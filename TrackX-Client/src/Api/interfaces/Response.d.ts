export interface IRES {
  message: string;
  success: boolean;
  data?: any;
}

export interface IUserProfile {
  success: boolean;
  message: string;
  data?: {
    _id: string;
    name: string;
    email: string;
    avatar: {
      public_id: string;
      secure_url: string;
    };
    preferences : string;
    createdAt: string;
  };
}


interface ExerciseSet {
  weight: number;
  reps: number;
  difficulty: "Easy" | "Hard"; // You can add more difficulty levels if needed
  _id: string;
}

interface Exercise {
  bodyPart: string;
  equipment: string;
  name: string;
  sets: ExerciseSet[];
  _id: string;
}

export interface IWorkoutData {
  _id: string;
  userId: string;
  date: string; // ISO date string
  exercises: Exercise[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}

export interface IWorkoutResponse {
  data: IWorkoutData[];
}


export interface IWorkoutStats {
  title : string;
  value : string;
}

export interface ITemplateData {
  _id: string;
  userId : string;
  name: string;
  exercises: Exercise[];
  __v : number;
}

export interface IPersonalBests {
  title : string;
  value : string;
}

interface IAIInsight {
  type: "plateauDetected" | "workoutSuggestion" | "recoveryAlert" | "info"; 
  message: string;
  exercise?: string;
}

interface IWeeklyProgress {
  success: boolean;
  data: {
    weightProgress: string;
    repsProgress: string;
  };
}
interface IExercise {
  _id : string;
  id : string;
  name : string;
  gifUrl : string;
}

export interface IProgressGraph {
  date : string;
  reps : number;
  weight : number
}

export interface IFitnessStats {
  title : string;
  value : string;
}

export interface IWorkoutPerformance {
  title : string;
  value : string;
  valueTitle : string;
}