// // import React, { useState, useEffect, useRef } from 'react';
// // import { MapPin, Navigation as NavIcon, Coffee, Utensils, Hotel, Trees as Tree, Building, ShoppingBag } from 'lucide-react';
// // import type { NearbyPlace } from '../types/navigation';
// // import { toast } from 'react-hot-toast';
// // import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';

// // const CATEGORIES = [
// //   { id: 'restaurant', name: 'Restaurants', icon: Utensils, color: '#ef4444', type: 'restaurant' },
// //   { id: 'cafe', name: 'Cafes', icon: Coffee, color: '#f97316', type: 'cafe' },
// //   { id: 'hotel', name: 'Hotels', icon: Hotel, color: '#3b82f6', type: 'lodging' },
// //   { id: 'park', name: 'Parks', icon: Tree, color: '#22c55e', type: 'park' },
// //   { id: 'shopping', name: 'Shopping', icon: ShoppingBag, color: '#8b5cf6', type: 'shopping_mall' },
// //   { id: 'business', name: 'Business', icon: Building, color: '#64748b', type: 'business' },
// // ];

// // const mapContainerStyle = {
// //   width: '100%',
// //   height: '100%',
// //   borderRadius: '0.5rem'
// // };

// // export default function NearbyPage() {
// //   const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral | null>(null);
// //   const [places, setPlaces] = useState<NearbyPlace[]>([]);
// //   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
// //   const [loading, setLoading] = useState(false);
// //   const [selectedPlace, setSelectedPlace] = useState<NearbyPlace | null>(null);
// //   const mapRef = useRef<google.maps.Map>();
// //   const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);

// //   useEffect(() => {
// //     if (navigator.geolocation) {
// //       navigator.geolocation.getCurrentPosition(
// //         (position) => {
// //           const coords = {
// //             lat: position.coords.latitude,
// //             lng: position.coords.longitude
// //           };
// //           setCurrentLocation(coords);
// //         },
// //         (error) => {
// //           console.error('Error getting location:', error);
// //           toast.error('Could not get your location. Please enable location services.');
// //         }
// //       );
// //     }
// //   }, []);

// //   const onMapLoad = (map: google.maps.Map) => {
// //     mapRef.current = map;
// //     placesServiceRef.current = new google.maps.places.PlacesService(map);
// //   };

// //   const fetchNearbyPlaces = () => {
// //     if (!currentLocation || !placesServiceRef.current) return;
    
// //     setLoading(true);
// //     const category = CATEGORIES.find(cat => cat.id === selectedCategory);
    
// //     const request = {
// //       location: currentLocation,
// //       radius: 2000,
// //       type: category?.type || 'point_of_interest'
// //     };

// //     placesServiceRef.current.nearbySearch(request, (results, status) => {
// //       if (status === google.maps.places.PlacesServiceStatus.OK && results) {
// //         const nearbyPlaces = results.map(place => ({
// //           id: place.place_id || Math.random().toString(),
// //           name: place.name || 'Unnamed Place',
// //           type: place.types?.[0] || 'place',
// //           coordinates: [place.geometry?.location?.lng() || 0, place.geometry?.location?.lat() || 0] as [number, number],
// //           rating: place.rating || Math.random() * 2 + 3,
// //           distance: calculateDistance(
// //             [currentLocation.lng, currentLocation.lat],
// //             [place.geometry?.location?.lng() || 0, place.geometry?.location?.lat() || 0]
// //           )
// //         }));
        
// //         setPlaces(nearbyPlaces);
// //       } else {
// //         setPlaces([]);
// //         toast.error('No places found in this category');
// //       }
// //       setLoading(false);
// //     });
// //   };

// //   useEffect(() => {
// //     if (currentLocation) {
// //       fetchNearbyPlaces();
// //     }
// //   }, [currentLocation, selectedCategory]);

// //   const calculateDistance = (coord1: [number, number], coord2: [number, number]): number => {
// //     const R = 6371;
// //     const dLat = (coord2[1] - coord1[1]) * Math.PI / 180;
// //     const dLon = (coord2[0] - coord1[0]) * Math.PI / 180;
// //     const a = 
// //       Math.sin(dLat/2) * Math.sin(dLat/2) +
// //       Math.cos(coord1[1] * Math.PI / 180) * Math.cos(coord2[1] * Math.PI / 180) * 
// //       Math.sin(dLon/2) * Math.sin(dLon/2);
// //     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
// //     return R * c;
// //   };

