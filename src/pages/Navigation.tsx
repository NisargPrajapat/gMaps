
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Navigation2,
  Save,
  Volume2,
  X,
  Car,
  Wallet as Walk,
  Bike,
  Download,
  Compass,
  Menu,
} from "lucide-react";
import SearchBox from '../components/SearchBox';
import type { Location, TravelMode } from '../types/navigation';
import {
  GoogleMap,
  DirectionsRenderer,
  Marker,
  Polyline,
  useLoadScript,
} from '@react-google-maps/api';
import html2canvas from 'html2canvas';
import { toast } from 'react-hot-toast';
import { astar } from '../utils/astar';

const TRAVEL_MODES = {
  driving: {
    mode: google.maps.TravelMode.DRIVING,
    icon: Car,
    label: 'Drive',
  },
  walking: {
    mode: google.maps.TravelMode.WALKING,
    icon: Walk,
    label: 'Walk',
  },
  bicycling: {
    mode: google.maps.TravelMode.BICYCLING,
    icon: Bike,
    label: 'Bike',
  },
};

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem',
};

const libraries = ["places", "geometry"] as ["places", "geometry"];

export default function NavigationPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [alternativeRoutes, setAlternativeRoutes] = useState<google.maps.DirectionsRoute[]>([]);
  const [astarPath, setAstarPath] = useState<google.maps.LatLng[]>([]);
  const [isNavigating, setIsNavigating] = useState(false);
  const [travelMode, setTravelMode] = useState<TravelMode>('driving');
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const mapRef = useRef<google.maps.Map>();
  const directionsService = useRef<google.maps.DirectionsService>();
  const mapDivRef = useRef<HTMLDivElement>(null);
  const navigationWatchId = useRef<number | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "<your api key here>",
    libraries,
  });

  const mapOptions = useMemo(() => ({
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }],
      },
    ],
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: true,
    streetViewControl: true,
    fullscreenControl: true,
    rotateControl: true
  }), []);

  useEffect(() => {
    const replayRoute = localStorage.getItem('replayRoute');
    if (replayRoute) {
      const route = JSON.parse(replayRoute);
      setLocations(route.locations);
      setTravelMode(route.mode);
      localStorage.removeItem('replayRoute');
    }

    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(coords);
          setIsLoading(false);
        },
        (error) => {
          console.error('Error tracking location:', error);
          handleLocationError(error);
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      );
      setWatchId(id);
    } else {
      toast.error('Geolocation is not supported by this browser.');
      setIsLoading(false);
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
      if (navigationWatchId.current) {
        navigator.geolocation.clearWatch(navigationWatchId.current);
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleLocationError = (error: GeolocationPositionError) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        toast.error('Please enable location services to use navigation features.');
        break;
      case error.POSITION_UNAVAILABLE:
        toast.error('Location information is unavailable. Please try again.');
        break;
      case error.TIMEOUT:
        toast.error('Location request timed out. Please try again.');
        break;
      default:
        toast.error('An unknown error occurred while getting location.');
        break;
    }
  };

  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    directionsService.current = new google.maps.DirectionsService();
  };

  const calculateAstarPath = () => {
    if (locations.length < 2) return;

    const grid = Array(100)
      .fill(null)
      .map(() => Array(100).fill(false));
    const path: [number, number][] = [];

    for (let i = 0; i < locations.length - 1; i++) {
      const start = locations[i].coordinates;
      const end = locations[i + 1].coordinates;

      const startGrid: [number, number] = [
        Math.floor((start[0] + 180) * (grid.length / 360)),
        Math.floor((start[1] + 90) * (grid[0].length / 180)),
      ];
      const endGrid: [number, number] = [
        Math.floor((end[0] + 180) * (grid.length / 360)),
        Math.floor((end[1] + 90) * (grid[0].length / 180)),
      ];

      const segment = astar(startGrid, endGrid, grid);
      path.push(...segment);
    }

    const astarLatLngs = path.map(
      (point) =>
        new google.maps.LatLng(
          point[1] * (180 / grid[0].length) - 90,
          point[0] * (360 / grid.length) - 180
        )
    );

    setAstarPath(astarLatLngs);
  };

  const calculateRoute = async () => {
    if (locations.length < 2 || !directionsService.current) return;

    try {
      const origin = locations[0];
      const destination = locations[locations.length - 1];
      const waypoints = locations.slice(1, -1).map((location) => ({
        location: {
          lat: location.coordinates[1],
          lng: location.coordinates[0],
        },
        stopover: true,
      }));

      const result = await directionsService.current.route({
        origin: { lat: origin.coordinates[1], lng: origin.coordinates[0] },
        destination: {
          lat: destination.coordinates[1],
          lng: destination.coordinates[0],
        },
        waypoints,
        travelMode: TRAVEL_MODES[travelMode].mode,
        provideRouteAlternatives: true,
      });

      setDirections(result);
      setAlternativeRoutes(result.routes.slice(1));
      calculateAstarPath();

      if (mapRef.current) {
        const bounds = new google.maps.LatLngBounds();
        result.routes[0].legs.forEach((leg) => {
          bounds.extend(leg.start_location);
          bounds.extend(leg.end_location);
        });
        mapRef.current.fitBounds(bounds);
      }
    } catch (error) {
      console.error('Error calculating route:', error);
      toast.error('Error calculating route. Please try again.');
    }
  };

  const addLocation = (location: Location) => {
    const newLocation = { ...location, id: crypto.randomUUID() };
    setLocations([...locations, newLocation]);
  };

  const removeLocation = (id: string) => {
    setLocations(locations.filter((loc) => loc.id !== id));
  };

  useEffect(() => {
    if (locations.length >= 2) {
      calculateRoute();
    }
  }, [locations, travelMode]);

  const startNavigation = () => {
    if (!directions || !currentLocation) return;
    setIsNavigating(true);

    const steps = directions.routes[0].legs.flatMap(leg => leg.steps);
    let currentStep = 0;

    const speakInstruction = (instruction: string) => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();

        const cleanInstruction = instruction.replace(/<[^>]*>/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanInstruction);

        const voices = window.speechSynthesis.getVoices();
        const englishVoice = voices.find(voice => voice.lang.startsWith('en-'));
        if (englishVoice) {
          utterance.voice = englishVoice;
        }

        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }
    };

    speakInstruction(`Starting navigation in ${travelMode} mode. ${steps[0].instructions}`);

    navigationWatchId.current = navigator.geolocation.watchPosition(
      (position) => {
        if (currentStep >= steps.length - 1) {
          speakInstruction('You have reached your destination');
          if (navigationWatchId.current) {
            navigator.geolocation.clearWatch(navigationWatchId.current);
          }
          return;
        }

        const currentPos = new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );
        const nextStepLocation = steps[currentStep + 1].start_location;

        const distance = google.maps.geometry.spherical.computeDistanceBetween(
          currentPos,
          nextStepLocation
        );

        if (distance < 50) {
          currentStep++;
          if (steps[currentStep]) {
            speakInstruction(steps[currentStep].instructions);
          }
        }
      },
      (error) => {
        console.error('Error tracking location:', error);
        handleLocationError(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  };

  const saveRoute = async () => {
    if (!directions) {
      toast.error('Please calculate a route first');
      return;
    }

    try {
      const route = directions.routes[0];
      const savedRoute = {
        locations,
        distance: route.legs.reduce(
          (total, leg) => total + (leg.distance?.value || 0),
          0
        ),
        duration: route.legs.reduce(
          (total, leg) => total + (leg.duration?.value || 0),
          0
        ),
        mode: travelMode,
      };

      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to save routes');
        return;
      }

      const response = await fetch('http://localhost:5000/api/routes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(savedRoute),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save route');
      }

      toast.success('Route saved successfully!');
    } catch (error) {
      console.error('Error saving route:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save route. Please try again.');
    }
  };

  const downloadMap = async () => {
    if (!mapDivRef.current) {
      toast.error('Map container not found');
      return;
    }

    try {
      const loadingToast = toast.loading('Saving map...');

      await new Promise(resolve => setTimeout(resolve, 1000));

      const canvas = await html2canvas(mapDivRef.current, {
        useCORS: true,
        scale: 2,
        allowTaint: true,
        logging: false,
        backgroundColor: null,
      });

      const imageUrl = canvas.toDataURL('image/png');
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('Please log in to save maps');
        toast.dismiss(loadingToast);
        return;
      }

      const response = await fetch('http://localhost:5000/api/profile/save-map', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save map');
      }

      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `map_${new Date().toISOString().slice(0, 10)}.png`;
      link.click();

      toast.dismiss(loadingToast);
      toast.success('Map saved and downloaded successfully!');
    } catch (error) {
      console.error('Error saving map:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save map. Please try again.');
    }
  };

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 font-semibold">Error loading Google Maps</p>
          <p className="text-gray-600 mt-2">Please check your internet connection and try again</p>
        </div>
      </div>
    );
  }

  if (!isLoaded || isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] relative">
      <div className="h-full flex flex-col md:flex-row gap-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-full shadow-lg"
        >
          <Menu size={24} />
        </button>

        <div className={`
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          transition-transform duration-300 ease-in-out
          fixed md:relative z-40 md:z-auto
          w-full md:w-1/3 lg:w-1/4
          h-full
          bg-white md:translate-x-0
          overflow-y-auto
          shadow-lg md:shadow-none rounded-lg
        `}
        >
          <div className="p-4">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Travel Mode
              </h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(TRAVEL_MODES).map(([key, { icon: Icon, label }]) => (
                  <button
                    key={key}
                    onClick={() => setTravelMode(key as TravelMode)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded ${travelMode === key
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100'
                      }`}
                  >
                    <Icon size={20} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {currentLocation && (
              <div className="mb-4 p-4 bg-blue-50 rounded">
                <div className="flex items-center space-x-2">
                  <Compass size={20} className="text-blue-600" />
                  <h3 className="font-semibold">Current Location</h3>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Lat: {currentLocation.lat.toFixed(4)}, Lng:{' '}
                  {currentLocation.lng.toFixed(4)}
                </p>
              </div>
            )}

            <div className="space-y-4">
              {locations.map((location, index) => (
                <div
                  key={location.id}
                  className="flex items-center space-x-2 p-2 bg-gray-50 rounded"
                >
                  <span className="font-medium">{index + 1}.</span>
                  <span className="flex-1">{location.name}</span>
                  <button
                    onClick={() => removeLocation(location.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}

              <div className="pt-4">
                <SearchBox
                  onSelect={addLocation}
                  placeholder="Add destination..."
                />
              </div>
            </div>

            {directions && (
              <div className="mt-6 space-y-4">
                <div className="p-4 bg-blue-50 rounded">
                  <h3 className="font-semibold">Main Route</h3>
                  <p>
                    Distance:{' '}
                    {(
                      directions.routes[0].legs.reduce(
                        (total, leg) => total + (leg.distance?.value || 0),
                        0
                      ) / 1000
                    ).toFixed(1)}{' '}
                    km
                  </p>
                  <p>
                    Duration:{' '}
                    {Math.round(
                      directions.routes[0].legs.reduce(
                        (total, leg) => total + (leg.duration?.value || 0),
                        0
                      ) / 60
                    )}{' '}
                    minutes
                  </p>
                </div>

                {alternativeRoutes.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Alternative Routes</h4>
                    {alternativeRoutes.map((route, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded">
                        <p>
                          Distance:{' '}
                          {(
                            route.legs.reduce(
                              (total, leg) => total + (leg.distance?.value || 0),
                              0
                            ) / 1000
                          ).toFixed(1)}{' '}
                          km
                        </p>
                        <p>
                          Duration:{' '}
                          {Math.round(
                            route.legs.reduce(
                              (total, leg) => total + (leg.duration?.value || 0),
                              0
                            ) / 60
                          )}{' '}
                          minutes
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={startNavigation}
                    className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    <Navigation2 size={20} />
                    <span>Start Navigation</span>
                  </button>

                  <button
                    onClick={saveRoute}
                    className="flex items-center justify-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                  >
                    <Save size={20} />
                  </button>

                  <button
                    onClick={downloadMap}
                    className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    <Download size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 relative" ref={mapDivRef}>
          {currentLocation && (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={14}
              center={currentLocation}
              onLoad={onMapLoad}
              options={mapOptions}
            >
              {currentLocation && (
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
              )}

              {astarPath.length > 0 && (
                <Polyline
                  path={astarPath}
                  options={{
                    geodesic: true,
                    strokeColor: '#3b82f6',
                    strokeOpacity: 1.0,
                    strokeWeight: 4,
                  }}
                />
              )}

              {directions && (
                <>
                  <DirectionsRenderer
                    directions={directions}
                    options={{
                      polylineOptions: {
                        strokeColor: '#3b82f6',
                        strokeWeight: 4,
                        strokeOpacity: 0.7,
                      },
                    }}
                  />
                  {alternativeRoutes.map((route, index) => (
                    <DirectionsRenderer
                      key={index}
                      directions={{
                        ...directions,
                        routes: [route],
                      }}
                      options={{
                        polylineOptions: {
                          strokeColor: '#ff0000',
                          strokeWeight: 3,
                          strokeOpacity: 0.35,
                        },
                      }}
                    />
                  ))}
                </>
              )}

              {locations.map((location, index) => (
                <Marker
                  key={location.id}
                  position={{
                    lat: location.coordinates[1],
                    lng: location.coordinates[0],
                  }}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor:
                      index === 0
                        ? '#22c55e'
                        : index === locations.length - 1
                          ? '#ef4444'
                          : '#3b82f6',
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 2,
                  }}
                  label={{
                    text: (index + 1).toString(),
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                />
              ))}
            </GoogleMap>
          )}

          {isNavigating && (
            <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">Turn-by-turn Navigation</h3>
                  <p className="text-gray-600 text-sm">
                    Next instruction will be spoken...
                  </p>
                </div>
                <button
                  onClick={() => window.speechSynthesis.cancel()}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <Volume2 size={24} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
