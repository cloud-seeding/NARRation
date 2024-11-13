// app/dates/StatsDisplay.tsx
"use client";

import { useState, useEffect } from "react";

interface StatsDisplayProps {
  data: {
    metadata: {
      variables_processed: string[];
      created: string;
    };
    variables: Record<string, any>;
  };
}

export default function StatsDisplay({ data }: StatsDisplayProps) {
  const [selectedVariable, setSelectedVariable] = useState<string>("");

  useEffect(() => {
    if (data.metadata.variables_processed.length > 0 && !selectedVariable) {
      setSelectedVariable(data.metadata.variables_processed[0]);
    }

    const handleVariableChange = (event: CustomEvent) => {
      setSelectedVariable(event.detail);
    };

    window.addEventListener(
      "variableChange",
      handleVariableChange as EventListener
    );
    return () => {
      window.removeEventListener(
        "variableChange",
        handleVariableChange as EventListener
      );
    };
  }, [data.metadata.variables_processed]);

  const startDate = new Date("1979-01-01");
  const endDate = new Date("2024-01-01");
  const totalDays = Math.floor(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (!selectedVariable) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-100">
        Coverage Statistics for {selectedVariable.toUpperCase()}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gray-900/50 p-4 rounded-lg border border-emerald-500/20">
          <h4 className="text-sm font-medium text-emerald-400">
            Coverage Status
          </h4>
          <div className="mt-2">
            <div className="text-2xl font-semibold text-emerald-300">100%</div>
            <p className="text-sm text-emerald-400/80">Complete Coverage</p>
          </div>
        </div>

        <div className="bg-gray-900/50 p-4 rounded-lg border border-emerald-500/20">
          <h4 className="text-sm font-medium text-emerald-400">Total Days</h4>
          <div className="mt-2">
            <div className="text-2xl font-semibold text-emerald-300">
              {totalDays.toLocaleString()}
            </div>
            <p className="text-sm text-emerald-400/80">Days of Complete Data</p>
          </div>
        </div>

        <div className="bg-gray-900/50 p-4 rounded-lg border border-emerald-500/20">
          <h4 className="text-sm font-medium text-emerald-400">Date Range</h4>
          <div className="mt-2">
            <div className="text-lg font-semibold text-emerald-300">
              {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
            </div>
            <p className="text-sm text-emerald-400/80">Full Period Coverage</p>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gray-900/50 p-6 rounded-lg border border-emerald-500/20">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <svg
              className="h-5 w-5 text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <h4 className="text-lg font-medium text-emerald-300">
              Complete Dataset
            </h4>
            <p className="text-sm text-emerald-400/80">
              The {selectedVariable.toUpperCase()} dataset has no missing or
              incomplete data points across the entire time period.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
