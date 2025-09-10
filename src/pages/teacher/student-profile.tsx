import { useEffect } from "react";
import TeacherDashboardProfile from "@/components/ui/TeacherDashboardProfile";
import { RevenueGraph } from "@/components/ui/RevenueGraph";
import { RoleplayModeCards } from "@/components/ui/RoleplayModeCards";
import { CertificationsSection } from "@/components/ui/CertificationsSection";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchDashboardData } from "@/redux/slices/dashboardSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export default function StudentProfile() {
  const myUser = localStorage.getItem("AiTutorUser");
  let parsedUser = JSON.parse(myUser || "{}");
  const currentUserId = parsedUser?.id;

  const dispatch = useAppDispatch();
  const { data, isLoading } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    if (currentUserId) {
      dispatch(fetchDashboardData(currentUserId));
    }
  }, [currentUserId, dispatch]);

  const user = data?.userInfo;

  return (
    <div className="min-h-screen p-4 border border-[var(--border-light)] rounded-3xl">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 md:gap-6">
          <div className="xl:col-span-3">
            {isLoading ? (
              <div className="border rounded-lg shadow p-4 bg-white">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-36" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ) : (
              <TeacherDashboardProfile user={user} />
            )}
          </div>

          <div className="xl:col-span-9 space-y-6">
            <RoleplayModeCards />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              <div className="lg:col-span-2">
                <RevenueGraph />
              </div>
              <div className="lg:col-span-1">
                <CertificationsSection />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
