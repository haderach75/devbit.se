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
  { id: "1", text: "Website Visited", color: "orange" },
  { id: "2", text: "Explore Services", color: "blue" },
  { id: "3", text: "Services", subtext: "Architecture · Dev · Cloud", color: "yellow", href: "/services" },
  { id: "4", text: "Interest Sparked", color: "orange" },
  { id: "5", text: "Check Background", color: "blue" },
  { id: "6", text: "Career Stream", subtext: "Event-sourced timeline", color: "yellow", href: "/career" },
  { id: "7", text: "If experience matches → build trust", color: "purple" },
  { id: "8", text: "Review Case Studies", color: "blue" },
  { id: "9", text: "Projects", subtext: "Case studies & results", color: "yellow", href: "/projects" },
  { id: "10", text: "Does this person deliver?", color: "pink" },
  { id: "11", text: "Learn About Person", color: "blue" },
  { id: "12", text: "About", subtext: "CV · Skills · Background", color: "yellow", href: "/about" },
  { id: "13", text: "Decision Made", color: "orange" },
  { id: "14", text: "If convinced → reach out", color: "purple" },
  { id: "15", text: "Send Message", color: "blue" },
  { id: "16", text: "Contact", subtext: "Get in touch", color: "yellow", href: "/contact" },
  { id: "17", text: "Message Sent", color: "orange" },
  { id: "18", text: "Consultant Hired 🎉", color: "orange" },
];

function StoryCard({ step, index }: { step: StoryStep; index: number }) {
  const router = useRouter();
  const colors = colorMap[step.color];
  const isClickable = !!step.href;
  const isAggregate = step.color === "yellow";

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30, y: 10 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.4, ease: "backOut" }}
      onClick={() => step.href && router.push(step.href)}
      className={`${colors.bg} ${colors.text} rounded-sm shadow-md
        ${isAggregate ? "px-5 py-4 border-2 border-white/30" : "px-4 py-3"}
        ${isClickable ? "cursor-pointer active:scale-95" : ""}
      `}
      style={{ fontFamily: "'Caveat', 'Segoe Print', 'Comic Sans MS', cursive" }}
    >
      <div className="flex items-center justify-between">
        <span className={isAggregate ? "text-lg font-bold" : "text-base font-semibold"}>
          {step.text}
        </span>
        {isClickable && (
          <span className="text-xs opacity-50 font-sans ml-2">→</span>
        )}
      </div>
      {step.subtext && (
        <span className="text-xs font-normal opacity-70 block mt-0.5">{step.subtext}</span>
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

      {/* Story flow */}
      <div className="max-w-sm mx-auto space-y-3">
        {story.map((step, i) => (
          <div key={step.id}>
            <StoryCard step={step} index={i} />
            {/* Connecting line between cards */}
            {i < story.length - 1 && (
              <div className="flex justify-center py-1">
                <div className="w-px h-4 bg-[#6b5e50]/30" style={{ borderLeft: "2px dashed #6b5e5080" }} />
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
