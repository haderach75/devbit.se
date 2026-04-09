"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
type FormData = z.infer<typeof schema>;

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error("Failed to send");
      setStatus("sent");
      reset();
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  }

  const inputClass = "w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm text-text-body placeholder:text-text-dim focus:border-crimson focus:outline-none transition-colors";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div><input {...register("name")} placeholder="Your name" className={inputClass} />{errors.name && <p className="mt-1 text-xs text-crimson">{errors.name.message}</p>}</div>
      <div><input {...register("email")} placeholder="Email address" className={inputClass} />{errors.email && <p className="mt-1 text-xs text-crimson">{errors.email.message}</p>}</div>
      <div><input {...register("subject")} placeholder="Subject (optional)" className={inputClass} /></div>
      <div><textarea {...register("message")} placeholder="Tell me about your project..." rows={5} className={`${inputClass} resize-vertical`} />{errors.message && <p className="mt-1 text-xs text-crimson">{errors.message.message}</p>}</div>
      <button type="submit" disabled={status === "sending"} className="rounded-lg bg-crimson px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-crimson-hover disabled:opacity-50">
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>
      <AnimatePresence>
        {status === "sent" && <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-sm text-sage">Message sent! I&apos;ll get back to you soon.</motion.p>}
        {status === "error" && <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-sm text-crimson">Failed to send. Please email me directly at michael@devbit.se.</motion.p>}
      </AnimatePresence>
    </form>
  );
}
