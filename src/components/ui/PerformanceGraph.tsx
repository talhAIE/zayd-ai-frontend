import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { AssessmentGraphData } from "@/types/dashboard";
import { useState } from "react";

interface PerformanceGraphProps {
  assessmentGraphData?: AssessmentGraphData[];
  timeFilter: "weekly" | "monthly";
  onTimeFilterChange: (value: "weekly" | "monthly") => void;
  isLoading?: boolean;
  title?: string; // Optional title for Teacher UI
}

export default function PerformanceGraph({
  assessmentGraphData = [],
  timeFilter,
  onTimeFilterChange,
  isLoading = false,
  title = "My Performance",
}: PerformanceGraphProps) {
  const [hoveredField, setHoveredField] = useState<string | null>(null);

  // Format graph data based on timeFilter
  const formatGraphData = () => {
    if (!assessmentGraphData || assessmentGraphData.length === 0) {
      return [];
    }

    // Sort data by date to ensure proper ordering
    const sortedData = [...assessmentGraphData].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    return sortedData.map((item, index) => {
      let label = "";

      switch (timeFilter) {
        case "weekly":
          // Weekly filter: Show days (Day 1, Day 2, etc.)
          label = `Day ${index + 1}`;
          break;
        case "monthly":
          // Monthly filter: Show weeks (Week 1, Week 2, etc.)
          // Calculate week number from the start of the data
          const weekNumber = Math.floor(index / 7) + 1;
          label = `Week ${weekNumber}`;
          break;
        default:
          label = `Day ${index + 1}`;
      }

      return {
        label,
        date: item.date,
        accuracy: Math.round(item.averageAccuracy * 10) / 10,
        pronunciation: Math.round(item.averagePronunciation * 10) / 10,
        fluency: Math.round(item.averageFluency * 10) / 10,
      };
    });
  };

  const graphData = formatGraphData();

  return (
    <Card className="shadow-md border-slate-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            {isLoading ? (
              <Skeleton className="h-6 w-40" />
            ) : (
              <CardTitle className="text-xl md:text-2xl font-bold text-slate-800">
                {title}
              </CardTitle>
            )}
          </div>

          {isLoading ? (
            <Skeleton className="h-9 w-24" />
          ) : (
            <Select
              value={timeFilter}
              onValueChange={(value) =>
                onTimeFilterChange(value as "weekly" | "monthly")
              }
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Weekly" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {isLoading ? (
          <div className="space-y-4">
            <div className="flex gap-4">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-20" />
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <>
            {/* Performance Labels */}
            <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6">
              <button
                className={`px-2 md:px-4 py-2 rounded-lg font-medium text-xs md:text-sm transition-colors w-full ${
                  hoveredField === "accuracy" || hoveredField === null
                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    : "bg-blue-50 text-blue-400 hover:bg-blue-100"
                }`}
                onMouseEnter={() => setHoveredField("accuracy")}
                onMouseLeave={() => setHoveredField(null)}
              >
                Accuracy
              </button>
              <button
                className={`px-2 md:px-4 py-2 rounded-lg font-medium text-xs md:text-sm transition-colors w-full ${
                  hoveredField === "pronunciation" || hoveredField === null
                    ? "text-green-600 hover:bg-green-50"
                    : "text-green-300 hover:bg-green-50"
                }`}
                onMouseEnter={() => setHoveredField("pronunciation")}
                onMouseLeave={() => setHoveredField(null)}
              >
                Pronunciation
              </button>
              <button
                className={`px-2 md:px-4 py-2 rounded-lg font-medium text-xs md:text-sm transition-colors w-full ${
                  hoveredField === "fluency" || hoveredField === null
                    ? "text-orange-600 hover:bg-orange-50"
                    : "text-orange-300 hover:bg-orange-50"
                }`}
                onMouseEnter={() => setHoveredField("fluency")}
                onMouseLeave={() => setHoveredField(null)}
              >
                Fluency
              </button>
            </div>

            {/* Performance Graph */}
            <div className="h-48 md:h-64 w-full overflow-x-auto">
              {graphData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%" minHeight={192}>
                  <LineChart
                    data={graphData}
                    margin={{
                      top: 5,
                      right: 10,
                      left: -10,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="label"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#666" }}
                      tickMargin={15}
                      padding={{ left: 20, right: 20 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#666" }}
                      domain={[0, 100]}
                      tickFormatter={(value) => `${value}%`}
                      width={35}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="accuracy"
                      stroke="#3B82F6"
                      strokeWidth={
                        hoveredField === "accuracy" || hoveredField === null
                          ? 3
                          : 1.5
                      }
                      opacity={
                        hoveredField === "accuracy" || hoveredField === null
                          ? 1
                          : 0.3
                      }
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Accuracy"
                    />
                    <Line
                      type="monotone"
                      dataKey="pronunciation"
                      stroke="#10B981"
                      strokeWidth={
                        hoveredField === "pronunciation" ||
                        hoveredField === null
                          ? 3
                          : 1.5
                      }
                      opacity={
                        hoveredField === "pronunciation" ||
                        hoveredField === null
                          ? 1
                          : 0.3
                      }
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Pronunciation"
                    />
                    <Line
                      type="monotone"
                      dataKey="fluency"
                      stroke="#F97316"
                      strokeWidth={
                        hoveredField === "fluency" || hoveredField === null
                          ? 3
                          : 1.5
                      }
                      opacity={
                        hoveredField === "fluency" || hoveredField === null
                          ? 1
                          : 0.3
                      }
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Fluency"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                  No assessment data available
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
