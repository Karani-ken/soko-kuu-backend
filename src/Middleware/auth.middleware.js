const jwt = require('jsonwebtoken');

const protect = (adminRequired = false) => {
    return async (req, res, next) => {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                // Get token from header
                token = req.headers.authorization.split(' ')[1];

                // Verify token
                const decoded = jwt.verify(token, process.env.JWT_SECRET);

                // Attach the user data to the request object
                req.user = decoded;

                // Check if admin access is required and verify role
                if (adminRequired && decoded?.role !== 'admin') {
                   // console.error('Not authorized - Admin access required');
                    return res.status(403).json("Admin Access required");
                }

                // Proceed to the next middleware/route handler
                return next();
            } catch (error) {
                //console.error('Token verification failed:', error);
                return res.status(401).json("Unauthorized - Invalid token");
            }
        }

        if (!token) {
            //console.error('Not authorized - No token provided');
            return res.status(403).json("Not authorized - No token provided");
        }
    };
};

module.exports = { protect };
