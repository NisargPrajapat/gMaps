// import express from 'express';
// import { auth } from '../middleware/auth.js';
// import User from '../models/User.js';

// const router = express.Router();

// // Get user profile
// router.get('/', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId)
//       .select('-password')
//       .maxTimeMS(15000);
      
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.json(user);
//   } catch (error) {
//     console.error('Profile Error:', error);
//     res.status(500).json({ message: 'Server error while fetching profile' });
//   }
// });

// // Update user profile
// router.put('/update', auth, async (req, res) => {
//   try {
//     const { name, phone, address } = req.body;
    
//     const user = await User.findById(req.user.userId).maxTimeMS(15000);
    
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     if (name) user.name = name;
//     if (phone) user.phone = phone;
//     if (address) user.address = address;

//     await user.save();
//     res.json(user);
//   } catch (error) {
//     console.error('Profile Update Error:', error);
//     res.status(500).json({ message: 'Error updating profile' });
//   }
// });

// // Save map image
// router.post('/save-map', auth, async (req, res) => {
//   try {
//     const { imageUrl } = req.body;
    
//     if (!imageUrl) {
//       return res.status(400).json({ message: 'Image URL is required' });
//     }

//     if (!imageUrl.startsWith('data:image/')) {
//       return res.status(400).json({ message: 'Invalid image format' });
//     }

//     const user = await User.findById(req.user.userId).maxTimeMS(15000);
    
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Limit the number of saved maps (optional)
//     const MAX_SAVED_MAPS = 50;
//     if (user.savedMaps.length >= MAX_SAVED_MAPS) {
//       user.savedMaps.shift(); // Remove oldest map
//     }

//     user.savedMaps.push({ imageUrl });
//     await user.save();

//     res.json({ message: 'Map saved successfully' });
//   } catch (error) {
//     console.error('Save Map Error:', error);
//     res.status(500).json({ message: 'Error saving map' });
//   }
// });

// export default router;


import express from 'express';
import { auth } from '../middleware/auth.js';
import User from '../models/User.js';
import SavedMap from '../models/SavedMap.js';
import UserQuery from '../models/UserQuery.js';

const router = express.Router();

// Get user profile with saved maps
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password')
      .maxTimeMS(15000);
      
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const savedMaps = await SavedMap.find({ userId: user._id })
      .sort({ createdAt: -1 });

    const userQueries = await UserQuery.find({ userId: user._id })
      .sort({ createdAt: -1 });

    res.json({
      ...user.toObject(),
      savedMaps,
      userQueries
    });
  } catch (error) {
    console.error('Profile Error:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
});

// Update user profile
router.put('/update', auth, async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    
    const user = await User.findById(req.user.userId).maxTimeMS(15000);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Profile Update Error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Save map image
router.post('/save-map', auth, async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ message: 'Image URL is required' });
    }

    if (!imageUrl.startsWith('data:image/')) {
      return res.status(400).json({ message: 'Invalid image format' });
    }

    const savedMap = new SavedMap({
      userId: req.user.userId,
      imageUrl
    });

    await savedMap.save();
    res.json({ message: 'Map saved successfully' });
  } catch (error) {
    console.error('Save Map Error:', error);
    res.status(500).json({ message: 'Error saving map' });
  }
});

// Delete saved map
router.delete('/maps/:mapId', auth, async (req, res) => {
  try {
    const map = await SavedMap.findOne({
      _id: req.params.mapId,
      userId: req.user.userId
    });

    if (!map) {
      return res.status(404).json({ message: 'Map not found' });
    }

    await map.deleteOne();
    res.json({ message: 'Map deleted successfully' });
  } catch (error) {
    console.error('Delete Map Error:', error);
    res.status(500).json({ message: 'Error deleting map' });
  }
});

// Submit user query
router.post('/queries', auth, async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ message: 'Subject and message are required' });
    }

    const query = new UserQuery({
      userId: req.user.userId,
      subject,
      message
    });

    await query.save();
    res.status(201).json(query);
  } catch (error) {
    console.error('Query Submission Error:', error);
    res.status(500).json({ message: 'Error submitting query' });
  }
});

// Get user queries
router.get('/queries', auth, async (req, res) => {
  try {
    const queries = await UserQuery.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });
    res.json(queries);
  } catch (error) {
    console.error('Query Fetch Error:', error);
    res.status(500).json({ message: 'Error fetching queries' });
  }
});

export default router;