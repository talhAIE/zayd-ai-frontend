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

const formatDateForDisplay = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const minutesToHours = (minutes: number) => {
  return Math.round((minutes / 60) * 10) / 10; // Round to 1 decimal place
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow-lg">
        <p className="text-sm font-medium">{`${payload[0].value}h`}</p>
      </div>
    );
  }
  return null;
};

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;

  if (payload.day === "Fri") {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill="#3B82F6"
        stroke="#ffffff"
        strokeWidth={2}
      />
    );
  }
  return null;
};

interface RevenueGraphProps {
  usageData?: Array<{
    date: string;
    duration: number;
  }>;
}

export function RevenueGraph({ usageData }: RevenueGraphProps) {
  const chartData =
    usageData?.map((item) => ({
      day: formatDateForDisplay(item.date),
      hours: minutesToHours(item.duration),
      originalDate: item.date,
    })) || [];

  const totalUsage =
    usageData?.reduce((sum, item) => sum + item.duration, 0) || 0;
  const totalHours = minutesToHours(totalUsage);
  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-800">
          Usage Graph: {totalHours.toFixed(1)}h Total
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#666" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#666" }}
                domain={[0, 40]}
                ticks={[0, 10, 20, 30, 40]}
                tickFormatter={(value) => `${value}h`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="hours"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={<CustomDot />}
                activeDot={{ r: 6, fill: "#3B82F6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
