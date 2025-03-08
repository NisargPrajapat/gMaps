import express from 'express';
import Route from '../models/Route.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get all routes for a user
router.get('/', auth, async (req, res) => {
  try {
    const routes = await Route.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .maxTimeMS(15000);
    res.json(routes);
  } catch (error) {
    console.error('Error fetching routes:', error);
    res.status(500).json({ message: 'Server error while fetching routes' });
  }
});

// Save a route
router.post('/', auth, async (req, res) => {
  try {
    const { locations, distance, duration, mode } = req.body;

    if (!locations || !Array.isArray(locations) || locations.length < 2) {
      return res.status(400).json({ message: 'Invalid route data' });
    }

    const route = new Route({
      userId: req.user.userId,
      locations,
      distance,
      duration,
      mode,
    });

    await route.save();
    res.status(201).json(route);
  } catch (error) {
    console.error('Error saving route:', error);
    res.status(500).json({ 
      message: error.name === 'ValidationError' 
        ? 'Invalid route data' 
        : 'Server error while saving route'
    });
  }
});

export default router;