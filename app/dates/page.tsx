// app/dates/page.tsx
import VariableSelector from "./VariableSelector";
import StatsDisplay from "./StatsDisplay";

async function getData() {
  const res = await fetch(
    "https://cloud-seeding.github.io/cdn/narration/dates/daily_missing_data_catalog.json",
    {
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();
  return data;
}

export default async function DatesPage() {
  const data = await getData();

  return (
    <div className="space-y-6 p-6 bg-gray-900 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold mb-2 text-gray-100">
          Temporal Coverage Analysis
        </h1>
        <p className="text-gray-400">NARR Dataset Coverage Statistics</p>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
        <div className="mb-6">
          <VariableSelector
            variables={data.metadata.variables_processed}
            data={data}
          />
        </div>
        <StatsDisplay data={data} />
      </div>

      <div className="bg-gray-800 rounded-lg shadow-xl p-4 border border-gray-700">
        <h2 className="text-lg font-semibold mb-4 text-gray-100">Index Date</h2>
        <p className="text-sm text-gray-400">
          Last updated: {new Date(data.metadata.created).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
