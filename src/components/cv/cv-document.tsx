import { Document, Page, Text, View, Link, Image, StyleSheet, Font } from "@react-pdf/renderer";
import type { CvData } from "@/data/cv-data";

Font.register({
  family: "Inter",
  fonts: [
    { src: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYMZg.ttf", fontWeight: 600 },
    { src: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZg.ttf", fontWeight: 700 },
  ],
});

export interface CvLabels {
  experience: string;
  education: string;
  skills: string;
  databases: string;
  messaging: string;
  languages: string;
  employed: string;
  ownCompany: string;
  consultancy: string;
  linkedinProfile: string;
  at: string;
  present: string;
  contact: string;
}

const c = {
  bg: "#f0eae2",
  surface: "#faf7f3",
  border: "#ddd5cb",
  crimson: "#a31f2e",
  amber: "#c4956a",
  amberSoft: "#ecdac6",
  primary: "#3d3530",
  body: "#4a423b",
  muted: "#8a7e72",
  dim: "#a89e92",
};

const SIDEBAR_W = 158;

const s = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    backgroundColor: c.surface,
    fontSize: 9,
    color: c.body,
    lineHeight: 1.5,
    flexDirection: "row",
  },
  // Full-height sidebar tint, repeated on every page
  sidebarBg: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_W,
    backgroundColor: c.bg,
    borderRightWidth: 0.75,
    borderRightColor: c.border,
  },
  sidebar: {
    width: SIDEBAR_W,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  main: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  photo: {
    width: 126,
    height: 126,
    borderRadius: 4,
    objectFit: "cover",
    marginBottom: 14,
  },
  // Headings
  sideTitle: {
    fontSize: 7.5,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: c.amber,
    marginBottom: 5,
    paddingBottom: 2.5,
    borderBottomWidth: 0.75,
    borderBottomColor: c.border,
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
  sideBlock: {
    marginBottom: 14,
  },
  section: {
    marginBottom: 9,
  },
  // Contact
  contactLine: {
    fontSize: 7.5,
    color: c.body,
    marginBottom: 2,
  },
  link: {
    color: c.crimson,
    textDecoration: "none",
  },
  availability: {
    fontSize: 7,
    color: c.muted,
    marginTop: 4,
    lineHeight: 1.4,
  },
  // Name block
  name: {
    fontSize: 22,
    fontWeight: 700,
    color: c.primary,
    letterSpacing: -0.3,
    lineHeight: 1.15,
  },
  title: {
    fontSize: 10.5,
    color: c.muted,
    marginTop: 2,
    lineHeight: 1.2,
  },
  rule: {
    width: 30,
    height: 2,
    backgroundColor: c.crimson,
    marginTop: 6,
    marginBottom: 10,
  },
  summary: {
    fontSize: 8.5,
    color: c.body,
    lineHeight: 1.45,
    marginBottom: 10,
  },
  // Skills
  pills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 3,
  },
  pill: {
    backgroundColor: c.surface,
    borderWidth: 0.5,
    borderColor: c.border,
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 1.5,
    fontSize: 7,
    color: c.body,
  },
  groupText: {
    fontSize: 7.5,
    color: c.body,
    lineHeight: 1.45,
  },
  // Experience
  entry: {
    marginBottom: 4,
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
    fontSize: 9,
  },
  at: {
    color: c.muted,
    fontSize: 9,
    marginHorizontal: 3,
  },
  company: {
    color: c.crimson,
    fontWeight: 600,
    fontSize: 9,
  },
  dates: {
    color: c.dim,
    fontSize: 7,
    flexShrink: 0,
    marginTop: 1.5,
  },
  bullets: {
    marginTop: 2,
  },
  bullet: {
    color: c.muted,
    fontSize: 8,
    marginBottom: 1,
    lineHeight: 1.35,
  },
  langText: {
    fontSize: 7.5,
    color: c.body,
    marginBottom: 1.5,
  },
  langLevel: {
    color: c.muted,
  },
  // Vertical timeline
  timeline: {
    paddingLeft: 13,
    borderLeftWidth: 1.5,
    borderLeftColor: c.border,
    marginLeft: 4,
  },
  timelineEntry: {
    marginBottom: 8,
    position: "relative",
  },
  timelineDot: {
    position: "absolute",
    left: -18.25,
    top: 2.5,
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  dotEmployment: {
    backgroundColor: c.crimson,
  },
  dotConsulting: {
    backgroundColor: c.surface,
    borderWidth: 2,
    borderColor: c.amber,
  },
  // Parent role: company on top, role + engagement tag beneath
  roleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 1,
  },
  companyLead: {
    color: c.crimson,
    fontWeight: 700,
    fontSize: 10,
  },
  roleLead: {
    fontSize: 8.5,
    color: c.body,
    flex: 1,
    marginRight: 6,
  },
  tag: {
    backgroundColor: c.bg,
    borderWidth: 0.5,
    borderColor: c.border,
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 0.5,
    flexShrink: 0,
  },
  tagOwn: {
    backgroundColor: c.amberSoft,
    borderColor: c.amber,
  },
  tagText: {
    fontSize: 6.5,
    color: c.muted,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  tagTextOwn: {
    color: c.primary,
  },
  // Client assignments nested under a consulting role
  assignments: {
    marginTop: 3,
    marginLeft: 1,
    paddingLeft: 9,
    borderLeftWidth: 0.75,
    borderLeftColor: c.border,
  },
  assignment: {
    marginBottom: 3.5,
  },
  assignmentHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  client: {
    color: c.crimson,
    fontWeight: 600,
    fontSize: 9,
    flex: 1,
    marginRight: 6,
  },
});

