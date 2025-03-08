import React from 'react';
import { MapPin, Navigation, Clock, Shield } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Optimal Route Planner</h1>
        <p className="text-xl text-gray-600">
          Your intelligent companion for efficient and reliable navigation
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <MapPin className="w-12 h-12 text-blue-600 mb-4" />
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-600">
            We strive to provide the most efficient and user-friendly route planning
            experience, helping you navigate your world with confidence and ease.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <Navigation className="w-12 h-12 text-green-600 mb-4" />
          <h2 className="text-2xl font-bold mb-4">What We Offer</h2>
          <p className="text-gray-600">
            Advanced route optimization, real-time navigation, and comprehensive
            location services to make your journey smoother and more efficient.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <Clock className="w-12 h-12 text-purple-600 mb-4" />
          <h2 className="text-2xl font-bold mb-4">Why Choose Us</h2>
          <p className="text-gray-600">
            Our platform combines cutting-edge technology with user-friendly
            design to deliver the best possible navigation experience.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <Shield className="w-12 h-12 text-red-600 mb-4" />
          <h2 className="text-2xl font-bold mb-4">Privacy & Security</h2>
          <p className="text-gray-600">
            Your privacy and data security are our top priorities. We ensure
            your information is protected with industry-standard encryption.
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md mb-12">
        <h2 className="text-2xl font-bold mb-4">Our Technology</h2>
        <p className="text-gray-600 mb-6">
          We leverage the latest advancements in mapping and navigation technology
          to provide you with:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>Real-time GPS tracking and navigation</li>
          <li>Intelligent route optimization algorithms</li>
          <li>Comprehensive location database</li>
          <li>Multiple transportation mode support</li>
          <li>Interactive maps with custom markers</li>
          <li>Save and share route functionality</li>
        </ul>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Join Us Today</h2>
        <p className="text-gray-600">
          Start optimizing your routes and experiencing smarter navigation.
          Sign up now to access all our features and benefits.
        </p>
      </div>
    </div>
  );
}