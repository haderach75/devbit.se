export type EventType =
  | "EducationCompleted"
  | "RoleStarted"
  | "SkillAcquired"
  | "ProjectDelivered"
  | "ProjectInProgress"
  | "CompanyFounded";

export interface CareerEvent {
  id: string;
  type: EventType;
  timestamp: string;
  endTimestamp?: string;
  source: string;
  payload: {
    role?: string;
    domain?: string;
    tech?: string[];
    degree?: string;
    scope?: string;
    skills?: string[];
    status?: string;
  };
  children?: CareerEvent[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Project {
  id: string;
  title: string;
  client: string;
  domain: string;
  challenge: string;
  approach: string;
  result: string;
  tech: string[];
}

export interface SiteLink {
  label: string;
  href: string;
  description: string;
  icon: string;
}
