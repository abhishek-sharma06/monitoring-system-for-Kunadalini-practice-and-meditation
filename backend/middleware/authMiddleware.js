// Import jsonwebtoken library.
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Authentication middleware function verifying incoming authorization token.
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authorization token required.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contains id, name, email, role
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired authorization token.' });
  }
};
