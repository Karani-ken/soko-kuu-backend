const dbHandler = require('../DbHandler/DbHandler');
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

// Create a payment
const createPayment = async (req, res) => {
    try {
        const { transaction_code, name, email, phone, agent_id } = req.body;

        if (!transaction_code || !name || !email || !phone) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if transaction code already exists (unique constraint)
        const existingPayment = await dbHandler.getPaymentByTransactionCode(transaction_code);
        if (existingPayment.length > 0) {
            return res.status(409).json({ message: "Transaction code already exists" });
        }

        const paymentData = {
            transaction_code,
            name,
            email,
            phone,
            agent_id
        };

        await dbHandler.insertPayment(paymentData);
        return res.status(201).json({ message: "Payment created successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error creating payment", error });
    }
};

// Get all payments
const getAllPayments = async (req, res) => {
    try {
        const payments = await dbHandler.getAllPayments();
        return res.status(200).json(payments);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching payments", error });
    }
};

// Get one payment by ID
const getOnePayment = async (req, res) => {
    const { payment_id } = req.params;

    if (!payment_id) {
        return res.status(400).json({ message: "Payment ID is required" });
    }

    try {
        const payment = await dbHandler.getOnePayment(payment_id);
        if (payment.length === 0) {
            return res.status(404).json({ message: "Payment not found" });
        }
        return res.status(200).json(payment[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching payment", error });
    }
};

// Get payment by transaction code
const getPaymentByTransactionCode = async (req, res) => {
    const { transaction_code } = req.params;

    if (!transaction_code) {
        return res.status(400).json({ message: "Transaction code is required" });
    }

    try {
        const payment = await dbHandler.getPaymentByTransactionCode(transaction_code);
        if (payment.length === 0) {
            return res.status(404).json({ message: "Payment not found" });
        }
        return res.status(200).json(payment);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching payment", error });
    }
};

//getPayment Code
const getMyPayments = async (req, res) => {
    try {
        const {id} = req.params;
        const myPayments = await dbHandler.myPayments(id);
        if(myPayments.length > 0){
            return res.status(200).json(myPayments)
        }else{
            return res.status(200).json([])
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching my payments", error });
    }
}

// Update a payment
const updatePayment = async (req, res) => {
    const { payment_id } = req.params;
    const { name, email, phone, agent_id } = req.body;

    if (!payment_id || !name || !email || !phone) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const updatePaymentData = { payment_id, name, email, phone, agent_id };

        await dbHandler.updatePayment(updatePaymentData);
        return res.status(200).json({ message: "Payment updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error updating payment", error });
    }
};

// Delete a payment
const deletePayment = async (req, res) => {
    const { payment_id } = req.params;

    if (!payment_id) {
        return res.status(400).json({ message: "Payment ID is required" });
    }

    try {
        await dbHandler.deletePayment(payment_id);
        return res.status(200).json({ message: "Payment deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error deleting payment", error });
    }
};

// Export the modules
module.exports = {
    createPayment,
    getAllPayments,
    getOnePayment,
    getPaymentByTransactionCode,
    updatePayment,
    deletePayment,
    getMyPayments
};
