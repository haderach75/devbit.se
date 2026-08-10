import { careerEvents } from "@/data/career-events";
import { contactInfo } from "@/data/site-config";
import { skills } from "@/data/skills";
import { languages } from "@/data/languages";
import { loc, type Locale } from "@/lib/i18n";
import type { CareerEvent } from "@/lib/types";

const consultingRoleIds = ["devbit-freelance", "evolve-afry"];
/** Freelance through my own AB, as opposed to being employed by a consultancy. */
const ownCompanyRoleIds = ["devbit-freelance"];

export interface TimelineAssignment {
  id: string;
  client: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface TimelineEntry {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  type: "employment" | "consulting";
  ownCompany?: boolean;
  /** Client assignments, for consulting roles. */
  assignments?: TimelineAssignment[];
  /** Deliverables, for employments. */
  highlights?: string[];
}

export interface CvLanguage {
  name: string;
  level: string;
}

export interface CvEducation {
  id: string;
  source: string;
  timestamp: string;
  endTimestamp?: string;
  degree: string;
}

export interface CvContact {
  email: string;
  phone: string;
  location: string;
  availability: string;
}

export interface CvData {
  name: string;
  title: string;
  summary: string;
  photo: string;
  contact: CvContact;
  linkedin: string;
  skills: string[];
  languages: CvLanguage[];
  timeline: TimelineEntry[];
  education: CvEducation[];
}

function buildTimeline(locale: Locale, roleLabelFallback: string): TimelineEntry[] {
  const entries: TimelineEntry[] = [];

  for (const evt of careerEvents) {
    if (evt.type !== "RoleStarted") continue;
    const children = evt.children ?? [];
    const isConsulting = consultingRoleIds.includes(evt.id);

    entries.push({
      id: evt.id,
      company: evt.source,
      role: evt.payload.role ? loc(evt.payload.role, locale) : roleLabelFallback,
      startDate: evt.timestamp,
      endDate: evt.endTimestamp,
      type: isConsulting ? "consulting" : "employment",
      ownCompany: ownCompanyRoleIds.includes(evt.id) || undefined,
      assignments: isConsulting
        ? children
            .map((child: CareerEvent) => ({
              id: child.id,
              client: child.source,
              startDate: child.timestamp,
              endDate: child.endTimestamp,
              description: child.payload.scope ? loc(child.payload.scope, locale) : undefined,
            }))
            .sort((a, b) => b.startDate.localeCompare(a.startDate))
        : undefined,
      highlights: isConsulting
        ? undefined
        : children
            .map((c: CareerEvent) => (c.payload.scope ? loc(c.payload.scope, locale) : ""))
            .filter(Boolean),
    });
  }

  return entries.sort((a, b) => b.startDate.localeCompare(a.startDate));
}

function buildEducation(locale: Locale): CvEducation[] {
  return careerEvents
    .filter((e) => e.type === "EducationCompleted")
    .map((e) => ({
      id: e.id,
      source: e.source,
      timestamp: e.timestamp,
      endTimestamp: e.endTimestamp,
      degree: e.payload.degree ? loc(e.payload.degree, locale) : "",
    }));
}

export function buildCvData(locale: Locale): CvData {
  const titles = {
    en: "Senior System Architect / Developer",
    sv: "Senior systemarkitekt / utvecklare",
  };
  const summaries = {
    en: "Senior system architect and developer with 20+ years in the industry. Hands-on in both Go and C#/.NET, specialized in distributed systems, DDD, CQRS and Event Sourcing on Kubernetes, AWS and Azure. Works extensively with AI-assisted development — context engineering and building AI into the everyday development process, from design to code review.",
    sv: "Senior systemarkitekt och utvecklare med 20+ år i branschen. Hands-on i både Go och C#/.NET, specialiserad på distribuerade system, DDD, CQRS och Event Sourcing på Kubernetes, AWS och Azure. Arbetar omfattande med AI-assisterad utveckling — context engineering och att bygga in AI i det dagliga utvecklingsflödet, från design till kodgranskning.",
  };
  const roleFallback = { en: "Consultant", sv: "Konsult" };

  return {
    name: "Michael Hultman",
    title: titles[locale],
    summary: summaries[locale],
    photo: "https://devbit.se/michael.jpg",
    contact: {
      email: contactInfo.email,
      phone: contactInfo.phone,
      location: loc(contactInfo.location, locale),
      availability: loc(contactInfo.availability, locale),
    },
    linkedin: "https://www.linkedin.com/in/michael-hultman-28545741/",
    skills,
    languages: languages.map((l) => ({
      name: loc(l.name, locale),
      level: loc(l.level, locale),
    })),
    timeline: buildTimeline(locale, roleFallback[locale]),
    education: buildEducation(locale),
  };
}
