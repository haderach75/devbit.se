import { careerEvents } from "@/data/career-events";
import { contactInfo } from "@/data/site-config";
import { skills } from "@/data/skills";
import { languages } from "@/data/languages";
import { loc, type Locale } from "@/lib/i18n";
import type { CareerEvent } from "@/lib/types";

const consultingRoleIds = ["devbit-freelance", "evolve-afry"];

export interface TimelineEntry {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  type: "employment" | "consulting";
  via?: string;
  description?: string;
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
    const roleText = evt.payload.role ? loc(evt.payload.role, locale) : roleLabelFallback;

    if (consultingRoleIds.includes(evt.id)) {
      for (const child of evt.children ?? []) {
        entries.push({
          id: child.id,
          company: child.source,
          role: roleText,
          startDate: child.timestamp,
          endDate: child.endTimestamp,
          type: "consulting",
          via: evt.source,
          description: child.payload.scope ? loc(child.payload.scope, locale) : undefined,
        });
      }
    } else {
      entries.push({
        id: evt.id,
        company: evt.source,
        role: roleText,
        startDate: evt.timestamp,
        endDate: evt.endTimestamp,
        type: "employment",
        highlights: (evt.children ?? [])
          .map((c: CareerEvent) => (c.payload.scope ? loc(c.payload.scope, locale) : ""))
          .filter(Boolean),
      });
    }
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
  const roleFallback = { en: "Consultant", sv: "Konsult" };

  return {
    name: "Michael Hultman",
    title: titles[locale],
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
