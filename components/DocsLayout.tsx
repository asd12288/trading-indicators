
export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <main className="flex-1 p-8 text-slate-50">{children}</main>
    </div>
  );
}