// //   const centerOnPlace = (place: NearbyPlace) => {
// //     if (mapRef.current) {
// //       mapRef.current.panTo({ lat: place.coordinates[1], lng: place.coordinates[0] });
// //       mapRef.current.setZoom(16);
// //       setSelectedPlace(place);
// //     }
// //   };

// //   return (
// //     <div className="h-[calc(100vh-4rem)]">
// //       <div className="grid grid-cols-3 gap-4 h-full">
// //         <div className="col-span-1 bg-white p-4 rounded-lg shadow overflow-y-auto">
// //           <h2 className="text-xl font-semibold mb-4">Nearby Places</h2>
          
// //           <div className="mb-4">
// //             <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
// //             <div className="flex flex-wrap gap-2">
// //               {CATEGORIES.map(category => (
// //                 <button
// //                   key={category.id}
// //                   onClick={() => setSelectedCategory(
// //                     selectedCategory === category.id ? null : category.id
// //                   )}
// //                   className={`flex items-center space-x-2 px-3 py-2 rounded ${
// //                     selectedCategory === category.id 
// //                       ? 'bg-blue-100 text-blue-700' 
// //                       : 'bg-gray-100 hover:bg-gray-200'
// //                   }`}
// //                 >
// //                   <category.icon size={16} />
// //                   <span>{category.name}</span>
// //                 </button>
// //               ))}
// //             </div>
// //           </div>

// //           {loading ? (
// //             <div className="flex items-center justify-center py-8">
// //               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
// //             </div>
// //           ) : (
// //             <div className="space-y-4">
// //               {places.map(place => (
// //                 <div key={place.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
// //                   <div className="flex items-start justify-between">
// //                     <div>
// //                       <h3 className="font-medium">{place.name}</h3>
// //                       <p className="text-sm text-gray-600 mt-1">
// //                         {place.type}
// //                       </p>
// //                     </div>
// //                     <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded">
// //                       <span>★</span>
// //                       <span>{place.rating.toFixed(1)}</span>
// //                     </div>
// //                   </div>
// //                   <div className="mt-2 flex items-center justify-between text-sm">
// //                     <span className="text-gray-600">
// //                       {place.distance.toFixed(1)} km away
// //                     </span>
// //                     <button 
// //                       onClick={() => centerOnPlace(place)}
// //                       className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
// //                     >
// //                       <NavIcon size={16} />
// //                       <span>View on map</span>
// //                     </button>
// //                   </div>
// //                 </div>
// //               ))}

// //               {places.length === 0 && !loading && (
// //                 <div className="text-center py-8">
// //                   <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
// //                   <h3 className="text-lg font-medium text-gray-900">No places found</h3>
// //                   <p className="text-gray-600 mt-1">
// //                     Try selecting a different category or expanding your search area
// //                   </p>
// //                 </div>
// //               )}
// //             </div>
// //           )}
// //         </div>

// //         <div className="col-span-2 relative">
// //           {currentLocation && (
// //             <GoogleMap
// //               mapContainerStyle={mapContainerStyle}
// //               zoom={14}
// //               center={currentLocation}
// //               onLoad={onMapLoad}
// //               options={{
// //                 styles: [
// //                   {
// //                     featureType: "poi",
// //                     elementType: "labels",
// //                     stylers: [{ visibility: "off" }]
// //                   }
// //                 ],
// //                 disableDefaultUI: true,
// //                 zoomControl: true,
// //                 mapTypeControl: false,
// //                 streetViewControl: false,
// //                 fullscreenControl: true
// //               }}
// //             >
// //               {/* Current location marker */}
// //               <Marker
// //                 position={currentLocation}
// //                 icon={{
// //                   path: google.maps.SymbolPath.CIRCLE,
// //                   scale: 8,
// //                   fillColor: "#3b82f6",
// //                   fillOpacity: 1,
// //                   strokeColor: "#ffffff",
// //                   strokeWeight: 2,
// //                 }}
// //               />

