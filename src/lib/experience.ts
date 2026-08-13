import { careerEvents } from "@/data/career-events";

const firstRoleYear = Math.min(
  ...careerEvents.filter((e) => e.type === "RoleStarted").map((e) => Number(e.timestamp.slice(0, 4)))
);

/** Single source for every "N+ years" claim on the site — never type the number by hand. */
export function experienceYears(): number {
  return new Date().getFullYear() - firstRoleYear;
}
