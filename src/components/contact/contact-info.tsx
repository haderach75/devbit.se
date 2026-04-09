import { Mail, Phone, MapPin } from "lucide-react";

function LinkedinIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
    </svg>
  );
}
import { contactInfo } from "@/data/site-config";

export function ContactInfo() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-crimson/25 bg-crimson/10"><Mail size={16} className="text-crimson" /></div>
        <div><p className="text-sm font-medium text-text-body">Email</p><p className="text-base text-text-muted">{contactInfo.email}</p></div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-crimson/25 bg-crimson/10"><Phone size={16} className="text-crimson" /></div>
        <div><p className="text-sm font-medium text-text-body">Phone</p><p className="text-base text-text-muted">{contactInfo.phone}</p></div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-crimson/25 bg-crimson/10"><MapPin size={16} className="text-crimson" /></div>
        <div><p className="text-sm font-medium text-text-body">Location</p><p className="text-base text-text-muted">{contactInfo.location}</p></div>
      </div>
      <a href="https://www.linkedin.com/in/michael-hultman-28545741/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-crimson/25 bg-crimson/10"><LinkedinIcon size={16} className="text-crimson" /></div>
        <div><p className="text-sm font-medium text-text-body">LinkedIn</p><p className="text-base text-text-muted group-hover:text-crimson transition-colors">Michael Hultman</p></div>
      </a>
      <div className="mt-6 border-t border-border pt-4"><p className="text-base text-text-dim">{contactInfo.availability}</p></div>
    </div>
  );
}