interface CvDocumentProps {
  data: CvData;
  labels: CvLabels;
  omitContact?: boolean;
}

function fmtDates(start: string, end: string | undefined, presentLabel: string): string {
  const from = start.replace("-", "/");
  const to = end === "present" ? presentLabel : end ? end.replace("-", "/") : "";
  return to ? `${from}–${to}` : from;
}

export function CvDocument({ data, labels, omitContact = false }: CvDocumentProps) {
  return (
    <Document title={`${data.name} CV`} author={data.name}>
      <Page size="A4" style={s.page}>
        <View fixed style={s.sidebarBg} />

        {/* Sidebar */}
        <View style={s.sidebar}>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image, not HTML img; no alt prop */}
          <Image style={s.photo} src={data.photo} />

          <View style={s.sideBlock}>
            <Text style={s.sideTitle}>{labels.contact}</Text>
            {!omitContact && (
              <>
                <Link src={`mailto:${data.contact.email}`} style={[s.contactLine, s.link]}>
                  <Text>{data.contact.email}</Text>
                </Link>
                <Text style={s.contactLine}>{data.contact.phone}</Text>
              </>
            )}
            <Text style={s.contactLine}>{data.contact.location}</Text>
            {!omitContact && (
              <Link src={data.linkedin} style={[s.contactLine, s.link]}>
                <Text>{labels.linkedinProfile}</Text>
              </Link>
            )}
            <Text style={s.availability}>{data.contact.availability}</Text>
          </View>

          <View style={s.sideBlock}>
            <Text style={s.sideTitle}>{labels.skills}</Text>
            <View style={s.pills}>
              {data.skills.map((skill) => (
                <View key={skill} style={s.pill}>
                  <Text>{skill}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={s.sideBlock}>
            <Text style={s.sideTitle}>{labels.databases}</Text>
            <Text style={s.groupText}>{data.databases.join(", ")}</Text>
          </View>

          <View style={s.sideBlock}>
            <Text style={s.sideTitle}>{labels.messaging}</Text>
            <Text style={s.groupText}>{data.messaging.join(", ")}</Text>
          </View>

          <View style={s.sideBlock}>
            <Text style={s.sideTitle}>{labels.languages}</Text>
            {data.languages.map((l) => (
              <Text key={l.name} style={s.langText}>
                {l.name} <Text style={s.langLevel}>· {l.level}</Text>
              </Text>
            ))}
          </View>
        </View>

        {/* Main column */}
        <View style={s.main}>
          <Text style={s.name}>{data.name}</Text>
          <Text style={s.title}>{data.title}</Text>
          <View style={s.rule} />

          <Text style={s.summary}>{data.summary}</Text>

          {/* Experience */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>{labels.experience}</Text>
            <View style={s.timeline}>
              {data.timeline.map((entry) => {
                const own = entry.ownCompany === true;
                const tagText =
                  entry.type === "employment"
                    ? labels.employed
                    : own
                      ? labels.ownCompany
                      : labels.consultancy;

                return (
                  <View key={entry.id} style={s.timelineEntry}>
                    <View
                      style={[
                        s.timelineDot,
                        entry.type === "employment" ? s.dotEmployment : s.dotConsulting,
                      ]}
                    />
                    <View style={s.entryHead} wrap={false}>
                      <Text style={s.companyLead}>{entry.company}</Text>
                      <Text style={s.dates}>
                        {fmtDates(entry.startDate, entry.endDate, labels.present)}
                      </Text>
                    </View>
                    <View style={s.roleRow} wrap={false}>
                      <Text style={s.roleLead}>{entry.role}</Text>
                      <View style={own ? [s.tag, s.tagOwn] : s.tag}>
                        <Text style={own ? [s.tagText, s.tagTextOwn] : s.tagText}>{tagText}</Text>
                      </View>
                    </View>

                    {entry.assignments && entry.assignments.length > 0 && (
                      <View style={s.assignments}>
                        {entry.assignments.map((a) => (
                          <View key={a.id} style={s.assignment} wrap={false}>
                            <View style={s.assignmentHead}>
                              <Text style={s.client}>{a.client}</Text>
                              <Text style={s.dates}>
                                {fmtDates(a.startDate, a.endDate, labels.present)}
                              </Text>
                            </View>
                            {a.description && <Text style={s.bullet}>{a.description}</Text>}
                          </View>
                        ))}
                      </View>
                    )}

                    {entry.highlights && entry.highlights.length > 0 && (
                      <View style={[s.assignments, s.bullets]}>
                        {entry.highlights.map((h, i) => (
                          <Text key={i} style={s.bullet}>
                            • {h}
                          </Text>
                        ))}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>

          {/* Education */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>{labels.education}</Text>
            {data.education.map((evt) => (
              <View key={evt.id} style={s.entry}>
                <View style={s.entryHead}>
                  <View style={s.entryTitles}>
                    <Text style={s.role}>{evt.degree}</Text>
                    <Text style={s.at}>{labels.at}</Text>
                    <Text style={s.company}>{evt.source}</Text>
                  </View>
                  <Text style={s.dates}>
                    {fmtDates(evt.timestamp, evt.endTimestamp, labels.present)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
}
