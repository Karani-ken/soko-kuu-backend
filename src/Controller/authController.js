const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendSms = require('../Middleware/sendsms.middleware')
const { sendWelcomeEmail, sendOtpEmail, sendPasswordResetMessage  } = require('../Middleware/mailMiddelware')
const userHandler = require('../DbHandler/DbHandler');
const dotenv = require('dotenv');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3Client = require('../Config/s3ClientConfig')
const crypto = require('crypto')
dotenv.config();


//password validation
const validatePassword = (password) => {
  const passwordRegext = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegext.test(password);
}
// Function to generate a random OTP
const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
}
// Register a new user
const register = async (req, res) => {
  const { name, email, password, phone, location, category, type, description, address, city, county } = req.body;
  const { location: profile_pic } = req.file
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is missing!!' })
  }
  let user_id;
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    user_id = decodedToken.id;
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
  if (!name || !email || !password || !phone) {
    return res.status(400).json("All fields must be available");
  }

  /*if (!validatePassword(password)) {
    return res.status(400).json({ message: "Password must be at least 8 characters long and include a mix of uppercase, lowercase, numbers, and special characters." })
  }*/
  // Check if the user account already exists
  const accountExists = await userHandler.findUserByEmail(email);
  if (accountExists.length !== 0) {
    return res.status(400).json({ message: "Account already exists!" });  
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Prepare user data for insertion
    const userData = {
      name,
      email,
      password: hashedPassword,
      phone,
      location,
      category,
      profile_pic,
      type,
      description,
      address,
      city,
      county,
      agent_id: user_id
    };

    // Insert user into the database
    console.log(userData)
    await userHandler.insertUser(userData);

    //send sms on successful registration
    const message = `Hello, ${name}.Thank you for joining Soko-Kuu, your trusted online business marketing platform. Start marketing your business and reaching more customers today.`

    const formattedPhone = phone.startsWith('0') ? phone.slice(1) : phone;
    const response = await sendSms(message, `+254${formattedPhone}`);
    sendWelcomeEmail(email)
    console.log(response)
    return res.status(201).json('User registered successfully');
  } catch (error) {
    console.log(error)
    return res.status(500).json('Error registering user',error);
  }
};

//add agent
const addAgent = async (req, res) => {
  const { name, email, password, phone, county, city } = req.body

  if (!name || !email || !password || !phone) {
    return res.status(400).json("All fields must be available");
  }

  const accountExists = await userHandler.findUserByEmail(email);
  if (accountExists.length !== 0) {
    return res.status(400).json({ message: "Account already exists!" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    let role = "agent";
    const agentData = {
      name,
      email,
      password: hashedPassword,
      phone,
      county,
      city,
      role: role
    }
    // console.log(agentData)
    await userHandler.addAgent(agentData);
    return res.status(201).json('agent registered successfully');
  } catch (error) {
    console.log(error)
    return res.status(500).json(`error adding agent ${error}`);
  }
}

// User login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userHandler.findUserByEmail(email);

    if (user.length === 0) return res.status(400).send('Cannot find user');

    // Check if password matches
    if (await bcrypt.compare(password, user[0].password)) {
      // Generate JWT token
      const token = jwt.sign(
        { id: user[0].id, username: user[0].name, role: user[0].role, plan: user[0].subscription, type: user[0].type },
        process.env.JWT_SECRET,
        { expiresIn: '12h' }
      );
      res.status(200).json(token);
    } else {
      res.status(400).json('Invalid password');
    }
  } catch (err) {
    res.status(500).json('Error logging in');
  }
};

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    //check if user exists
    const user = await dbHandler.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const otpCode = generateOtp();
    const expiryTime = new Date(Date.now() + 15 * 60 * 1000);//expires in 15 minutes

    //store the OTP in the database
    await dbHandler.insertOtp(email, otpCode, expiryTime);

    //send OTP via email
    await sendOtpEmail(email, otpCode);

    return res.status(200).json({ message: "Otp sent to your email address" });
   
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Error sending OTP", error })
  }
}
const resetPassword = async (req, res) => {
  try {
    const { otp, newPassword, email } = req.body;

    if (!otp || !newPassword || !email) {
      return res.status(401).json("Otp and new Password are required")
    }
   
    const user = await dbHandler.findUserByEmail(email)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    //verify OTP
    const otpRecord = await dbHandler.getOtp(user.email)
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" })
    }

    //check if OTP is expired
    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP has Expired" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await dbHandler.updateUserPassword(hashedPassword, email);
    //clear the OTP record (or delete it)
    await dbHandler.removeOtp(email);
    await sendPasswordResetMessage(email)
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Error resetting password', error });
  }
}



