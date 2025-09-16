import { Card, CardHeader } from "@/components/ui/card";
import { CertificateIcon } from "@/components/Icons";
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

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader className="pb-4">
        <Tabs defaultValue="certifications" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="certifications"
              className="text-xs sm:text-sm truncate"
            >
              Certifications
            </TabsTrigger>
            <TabsTrigger
              value="rewards"
              className="text-xs sm:text-sm truncate"
            >
              Rewards
            </TabsTrigger>
          </TabsList>

          <TabsContent value="certifications" className="mt-4">
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {achievements && achievements.length > 0 ? (
                achievements
                  .filter(
                    (achievement) => achievement.category === "certificate"
                  )
                  .slice(0, 3)
                  .map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-12 h-12 rounded flex-shrink-0 flex items-center justify-center">
                        <CertificateIcon className="w-12 h-12" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500">
                          Awarded {formatDate(achievement.awardedAt)}
                        </p>
                        <p className="mt-1 text-sm font-bold text-gray-800 break-words">
                          {achievement.name}
                        </p>
                        <p className="text-xs text-gray-600 break-words leading-relaxed">
                          {achievement.description}
                        </p>
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
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {achievements && achievements.length > 0 ? (
                achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {achievement.category === "certificate" ? (
                      <div className="w-12 h-12 rounded flex-shrink-0 flex items-center justify-center">
                        <CertificateIcon className="w-12 h-12" />
                      </div>
                    ) : (
                      <img
                        src={achievement.iconUrl}
                        alt={achievement.name}
                        className="w-12 h-12 rounded object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 break-words">
                        {achievement.name}
                      </p>
                      <p className="text-xs text-gray-600 break-words leading-relaxed">
                        {achievement.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {achievement.category} •{" "}
                        {formatDate(achievement.awardedAt)}
                      </p>
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
    </Card>
  );
}