// //               {/* Place markers */}
// //               {places.map((place) => (
// //                 <Marker
// //                   key={place.id}
// //                   position={{ lat: place.coordinates[1], lng: place.coordinates[0] }}
// //                   onClick={() => setSelectedPlace(place)}
// //                 />
// //               ))}

// //               {/* Info window for selected place */}
// //               {selectedPlace && (
// //                 <InfoWindow
// //                   position={{ lat: selectedPlace.coordinates[1], lng: selectedPlace.coordinates[0] }}
// //                   onCloseClick={() => setSelectedPlace(null)}
// //                 >
// //                   <div className="p-2">
// //                     <h3 className="font-bold">{selectedPlace.name}</h3>
// //                     <p className="text-sm">{selectedPlace.distance.toFixed(1)} km away</p>
// //                     {selectedPlace.rating && (
// //                       <p className="text-sm mt-1">Rating: {selectedPlace.rating.toFixed(1)} ★</p>
// //                     )}
// //                   </div>
// //                 </InfoWindow>
// //               )}
// //             </GoogleMap>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// import React, { useState, useEffect, useRef } from 'react';
// import {
//   MapPin,
//   Navigation as NavIcon,
//   Coffee,
//   Utensils,
//   Hotel,
//   Trees as Tree,
//   Building,
//   ShoppingBag,
// } from 'lucide-react';
// import type { NearbyPlace } from '../types/navigation';
// import { toast } from 'react-hot-toast';
// import {
//   GoogleMap,
//   useLoadScript,
//   Marker,
//   InfoWindow,
// } from '@react-google-maps/api';

// const CATEGORIES = [
//   {
//     id: 'restaurant',
//     name: 'Restaurants',
//     icon: Utensils,
//     color: '#ef4444',
//     type: 'restaurant',
//   },
//   { id: 'cafe', name: 'Cafes', icon: Coffee, color: '#f97316', type: 'cafe' },
//   {
//     id: 'hotel',
//     name: 'Hotels',
//     icon: Hotel,
//     color: '#3b82f6',
//     type: 'lodging',
//   },
//   { id: 'park', name: 'Parks', icon: Tree, color: '#22c55e', type: 'park' },
//   {
//     id: 'shopping',
//     name: 'Shopping',
//     icon: ShoppingBag,
//     color: '#8b5cf6',
//     type: 'shopping_mall',
//   },
//   {
//     id: 'business',
//     name: 'Business',
//     icon: Building,
//     color: '#64748b',
//     type: 'business',
//   },
// ];

// const mapContainerStyle = {
//   width: '100%',
//   height: '100%',
//   borderRadius: '0.5rem',
// };

// export default function NearbyPage() {
//   const [currentLocation, setCurrentLocation] =
//     useState<google.maps.LatLngLiteral | null>(null);
//   const [places, setPlaces] = useState<NearbyPlace[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [selectedPlace, setSelectedPlace] = useState<NearbyPlace | null>(null);
//   const mapRef = useRef<google.maps.Map>();
//   const placesServiceRef = useRef<google.maps.places.PlacesService | null>(
//     null
//   );

//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const coords = {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           };
//           setCurrentLocation(coords);
//         },
//         (error) => {
//           console.error('Error getting location:', error);
//           toast.error(
//             'Could not get your location. Please enable location services.'
//           );
//         }
//       );
//     }
//   }, []);

//   const onMapLoad = (map: google.maps.Map) => {
//     mapRef.current = map;
//     placesServiceRef.current = new google.maps.places.PlacesService(map);
//   };

//   const fetchNearbyPlaces = () => {
//     if (!currentLocation || !placesServiceRef.current) return;

//     setLoading(true);
//     const category = CATEGORIES.find((cat) => cat.id === selectedCategory);

//     const request = {
//       location: currentLocation,
//       radius: 2000,
//       type: category?.type || 'point_of_interest',
//     };

