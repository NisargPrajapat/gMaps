// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import type { Route } from '../types/navigation';
// import { Clock, Navigation, Car, Wallet as Walk, Bike } from 'lucide-react';

// export default function SummaryPage() {
//   const [routes, setRoutes] = useState<Route[]>([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const savedRoutes = JSON.parse(localStorage.getItem('savedRoutes') || '[]');
//     setRoutes(savedRoutes);
//   }, []);

//   const getModeIcon = (mode: string) => {
//     switch (mode) {
//       case 'driving':
//         return <Car size={16} className="mr-2" />;
//       case 'walking':
//         return <Walk size={16} className="mr-2" />;
//       case 'cycling':
//         return <Bike size={16} className="mr-2" />;
//       default:
//         return <Navigation size={16} className="mr-2" />;
//     }
//   };

//   const replayRoute = (route: Route) => {
//     // Store the route to replay in localStorage
//     localStorage.setItem('replayRoute', JSON.stringify(route));
//     navigate('/navigation');
//   };

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-bold">Your Navigation History</h1>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {routes.map((route) => (
//           <div key={route.id} className="bg-white rounded-lg shadow-md p-6">
//             <div className="flex items-start justify-between">
//               <div>
//                 <h3 className="font-semibold text-lg">
//                   {route.locations[0].name} → {route.locations[route.locations.length - 1].name}
//                 </h3>
//                 <p className="text-gray-600 text-sm mt-1">
//                   {route.locations.length} stops
//                 </p>
//               </div>
//               {getModeIcon(route.mode)}
//             </div>
            
//             <div className="mt-4 space-y-2">
//               <div className="flex items-center text-gray-600">
//                 <Clock size={16} className="mr-2" />
//                 <span>{Math.round(route.duration / 60)} minutes</span>
//               </div>
//               <div className="flex items-center text-gray-600">
//                 <Navigation size={16} className="mr-2" />
//                 <span>{(route.distance / 1000).toFixed(1)} km</span>
//               </div>
//             </div>
            
//             <div className="mt-4 pt-4 border-t">
//               <button
//                 onClick={() => replayRoute(route)}
//                 className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//               >
//                 Replay Route
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {routes.length === 0 && (
//         <div className="text-center py-12">
//           <Navigation size={48} className="mx-auto text-gray-400 mb-4" />
//           <h3 className="text-lg font-medium text-gray-900">No routes saved yet</h3>
//           <p className="text-gray-600 mt-1">
//             Your saved routes will appear here once you start navigating
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Route } from '../types/navigation';
import { Clock, Navigation, Car, Wallet as Walk, Bike } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function SummaryPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/routes', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch routes');
      }

      const data = await response.json();
      setRoutes(data);
    } catch (error) {
      console.error('Error fetching routes:', error);
      toast.error('Failed to fetch routes');
    } finally {
      setLoading(false);
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'driving':
        return <Car size={16} className="mr-2" />;
      case 'walking':
        return <Walk size={16} className="mr-2" />;
      case 'bicycling':
        return <Bike size={16} className="mr-2" />;
      default:
        return <Navigation size={16} className="mr-2" />;
    }
  };

  const replayRoute = (route: Route) => {
    localStorage.setItem('replayRoute', JSON.stringify({
      locations: route.locations,
      mode: route.mode
    }));
    navigate('/navigation');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Your Navigation History</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routes.map((route) => (
          <div key={route.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate">
                  {route.locations[0].name}
                </h3>
                <h3 className="font-semibold text-lg truncate">
                  → {route.locations[route.locations.length - 1].name}
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  {route.locations.length} stops
                </p>
              </div>
              {getModeIcon(route.mode)}
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center text-gray-600">
                <Clock size={16} className="mr-2" />
                <span>{Math.round(route.duration / 60)} minutes</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Navigation size={16} className="mr-2" />
                <span>{(route.distance / 1000).toFixed(1)} km</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <button
                onClick={() => replayRoute(route)}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Replay Route
              </button>
            </div>
          </div>
        ))}
      </div>

      {routes.length === 0 && (
        <div className="text-center py-12">
          <Navigation size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            No routes saved yet
          </h3>
          <p className="text-gray-600 mt-1">
            Your saved routes will appear here once you start navigating
          </p>
        </div>
      )}
    </div>
  );
}