"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

type NoteColor = "orange" | "blue" | "yellow" | "pink" | "green" | "purple" | "lilac";

interface StickyNote {
  id: string;
  text: string;
  subtext?: string;
  color: NoteColor;
  x: number; // percentage from left
  y: number; // percentage from top
  rotation: number; // degrees
  href?: string;
  size?: "sm" | "md" | "lg";
}

const colorMap: Record<NoteColor, { bg: string; text: string; shadow: string }> = {
  orange:  { bg: "bg-[#FF8C42]", text: "text-[#3d1e00]", shadow: "shadow-[#e07030]/20" },
  blue:    { bg: "bg-[#5B9BD5]", text: "text-[#1a2e42]", shadow: "shadow-[#4a8bc5]/20" },
  yellow:  { bg: "bg-[#FFD966]", text: "text-[#3d3000]", shadow: "shadow-[#e0c050]/20" },
  pink:    { bg: "bg-[#FF6B8A]", text: "text-[#3d0015]", shadow: "shadow-[#e05070]/20" },
  green:   { bg: "bg-[#6BBF6B]", text: "text-[#0a2e0a]", shadow: "shadow-[#50a050]/20" },
  purple:  { bg: "bg-[#9B7ED8]", text: "text-[#2a1a42]", shadow: "shadow-[#8060c0]/20" },
  lilac:   { bg: "bg-[#C9A9E8]", text: "text-[#2a1a42]", shadow: "shadow-[#a080d0]/20" },
};

// Event Storming layout:
// Orange = Domain Events (things that happened)
// Blue = Commands (actions/triggers)
// Yellow = Aggregates / Systems (the pages!)
// Pink = Hot spots / pain points
// Green = Read models / views
// Purple = Policies / rules
// Lilac = External systems

const notes: StickyNote[] = [
  // Top row - The story starts: someone discovers Devbit
  { id: "evt-visit", text: "Website Visited", color: "orange", x: 9, y: 5, rotation: -1.5, size: "sm" },
  { id: "cmd-explore", text: "Explore Services", color: "blue", x: 19, y: 4, rotation: 1, size: "sm" },

  // The "Services" aggregate - CLICKABLE
  { id: "agg-services", text: "Services", subtext: "Architecture · Dev · Cloud", color: "yellow", x: 31, y: 3, rotation: -0.5, href: "/services", size: "lg" },

  { id: "evt-interested", text: "Interest Sparked", color: "orange", x: 44, y: 6, rotation: 2, size: "sm" },
  { id: "cmd-check-bg", text: "Check Background", color: "blue", x: 56, y: 4, rotation: -1, size: "sm" },

  // The "Career" aggregate - CLICKABLE
  { id: "agg-career", text: "Career Stream", subtext: "Event-sourced timeline", color: "yellow", x: 68, y: 2, rotation: 1.5, href: "/career", size: "lg" },

  { id: "policy-trust", text: "If experience matches → build trust", color: "purple", x: 82, y: 5, rotation: -2, size: "sm" },

  // Middle row - deeper evaluation
  { id: "evt-evaluating", text: "Candidate Evaluated", color: "orange", x: 7, y: 34, rotation: 1, size: "sm" },
  { id: "cmd-review", text: "Review Case Studies", color: "blue", x: 18, y: 36, rotation: -1.5, size: "sm" },

  // The "Projects" aggregate - CLICKABLE
  { id: "agg-projects", text: "Projects", subtext: "Case studies & results", color: "yellow", x: 31, y: 33, rotation: 0.5, href: "/projects", size: "lg" },

  { id: "hotspot-1", text: "Does this person deliver?", color: "pink", x: 45, y: 37, rotation: -1, size: "sm" },
  { id: "ext-linkedin", text: "LinkedIn", color: "lilac", x: 45, y: 30, rotation: 2, size: "sm" },

  { id: "cmd-who", text: "Learn About Person", color: "blue", x: 57, y: 35, rotation: 1.5, size: "sm" },

  // The "About" aggregate - CLICKABLE
  { id: "agg-about", text: "About", subtext: "CV · Skills · Background", color: "yellow", x: 68, y: 32, rotation: -1, href: "/about", size: "lg" },

  { id: "evt-convinced", text: "Decision Made", color: "orange", x: 82, y: 35, rotation: 1, size: "sm" },

  // Bottom row - the action
  { id: "policy-reach", text: "If convinced → reach out", color: "purple", x: 12, y: 60, rotation: -1, size: "sm" },
  { id: "cmd-contact", text: "Send Message", color: "blue", x: 26, y: 62, rotation: 1.5, size: "sm" },

  // The "Contact" aggregate - CLICKABLE
  { id: "agg-contact", text: "Contact", subtext: "Get in touch", color: "yellow", x: 41, y: 59, rotation: -0.5, href: "/contact", size: "lg" },

  { id: "evt-sent", text: "Message Sent", color: "orange", x: 56, y: 61, rotation: 2, size: "sm" },
  { id: "evt-hired", text: "Consultant Hired 🎉", color: "orange", x: 70, y: 59, rotation: -1, size: "sm" },

  // Legend area (bottom right)
  { id: "hotspot-legend", text: "← You are here", color: "pink", x: 84, y: 60, rotation: 0, size: "sm" },
];

