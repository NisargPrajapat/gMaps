
import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, Edit, Save, X, MapPin, Phone, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface SavedMap {
  _id: string;
  imageUrl: string;
  createdAt: string;
}

interface UserProfile {
  email: string;
  name: string;
  phone: string;
  address: string;
  createdAt: string;
  savedMaps: SavedMap[];
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to view profile');
        return;
      }

      const response = await fetch('http://localhost:5000/api/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data);
      setEditForm({
        name: data.name || '',
        phone: data.phone || '',
        address: data.address || '',
      });
    } catch (error) {
      console.error('Profile fetch error:', error);
      toast.error('Error fetching profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to update profile');
        return;
      }

      const response = await fetch('http://localhost:5000/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setIsEditing(false);
      toast.success('Profile updated successfully');
      
      await fetchProfile();
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const deleteMap = async (mapId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to delete maps');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/profile/maps/${mapId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete map');
      }

      toast.success('Map deleted successfully');
      await fetchProfile();
    } catch (error) {
      console.error('Map deletion error:', error);
      toast.error('Failed to delete map');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <User size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Profile not found</h3>
        <p className="text-gray-600 mt-2">Please try refreshing the page</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Profile Information</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mt-2 sm:mt-0"
          >
            {isEditing ? (
              <>
                <X size={20} />
                <span>Cancel</span>
              </>
            ) : (
              <>
                <Edit size={20} />
                <span>Edit Profile</span>
              </>
            )}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your address"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Save size={20} />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Mail className="text-gray-500 flex-shrink-0" size={24} />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{profile.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <User className="text-gray-500 flex-shrink-0" size={24} />
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{profile.name || 'Not set'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Calendar className="text-gray-500 flex-shrink-0" size={24} />
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium">
                  {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {profile.phone && (
              <div className="flex items-center space-x-4">
                <Phone className="text-gray-500 flex-shrink-0" size={24} />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{profile.phone}</p>
                </div>
              </div>
            )}

            {profile.address && (
              <div className="flex items-center space-x-4">
                <MapPin className="text-gray-500 flex-shrink-0" size={24} />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{profile.address}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">Saved Maps</h3>
        
        {profile.savedMaps && profile.savedMaps.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.savedMaps.map((map) => (
              <div key={map._id} className="relative group">
                <button
                  onClick={() => setSelectedImage(map.imageUrl)}
                  className="w-full focus:outline-none"
                >
                  <img
                    src={map.imageUrl}
                    alt={`Saved map`}
                    className="w-full h-48 object-cover rounded-lg hover:opacity-90 transition-opacity"
                  />
                </button>
                <button
                  onClick={() => deleteMap(map._id)}
                  className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                  aria-label="Delete map"
                >
                  <Trash2 size={16} />
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  Saved on {new Date(map.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No saved maps yet</p>
        )}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
              aria-label="Close preview"
            >
              <X size={24} />
            </button>
            <img
              src={selectedImage}
              alt="Full size map"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}