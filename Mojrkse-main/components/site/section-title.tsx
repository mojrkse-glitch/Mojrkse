export function SectionTitle({
  eyebrow,
  title,
  description
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow ? (
        <p className="mb-3 text-sm font-semibold text-primary">{eyebrow}</p>
      ) : null}
      <h2 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-8 text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
