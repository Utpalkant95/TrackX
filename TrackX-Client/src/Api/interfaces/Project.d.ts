import { IUserProfile } from "./Response";

export interface IProfileAvatarFrag {
  data: IUserProfile | undefined;
  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<IUserProfile, Error>>;
}

export interface INavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface IMobileMenuProps {
  navItems: INavItem[];
}

export interface IProfileSectionWrapperAtom {
  children: React.ReactNode;
  title: string;
  className ?: string;
}


interface Set {
  weight: number
  reps: number
  difficulty: "Easy" | "Medium" | "Hard"
}

export interface Exercise {
  name: string;
  bodyPart : string;
  equipment : string;
  sets: Set[]
}

interface Workout {
  exercises: Exercise[]
}

export interface ITemplate {
  name: string
  exercises: Exercise[]
}

export interface IUserSetting {
  workoutReminder: {
    workoutReminder: boolean | undefined;
    reminderTime: string | undefined;
  };
  progessAiAlerts: {
    plateauAlerts: boolean | undefined;
    goalTrackingAlerts: boolean | undefined;
  };
  emailNotifications: {
    receiveWeeklyProgressReports: boolean | undefined;
    receiveSpecialTrainingTipsUpdates: boolean | undefined;
  };
}