// Update user account details
const updateUser = async (req, res) => {
  const { name, phone, location, category, description, type, address, city, county } = req.body;
  const { id } = req.params
  if (!id) {
    return res.status(400).json({ message: 'User ID is required' });
  }
  try {
    const userData = { id, name, phone, location, category, description, type, address, city, county };
    // Update user in the database
    console.log(userData)
    await userHandler.updateUser(userData);
    return res.status(200).json('User updated successfully');
  } catch (error) {
    return res.status(500).json('Error updating user');
  }
};

//update user Profile
const updateProfilePic = async (req, res) => {
  const { id } = req.params;
  const { location: profile_pic } = req.file;

  if (!id || !req.file) {
    return res.status(400).json({ message: 'User ID and profile picture are required' });
  }
  try {
    const user = await userHandler.getOneUser(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user[0].profile_pic) {
      try {
        const fileName = user[0].profile_pic.split('/').pop();
        console.log(fileName)
        const deleteParams = {
          Bucket: process.env.DO_SPACES_BUCKET,
          Key: fileName,
        }
        const command = new DeleteObjectCommand(deleteParams);
        await s3Client.send(command);
        console.log('Old profile picture deleted from Digital Ocean');
      } catch (err) {
        console.error('Error deleting old profile picture:', err);
        return res.status(500).json({ message: 'Error deleting old profile picture', err });
      }
    }

    const updatedProfile = {
      id,
      profile_pic

    }
    await userHandler.updateUserProfile(updatedProfile)
    return res.status(200).json({ message: 'Profile picture updated successfully' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating profile picture' });
  }

}

// Delete user account
const deleteUser = async (req, res) => {
  const { user_id } = req.params;

  // Validate user ID
  if (!user_id) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    // Fetch user details
    const user = await userHandler.getOneUser(user_id);

    // Check if user exists
    if (!user || user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const fileUrl = user[0].profile_pic;

    // Only attempt to delete the profile picture if it exists
    if (fileUrl) {
      const fileName = fileUrl.split('/').pop();
      console.log(fileName);
      const deleteParams = {
        Bucket: process.env.DO_SPACES_BUCKET,
        Key: fileName,
      };
      const command = new DeleteObjectCommand(deleteParams);
      await s3Client.send(command);
      console.log("Deleted user profile picture from Digital Ocean Spaces");
    } else {
      console.log("No profile picture to delete");
    }

    // Proceed to delete the user from the database
    await userHandler.deleteUser(user_id);
    return res.status(200).json('User deleted successfully');

  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Error deleting user', error });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await userHandler.getOneUser(id);
    // console.log(user)
    return res.status(200).json(user);
  } catch (error) {
    console.log(error)
    return res.status(400).json(error)
  }
}

const getAllUsers = async (req, res) => {
  try {
    const users = await userHandler.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.log(error)
    return res.status(400).json(error)
  }
}
const getAllAgents = async (req, res) => {
  try {
    const users = await userHandler.getAllAgents();
    return res.status(200).json(users);
  } catch (error) {
    console.log(error)
    return res.status(400).json(error)
  }
}


//update user plan
const editUserPlan = async (req, res) => {
  try {
    const { subscription } = req.body
    const { id } = req.params
    if (!id || !subscription) {
      return res.status(400).json("All fields are required!!")
    }
    await userHandler.updateUserPlan(id, subscription);
    return res.status(200).json("status updated successfully")

  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
}


//get users by agent id
const getBusinessesByAgentId = async (req, res) => {
  const { id } = req.params
  try {
    const users = await userHandler.getUsersByAgentId(id);
    return res.status(200).json(users)
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
}
const getGoldUsers = async (req, res) => {
  try {
    const users = await userHandler.getGoldUsers();
    return res.status(200).json(users)
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
}

module.exports = {
  register,
  login,
  requestPasswordReset,
  resetPassword,
  updateUser,
  deleteUser,
  getUser,
  getAllUsers,
  updateProfilePic,
  editUserPlan,
  addAgent,
  getBusinessesByAgentId,
  getAllAgents,
  getGoldUsers
};
