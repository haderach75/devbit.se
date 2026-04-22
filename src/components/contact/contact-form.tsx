"use client";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";

export function ContactForm() {
  const t = useTranslations("contactForm");
  const tErr = useTranslations("contactForm.errors");

  const schema = useMemo(() => z.object({
    name: z.string().min(1, tErr("nameRequired")),
    email: z.string().email(tErr("emailInvalid")),
    subject: z.string().optional(),
    message: z.string().min(10, tErr("messageMin")),
  }), [tErr]);

  type FormData = z.infer<typeof schema>;

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  function onSubmit(data: FormData) {
    const subject = encodeURIComponent(data.subject || t("defaultSubject"));
    const body = encodeURIComponent(`From: ${data.name} (${data.email})\n\n${data.message}`);
    window.location.href = `mailto:michael@devbit.se?subject=${subject}&body=${body}`;
  }

  const inputClass = "w-full rounded-lg border border-border bg-bg px-4 py-3 text-base text-text-body placeholder:text-text-dim focus:border-crimson focus:outline-none transition-colors";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div><input {...register("name")} placeholder={t("namePlaceholder")} className={inputClass} />{errors.name && <p className="mt-1 text-sm text-crimson">{errors.name.message}</p>}</div>
      <div><input {...register("email")} placeholder={t("emailPlaceholder")} className={inputClass} />{errors.email && <p className="mt-1 text-sm text-crimson">{errors.email.message}</p>}</div>
      <div><input {...register("subject")} placeholder={t("subjectPlaceholder")} className={inputClass} /></div>
      <div><textarea {...register("message")} placeholder={t("messagePlaceholder")} rows={5} className={`${inputClass} resize-vertical`} />{errors.message && <p className="mt-1 text-sm text-crimson">{errors.message.message}</p>}</div>
      <button type="submit" className="rounded-lg bg-crimson px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-crimson-hover">
        {t("submit")}
      </button>
    </form>
  );
}
