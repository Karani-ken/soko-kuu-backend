const express = require('express');
const rateLimit = require('express-rate-limit')
const authController = require('../Controller/authController');
const {protect} = require('../Middleware/auth.middleware')
const upload = require('../Middleware/uploads.middleware')
const router = express.Router();

router.post('/register', protect(true),upload.single("profile_pic"), authController.register);
router.post('/login', authController.login);
router.post('/send-otp', authController.requestPasswordReset);
router.put('/reset-password', authController.resetPassword);
router.put('/update/:id', authController.updateUser);
router.put('/update-profile/:id', upload.single("profile_pic"), authController.updateProfilePic);
router.delete('/delete/:user_id', protect(true), authController.deleteUser )
router.get('/users',authController.getAllUsers);
router.get('/agents',authController.getAllAgents)
router.get('/user/:id', authController.getUser)   
router.put('/user-plan/:id',protect(true), authController.editUserPlan)

//add agent
router.post('/add-agent', authController.addAgent);
router.get('/get-business/:id', authController.getBusinessesByAgentId)

router.get('/gold-users', authController.getGoldUsers)
  
module.exports = router;
      