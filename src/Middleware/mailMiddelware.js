require('dotenv').config();
const fs = require('fs')
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendOtpEmail = async (email, otpCode) => {
    try {

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset OTP Code",
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
                <div style="background-color: #2b6cb0; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                    <img src="https://www.example.com/soko-kuu-logo.png" alt="Soko-Kuu Logo" style="width: 150px; margin-bottom: 10px;">
                    <h1 style="color: #ffffff; font-size: 24px;">Soko-Kuu</h1>
                </div>
        
                <div style="padding: 20px;">
                    <h2 style="font-size: 20px; color: #333333;">Password Reset OTP</h2>
                    <p style="font-size: 16px; color: #555555;">Dear customer,</p>
                    <p style="font-size: 16px; color: #555555;">
                        You requested to reset your password. Please use the OTP code below to complete the process:
                    </p>
        
                    <div style="background-color: #f7fafc; border: 1px solid #e2e8f0; padding: 15px; text-align: center; font-size: 20px; color: #2b6cb0; font-weight: bold; margin-bottom: 20px;">
                        ${otpCode}
                    </div>
        
                    <p style="font-size: 16px; color: #555555;">
                        <strong>Note:</strong> This OTP code will expire in 15 minutes. If you did not request this, please ignore this email.
                    </p>
        
                    <p style="font-size: 16px; color: #555555;">
                        Regards,<br>
                        The Soko-Kuu Team
                    </p>
        
                    <hr style="margin-top: 30px; border-color: #e2e8f0;">
        
                    <p style="font-size: 14px; color: #999999; text-align: center;">
                        Soko-Kuu Ventures<br>
                        info@soko-kuu.co.ke | +254 700 000 000<br>
                        <a href="https://soko-kuu.co.ke" style="color: #2b6cb0;">www.soko-kuu.co.ke</a>
                    </p>
                </div>
            </div>
            `
        };


        await transporter.sendMail(mailOptions);
       // console.log({ message: "OTP Email sent successfully" })
    } catch (error) {
        console.log(error)
        // throw error;
    }
}



const sendPasswordResetMessage = async (email) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Success",
            html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
                        <div style="background-color: #2b6cb0; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                            <img src="https://www.example.com/soko-kuu-logo.png" alt="Soko-Kuu Logo" style="width: 150px; margin-bottom: 10px;">
                            <h1 style="color: #ffffff; font-size: 24px;">Soko-Kuu</h1>
                        </div>
        
                        <div style="padding: 20px;">
                            <h2 style="font-size: 20px; color: #333333;">Password Reset Successful</h2>
                            <p style="font-size: 16px; color: #555555;">Dear customer,</p>
                            <p style="font-size: 16px; color: #555555;">
                                We’re writing to inform you that your password has been successfully reset. You can now log in with your new credentials.
                            </p>
        
                            <p style="font-size: 16px; color: #555555;">
                                If you did not request this change, please contact us immediately.
                            </p>
        
                            <p style="font-size: 16px; color: #555555;">
                                Regards,<br>
                                The Soko-Kuu Team
                            </p>
        
                            <hr style="margin-top: 30px; border-color: #e2e8f0;">
        
                            <p style="font-size: 14px; color: #999999; text-align: center;">
                                Soko-Kuu Ventures<br>
                                info@soko-kuu.co.ke | +254 700 000 000<br>
                                <a href="https://soko-kuu.co.ke" style="color: #2b6cb0;">www.soko-kuu.co.ke</a>
                            </p>
                        </div>
                    </div>
                    `
        };

        await transporter.sendMail(mailOptions);
        //console.log({ message: "Password reset success email sent successfully" });

    } catch (error) {
        console.log(error);
        // throw error;
    }
};



