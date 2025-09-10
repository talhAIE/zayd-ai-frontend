import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const certificates = [
  {
    id: 1,
    title: "Deep Learning Certificate",
    issueDate: "Issue Jun 2025",
    thumbnail: "https://via.placeholder.com/60x40/4F46E5/ffffff?text=이런이이",
  },
  {
    id: 2,
    title: "Deep Learning Certificate",
    issueDate: "Issue Jun 2025",
    thumbnail: "https://via.placeholder.com/60x40/000000/ffffff?text=지식채널e",
  },
  {
    id: 3,
    title: "Deep Learning Certificate",
    issueDate: "Issue Jun 2025",
    thumbnail: "https://via.placeholder.com/60x40/000000/ffffff?text=지식채널e",
  },
];

export function CertificationsSection() {
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
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <img
                    src={cert.thumbnail}
                    className="w-15 h-10 rounded object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">{cert.issueDate}</p>
                    <p className="mt-3 text-sm font-bold text-gray-800 truncate">
                      {cert.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rewards" className="mt-4">
            <div className="text-center py-8 text-gray-500">
              <p>No rewards yet</p>
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
