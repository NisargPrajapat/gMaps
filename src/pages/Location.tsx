import React, { useState, useEffect } from 'react';
import { Compass, MapPin, Navigation, Wifi, User } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface LocationInfo {
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
    altitude: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp: number;
  address: string | null;
}

interface UserProfile {
  address: string;
  name: string;
}

export default function Location() {
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
    initializeLocationTracking();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to view your location');
        return;
      }

      const response = await fetch('http://localhost:5000/api/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch profile');

      const data = await response.json();
      setUserProfile(data);
    } catch (error) {
      console.error('Profile fetch error:', error);
      toast.error('Error fetching profile');
    }
  };

  const getAddressFromCoords = async (latitude: number, longitude: number): Promise<string> => {
    try {
      const geocoder = new google.maps.Geocoder();
      const response = await geocoder.geocode({
        location: { lat: latitude, lng: longitude }
      });

      if (response.results[0]) {
        return response.results[0].formatted_address;
      }
      return 'Address not found';
    } catch (error) {
      console.error('Geocoding error:', error);
      return 'Error getting address';
    }
  };

  const initializeLocationTracking = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const address = await getAddressFromCoords(
          position.coords.latitude,
          position.coords.longitude
        );

        setLocationInfo({
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            heading: position.coords.heading,
            speed: position.coords.speed,
          },
          timestamp: position.timestamp,
          address
        });
        setLoading(false);
        setError(null);
      },
      (error) => {
        setError(getGeolocationErrorMessage(error));
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  };

  const getGeolocationErrorMessage = (error: GeolocationPositionError): string => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'Location access denied. Please enable location services.';
      case error.POSITION_UNAVAILABLE:
        return 'Location information is unavailable.';
      case error.TIMEOUT:
        return 'Location request timed out.';
      default:
        return 'An unknown error occurred.';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <MapPin className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-700 mb-2">Location Error</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Location Information
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Compare your registered and current location
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Registered Address Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3 mb-4">
            <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold dark:text-white">Registered Address</h2>
          </div>
          {userProfile ? (
            <div className="space-y-2">
              <p className="text-lg text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Name:</span> {userProfile.name}
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Address:</span> {userProfile.address}
              </p>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Loading profile...</p>
          )}
        </div>

        {/* Current Location Address Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3 mb-4">
            <MapPin className="w-6 h-6 text-green-600 dark:text-green-400" />
            <h2 className="text-xl font-bold dark:text-white">Current Location</h2>
          </div>
          {locationInfo ? (
            <div className="space-y-2">
              <p className="text-lg text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Address:</span> {locationInfo.address}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last updated: {new Date(locationInfo.timestamp).toLocaleTimeString()}
              </p>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Getting current location...</p>
          )}
        </div>
      </div>

      {locationInfo && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-6">
              <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-bold dark:text-white">Coordinates</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Latitude</p>
                <p className="font-mono text-lg dark:text-white">
                  {locationInfo.coords.latitude.toFixed(6)}°
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Longitude</p>
                <p className="font-mono text-lg dark:text-white">
                  {locationInfo.coords.longitude.toFixed(6)}°
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Accuracy</p>
                <p className="font-mono text-lg dark:text-white">
                  ±{locationInfo.coords.accuracy.toFixed(1)} meters
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Compass className="w-6 h-6 text-green-600 dark:text-green-400" />
              <h2 className="text-xl font-bold dark:text-white">Movement Data</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Altitude</p>
                <p className="font-mono text-lg dark:text-white">
                  {locationInfo.coords.altitude
                    ? `${locationInfo.coords.altitude.toFixed(1)} meters`
                    : 'Not available'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Heading</p>
                <p className="font-mono text-lg dark:text-white">
                  {locationInfo.coords.heading
                    ? `${locationInfo.coords.heading.toFixed(1)}°`
                    : 'Not available'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Speed</p>
                <p className="font-mono text-lg dark:text-white">
                  {locationInfo.coords.speed
                    ? `${(locationInfo.coords.speed * 3.6).toFixed(1)} km/h`
                    : 'Not available'}
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Wifi className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-bold dark:text-white">Signal Information</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
                <p className="font-mono text-lg dark:text-white">
                  {new Date(locationInfo.timestamp).toLocaleTimeString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Location Quality</p>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-block w-3 h-3 rounded-full ${
                      locationInfo.coords.accuracy <= 10
                        ? 'bg-green-500'
                        : locationInfo.coords.accuracy <= 30
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                  />
                  <span className="font-medium dark:text-white">
                    {locationInfo.coords.accuracy <= 10
                      ? 'Excellent'
                      : locationInfo.coords.accuracy <= 30
                      ? 'Good'
                      : 'Poor'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}