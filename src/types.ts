export type Gender = 'male' | 'female';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  height: number; // in cm
  currentWeight?: number; // in kg
  weightGoal?: number;
}

export interface BodyMeasurement {
  id: string;
  userId: string;
  date: string;
  createdAt?: number;
  weight: number;
  neck: number;
  waist: number;
  hip?: number; // Only for female
  arm?: number;
  chest?: number;
  thigh?: number;
  calf?: number;
  bodyFat?: number;
  leanMass?: number;
  fatMass?: number;
  bmi?: number;
}

export type Page = 'dashboard' | 'history' | 'new-measure' | 'charts' | 'profile';
