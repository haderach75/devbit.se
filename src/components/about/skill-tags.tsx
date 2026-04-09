"use client";
import { motion } from "framer-motion";

const skills = ["C#", ".NET", "Go", "Azure", "AWS", "Kubernetes", "DDD", "CQRS", "Event Sourcing", "gRPC", "GraphQL", "Orleans", "MQTT", "Docker", "ASP.NET Core"];

export function SkillTags() {
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, i) => (
        <motion.span key={skill} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.3, delay: i * 0.03 }}
          className="rounded-md border border-crimson/30 bg-crimson/10 px-2.5 py-1 font-mono text-sm text-amber">
          {skill}
        </motion.span>
      ))}
    </div>
  );
}
