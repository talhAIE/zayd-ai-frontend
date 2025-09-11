// import { Badge } from "./badge";
import { Card, CardContent } from "./card";
import { Activity } from "lucide-react";

const TeacherDashboardProfile = (user: any) => {
  return (
    <Card className="w-full md:max-w-lg my-4 md:my-0 bg-slate-50 ">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4 rounded-3xl gradientBg ">
          <div className="flex items-center">
            <div className="relative p-12 ">
              <div className="absolute top-8 left-4 w-24 h-24 rounded-lg overflow-hidden">
                <img
                  src="https://www.gravatar.com/avatar/?d=mp"
                  alt="Profile"
                  className="w-full h-full object-cover border p-1 bg-white rounded-3xl"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-md font-bold">
              {user?.user?.firstName + " " + user?.user?.lastName}
            </h3>
          </div>
          <div className="space-y-3">
            {/* Grade Box */}
            <div className="flex items-center justify-between rounded-full p-3 border border-gray-200">
              <span className="font-medium text-sm text-[#6250E9]">
                Grade
              </span>
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-full px-4 py-1">
                <span className="font-medium text-sm bg-gradient-to-r from-[#6250E9] to-[#69BDFF] bg-clip-text text-transparent">
                  9
                </span>
              </div>
            </div>

            {/* Level Box */}
            <div className="flex items-center justify-between rounded-full p-3 border border-gray-200">
              <span className="font-medium text-sm text-[#6250E9]">
                Level
              </span>
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-full px-4 py-1">
                <span className="font-medium text-sm bg-gradient-to-r from-[#6250E9] to-[#69BDFF] bg-clip-text text-transparent">
                  5
                </span>
              </div>
            </div>

            {/* Total Points Box */}
            <div className="flex items-center justify-between rounded-full p-3 border border-gray-200">
              <span className="font-medium text-sm text-[#6250E9]">
                Total Points
              </span>
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-full px-4 py-1">
                <span className="font-medium text-sm bg-gradient-to-r from-[#6250E9] to-[#69BDFF] bg-clip-text text-transparent">
                  9
                </span>
              </div>
            </div>

            <div className="relative bg-[#065FF014] rounded-2xl p-6 border border-gray-200">
              <div className="absolute top-4 left-4 w-14 h-14 bg-white rounded-2xl flex items-center justify-center">
                <Activity className="w-8 h-8 text-[#065FF0]" />
              </div>

              <div className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-blue-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </div>

              <div className="flex items-center justify-center mt-16">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      Current
                    </div>
                    <div className="text-2xl font-bold text-blue-600">20</div>
                  </div>

                  <div className="w-px h-12 bg-gray-300"></div>

                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      Longest
                    </div>
                    <div className="text-2xl font-bold text-blue-600">30</div>
                  </div>

                  <div className="w-px h-12 bg-gray-300"></div>

                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      Total
                    </div>
                    <div className="text-2xl font-bold text-blue-600">100</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeacherDashboardProfile;
