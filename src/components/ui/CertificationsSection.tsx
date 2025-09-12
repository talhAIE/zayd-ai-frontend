import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CertificationsSectionProps {
  achievements?: Array<{
    id: string;
    name: string;
    description: string;
    pointValue: number;
    awardedAt: string;
    iconUrl: string;
    category: string;
  }>;
}

export function CertificationsSection({
  achievements,
}: CertificationsSectionProps) {
  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  // Group achievements by category
  const achievementsByCategory =
    achievements?.reduce((acc, achievement) => {
      if (!acc[achievement.category]) {
        acc[achievement.category] = [];
      }
      acc[achievement.category].push(achievement);
      return acc;
    }, {} as Record<string, typeof achievements>) || {};
  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader className="pb-4">
        <Tabs defaultValue="certifications" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
          </TabsList>

          <TabsContent value="certifications" className="mt-4">
            <div className="space-y-3">
              {achievements && achievements.length > 0 ? (
                achievements.slice(0, 3).map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <img
                      src={achievement.iconUrl}
                      alt={achievement.name}
                      className="w-15 h-10 rounded object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">
                        Awarded {formatDate(achievement.awardedAt)}
                      </p>
                      <p className="mt-1 text-sm font-bold text-gray-800 truncate">
                        {achievement.name}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {achievement.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-blue-600">
                        +{achievement.pointValue} pts
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No achievements yet</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="rewards" className="mt-4">
            <div className="space-y-3">
              {achievements && achievements.length > 0 ? (
                achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <img
                      src={achievement.iconUrl}
                      alt={achievement.name}
                      className="w-12 h-12 rounded object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate">
                        {achievement.name}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {achievement.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {achievement.category} •{" "}
                        {formatDate(achievement.awardedAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-blue-600">
                        +{achievement.pointValue}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No rewards yet</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="w-full gradientBg border-0 shadow-none rounded-full text-white cursor-pointer py-2 px-4 text-center transition-transform duration-150 active:scale-95">
          <span className="font-medium text-sm bg-gradient-to-r from-[#6250E9] to-[#69BDFF] bg-clip-text text-transparent">
            View All
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
