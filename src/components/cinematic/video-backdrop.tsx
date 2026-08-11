"use client";

// ponytail: sections 2/3 use a looping <video>, not a frame scrub — only the
// hero orbit needs frame-accurate scrubbing.
export function VideoBackdrop({ src, hidden }: { src: string; hidden: boolean }) {
  if (hidden) return <div className="absolute inset-0 bg-[#1a1714]" />;
  return (
    <>
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1714] via-[#1a1714]/40 to-[#1a1714]" />
    </>
  );
}
