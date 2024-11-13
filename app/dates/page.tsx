import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface DailyStat {
  total_missing: number;
  variables_affected: string[];
  max_percentage: number;
}

interface Catalog {
  metadata: {
    created: string;
    base_path: string;
    variables_processed: string[];
  };
  variables: {
    [key: string]: {
      [date: string]: {
        missing_count: number;
        total_points: number;
        missing_percentage: number;
      };
    };
  };
  daily_summary: {
    [date: string]: DailyStat;
  };
}

export default function MissingDataPage() {
  const [data, setData] = useState<Catalog | null>(null);
  const [selectedVariable, setSelectedVariable] = useState<string>("all");
  const [hoveredDay, setHoveredDay] = useState<{
    date: string;
    stats: DailyStat | null;
  }>(null);

  useEffect(() => {
    fetch(
      "https://cloud-seeding.github.io/cdn/narration/dates/daily_missing_data_catalog.json"
    )
      .then((res) => res.json())
      .then(setData);
  }, []);

  // Calculate position for each day cell
  const calculateDayPosition = (dayOfYear: number, radius: number) => {
    const angle = (dayOfYear / 365) * 2 * Math.PI - Math.PI / 2;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  // Generate color based on missing data percentage
  const getColor = (percentage: number) => {
    if (percentage === 0) return "#1a1a1a";
    if (percentage < 1) return "#0e4429";
    if (percentage < 3) return "#006d32";
    if (percentage < 5) return "#26a641";
    return "#39d353";
  };

  if (!data) {
    return <Skeleton className="w-full h-[600px] rounded-lg" />;
  }

  const centerX = 300;
  const centerY = 300;
  const cellSize = 10;
  const radius = 250;

  // Get dates for the year 1979 (from the data)
  const allDates = Object.keys(data.daily_summary).sort();
  const startDate = new Date(allDates[0]);

  return (
    <div className="flex flex-col space-y-4 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Missing Data Patterns</h2>
        <Select value={selectedVariable} onValueChange={setSelectedVariable}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select variable" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Variables</SelectItem>
            {data.metadata.variables_processed.map((var_name) => (
              <SelectItem key={var_name} value={var_name}>
                {var_name.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-black border-gray-800">
        <CardContent className="pt-6">
          <div className="relative w-full">
            <svg viewBox="0 0 600 600" className="w-full h-full">
              {/* Background circle */}
              <circle
                cx={centerX}
                cy={centerY}
                r={radius + 20}
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="1"
              />

              {/* Month labels */}
              {Array.from({ length: 12 }).map((_, month) => {
                const angle = (month / 12) * 2 * Math.PI - Math.PI / 2;
                const labelRadius = radius + 40;
                const x = centerX + Math.cos(angle) * labelRadius;
                const y = centerY + Math.sin(angle) * labelRadius;

                return (
                  <text
                    key={month}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-gray-400 text-xs font-medium"
                    transform={`rotate(${(month / 12) * 360}, ${x}, ${y})`}
                  >
                    {new Date(1979, month).toLocaleString("default", {
                      month: "short",
                    })}
                  </text>
                );
              })}

              {/* Day cells */}
              {allDates.map((date, index) => {
                const dayOfYear = Math.floor(
                  (new Date(date).getTime() - startDate.getTime()) /
                    (1000 * 60 * 60 * 24)
                );
                const pos = calculateDayPosition(dayOfYear, radius);
                const stats =
                  selectedVariable === "all"
                    ? data.daily_summary[date]
                    : data.variables[selectedVariable]?.[date]
                    ? {
                        total_missing:
                          data.variables[selectedVariable][date].missing_count,
                        variables_affected: [selectedVariable],
                        max_percentage:
                          data.variables[selectedVariable][date]
                            .missing_percentage,
                      }
                    : null;

                if (!stats) return null;

                return (
                  <g
                    key={date}
                    transform={`translate(${centerX + pos.x}, ${
                      centerY + pos.y
                    })`}
                    onMouseEnter={() => setHoveredDay({ date, stats })}
                    onMouseLeave={() => setHoveredDay(null)}
                    className="cursor-pointer"
                  >
                    <rect
                      x={-cellSize / 2}
                      y={-cellSize / 2}
                      width={cellSize}
                      height={cellSize}
                      rx={2}
                      fill={getColor(stats.max_percentage)}
                      className="transition-colors duration-200"
                    />
                  </g>
                );
              })}

              {/* Tooltip */}
              {hoveredDay && (
                <g transform={`translate(${centerX}, ${centerY})`}>
                  <rect
                    x={-120}
                    y={-80}
                    width={240}
                    height={60}
                    fill="#1a1a1a"
                    stroke="#2d2d2d"
                    rx={4}
                  />
                  <text
                    x={0}
                    y={-55}
                    textAnchor="middle"
                    className="fill-gray-200 text-xs"
                  >
                    {new Date(hoveredDay.date).toLocaleDateString()}
                  </text>
                  <text
                    x={0}
                    y={-35}
                    textAnchor="middle"
                    className="fill-gray-300 text-xs"
                  >
                    {`Missing: ${hoveredDay.stats?.total_missing.toLocaleString()} points`}
                  </text>
                  <text
                    x={0}
                    y={-15}
                    textAnchor="middle"
                    className="fill-gray-400 text-xs"
                  >
                    {`${hoveredDay.stats?.variables_affected.length} variables affected`}
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <span className="text-xs text-gray-400">Less</span>
            {[0, 1, 3, 5, 10].map((value) => (
              <div
                key={value}
                className="w-4 h-4 rounded"
                style={{ backgroundColor: getColor(value) }}
              />
            ))}
            <span className="text-xs text-gray-400">More</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
