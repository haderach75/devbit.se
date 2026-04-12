import { Document, Page, Text, View, Link, Image, StyleSheet, Font } from "@react-pdf/renderer";
import type { CareerEvent } from "@/lib/types";

Font.register({
  family: "Inter",
  fonts: [
    { src: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYMZg.ttf", fontWeight: 600 },
    { src: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZg.ttf", fontWeight: 700 },
  ],
});

const c = {
  bg: "#f0eae2",
  surface: "#faf7f3",
  border: "#ddd5cb",
  crimson: "#a31f2e",
  amber: "#c4956a",
  primary: "#3d3530",
  body: "#4a423b",
  muted: "#8a7e72",
  dim: "#a89e92",
};

const s = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    backgroundColor: c.surface,
    paddingVertical: 32,
    paddingHorizontal: 36,
    fontSize: 9,
    color: c.body,
    lineHeight: 1.5,
  },
  // Header
  header: {
    flexDirection: "row",
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: c.border,
    gap: 14,
  },
  photo: {
    width: 70,
    height: 70,
    borderRadius: 6,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 700,
    color: c.primary,
    marginBottom: 4,
    lineHeight: 1.2,
  },
  title: {
    fontSize: 11,
    color: c.muted,
    marginBottom: 6,
    lineHeight: 1.2,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    fontSize: 8.5,
    color: c.muted,
    marginBottom: 2,
  },
  link: {
    color: c.crimson,
    textDecoration: "none",
  },
  sep: {
    color: c.dim,
    marginHorizontal: 4,
  },
  // Sections
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 8.5,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    color: c.amber,
    marginBottom: 6,
    paddingBottom: 3,
    borderBottomWidth: 0.75,
    borderBottomColor: c.border,
  },
  // Skills
  pills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 3,
  },
  pill: {
    backgroundColor: c.bg,
    borderWidth: 0.5,
    borderColor: c.border,
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    fontSize: 7.5,
    color: c.body,
  },
  // Experience
  entry: {
    marginBottom: 8,
  },
  entryHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 1,
  },
  entryTitles: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
    marginRight: 6,
    alignItems: "baseline",
  },
  role: {
    fontWeight: 600,
    color: c.primary,
    fontSize: 9.5,
  },
  at: {
    color: c.muted,
    fontSize: 9.5,
    marginHorizontal: 3,
  },
  company: {
    color: c.crimson,
    fontWeight: 600,
    fontSize: 9.5,
  },
  dates: {
    color: c.dim,
    fontSize: 7.5,
    flexShrink: 0,
    marginTop: 1,
  },
  bullets: {
    marginTop: 2,
    paddingLeft: 6,
  },
  bullet: {
    color: c.muted,
    fontSize: 8.5,
    marginBottom: 1.5,
    lineHeight: 1.4,
  },
  // Languages
  langText: {
    fontSize: 9,
    color: c.body,
  },
  // Assignments
  assignmentEntry: {
    marginBottom: 6,
  },
  assignmentHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 1,
  },
  assignmentClient: {
    fontWeight: 600,
    color: c.crimson,
    fontSize: 9.5,
  },
  assignmentScope: {
    color: c.muted,
    fontSize: 8.5,
    lineHeight: 1.4,
    paddingLeft: 6,
  },
});

interface CvDocumentProps {
  data: {
    name: string;
    title: string;
    photo: string;
    contact: { email: string; phone: string; location: string };
    linkedin: string;
    skills: string[];
    languages: { name: string; level: string }[];
    experience: (CareerEvent & { type: "RoleStarted" })[];
    education: (CareerEvent & { type: "EducationCompleted" })[];
    assignments: CareerEvent[];
  };
  omitContact?: boolean;
}

function fmtDates(start: string, end?: string): string {
  const from = start.replace("-", "/");
  const to = end === "present" ? "Present" : end ? end.replace("-", "/") : "";
  return to ? `${from} — ${to}` : from;
}

export function CvDocument({ data, omitContact = false }: CvDocumentProps) {
  return (
    <Document title={`${data.name} — CV`} author={data.name}>
      <Page size="A4" style={s.page}>

        {/* Header */}
        <View style={s.header}>
          <Image style={s.photo} src={data.photo} />
          <View style={s.headerText}>
            <Text style={s.name}>{data.name}</Text>
            <Text style={s.title}>{data.title}</Text>
            {!omitContact ? (
              <View style={s.contactRow}>
                <Link src={`mailto:${data.contact.email}`} style={s.link}>
                  <Text>{data.contact.email}</Text>
                </Link>
                <Text style={s.sep}>·</Text>
                <Text>{data.contact.phone}</Text>
                <Text style={s.sep}>·</Text>
                <Text>{data.contact.location}</Text>
                <Text style={s.sep}>·</Text>
                <Link src={data.linkedin} style={s.link}>
                  <Text>LinkedIn Profile</Text>
                </Link>
              </View>
            ) : (
              <View style={s.contactRow}>
                <Text>{data.contact.location}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Expertise */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Expertise</Text>
          <View style={s.pills}>
            {data.skills.map((skill) => (
              <View key={skill} style={s.pill}>
                <Text>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Experience */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Experience</Text>
          {data.experience.map((evt) => (
            <View key={evt.id} style={s.entry} wrap={false}>
              <View style={s.entryHead}>
                <View style={s.entryTitles}>
                  <Text style={s.role}>{evt.payload.role}</Text>
                  <Text style={s.at}>at</Text>
                  <Text style={s.company}>{evt.source}</Text>
                </View>
                <Text style={s.dates}>{fmtDates(evt.timestamp, evt.endTimestamp)}</Text>
              </View>
              {evt.children && evt.children.length > 0 && (
                <View style={s.bullets}>
                  {evt.children.map((child) => (
                    <Text key={child.id} style={s.bullet}>
                      • {child.payload.scope}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Assignments */}
        {data.assignments.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Consulting Assignments</Text>
            {data.assignments.map((a) => (
              <View key={a.id} style={s.assignmentEntry} wrap={false}>
                <View style={s.assignmentHead}>
                  <Text style={s.assignmentClient}>{a.source}</Text>
                  <Text style={s.dates}>{fmtDates(a.timestamp, a.endTimestamp)}</Text>
                </View>
                {a.payload.scope && (
                  <Text style={s.assignmentScope}>{a.payload.scope}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Education</Text>
          {data.education.map((evt) => (
            <View key={evt.id} style={s.entry}>
              <View style={s.entryHead}>
                <View style={s.entryTitles}>
                  <Text style={s.role}>{evt.payload.degree}</Text>
                  <Text style={s.at}>at</Text>
                  <Text style={s.company}>{evt.source}</Text>
                </View>
                <Text style={s.dates}>{fmtDates(evt.timestamp, evt.endTimestamp)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Languages */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Languages</Text>
          <Text style={s.langText}>
            {data.languages.map((l) => `${l.name} (${l.level})`).join(", ")}
          </Text>
        </View>

      </Page>
    </Document>
  );
}
