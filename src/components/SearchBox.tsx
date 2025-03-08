// import React, { useState, useRef } from 'react';
// import { Search, X } from 'lucide-react';
// import { toast } from 'react-hot-toast';

// interface SearchBoxProps {
//   onSelect: (location: { name: string; coordinates: [number, number] }) => void;
//   placeholder?: string;
// }

// export default function SearchBox({ onSelect, placeholder = "Search location..." }: SearchBoxProps) {
//   const [query, setQuery] = useState('');
//   const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
//   const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
//   const placesService = useRef<google.maps.places.PlacesService | null>(null);

//   const initServices = () => {
//     if (!autocompleteService.current) {
//       autocompleteService.current = new google.maps.places.AutocompleteService();
//     }
//     if (!placesService.current) {
//       const mapDiv = document.createElement('div');
//       placesService.current = new google.maps.places.PlacesService(mapDiv);
//     }
//   };

//   const handleSearch = async (input: string) => {
//     if (!input) {
//       setPredictions([]);
//       return;
//     }

//     initServices();

//     try {
//       const { predictions } = await new Promise<google.maps.places.AutocompletePrediction[]>((resolve, reject) => {
//         autocompleteService.current?.getPlacePredictions(
//           { input },
//           (results, status) => {
//             if (status === google.maps.places.PlacesServiceStatus.OK && results) {
//               resolve({ predictions: results });
//             } else {
//               reject(new Error('Failed to get predictions'));
//             }
//           }
//         );
//       });
//       setPredictions(predictions || []);
//     } catch (error) {
//       console.error('Error fetching predictions:', error);
//       toast.error('Error searching locations. Please try again.');
//       setPredictions([]);
//     }
//   };

//   const handleSelect = async (placeId: string, description: string) => {
//     try {
//       const place = await new Promise<google.maps.places.PlaceResult>((resolve, reject) => {
//         placesService.current?.getDetails(
//           { placeId },
//           (result, status) => {
//             if (status === google.maps. places.PlacesServiceStatus.OK && result) {
//               resolve(result);
//             } else {
//               reject(new Error('Failed to get place details'));
//             }
//           }
//         );
//       });

//       if (place.geometry?.location) {
//         onSelect({
//           name: description,
//           coordinates: [place.geometry.location.lng(), place.geometry.location.lat()]
//         });
//         setQuery('');
//         setPredictions([]);
//       }
//     } catch (error) {
//       console.error('Error getting place details:', error);
//       toast.error('Error getting location details. Please try again.');
//     }
//   };

//   return (
//     <div className="relative w-full">
//       <div className="relative">
//         <input
//           type="text"
//           value={query}
//           onChange={(e) => {
//             setQuery(e.target.value);
//             handleSearch(e.target.value);
//           }}
//           placeholder={placeholder}
//           className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//         />
//         <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
//         {query && (
//           <button
//             onClick={() => {
//               setQuery('');
//               setPredictions([]);
//             }}
//             className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
//           >
//             <X size={20} />
//           </button>
//         )}
//       </div>
      
//       {predictions.length > 0 && (
//         <div className="absolute w-full bg-white mt-1 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
//           {predictions.map((prediction) => (
//             <button
//               key={prediction.place_id}
//               onClick={() => handleSelect(prediction.place_id, prediction.description)}
//               className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
//             >
//               <div className="font-medium">{prediction.structured_formatting.main_text}</div>
//               {prediction.structured_formatting.secondary_text && (
//                 <div className="text-sm text-gray-600">{prediction.structured_formatting.secondary_text}</div>
//               )}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface SearchBoxProps {
  onSelect: (location: { name: string; coordinates: [number, number] }) => void;
  placeholder?: string;
}

export default function SearchBox({
  onSelect,
  placeholder = 'Search location...',
}: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const autocompleteService =
    useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);

  const initServices = () => {
    if (!autocompleteService.current) {
      autocompleteService.current =
        new google.maps.places.AutocompleteService();
    }
    if (!placesService.current) {
      const mapDiv = document.createElement('div');
      placesService.current = new google.maps.places.PlacesService(mapDiv);
    }
  };

  const handleSearch = async (input: string) => {
    if (!input) {
      setPredictions([]);
      return;
    }

    initServices();

    try {
      const { predictions } = await new Promise<
        google.maps.places.AutocompletePrediction[]
      >((resolve, reject) => {
        autocompleteService.current?.getPlacePredictions(
          { input },
          (results, status) => {
            if (
              status === google.maps.places.PlacesServiceStatus.OK &&
              results
            ) {
              resolve({ predictions: results });
            } else {
              reject(new Error('Failed to get predictions'));
            }
          }
        );
      });
      setPredictions(predictions || []);
    } catch (error) {
      console.error('Error fetching predictions:', error);
      toast.error('Error searching locations. Please try again.');
      setPredictions([]);
    }
  };

  const handleSelect = async (placeId: string, description: string) => {
    try {
      const place = await new Promise<google.maps.places.PlaceResult>(
        (resolve, reject) => {
          placesService.current?.getDetails({ placeId }, (result, status) => {
            if (
              status === google.maps.places.PlacesServiceStatus.OK &&
              result
            ) {
              resolve(result);
            } else {
              reject(new Error('Failed to get place details'));
            }
          });
        }
      );

      if (place.geometry?.location) {
        onSelect({
          name: description,
          coordinates: [
            place.geometry.location.lng(),
            place.geometry.location.lat(),
          ],
        });
        setQuery('');
        setPredictions([]);
      }
    } catch (error) {
      console.error('Error getting place details:', error);
      toast.error('Error getting location details. Please try again.');
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            handleSearch(e.target.value);
          }}
          placeholder={placeholder}
          className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setPredictions([]);
            }}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {predictions.length > 0 && (
        <div className="absolute w-full bg-white mt-1 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
          {predictions.map((prediction) => (
            <button
              key={prediction.place_id}
              onClick={() =>
                handleSelect(prediction.place_id, prediction.description)
              }
              className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            >
              <div className="font-medium">
                {prediction.structured_formatting.main_text}
              </div>
              {prediction.structured_formatting.secondary_text && (
                <div className="text-sm text-gray-600">
                  {prediction.structured_formatting.secondary_text}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
