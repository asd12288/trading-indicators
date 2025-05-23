
export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <main className="flex-1 p-8 ">{children}</main>
    </div>
  );
}