//     placesServiceRef.current.nearbySearch(request, (results, status) => {
//       if (status === google.maps.places.PlacesServiceStatus.OK && results) {
//         const nearbyPlaces = results.map((place) => ({
//           id: place.place_id || Math.random().toString(),
//           name: place.name || 'Unnamed Place',
//           type: place.types?.[0] || 'place',
//           coordinates: [
//             place.geometry?.location?.lng() || 0,
//             place.geometry?.location?.lat() || 0,
//           ] as [number, number],
//           rating: place.rating || Math.random() * 2 + 3,
//           distance: calculateDistance(
//             [currentLocation.lng, currentLocation.lat],
//             [
//               place.geometry?.location?.lng() || 0,
//               place.geometry?.location?.lat() || 0,
//             ]
//           ),
//         }));

//         setPlaces(nearbyPlaces);
//       } else {
//         setPlaces([]);
//         toast.error('No places found in this category');
//       }
//       setLoading(false);
//     });
//   };

//   useEffect(() => {
//     if (currentLocation) {
//       fetchNearbyPlaces();
//     }
//   }, [currentLocation, selectedCategory]);

//   const calculateDistance = (
//     coord1: [number, number],
//     coord2: [number, number]
//   ): number => {
//     const R = 6371;
//     const dLat = ((coord2[1] - coord1[1]) * Math.PI) / 180;
//     const dLon = ((coord2[0] - coord1[0]) * Math.PI) / 180;
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos((coord1[1] * Math.PI) / 180) *
//         Math.cos((coord2[1] * Math.PI) / 180) *
//         Math.sin(dLon / 2) *
//         Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c;
//   };

//   const centerOnPlace = (place: NearbyPlace) => {
//     if (mapRef.current) {
//       mapRef.current.panTo({
//         lat: place.coordinates[1],
//         lng: place.coordinates[0],
//       });
//       mapRef.current.setZoom(16);
//       setSelectedPlace(place);
//     }
//   };

//   return (
//     <div className="h-[calc(100vh-4rem)]">
//       <div className="grid grid-cols-3 gap-4 h-full">
//         <div className="col-span-1 bg-white p-4 rounded-lg shadow overflow-y-auto">
//           <h2 className="text-xl font-semibold mb-4">Nearby Places</h2>

//           <div className="mb-4">
//             <h3 className="text-sm font-medium text-gray-700 mb-2">
//               Categories
//             </h3>
//             <div className="flex flex-wrap gap-2">
//               {CATEGORIES.map((category) => (
//                 <button
//                   key={category.id}
//                   onClick={() =>
//                     setSelectedCategory(
//                       selectedCategory === category.id ? null : category.id
//                     )
//                   }
//                   className={`flex items-center space-x-2 px-3 py-2 rounded ${
//                     selectedCategory === category.id
//                       ? 'bg-blue-100 text-blue-700'
//                       : 'bg-gray-100 hover:bg-gray-200'
//                   }`}
//                 >
//                   <category.icon size={16} />
//                   <span>{category.name}</span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {loading ? (
//             <div className="flex items-center justify-center py-8">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {places.map((place) => (
//                 <div
//                   key={place.id}
//                   className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
//                 >
//                   <div className="flex items-start justify-between">
//                     <div>
//                       <h3 className="font-medium">{place.name}</h3>
//                       <p className="text-sm text-gray-600 mt-1">{place.type}</p>
//                     </div>
//                     <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded">
//                       <span>★</span>
//                       <span>{place.rating.toFixed(1)}</span>
//                     </div>
//                   </div>
//                   <div className="mt-2 flex items-center justify-between text-sm">
//                     <span className="text-gray-600">
//                       {place.distance.toFixed(1)} km away
//                     </span>
//                     <button
//                       onClick={() => centerOnPlace(place)}
//                       className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
//                     >
//                       <NavIcon size={16} />
//                       <span>View on map</span>
//                     </button>
//                   </div>
//                 </div>
//               ))}

