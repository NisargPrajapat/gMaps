import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  locations: [{
    name: String,
    coordinates: [Number],
  }],
  distance: Number,
  duration: Number,
  mode: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Route', routeSchema);