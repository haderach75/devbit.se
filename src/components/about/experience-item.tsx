interface ExperienceItemProps { title: string; company: string; dates: string; description: string; }

export function ExperienceItem({ title, company, dates, description }: ExperienceItemProps) {
  return (
    <div className="mb-4">
      <p className="font-semibold text-sm text-text-body">{title}</p>
      <p className="text-sm text-crimson">{company}</p>
      <p className="font-mono text-xs text-text-dim">{dates}</p>
      {description && <p className="text-sm text-text-muted mt-0.5">{description}</p>}
    </div>
  );
}
