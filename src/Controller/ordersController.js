const orderHandler = require('../DbHandler/DbHandler'); // Assuming the DB handler file is in dbHandler folder
const { sendOrderConfirmationEmail } = require('../Middleware/mailMiddelware')
const sendSms = require('../Middleware/sendsms.middleware')
const jwt = require('jsonwebtoken');
let temporaryOrders = {};
const axios = require('axios')
require('dotenv').config()



function getTimestamp() {
    const date = new Date();
    const timestamp = date.getFullYear() +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        ("0" + date.getDate()).slice(-2) +
        ("0" + date.getHours()).slice(-2) +
        ("0" + date.getMinutes()).slice(-2) +
        ("0" + date.getSeconds()).slice(-2);

    return timestamp;
}

function generatePassword() {

    const shortcode = process.env.SHORTCODE;
    const passkey = process.env.PASSKEY;
    const timestamp = getTimestamp();
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
    return password;
}

const generateToken = async () => {
    const consumer = process.env.MPESA_CONSUMER_KEY;
    const secret = process.env.MPESA_SECRET_KEY;

    const auth = Buffer.from(`${consumer}:${secret}`).toString('base64');

    try {
        const response = await axios.get('https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
            headers: {
                authorization: `Basic ${auth}`
            }
        });
        console.log(response.data.access_token);
        return response.data.access_token; // Return the token directly
    } catch (err) {
        console.log(err);
        throw new Error(err.message); // Throw the error for handling upstream
    }  
};


const initiateStkPush = async (phoneNumber, totalAmount) => {
    const phone = phoneNumber.substring(1);  // Remove leading '0' from phone number
    const amount = totalAmount;
    const token = await generateToken();  // Get the authorization token

    try {
        // Send the STK Push request to Safaricom
        const response = await axios.post(
            'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
            {
                BusinessShortCode: process.env.SHORTCODE, // Store number for till
                Password: generatePassword(),
                Timestamp: getTimestamp(),
                TransactionType: 'CustomerBuyGoodsOnline',
                Amount: amount,
                PartyA: `254${phone}`,  // Customer phone number (starting with 254)
                PartyB: 4953864,         // Your Paybill/Till Number
                PhoneNumber: `254${phone}`,  // Phone number of customer (starting with 254)
                CallBackURL: "https://3733-102-0-4-196.ngrok-free.app/orders/payment-callback",  // Your callback URL
                AccountReference: `254${phone}`,  // Unique account reference for the transaction
                TransactionDesc: 'test',  // Description of the transaction
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,  // Use the generated token
                },
            }
        );

        // Return the response data to the caller
        return response.data;
    } catch (err) {
        // Log and rethrow error with more details
        console.error('STK Push Error:', err.response ? err.response.data : err.message);
        throw new Error('STK Push request failed');
    }
};

/*const createOrder = async (req, res) => {
    const { customer_id, payment_code, items, totalAmount, location, location_pin } = req.body;

    if (!customer_id || !payment_code || !items || !items.length || !location) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    //get the customer details 
    const customer = await orderHandler.getCustomerById(customer_id)
    if (customer.length === 0) {
        return res.status(401).json({ error: "Customer Not found" })
    }

    try {
        // Step 1: Create the order
        const total_price = totalAmount;
        const orderResult = await orderHandler.addOrder(customer_id, payment_code, location, location_pin, total_price);
       // console.log(orderResult)
        const order_id = orderResult.insertId; // Get the generated order ID

        // Step 2: Add items to order_items table
        for (let item of items) {
            await orderHandler.addOrderItems(
                order_id,
                item.product_id,
                item.product_name,
                item.product_price,
                item.quantity,
            );
        }
        const order = {
            order_id,
            customer_id,
            payment_code,
            totalAmount,
            location,
            location_pin
        }
        const order_items = {
            items
        }
        const orderData = {
            order,
            order_items
        }
        
        await sendOrderConfirmationEmail(customer.email, customer.customer_name, orderData, total_price, location, location_pin)
        for (let item of items) {
            const product = await orderHandler.getOneProduct(item.product_id)
            //console.log(product[0])
            if (product[0].quantity >= item.quantity && product[0].quantity.length > 0) {
                product[0].quantity -= item.quantity
                await orderHandler.updateProductQuantity(product[0].quantity, product[0].product_id)
            }
        }

        const customEmail = `sokokuu254@gmail.com`
        await sendOrderConfirmationEmail(customEmail, customer.customer_name, orderData, total_price, location, location_pin)
     
        const message = `New Order Alert Order Id: ${order.order_id}`
        const recipients = ['0720939444', '0743335552', '0713801284', '0724019618']
        const formattedRecipients = recipients.map(phone => {
            return phone.startsWith('0') ? `+254${phone.slice(1)}` : phone;
        });

        (async () => {
            try {
                const response = await sendSms(message, formattedRecipients);
                //console.log('SMS sent successfully:', response);
            } catch (err) {
                console.error('Failed to send SMS:', err.message);
            }
        })();

        return res.status(200).json({ message: "Order created successfully" });
    } catch (err) {
        console.log(err)
        return res.status(500).json( err );
    }
};*/


