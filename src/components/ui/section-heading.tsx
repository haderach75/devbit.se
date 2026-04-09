interface SectionHeadingProps {
  label: string;
  title: string;
  description?: string;
}

export function SectionHeading({ label, title, description }: SectionHeadingProps) {
  return (
    <div className="mb-8">
      <p className="text-sm font-medium uppercase tracking-widest text-crimson mb-2">{label}</p>
      <h1 className="text-4xl font-bold text-text-primary mb-2">{title}</h1>
      {description && <p className="text-text-muted text-xl">{description}</p>}
    </div>
  );
}