//               {places.length === 0 && !loading && (
//                 <div className="text-center py-8">
//                   <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
//                   <h3 className="text-lg font-medium text-gray-900">
//                     No places found
//                   </h3>
//                   <p className="text-gray-600 mt-1">
//                     Try selecting a different category or expanding your search
//                     area
//                   </p>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         <div className="col-span-2 relative">
//           {currentLocation && (
//             <GoogleMap
//               mapContainerStyle={mapContainerStyle}
//               zoom={14}
//               center={currentLocation}
//               onLoad={onMapLoad}
//               options={{
//                 styles: [
//                   {
//                     featureType: 'poi',
//                     elementType: 'labels',
//                     stylers: [{ visibility: 'off' }],
//                   },
//                 ],
//                 disableDefaultUI: true,
//                 zoomControl: true,
//                 mapTypeControl: false,
//                 streetViewControl: false,
//                 fullscreenControl: true,
//               }}
//             >
//               {/* Current location marker */}
//               <Marker
//                 position={currentLocation}
//                 icon={{
//                   path: google.maps.SymbolPath.CIRCLE,
//                   scale: 8,
//                   fillColor: '#3b82f6',
//                   fillOpacity: 1,
//                   strokeColor: '#ffffff',
//                   strokeWeight: 2,
//                 }}
//               />

//               {/* Place markers */}
//               {places.map((place) => (
//                 <Marker
//                   key={place.id}
//                   position={{
//                     lat: place.coordinates[1],
//                     lng: place.coordinates[0],
//                   }}
//                   onClick={() => setSelectedPlace(place)}
//                 />
//               ))}

//               {/* Info window for selected place */}
//               {selectedPlace && (
//                 <InfoWindow
//                   position={{
//                     lat: selectedPlace.coordinates[1],
//                     lng: selectedPlace.coordinates[0],
//                   }}
//                   onCloseClick={() => setSelectedPlace(null)}
//                 >
//                   <div className="p-2">
//                     <h3 className="font-bold">{selectedPlace.name}</h3>
//                     <p className="text-sm">
//                       {selectedPlace.distance.toFixed(1)} km away
//                     </p>
//                     {selectedPlace.rating && (
//                       <p className="text-sm mt-1">
//                         Rating: {selectedPlace.rating.toFixed(1)} ★
//                       </p>
//                     )}
//                   </div>
//                 </InfoWindow>
//               )}
//             </GoogleMap>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Navigation as NavIcon,
  Coffee,
  Utensils,
  Hotel,
  Trees as Tree,
  Building,
  ShoppingBag,
  Navigation2,
} from 'lucide-react';
import type { NearbyPlace } from '../types/navigation';
import { toast } from 'react-hot-toast';
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
  DirectionsRenderer,
} from '@react-google-maps/api';

const CATEGORIES = [
  {
    id: 'restaurant',
    name: 'Restaurants',
    icon: Utensils,
    color: '#ef4444',
    type: 'restaurant',
  },
  { id: 'cafe', name: 'Cafes', icon: Coffee, color: '#f97316', type: 'cafe' },
  {
    id: 'hotel',
    name: 'Hotels',
    icon: Hotel,
    color: '#3b82f6',
    type: 'lodging',
  },
  { id: 'park', name: 'Parks', icon: Tree, color: '#22c55e', type: 'park' },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: ShoppingBag,
    color: '#8b5cf6',
    type: 'shopping_mall',
  },
  {
    id: 'business',
    name: 'Business',
    icon: Building,
    color: '#64748b',
    type: 'business',
  },
];

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem',
};

