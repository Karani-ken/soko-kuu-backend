const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const sendSms = async (message, recipients) => {
    if (!message || !Array.isArray(recipients) || recipients.length === 0) {
        throw new Error("Please provide a message and an array of recipient phone numbers");
    }

    console.log('Recipients:', recipients);
    console.log('Message:', message);

    try {
        const results = []; // To store results for each recipient

        // Loop through recipients and send SMS to each
        for (const recipient of recipients) {
            const data = {
                SenderId: process.env.ONFON_SENDER_ID,   // Your approved Sender ID
                IsUnicode: false,                         // Set to true if the message is Unicode
                IsFlash: false,                           // Set to true if sending Flash SMS
                ScheduleDateTime: "",                     // Leave empty for immediate send
                MessageParameters: [{
                    Number: recipient,                    // Single recipient
                    Text: message                         // Message content
                }],
                ApiKey: process.env.ONFON_API_KEY,       // Your OnFon API key
                ClientId: process.env.ONFON_USERNAME      // Your OnFon client username
            };

            // Make API request to OnFon Media for each recipient        
            const result = await axios.post(process.env.ONFON_API_URL, data);
            results.push(result.data); // Store result for this recipient
        }

        return results; // Return all results

    } catch (error) {
        console.error('Error sending SMS:', error.response ? error.response.data : error.message);
        throw new Error('Failed to send SMS');
    }
};

module.exports = sendSms;
