"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

type NoteColor = "orange" | "blue" | "yellow" | "pink" | "purple" | "lilac";

interface StoryStep {
  id: string;
  text: string;
  subtext?: string;
  color: NoteColor;
  href?: string;
  rotation: number;
}

const colorMap: Record<NoteColor, { bg: string; text: string }> = {
  orange: { bg: "bg-[#FF8C42]", text: "text-[#3d1e00]" },
  blue:   { bg: "bg-[#5B9BD5]", text: "text-[#1a2e42]" },
  yellow: { bg: "bg-[#FFD966]", text: "text-[#3d3000]" },
  pink:   { bg: "bg-[#FF6B8A]", text: "text-[#3d0015]" },
  purple: { bg: "bg-[#9B7ED8]", text: "text-[#2a1a42]" },
  lilac:  { bg: "bg-[#C9A9E8]", text: "text-[#2a1a42]" },
};

const story: StoryStep[] = [
  { id: "1", text: "Website Visited", color: "orange", rotation: -1.5 },
  { id: "2", text: "Explore Services", color: "blue", rotation: 1 },
  { id: "3", text: "Services", subtext: "Architecture · Dev · Cloud", color: "yellow", href: "/services", rotation: -0.5 },
  { id: "4", text: "Interest Sparked", color: "orange", rotation: 2 },
  { id: "5", text: "Check Background", color: "blue", rotation: -1 },
  { id: "6", text: "Career Stream", subtext: "Event-sourced timeline", color: "yellow", href: "/career", rotation: 1.5 },
  { id: "7", text: "If experience matches → build trust", color: "purple", rotation: -2 },
  { id: "8", text: "Review Case Studies", color: "blue", rotation: 1 },
  { id: "9", text: "Projects", subtext: "Case studies & results", color: "yellow", href: "/projects", rotation: -0.5 },
  { id: "10", text: "Does this person deliver?", color: "pink", rotation: 1.5 },
  { id: "11", text: "Learn About Person", color: "blue", rotation: -1 },
  { id: "12", text: "About", subtext: "CV · Skills · Background", color: "yellow", href: "/about", rotation: 0.5 },
  { id: "13", text: "Decision Made", color: "orange", rotation: -1.5 },
  { id: "14", text: "If convinced → reach out", color: "purple", rotation: 1 },
  { id: "15", text: "Send Message", color: "blue", rotation: -0.5 },
  { id: "16", text: "Contact", subtext: "Get in touch", color: "yellow", href: "/contact", rotation: 1 },
  { id: "17", text: "Message Sent", color: "orange", rotation: -1 },
  { id: "18", text: "Consultant Hired 🎉", color: "orange", rotation: 2 },
];

function StickyNote({ step, index }: { step: StoryStep; index: number }) {
  const router = useRouter();
  const colors = colorMap[step.color];
  const isClickable = !!step.href;
  const isAggregate = step.color === "yellow";

  return (
    <motion.div
      initial={{ opacity: 0, y: -30, scale: 0.5, rotate: step.rotation + 10 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotate: step.rotation }}
      viewport={{ once: true, margin: "-10px" }}
      transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      onClick={() => step.href && router.push(step.href)}
      className={`${colors.bg} ${colors.text} shadow-[2px_3px_8px_rgba(0,0,0,0.2)]
        ${isAggregate ? "w-40 h-40 p-4 border-2 border-white/30" : "w-28 h-28 p-3"}
        ${isClickable ? "cursor-pointer active:scale-95" : ""}
        flex flex-col justify-center items-center text-center
      `}
      style={{
        fontFamily: "'Caveat', 'Segoe Print', 'Comic Sans MS', cursive",
      }}
    >
      <span className={isAggregate ? "text-base font-bold" : "text-sm font-semibold"}>
        {step.text}
      </span>
      {step.subtext && (
        <span className="text-[10px] font-normal opacity-70 mt-1">{step.subtext}</span>
      )}
      {isClickable && (
        <span className="mt-1 text-[9px] opacity-50 font-sans font-normal">tap →</span>
      )}
    </motion.div>
  );
}

export function MobileEventStormingBoard() {
  return (
    <div className="min-h-screen pt-16 pb-8 px-4 bg-[#e8e0d4] dark:bg-[#1a1714]">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-6"
      >
        <p className="text-sm text-text-muted font-mono">// event storming: the customer journey</p>
      </motion.div>

      {/* Story flow — zigzag sticky notes */}
      <div className="flex flex-col items-center gap-2">
        {story.map((step, i) => (
          <div key={step.id} className="flex flex-col items-center">
            <div className={i % 2 === 0 ? "self-start ml-4" : "self-end mr-4"}>
              <StickyNote step={step} index={i} />
            </div>
            {/* Connecting dashes */}
            {i < story.length - 1 && (
              <div className="py-0.5">
                <div className="h-3 border-l-2 border-dashed border-[#6b5e50]/40" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-8 flex flex-wrap justify-center gap-3 text-xs text-text-dim font-mono"
      >
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-[#FF8C42]" /> Event</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-[#5B9BD5]" /> Command</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-[#FFD966] border border-white/30" /> Page</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-[#FF6B8A]" /> Hot Spot</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-[#9B7ED8]" /> Policy</span>
      </motion.div>
    </div>
  );
}
