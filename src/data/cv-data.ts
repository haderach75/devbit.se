import { careerEvents } from "@/data/career-events";
import { contactInfo } from "@/data/site-config";
import { skills } from "@/data/skills";
import { languages } from "@/data/languages";

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

function buildTimeline(): TimelineEntry[] {
  const entries: TimelineEntry[] = [];

  for (const evt of careerEvents) {
    if (evt.type !== "RoleStarted") continue;

    if (consultingRoleIds.includes(evt.id)) {
      // Flatten consulting children into top-level entries
      for (const child of evt.children ?? []) {
        entries.push({
          id: child.id,
          company: child.source,
          role: evt.payload.role ?? "Consultant",
          startDate: child.timestamp,
          endDate: child.endTimestamp,
          type: "consulting",
          via: evt.source,
          description: child.payload.scope,
        });
      }
    } else {
      // Employment: keep as single entry with highlights from children
      entries.push({
        id: evt.id,
        company: evt.source,
        role: evt.payload.role ?? "",
        startDate: evt.timestamp,
        endDate: evt.endTimestamp,
        type: "employment",
        highlights: (evt.children ?? []).map((c) => c.payload.scope ?? ""),
      });
    }
  }

  return entries.sort((a, b) => b.startDate.localeCompare(a.startDate));
}

export const cvData = {
  name: "Michael Hultman",
  title: "Senior System Architect / Developer",
  photo: "https://devbit.se/michael.jpg",
  contact: contactInfo,
  linkedin: "https://www.linkedin.com/in/michael-hultman-28545741/",
  skills,
  languages,
  timeline: buildTimeline(),
  education: careerEvents.filter(
    (e) => e.type === "EducationCompleted"
  ),
};
