import mongoose from 'mongoose';

const savedMapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
savedMapSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('SavedMap', savedMapSchema);