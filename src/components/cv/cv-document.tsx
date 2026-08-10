import { Document, Page, Text, View, Link, Image, StyleSheet, Font } from "@react-pdf/renderer";
import type { CvData, TimelineEntry } from "@/data/cv-data";

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
  languages: string;
  employed: string;
  consulting: string;
  linkedinProfile: string;
  at: string;
  consultingVia: (company: string) => string;
  present: string;
  contact: string;
  atAGlance: string;
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
const GLANCE_LABEL_W = 96;

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
  // Career-at-a-glance strip
  glanceAxis: {
    flexDirection: "row",
    marginBottom: 2,
  },
  glanceTrackArea: {
    flex: 1,
    position: "relative",
  },
  glanceAxisRow: {
    height: 8,
    position: "relative",
  },
  glanceYear: {
    position: "absolute",
    top: 0,
    fontSize: 5.5,
    color: c.dim,
  },
  glanceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2.5,
  },
  glanceLabel: {
    width: GLANCE_LABEL_W,
    fontSize: 6.5,
    color: c.body,
    paddingRight: 6,
    maxLines: 1,
    textOverflow: "ellipsis",
  },
  glanceTrack: {
    flex: 1,
    height: 7,
    position: "relative",
    backgroundColor: c.bg,
    borderRadius: 3.5,
  },
  glanceGrid: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 0.5,
    backgroundColor: c.border,
  },
  glanceBar: {
    position: "absolute",
    top: 0,
    height: 7,
    borderRadius: 3.5,
  },
  glanceBarEmployment: {
    backgroundColor: c.crimson,
  },
  glanceBarConsulting: {
    backgroundColor: c.amberSoft,
    borderWidth: 0.75,
    borderColor: c.amber,
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
    marginBottom: 5,
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
  viaTag: {
    backgroundColor: c.bg,
    borderWidth: 0.5,
    borderColor: c.border,
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 0.5,
    marginLeft: 5,
  },
  viaTagText: {
    fontSize: 6.5,
    color: c.muted,
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 5,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  legendDotEmployment: {
    backgroundColor: c.crimson,
  },
  legendDotConsulting: {
    backgroundColor: c.surface,
    borderWidth: 1.5,
    borderColor: c.amber,
  },
  legendText: {
    fontSize: 6.5,
    color: c.dim,
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
  return to ? `${from} — ${to}` : from;
}

/** "2021-03" | "2021" -> absolute month index, for positioning bars on the year axis. */
function toMonths(value: string): number {
  const [y, m] = value.split("-");
  return Number(y) * 12 + (m ? Number(m) - 1 : 0);
}

interface GlanceSpan {
  start: number;
  end: number;
  type: TimelineEntry["type"];
}

interface GlanceRow {
  company: string;
  spans: GlanceSpan[];
}

/** One row per company (most recent first), with a bar per assignment/role. */
function buildGlance(timeline: TimelineEntry[]) {
  const now = new Date();
  const nowMonths = now.getFullYear() * 12 + now.getMonth();
  const rows = new Map<string, GlanceRow>();
  let min = Infinity;
  let max = -Infinity;

  for (const entry of timeline) {
    const start = toMonths(entry.startDate);
    const end =
      !entry.endDate || entry.endDate === "present" ? nowMonths : toMonths(entry.endDate);
    if (start < min) min = start;
    if (end > max) max = end;
    const row = rows.get(entry.company) ?? { company: entry.company, spans: [] };
    row.spans.push({ start, end, type: entry.type });
    rows.set(entry.company, row);
  }

  if (min === Infinity) return { rows: [], ticks: [], min: 0, span: 1 };

  // Snap the axis to whole years so gridlines land on the labels.
  const firstYear = Math.floor(min / 12);
  const lastYear = Math.floor(max / 12) + 1;
  const axisMin = firstYear * 12;
  const span = lastYear * 12 - axisMin;

  const step = Math.max(1, Math.ceil((lastYear - firstYear) / 6));
  const ticks: { year: number; pct: number }[] = [];
  for (let y = firstYear; y <= lastYear; y += step) {
    const pct = ((y * 12 - axisMin) / span) * 100;
    if (pct > 90) break; // last label would collide with the right edge
    ticks.push({ year: y, pct });
  }

  return { rows: [...rows.values()], ticks, min: axisMin, span };
}

export function CvDocument({ data, labels, omitContact = false }: CvDocumentProps) {
  const glance = buildGlance(data.timeline);

  return (
    <Document title={`${data.name} — CV`} author={data.name}>
      <Page size="A4" style={s.page}>
        <View fixed style={s.sidebarBg} />

        {/* Sidebar */}
        <View style={s.sidebar}>
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

          {/* Career at a glance */}
          {glance.rows.length > 0 && (
            <View style={s.section}>
              <Text style={s.sectionTitle}>{labels.atAGlance}</Text>
              <View style={s.glanceAxis}>
                <View style={{ width: GLANCE_LABEL_W }} />
                <View style={s.glanceTrackArea}>
                  <View style={s.glanceAxisRow}>
                    {glance.ticks.map((t) => (
                      <Text
                        key={t.year}
                        style={[s.glanceYear, { left: `${Math.min(t.pct, 93)}%` }]}
                      >
                        {t.year}
                      </Text>
                    ))}
                  </View>
                </View>
              </View>
              {glance.rows.map((row) => (
                <View key={row.company} style={s.glanceRow}>
                  <Text style={s.glanceLabel}>{row.company}</Text>
                  <View style={s.glanceTrack}>
                    {glance.ticks.map((t) => (
                      <View key={t.year} style={[s.glanceGrid, { left: `${t.pct}%` }]} />
                    ))}
                    {row.spans.map((sp, i) => (
                      <View
                        key={i}
                        style={[
                          s.glanceBar,
                          sp.type === "employment"
                            ? s.glanceBarEmployment
                            : s.glanceBarConsulting,
                          {
                            left: `${((sp.start - glance.min) / glance.span) * 100}%`,
                            width: `${Math.max((sp.end - sp.start) / glance.span, 0.012) * 100}%`,
                          },
                        ]}
                      />
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Experience */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>{labels.experience}</Text>
            <View style={s.legend}>
              <View style={s.legendItem}>
                <View style={[s.legendDot, s.legendDotEmployment]} />
                <Text style={s.legendText}>{labels.employed}</Text>
              </View>
              <View style={s.legendItem}>
                <View style={[s.legendDot, s.legendDotConsulting]} />
                <Text style={s.legendText}>{labels.consulting}</Text>
              </View>
            </View>
            <View style={s.timeline}>
              {data.timeline.map((entry) => (
                <View key={entry.id} style={s.timelineEntry} wrap={false}>
                  <View
                    style={[
                      s.timelineDot,
                      entry.type === "employment" ? s.dotEmployment : s.dotConsulting,
                    ]}
                  />
                  <View style={s.entryHead}>
                    <View style={s.entryTitles}>
                      <Text style={s.company}>{entry.company}</Text>
                      <Text style={s.at}>—</Text>
                      <Text style={s.role}>{entry.role}</Text>
                      {entry.via && (
                        <View style={s.viaTag}>
                          <Text style={s.viaTagText}>{labels.consultingVia(entry.via)}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={s.dates}>
                      {fmtDates(entry.startDate, entry.endDate, labels.present)}
                    </Text>
                  </View>
                  {entry.description && (
                    <View style={s.bullets}>
                      <Text style={s.bullet}>{entry.description}</Text>
                    </View>
                  )}
                  {entry.highlights && entry.highlights.length > 0 && (
                    <View style={s.bullets}>
                      {entry.highlights.map((h, i) => (
                        <Text key={i} style={s.bullet}>
                          • {h}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              ))}
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