// Create a new order
const createOrder = async (req, res) => {
    const { customer_id, phone_number, items, totalAmount, location, location_pin } = req.body;

    if (!customer_id || !phone_number || !items || !items.length) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    // Get the customer details
    const customer = await orderHandler.getCustomerById(customer_id);
    if (customer.length === 0) {
        return res.status(401).json({ error: "Customer Not found" });
    }

    try {
        // Initiate the STK push
        const paymentResponse = await initiateStkPush(phone_number, totalAmount);
        console.log("payment response",paymentResponse?.checkoutRequestID);

        const checkoutRequestID = paymentResponse?.CheckoutRequestID;
        console.log(checkoutRequestID)
        if (!checkoutRequestID) {
            return res.status(400).json({ error: "CheckoutRequestID not returned from STK push" });
        }

        // Step 1: Save the order in the database with the CheckoutRequestID
        const orderData = {
            customer_id,               
            total_price: totalAmount,
            location,
            location_pin,
            checkoutRequestID,   
            phone_number         
        };

        const orderResult = await orderHandler.addOrder(orderData);  // Add order to DB
        const order_id = orderResult.insertId; // Get the generated order ID

        // Step 2: Save the items in the database
        for (let item of items) {
            await orderHandler.addOrderItems(order_id, item.product_id, item.product_name, item.product_price, item.quantity);
        }

        console.log(`Order with CheckoutRequestID ${checkoutRequestID} stored successfully`);

        // Return the checkoutRequestID to the client
        return res.status(200).json({   
            message: "Payment initiated, waiting for confirmation",
            checkoutRequestID, // Track this in the payment callback      
        });

    } catch (err) {   
        console.error(err);
        return res.status(500).json({ error: "Error creating order" });   
    }
};

