"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
type FormData = z.infer<typeof schema>;

export function ContactForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  function onSubmit(data: FormData) {
    const subject = encodeURIComponent(data.subject || "Website inquiry");
    const body = encodeURIComponent(`From: ${data.name} (${data.email})\n\n${data.message}`);
    window.location.href = `mailto:michael@devbit.se?subject=${subject}&body=${body}`;
  }

  const inputClass = "w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm text-text-body placeholder:text-text-dim focus:border-crimson focus:outline-none transition-colors";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div><input {...register("name")} placeholder="Your name" className={inputClass} />{errors.name && <p className="mt-1 text-xs text-crimson">{errors.name.message}</p>}</div>
      <div><input {...register("email")} placeholder="Email address" className={inputClass} />{errors.email && <p className="mt-1 text-xs text-crimson">{errors.email.message}</p>}</div>
      <div><input {...register("subject")} placeholder="Subject (optional)" className={inputClass} /></div>
      <div><textarea {...register("message")} placeholder="Tell me about your project..." rows={5} className={`${inputClass} resize-vertical`} />{errors.message && <p className="mt-1 text-xs text-crimson">{errors.message.message}</p>}</div>
      <button type="submit" className="rounded-lg bg-crimson px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-crimson-hover">
        Send Message
      </button>
    </form>
  );
}
