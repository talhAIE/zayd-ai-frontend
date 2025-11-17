import { Card, CardContent } from "./card";

const DashboardProfile = (user: any) => {
  return (
    <Card className="w-full my-10 md:my-0 bg-slate-50 pt-[7px] pb-[7px]">
      <CardContent className="p-4">
        {/* Centered Profile Picture with Gradient Border */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div
              className="w-32 h-32 rounded-full p-1"
              style={{
                background: "linear-gradient(to bottom, #5DA0FE8C, #00FFF230)",
              }}
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-white">
                <img
                  src="https://www.gravatar.com/avatar/?d=mp"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Centered Name */}
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-black">
            {user?.user?.firstName + " " + user?.user?.lastName}
          </h3>
        </div>

        {/* Class Field */}
        <div className="mb-3">
          <div className="bg-gray-200 rounded-lg px-4 py-2.5 flex items-center justify-between">
            <span className="text-sm text-gray-700">Class:</span>
            <span className="text-sm font-bold text-black">
              {user?.user?.class || "M"}
            </span>
          </div>
        </div>

        {/* School Name Field */}
        <div>
          <div className="bg-gray-200 rounded-lg px-4 py-2.5 flex items-center justify-between">
            <span className="text-sm text-gray-700">School Name:</span>
            <span className="text-sm font-bold text-black">
              {user?.user?.schoolName || "Bav ai - american"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardProfile;
