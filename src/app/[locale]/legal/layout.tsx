
export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container max-w-4xl py-12 px-4 md:py-20">
      <div className="prose prose-slate max-w-none dark:prose-invert">
        {children}
      </div>
    </div>
  );
}
