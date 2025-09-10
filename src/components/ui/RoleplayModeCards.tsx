import { Card, CardContent } from "@/components/ui/card";

export function RoleplayModeCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {[1, 2, 3].map((index) => (
        <Card
          key={index}
          className="bg-white border border-gray-200 hover:shadow-md transition-shadow"
        >
          <CardContent className="p-2">
            <div className="text-center">
              <h3 className="text-md font-bold text-gray-800 mt-2">
                Roleplay Mode
              </h3>
              <div className="space-x-4 p-4 flex items-center justify-center">
                <div className="text-lg bg-[#F8F9FD] px-6 py-4 rounded-lg">
                  <span className="text-[#2DE000] font-bold">04</span>
                  <br />
                  <span className="text-sm">Completed</span>
                </div>
                <div className="text-lg bg-[#F8F9FD] px-6 py-4 rounded-lg">
                  <span className="text-[#2DE000] font-bold">04</span>
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
