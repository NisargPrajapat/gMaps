export type TravelMode = 'driving' | 'walking' | 'bicycling';

export interface Location {
  id: string;
  name: string;
  coordinates: [number, number];
}

export interface Route {
  id: string;
  locations: Location[];
  distance: number;
  duration: number;
  created_at: string;
  mode: TravelMode;
  path: [number, number][];
}

export interface RouteStep {
  distance: number;
  duration: number;
  instruction: string;
  coordinates: [number, number];
}

export interface NearbyPlace {
  id: number;
  name: string;
  type: string;
  coordinates: [number, number];
}