// Arrows connecting the flow
const arrows = [
  { from: "evt-visit", to: "cmd-explore" },
  { from: "cmd-explore", to: "agg-services" },
  { from: "agg-services", to: "evt-interested" },
  { from: "evt-interested", to: "cmd-check-bg" },
  { from: "cmd-check-bg", to: "agg-career" },
  { from: "agg-career", to: "evt-evaluating" },
  { from: "evt-evaluating", to: "cmd-review" },
  { from: "cmd-review", to: "agg-projects" },
  { from: "agg-projects", to: "cmd-who" },
  { from: "cmd-who", to: "agg-about" },
  { from: "agg-about", to: "evt-convinced" },
  { from: "evt-convinced", to: "cmd-contact" },
  { from: "cmd-contact", to: "agg-contact" },
  { from: "agg-contact", to: "evt-sent" },
  { from: "evt-sent", to: "evt-hired" },
];

function StickyNoteCard({ note, index }: { note: StickyNote; index: number }) {
  const router = useRouter();
  const colors = colorMap[note.color];
  const isClickable = !!note.href;
  const isAggregate = note.color === "yellow";
  const sizeClass = note.size === "lg" ? "w-36 h-36 p-3" : note.size === "sm" ? "w-24 h-24 p-2" : "w-28 h-28 p-2.5";
  const textSize = note.size === "lg" ? "text-[13px] font-bold" : "text-[10px] font-semibold";
  const subtextSize = "text-[9px] font-normal opacity-70 mt-1";

  // Stagger: each note drops in from above with a "slap" effect
  const delay = 0.3 + index * 0.15;

  return (
    <motion.div
      initial={{ opacity: 0, y: -60, scale: 0.3, rotate: note.rotation + 15 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: note.rotation }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.34, 1.56, 0.64, 1], // overshoot spring
      }}
      whileHover={isClickable ? { scale: 1.1, rotate: 0, zIndex: 50, transition: { duration: 0.2 } } : { scale: 1.03 }}
      onClick={() => note.href && router.push(note.href)}
      className={`absolute ${colors.bg} ${colors.text} ${sizeClass} rounded-sm
        flex flex-col justify-center items-center text-center leading-tight
        ${isClickable ? "cursor-pointer ring-0 hover:ring-2 hover:ring-crimson/50" : ""}
        ${isAggregate ? "border-2 border-white/30" : ""}
      `}
      style={{
        left: `${note.x}%`,
        top: `${note.y}%`,
        fontFamily: "'Caveat', 'Segoe Print', 'Comic Sans MS', cursive",
        boxShadow: "3px 4px 8px rgba(0,0,0,0.18), 1px 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <span className={textSize}>{note.text}</span>
      {note.subtext && <span className={subtextSize}>{note.subtext}</span>}
      {isClickable && (
        <span className="mt-1 text-[8px] opacity-50 font-sans font-normal">click →</span>
      )}
    </motion.div>
  );
}

function Arrow({ fromNote, toNote }: { fromNote: StickyNote; toNote: StickyNote }) {
  const fromSize = fromNote.size === "lg" ? 144 : fromNote.size === "sm" ? 96 : 112;
  const toSize = toNote.size === "lg" ? 144 : toNote.size === "sm" ? 96 : 112;

  // Approximate center of each note in viewport percentages
  const x1 = fromNote.x + (fromSize / 2) / 14.4; // rough px to % conversion for 1440px viewport
  const y1 = fromNote.y + (fromSize / 2) / 9;
  const x2 = toNote.x;
  const y2 = toNote.y + (toSize / 2) / 9;

  return (
    <line
      x1={`${x1}%`}
      y1={`${y1}%`}
      x2={`${x2}%`}
      y2={`${y2}%`}
      stroke="#6b5e50"
      strokeWidth="2"
      strokeDasharray="8 5"
      opacity="0.5"
    />
  );
}

export function EventStormingBoard() {
  const noteMap = Object.fromEntries(notes.map(n => [n.id, n]));

  return (
    <div className="w-full h-screen pt-14 overflow-hidden bg-[#e8e0d4] dark:bg-[#1a1714]">
      <div className="relative w-full h-full overflow-hidden">
      {/* Whiteboard texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-2 left-1/2 -translate-x-1/2 text-center z-10"
      >
        <p className="text-sm text-text-muted font-mono mb-4">// event storming: the customer journey</p>
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 + notes.length * 0.15 + 1.5, duration: 0.8 }}
        className="absolute bottom-4 right-4 flex flex-wrap gap-3 text-xs text-text-dim font-mono z-10"
      >
        <span className="flex items-center gap-1"><span className="w-3.5 h-3.5 rounded-sm bg-[#FF8C42]" /> Domain Event</span>
        <span className="flex items-center gap-1"><span className="w-3.5 h-3.5 rounded-sm bg-[#5B9BD5]" /> Command</span>
        <span className="flex items-center gap-1"><span className="w-3.5 h-3.5 rounded-sm bg-[#FFD966] border border-white/30" /> Aggregate (page)</span>
        <span className="flex items-center gap-1"><span className="w-3.5 h-3.5 rounded-sm bg-[#FF6B8A]" /> Hot Spot</span>
        <span className="flex items-center gap-1"><span className="w-3.5 h-3.5 rounded-sm bg-[#9B7ED8]" /> Policy</span>
        <span className="flex items-center gap-1"><span className="w-3.5 h-3.5 rounded-sm bg-[#C9A9E8]" /> External</span>
      </motion.div>

      {/* Dashed flow arrows — fade in after notes land */}
      <motion.svg
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 + notes.length * 0.15 + 0.5, duration: 1 }}
        className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {arrows.map((a, i) => {
          const from = noteMap[a.from];
          const to = noteMap[a.to];
          if (!from || !to) return null;
          return <Arrow key={i} fromNote={from} toNote={to} />;
        })}
      </motion.svg>

      {/* Sticky notes */}
      {notes.map((note, i) => (
        <StickyNoteCard key={note.id} note={note} index={i} />
      ))}
      </div>
    </div>
  );
}
