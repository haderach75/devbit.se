import { Mail, Phone, MapPin } from "lucide-react";
import { contactInfo } from "@/data/site-config";

export function ContactInfo() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-crimson/25 bg-crimson/10"><Mail size={16} className="text-crimson" /></div>
        <div><p className="text-xs font-medium text-text-body">Email</p><p className="text-sm text-text-muted">{contactInfo.email}</p></div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-crimson/25 bg-crimson/10"><Phone size={16} className="text-crimson" /></div>
        <div><p className="text-xs font-medium text-text-body">Phone</p><p className="text-sm text-text-muted">{contactInfo.phone}</p></div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-crimson/25 bg-crimson/10"><MapPin size={16} className="text-crimson" /></div>
        <div><p className="text-xs font-medium text-text-body">Location</p><p className="text-sm text-text-muted">{contactInfo.location}</p></div>
      </div>
      <div className="mt-6 border-t border-border pt-4"><p className="text-sm text-text-dim">{contactInfo.availability}</p></div>
    </div>
  );
}