export default function NearbyPage() {
  const [currentLocation, setCurrentLocation] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<NearbyPlace | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const mapRef = useRef<google.maps.Map>();
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(coords);
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error(
            'Could not get your location. Please enable location services.'
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    placesServiceRef.current = new google.maps.places.PlacesService(map);
    directionsServiceRef.current = new google.maps.DirectionsService();
  };

  const fetchNearbyPlaces = () => {
    if (!currentLocation || !placesServiceRef.current) return;

    setLoading(true);
    const category = CATEGORIES.find((cat) => cat.id === selectedCategory);

    const request = {
      location: currentLocation,
      radius: 2000,
      type: category?.type || 'point_of_interest',
    };

    placesServiceRef.current.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        const nearbyPlaces = results.map((place) => ({
          id: place.place_id || Math.random().toString(),
          name: place.name || 'Unnamed Place',
          type: place.types?.[0] || 'place',
          coordinates: [
            place.geometry?.location?.lng() || 0,
            place.geometry?.location?.lat() || 0,
          ] as [number, number],
          rating: place.rating || Math.random() * 2 + 3,
          distance: calculateDistance(
            [currentLocation.lng, currentLocation.lat],
            [
              place.geometry?.location?.lng() || 0,
              place.geometry?.location?.lat() || 0,
            ]
          ),
        }));

        setPlaces(nearbyPlaces);
      } else {
        setPlaces([]);
        toast.error('No places found in this category');
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    if (currentLocation) {
      fetchNearbyPlaces();
    }
  }, [currentLocation, selectedCategory]);

  const calculateDistance = (
    coord1: [number, number],
    coord2: [number, number]
  ): number => {
    const R = 6371;
    const dLat = ((coord2[1] - coord1[1]) * Math.PI) / 180;
    const dLon = ((coord2[0] - coord1[0]) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((coord1[1] * Math.PI) / 180) *
        Math.cos((coord2[1] * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const navigateToPlace = async (place: NearbyPlace) => {
    if (!currentLocation || !directionsServiceRef.current) return;

    try {
      const result = await directionsServiceRef.current.route({
        origin: currentLocation,
        destination: { lat: place.coordinates[1], lng: place.coordinates[0] },
        travelMode: google.maps.TravelMode.DRIVING,
      });

      setDirections(result);
      setSelectedPlace(place);
    } catch (error) {
      console.error('Error calculating route:', error);
      toast.error('Error calculating route to this place');
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)]">
      <div className="grid grid-cols-3 gap-4 h-full">
        <div className="col-span-1 bg-white p-4 rounded-lg shadow overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Nearby Places</h2>

          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === category.id ? null : category.id
                    )
                  }
                  className={`flex items-center space-x-2 px-3 py-2 rounded ${
                    selectedCategory === category.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <category.icon size={16} />
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {places.map((place) => (
                <div
                  key={place.id}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{place.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{place.type}</p>
                    </div>
                    <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      <span>★</span>
                      <span>{place.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {place.distance.toFixed(1)} km away
                    </span>
                    <button
                      onClick={() => navigateToPlace(place)}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                    >
                      <Navigation2 size={16} />
                      <span>Navigate</span>
                    </button>
                  </div>
                </div>
              ))}

              {places.length === 0 && !loading && (
                <div className="text-center py-8">
                  <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">
                    No places found
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Try selecting a different category or expanding your search
                    area
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="col-span-2 relative">
          {currentLocation && (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={14}
              center={currentLocation}
              onLoad={onMapLoad}
              options={{
                styles: [
                  {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [{ visibility: 'off' }],
                  },
                ],
                disableDefaultUI: true,
                zoomControl: true,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: true,
              }}
            >
              {/* Current location marker */}
              <Marker
                position={currentLocation}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 8,
                  fillColor: '#3b82f6',
                  fillOpacity: 1,
                  strokeColor: '#ffffff',
                  strokeWeight: 2,
                }}
              />

              {/* Place markers */}
              {places.map((place) => (
                <Marker
                  key={place.id}
                  position={{
                    lat: place.coordinates[1],
                    lng: place.coordinates[0],
                  }}
                  onClick={() => setSelectedPlace(place)}
                />
              ))}

              {/* Info window for selected place */}
              {selectedPlace && (
                <InfoWindow
                  position={{
                    lat: selectedPlace.coordinates[1],
                    lng: selectedPlace.coordinates[0],
                  }}
                  onCloseClick={() => {
                    setSelectedPlace(null);
                    setDirections(null);
                  }}
                >
                  <div className="p-2">
                    <h3 className="font-bold">{selectedPlace.name}</h3>
                    <p className="text-sm">
                      {selectedPlace.distance.toFixed(1)} km away
                    </p>
                    {selectedPlace.rating && (
                      <p className="text-sm mt-1">
                        Rating: {selectedPlace.rating.toFixed(1)} ★
                      </p>
                    )}
                    <button
                      onClick={() => navigateToPlace(selectedPlace)}
                      className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Navigate Here
                    </button>
                  </div>
                </InfoWindow>
              )}

              {/* Directions renderer */}
              {directions && (
                <DirectionsRenderer
                  directions={directions}
                  options={{
                    suppressMarkers: true,
                    polylineOptions: {
                      strokeColor: '#3b82f6',
                      strokeWeight: 4,
                      strokeOpacity: 0.7,
                    },
                  }}
                />
              )}
            </GoogleMap>
          )}
        </div>
      </div>
    </div>
  );
}