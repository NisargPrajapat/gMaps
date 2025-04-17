
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    match: [/^[A-Za-z\s]+$/, 'Name can only contain letters and spaces'],
    minlength: [2, 'Name must be at least 2 characters long']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s-]{10,}$/, 'Please enter a valid phone number']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to ensure name only contains letters and spaces
userSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    if (!/^[A-Za-z\s]+$/.test(this.name)) {
      next(new Error('Name can only contain letters and spaces'));
    }
  }
  next();
});

export default mongoose.model('User', userSchema);