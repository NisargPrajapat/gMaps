/*
  # Create routes table for storing navigation history

  1. New Tables
    - `routes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `locations` (jsonb array of locations)
      - `distance` (float, in meters)
      - `duration` (float, in seconds)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `routes` table
    - Add policies for authenticated users to:
      - Read their own routes
      - Create new routes
*/

CREATE TABLE routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  locations jsonb NOT NULL,
  distance float NOT NULL,
  duration float NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE routes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own routes"
  ON routes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create routes"
  ON routes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);