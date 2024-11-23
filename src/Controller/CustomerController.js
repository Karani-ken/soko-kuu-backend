const dbHandler = require("../DbHandler/DbHandler");
const dotenv = require("dotenv");
const crypto = require("crypto");
dotenv.config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const sendSms = require("../Middleware/sendsms.middleware");
const {
  sendWelcomeEmail,
  sendOtpEmail,
  sendPasswordResetMessage,
} = require("../Middleware/mailMiddelware");

const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const registerCustomer = async (req, res) => {
  const { customer_name, phone, email, password } = req.body;

  // Check if all required details are provided
  if (!customer_name || !email || !password || !phone) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Check if customer already exists
    const existingCustomer = await dbHandler.getCustomerByEmail(email);
    if (existingCustomer) {
      return res
        .status(409)
        .json({ error: "Customer already exists with this email." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new customer
    const customerData = {
      customer_name,
      phone,
      email,
      googleId: "",
      town: "",
      county: "",
      password: hashedPassword,
    };
    const result = await dbHandler.insertCustomer(customerData);
    sendWelcomeEmail(email);
    //console.log(response)
    res
      .status(201)
      .json({ message: "Customer registered successfully", data: result });
  } catch (err) {
    console.error("Error registering customer:", err);
    res
      .status(500)
      .json({ error: "Failed to register customer", details: err.message });
  }
};
//google login controller
const googleLoginCustomer = async (req, res) => {
  passport.authenticate(
    "google",
    { scope: ["profile", "email"] },
    (err, profile) => {
      if (err || !profile) {
        return res.status(401).json({ error: "Google login failed" });
      }
      //extract profile information
      const { displayName, emails, id } = profile;
      const email = emails[0].value;
      try {
        //check if customer exists in the database
        dbHandler.getCustomerByEmail(email).then(async (customer) => {
          if (customer.length === 0) {
            //register new customer if not found
            const newCustomer = {
              customer_name: displayName,
              googleId: id,
              email,
              password: null,
              town: "",
              county: "",
              phone: "",
            };
            customer = await dbHandler.insertCustomer(newCustomer);
          }
          //generate token for the authenticated user
          const token = jwt.sign(
            {
              customer_id: customer[0].customer_id,
              email: customer[0].email,
              name: customer[0].customer_name,
            },
            process.env.JWT_SECRET,
            { expiresIn: "12h" }
          );

          return res.status(200).json(token);
        });
      } catch (error) {
        console.error("Error during Google login:", err);
        return res
          .status(500)
          .json({ error: "Google login failed", details: err.message });
      }
    }
  );
};

const loginCustomer = async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    // Get customer by email
    const customer = await dbHandler.getCustomerByEmail(email);

    if (!customer || customer.length === 0) {
      return res.status(404).json({ error: "Customer not found." });
    }
    // console.log(customer)

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, customer.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password." });
    }

    // Successful login
    const token = jwt.sign(
      {
        id: customer.customer_id,
        username: customer.customer_name,
        email: customer.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    res.status(200).json(token);
  } catch (err) {
    console.error("Error logging in customer:", err);
    res.status(500).json({ error: "Failed to log in", details: err.message });
  }
};

const loginWithSocialAccounts = async (req, res) => {
  try {
    const { email, name } = req.body;
    // Get customer by email
    const customer = await dbHandler.getCustomerByEmail(email);
    console.log(customer)
    if (customer) {
      // Successful login
      const token = jwt.sign(
        {
          id: customer.customer_id,
          username: customer.customer_name,
          email: customer.email,
        },
        process.env.JWT_SECRET,   
        { expiresIn: "30d" }
      );
      console.log(token)
      // res.cookie("access_token", token);
      res.status(200).json(token);
    } else {
      // Check if all required details are provided
      if (!email) {
        return res.status(400).json({ error: "Email required." });
      }

      const generatedPassword =
        Math.random().toString(36).slice("-6") +
        Math.random().toString(36).slice("-6");
      // hash password.
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);

      // save users details to database.
      // Insert the new customer
      const customerData = {
        customer_name: name,
        email,
        password: hashedPassword,
        phone: "",
        googleId: "",
        town: "",
        county: "",
      };
      await dbHandler.insertCustomer(customerData);
      sendWelcomeEmail(email);
      res
        .status(201)
        .json({ success: true, message: "Customer registered successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
};

//request password reset
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    //check if user exists
    const user = await dbHandler.getCustomerByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const otpCode = generateOtp();
    const expiryTime = new Date(Date.now() + 15 * 60 * 1000); //expires in 15 minutes

    //store the OTP in the database
    await dbHandler.insertOtp(email, otpCode, expiryTime);

    //send OTP via email
    await sendOtpEmail(email, otpCode);

    return res.status(200).json({ message: "Otp sent to your email address" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error sending OTP", error });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { otp, newPassword, email } = req.body;

    if (!otp || !newPassword || !email) {
      return res.status(401).json("Otp and new Password are required");
    }
    if (!validatePassword(newPassword)) {
      return res.status(401).json("Minimum password requirements not met!!");
    }
    const user = await dbHandler.getCustomerByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //verify OTP
    const otpRecord = await dbHandler.getOtp(user.email);
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    //check if OTP is expired
    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP has Expired" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await dbHandler.updateCustomerPassword(hashedPassword, email);
    //clear the OTP record (or delete it)
    await dbHandler.removeOtp(email);
    await sendPasswordResetMessage(email);
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error resetting password", error });
  }
};

// Update customer details
const updateCustomer = async (req, res) => {
  const customer_id = req.params.customer_id;
  const customerData = req.body;
  try {
    const result = await dbHandler.updateCustomer(customer_id, customerData);
    res
      .status(200)
      .json({ message: "Customer updated successfully", data: result });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update customer", details: err.message });
  }
};

// Get a specific customer by ID
const getCustomer = async (req, res) => {
  const customer_id = req.params.customer_id;
  try {
    const customer = await dbHandler.getCustomerById(customer_id);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.status(200).json({ data: customer });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to retrieve customer", details: err.message });
  }
};

// Delete a customer by ID
const deleteCustomer = async (req, res) => {
  const customer_id = req.params.customer_id;
  try {
    const result = await dbHandler.deleteCustomer(customer_id);
    res
      .status(200)
      .json({ message: "Customer deleted successfully", data: result });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete customer", details: err.message });
  }
};

module.exports = {
  registerCustomer,
  loginCustomer,
  googleLoginCustomer,
  resetPassword,
  requestPasswordReset,
  updateCustomer,
  getCustomer,
  deleteCustomer,
  loginWithSocialAccounts,
};
