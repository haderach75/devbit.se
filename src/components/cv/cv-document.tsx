import { Document, Page, Text, View, Link, StyleSheet, Font } from "@react-pdf/renderer";
import type { CareerEvent } from "@/lib/types";

Font.register({
  family: "Inter",
  fonts: [
    { src: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYMZg.ttf", fontWeight: 600 },
    { src: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZg.ttf", fontWeight: 700 },
  ],
});

const colors = {
  bg: "#f0eae2",
  surface: "#faf7f3",
  border: "#ddd5cb",
  crimson: "#a31f2e",
  amber: "#c4956a",
  textPrimary: "#3d3530",
  textBody: "#4a423b",
  textMuted: "#8a7e72",
  textDim: "#a89e92",
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    backgroundColor: colors.surface,
    padding: 40,
    fontSize: 10,
    color: colors.textBody,
    lineHeight: 1.4,
  },
  header: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  name: {
    fontSize: 24,
    fontWeight: 700,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    fontSize: 9,
    color: colors.textMuted,
  },
  contactLink: {
    color: colors.crimson,
    textDecoration: "none",
  },
  contactSep: {
    color: colors.textDim,
  },
  sectionHeading: {
    fontSize: 9,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    color: colors.amber,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  section: {
    marginBottom: 16,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  skillPill: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 8,
    color: colors.textBody,
  },
  experienceEntry: {
    marginBottom: 10,
    breakInside: "avoid",
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  entryTitleGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 3,
    flex: 1,
    marginRight: 8,
  },
  entryRole: {
    fontWeight: 600,
    color: colors.textPrimary,
    fontSize: 10,
  },
  entryAt: {
    color: colors.textMuted,
    fontSize: 10,
  },
  entryCompany: {
    color: colors.crimson,
    fontWeight: 600,
    fontSize: 10,
  },
  entryDates: {
    color: colors.textDim,
    fontSize: 8,
    flexShrink: 0,
  },
  projectList: {
    marginTop: 4,
    paddingLeft: 8,
  },
  projectBullet: {
    color: colors.textMuted,
    fontSize: 9,
    marginBottom: 2,
  },
  languagesText: {
    fontSize: 10,
    color: colors.textBody,
  },
  linkedinRow: {
    marginTop: 4,
  },
  linkedinLink: {
    color: colors.crimson,
    fontSize: 9,
    textDecoration: "none",
  },
});

interface CvDocumentProps {
  data: {
    name: string;
    title: string;
    contact: {
      email: string;
      phone: string;
      location: string;
    };
    linkedin: string;
    skills: string[];
    languages: { name: string; level: string }[];
    experience: (CareerEvent & { type: "RoleStarted" })[];
    education: (CareerEvent & { type: "EducationCompleted" })[];
  };
}

function formatDateRange(timestamp: string, endTimestamp?: string): string {
  const start = timestamp.replace("-", "/");
  const end = endTimestamp === "present" ? "Present" : endTimestamp ? endTimestamp.replace("-", "/") : "";
  return end ? `${start} — ${end}` : start;
}

export function CvDocument({ data }: CvDocumentProps) {
  return (
    <Document title={`${data.name} — CV`} author={data.name}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.name}</Text>
          <Text style={styles.jobTitle}>{data.title}</Text>
          <View style={styles.contactRow}>
            <Link src={`mailto:${data.contact.email}`} style={styles.contactLink}>
              <Text>{data.contact.email}</Text>
            </Link>
            <Text style={styles.contactSep}> · </Text>
            <Text>{data.contact.phone}</Text>
            <Text style={styles.contactSep}> · </Text>
            <Text>{data.contact.location}</Text>
          </View>
          <View style={styles.linkedinRow}>
            <Link src={data.linkedin} style={styles.linkedinLink}>
              <Text>{data.linkedin}</Text>
            </Link>
          </View>
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Expertise</Text>
          <View style={styles.skillsContainer}>
            {data.skills.map((skill) => (
              <View key={skill} style={styles.skillPill}>
                <Text>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Experience */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Experience</Text>
          {data.experience.map((event) => (
            <View key={event.id} style={styles.experienceEntry}>
              <View style={styles.entryHeader}>
                <View style={styles.entryTitleGroup}>
                  <Text style={styles.entryRole}>{event.payload.role}</Text>
                  <Text style={styles.entryAt}> at </Text>
                  <Text style={styles.entryCompany}>{event.source}</Text>
                </View>
                <Text style={styles.entryDates}>
                  {formatDateRange(event.timestamp, event.endTimestamp)}
                </Text>
              </View>
              {event.children && event.children.length > 0 && (
                <View style={styles.projectList}>
                  {event.children.map((child) => (
                    <Text key={child.id} style={styles.projectBullet}>
                      {"• "}{child.payload.scope}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Education */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Education</Text>
          {data.education.map((event) => (
            <View key={event.id} style={styles.experienceEntry}>
              <View style={styles.entryHeader}>
                <View style={styles.entryTitleGroup}>
                  <Text style={styles.entryRole}>{event.payload.degree}</Text>
                  <Text style={styles.entryAt}> at </Text>
                  <Text style={styles.entryCompany}>{event.source}</Text>
                </View>
                <Text style={styles.entryDates}>
                  {formatDateRange(event.timestamp, event.endTimestamp)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Languages */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Languages</Text>
          <Text style={styles.languagesText}>
            {data.languages.map((l, i) => `${l.name} (${l.level})${i < data.languages.length - 1 ? ", " : ""}`).join("")}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
