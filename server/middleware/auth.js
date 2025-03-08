import jwt from 'jsonwebtoken';

export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error('No authentication token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Authentication Error:', error.message);
    res.status(401).json({ 
      message: error.message === 'No authentication token provided' 
        ? 'Authentication required' 
        : 'Invalid or expired token'
    });
  }
};