const sendWelcomeEmail = async (email) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Registration Successful",
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
                <div style="background-color: #2b6cb0; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                    <img src="https://www.example.com/soko-kuu-logo.png" alt="Soko-Kuu Logo" style="width: 150px; margin-bottom: 10px;">
                    <h1 style="color: #ffffff; font-size: 24px;">Soko-Kuu</h1>
                </div>

                <div style="padding: 20px;">
                    <h2 style="font-size: 20px; color: #333333;">Welcome to Soko-Kuu!</h2>
                    <p style="font-size: 16px; color: #555555;">Hello,</p>
                    <p style="font-size: 16px; color: #555555;">
                        We are thrilled to welcome you to Soko-Kuu, your number one platform for buying and selling goods. Your registration was successful, and we can't wait for you to explore our marketplace.
                    </p>

                    <p style="font-size: 16px; color: #555555;">
                        You can log in to your account and start shopping or listing products right away. If you need any assistance, feel free to reach out to our support team.
                    </p>

                    <p style="font-size: 16px; color: #555555;">
                        Best regards,<br>
                        The Soko-Kuu Team
                    </p>

                    <hr style="margin-top: 30px; border-color: #e2e8f0;">

                    <p style="font-size: 14px; color: #999999; text-align: center;">
                        Soko-Kuu Ventures<br>
                        info@soko-kuu.co.ke | +254 700 000 000<br>
                        <a href="https://soko-kuu.co.ke" style="color: #2b6cb0;">www.soko-kuu.co.ke</a>
                    </p>
                </div>
            </div>
            `
        };

        await transporter.sendMail(mailOptions);
        //console.log({ message: "Registration success email sent successfully" });

    } catch (error) {
        console.log(error);
       // throw error;
    }
};

//send orders placed successfuly email
const sendOrderConfirmationEmail = async (email, name, orderData, total_price, location, location_pin) => {
    try {
        const { order, order_items } = orderData; // Extract order and order_items from the data

        // Calculate total amount for the order
        const totalAmount = order_items.items.reduce((total, item) => {
            return total + item.quantity * item.product_price;
        }, 0);

        // Generate a table of the order items
        const orderItemsHtml = order_items.items.map(item => `
            <tr>
                <td style="padding: 8px; border: 1px solid #e2e8f0;">${item.product_name}</td>
                <td style="padding: 8px; border: 1px solid #e2e8f0;">${item.quantity}</td>
                <td style="padding: 8px; border: 1px solid #e2e8f0;">${item.product_price}</td>
                <td style="padding: 8px; border: 1px solid #e2e8f0;">${(item.quantity * item.product_price).toFixed(2)}</td>
            </tr>
        `).join('');

        // Create Google Maps link for location_pin
        const googleMapsLink = `https://www.google.com/maps?q=${location_pin}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Order Confirmation - Order #${order.order_id}`,
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
                <div style="background-color: #2b6cb0; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                    <img src="https://www.example.com/soko-kuu-logo.png" alt="Soko-Kuu Logo" style="width: 150px; margin-bottom: 10px;">
                    <h1 style="color: #ffffff; font-size: 24px;">Soko-Kuu</h1>
                </div>

                <div style="padding: 20px;">
                    <h2 style="font-size: 20px; color: #333333;">Order Confirmation</h2>
                    <p style="font-size: 16px; color: #555555;">Dear ${name},</p>
                    <p style="font-size: 16px; color: #555555;">
                        Thank you for your order! Below are the details of your order:
                    </p>

                    <h3 style="font-size: 18px; color: #333333;">Order Summary</h3>
                    <p><strong>Order ID:</strong> ${order.order_id}</p>    
                    <p><strong>Date Created:</strong> ${new Date().toLocaleString()}</p>

                    <h3 style="font-size: 18px; color: #333333;">Order Items</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th style="padding: 8px; border: 1px solid #e2e8f0;">Product Name</th>
                                <th style="padding: 8px; border: 1px solid #e2e8f0;">Quantity</th>
                                <th style="padding: 8px; border: 1px solid #e2e8f0;">Price</th>
                                <th style="padding: 8px; border: 1px solid #e2e8f0;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orderItemsHtml}
                        </tbody>
                    </table>

                    <p style="font-size: 16px; color: #333333;">
                        <strong>Total Amount: </strong> KSH ${total_price.toFixed(2)}
                    </p>

                    <h3 style="font-size: 18px; color: #333333;">Delivery Location</h3>
                    <p style="font-size: 16px; color: #555555;">
                        <strong>Location:</strong> ${location}
                    </p>
                    <p style="font-size: 16px; color: #555555;">
                        <strong>Location Pin:</strong> <a href="${googleMapsLink}" target="_blank">View on Google Maps</a>
                    </p>

                    <p style="font-size: 16px; color: #555555;">
                        We will notify you once your order has been processed. If you have any questions, feel free to reach out to us.
                    </p>

                    <p style="font-size: 16px; color: #555555;">
                        Regards,<br>
                        The Soko-Kuu Team
                    </p>

                    <hr style="margin-top: 30px; border-color: #e2e8f0;">

                    <p style="font-size: 14px; color: #999999; text-align: center;">
                        Soko-Kuu Ventures<br>
                        info@soko-kuu.co.ke | +254 700 000 000<br>
                        <a href="https://soko-kuu.co.ke" style="color: #2b6cb0;">www.soko-kuu.co.ke</a>
                    </p>   
                </div>
            </div>
            `
        };

        await transporter.sendMail(mailOptions);
        //console.log({ message: "Order confirmation email sent successfully" });
    } catch (error) {
        console.log(error);
        // Handle error, e.g., by logging or rethrowing
    }
};


module.exports = {
    sendOtpEmail,
    sendPasswordResetMessage,
    sendWelcomeEmail,
    sendOrderConfirmationEmail
}