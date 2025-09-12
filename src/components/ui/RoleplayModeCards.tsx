import { Card, CardContent } from "@/components/ui/card";

interface RoleplayModeCardsProps {
  topicsData?: {
    "listening-mode": number;
    "roleplay-mode": number;
    "debate-mode": number;
    "reading-mode": number;
  };
}

export function RoleplayModeCards({ topicsData }: RoleplayModeCardsProps) {
  const learningModes = [
    {
      name: "Listening Mode",
      key: "listening-mode" as keyof typeof topicsData,
      color: "#2DE000",
    },
    {
      name: "Roleplay Mode",
      key: "roleplay-mode" as keyof typeof topicsData,
      color: "#2DE000",
    },
    {
      name: "Debate Mode",
      key: "debate-mode" as keyof typeof topicsData,
      color: "#2DE000",
    },
    {
      name: "Reading Mode",
      key: "reading-mode" as keyof typeof topicsData,
      color: "#2DE000",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {learningModes.map((mode, index) => (
        <Card
          key={index}
          className="bg-white border border-gray-200 hover:shadow-md transition-shadow"
        >
          <CardContent className="p-2">
            <div className="text-center">
              <h3 className="text-md font-bold text-gray-800 mt-2">
                {mode.name}
              </h3>
              <div className="p-4 flex items-center justify-center">
                <div className="text-lg bg-[#F8F9FD] px-6 py-4 rounded-lg">
                  <span className="text-[#2DE000] font-bold">
                    {topicsData?.[mode.key] || 0}
                  </span>
                  <br />
                  <span className="text-sm">Completed</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
