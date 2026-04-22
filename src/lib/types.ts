import type { LocalizedString } from "./i18n";

export type EventType =
  | "EducationCompleted"
  | "RoleStarted"
  | "SkillAcquired"
  | "ProjectDelivered"
  | "ProjectInProgress"
  | "CompanyFounded";

export interface CareerEventPayload {
  role?: LocalizedString;
  domain?: LocalizedString;
  tech?: string[];
  degree?: LocalizedString;
  scope?: LocalizedString;
  skills?: string[];
  status?: string;
}

export interface CareerEvent {
  id: string;
  type: EventType;
  timestamp: string;
  endTimestamp?: string;
  source: string;
  payload: CareerEventPayload;
  children?: CareerEvent[];
}

export interface Service {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  icon: string;
}

export interface Project {
  id: string;
  title: LocalizedString;
  client: string;
  domain: LocalizedString;
  challenge: LocalizedString;
  approach: LocalizedString;
  result: LocalizedString;
  tech: string[];
}

export interface SiteLink {
  label: LocalizedString;
  href: string;
  description: LocalizedString;
  icon: string;
}
