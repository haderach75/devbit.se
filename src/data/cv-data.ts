import { careerEvents } from "@/data/career-events";
import { contactInfo } from "@/data/site-config";
import { skills } from "@/data/skills";
import { languages } from "@/data/languages";
import type { CareerEvent } from "@/lib/types";

const consultingRoleIds = ["devbit-freelance", "evolve-afry"];

export const cvData = {
  name: "Michael Hultman",
  title: "Senior System Architect / Developer",
  photo: "https://devbit.se/michael.jpg",
  contact: contactInfo,
  linkedin: "https://www.linkedin.com/in/michael-hultman-28545741/",
  skills,
  languages,
  experience: careerEvents.filter(
    (e): e is CareerEvent & { type: "RoleStarted" } => e.type === "RoleStarted"
  ),
  education: careerEvents.filter(
    (e): e is CareerEvent & { type: "EducationCompleted" } => e.type === "EducationCompleted"
  ),
  assignments: careerEvents
    .filter((e) => consultingRoleIds.includes(e.id))
    .flatMap((e) => e.children ?? [])
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp)),
};
