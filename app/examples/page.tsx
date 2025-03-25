import EurusdChart from "@/components/examples/EurusdChart";

export default function ExamplesPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">Chart Examples</h1>

      <div className="mx-auto max-w-3xl">
        <EurusdChart />
      </div>
    </div>
  );
}