const paymentCallback = async (req, res) => {    
    const callbackData = req.body;

    // Check if the callback contains payment metadata
    if (!callbackData?.Body?.stkCallback?.CallbackMetadata?.Item) {
        //console.log('Invalid callback data:', callbackData?.Body);
        return res.status(400).json("ok");
    }   

    const metadataItems = callbackData?.Body?.stkCallback?.CallbackMetadata?.Item;
    const checkoutRequestID = callbackData?.Body?.stkCallback?.CheckoutRequestID;

    if (!checkoutRequestID) {
       // console.log('CheckoutRequestID is missing:', callbackData?.Body);
        return res.status(400).json({ error: 'Missing CheckoutRequestID' });
    }

    // Step 1: Retrieve the order from the database using CheckoutRequestID
    const order = await orderHandler.getOrderByCheckoutRequestID(checkoutRequestID);

    if (order.length === 0) {
        //console.error('Order not found in the database');
        return res.status(400).json({ error: "Order data not found" });
    }

    const customer = await orderHandler.getCustomerById(order[0]?.customer_id)
    if (customer.length === 0) {
        return res.status(401).json({ error: "Customer Not found" })
    }
   // console.log(order[0]?.order_id)
    //get order items
    const orderItems = await orderHandler.getOrderItemsByOrderId(order[0]?.order_id)
   // console.log(orderItems)
    // Extract payment details from the callback data
    const amount = metadataItems.find(item => item.Name === 'Amount')?.Value;
    const payment_code = metadataItems.find(item => item.Name === 'MpesaReceiptNumber')?.Value;
    const transactionDate = metadataItems.find(item => item.Name === 'TransactionDate')?.Value;
    const phoneNumber = metadataItems.find(item => item.Name === 'PhoneNumber')?.Value;

    //console.log({ phoneNumber, payment_code, amount, transactionDate });   

    try {
        // Step 2: Update the order status to "Paid" if the payment was successful
        const order_status = callbackData?.Body?.stkCallback?.ResultCode === 0 ? 'Confirmed' : 'Cancelled';     
        
        await orderHandler.updatePaymentStatus(checkoutRequestID, order_status, payment_code);   
        
    
       
       await sendOrderConfirmationEmail(customer.email, customer.customer_name, order, orderItems)       
     
      /* const message = `New Order Alert Order Id: ${order[0].order_id}`
        const recipients = ['0720939444', '0743335552', '0713801284', '0724019618']
        const formattedRecipients = recipients.map(phone => {
            return phone.startsWith('0') ? `+254${phone.slice(1)}` : phone;
        });

        (async () => {
            try {
                const response = await sendSms(message, formattedRecipients);
                //console.log('SMS sent successfully:', response);
            } catch (err) {
                console.error('Failed to send SMS:', err.message);
            }
        })();*/
        // Send a success response
        return res.status(200).json({
            message: "Payment successful, order updated",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error updating order after payment confirmation" });
    }
};



// Get orders by customer ID
const getOrdersByCustomerId = async (req, res) => {
    const { customer_id } = req.params;

    try {
        const orders = await orderHandler.getOrdersByCustomerId(customer_id);

        // Check if orders are found
        if (orders.length === 0) {
            return res.status(404).json({ error: "No orders found" });
        }

        // Fetch and include order_items for each order
        for (let order of orders) {
            const order_items = await orderHandler.getOrderItemsByOrderId(order.order_id);
            order.items = order_items;  // Add the order_items to the order object
        }

        // Return the orders along with their items
        return res.status(200).json(orders);
    } catch (err) {
        return res.status(500).json({ error: "Error retrieving orders" });
    }
};

const getOrders = async (req, res) => {
    try {
        // Step 1: Fetch all orders
        const orders = await orderHandler.getAllOrders();

        // Step 2: Iterate through each order and fetch customer details and order items
        const detailedOrders = await Promise.all(orders.map(async (order) => {
            // Fetch customer details
            const customer = await orderHandler.getCustomerById(order.customer_id);
           // console.log(customer)
            // Fetch order items
            const orderItems = await orderHandler.getOrderItemsByOrderId(order.order_id);

            return {
                ...order,
                customer: customer ? customer : {}, // Add customer details
                order_items: orderItems // Add order items
            };
        }));

        // Return the detailed orders
        return res.status(200).json(detailedOrders);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


const getOrdersByOrderId = async (req, res) => {
    const { order_id } = req.params;

    try {
        const order = await orderHandler.getOrdersByOrderId(order_id);

        // Check if orders are found
        if (order.length === 0) {
            return res.status(404).json({ error: "No orders found" });
        }



        const order_items = await orderHandler.getOrderItemsByOrderId(order[0].order_id);
        const newOrder = {
            order,
            order_items
        }



        // Return the orders along with their items
        return res.status(200).json(newOrder);
    } catch (err) {
        return res.status(500).json({ error: "Error retrieving orders" });
    }
};


// Get order items by order ID
const getOrderItemsByOrderId = async (req, res) => {
    const { order_id } = req.params;

    try {
        const items = await orderHandler.getOrderItemsByOrderId(order_id);
        if (items.length === 0) {
            return res.status(404).json({ error: "No items found for this order" });
        }
        return res.status(200).json(items);
    } catch (err) {
        return res.status(500).json({ error: "Error retrieving order items" });
    }
};

// Update order status
const updateOrderStatus = async (req, res) => {
    const { order_status } = req.body;
    const { order_id } = req.params

    if (!order_id || !order_status) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {        
        await orderHandler.updateOrderStatus(order_id, order_status);
        return res.status(200).json({ message: "Order status updated successfully" });
    } catch (err) {
        return res.status(500).json({ error: "Error updating order status" });
    }
};

// Delete an order by ID
const deleteOrderById = async (req, res) => {
    const { order_id } = req.params;

    try {
        await orderHandler.deleteOrderById(order_id);
        return res.status(200).json({ message: "Order deleted successfully" });
    } catch (err) {
        return res.status(500).json({ error: "Error deleting order" });
    }
};

module.exports = {
    createOrder,
    getOrdersByCustomerId,
    getOrdersByOrderId,
    getOrderItemsByOrderId,
    updateOrderStatus,
    deleteOrderById,
    getOrders,
    paymentCallback
};
