import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import DashboardBadge from "@/assets/svgs/dashboard_badge.svg";
import TeachBird from "@/assets/svgs/dashboardTeach.svg";
import DashboardProfile from "@/components/ui/DashboardProfile";
import PerformanceGraph from "@/components/ui/PerformanceGraph";
// import { BarChartComponent } from '@/components/ui/barChartComponent';
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchDashboardData } from "@/redux/slices/dashboardSlice";
import { Skeleton } from "@/components/ui/skeleton";

export default function LanguageLearningDashboard() {
  const myUser = localStorage.getItem("AiTutorUser");
  let parsedUser = JSON.parse(myUser || "{}");
  const currentUserId = parsedUser?.id;

  const dispatch = useAppDispatch();
  const { data, isLoading, error } = useAppSelector((state) => state.dashboard);
  const [timeFilter, setTimeFilter] = useState<"weekly" | "monthly">("weekly");

  useEffect(() => {
    // Only fetch if we have a valid user ID
    if (currentUserId) {
      dispatch(fetchDashboardData({ userId: currentUserId, timeFilter }));
    }
  }, [currentUserId, timeFilter, dispatch]);

  const user = data?.userInfo;
  const usageRecords = data?.usageRecords;
  const assessmentGraphData = data?.assessmentGraphData || [];

  // Show error state if there's an error
  if (error) {
    return (
      <div className="flex flex-col border border-[var(--border-light)] rounded-3xl p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-medium text-red-600 mb-2">
              Error Loading Dashboard
            </h3>
            <p className="text-sm text-gray-500">{error}</p>
            <button
              onClick={() =>
                currentUserId &&
                dispatch(
                  fetchDashboardData({ userId: currentUserId, timeFilter })
                )
              }
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show message if no user ID
  if (!currentUserId) {
    return (
      <div className="flex flex-col border border-[var(--border-light)] rounded-3xl p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No User Found
            </h3>
            <p className="text-sm text-gray-500">
              Please log in to view your dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col border border-[var(--border-light)] rounded-3xl p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 md:gap-6 mb-6 w-full mx-auto items-start">
        {isLoading ? (
          // Profile Skeleton aligned with DashboardProfile layout
          <Card className="col-span-1 w-full my-10 md:my-0 bg-slate-50 pt-[7px] pb-[7px] shadow-sm border-none">
            <CardContent className="p-4">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div
                    className="w-32 h-32 rounded-full p-1"
                    style={{
                      background:
                        "linear-gradient(to bottom, #5DA0FE8C, #00FFF230)",
                    }}
                  >
                    <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                      <Skeleton className="w-full h-full rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mb-4">
                <Skeleton className="h-6 w-40 mx-auto" />
              </div>

              <div className="mb-3">
                <div className="bg-gray-200 rounded-lg px-4 py-2.5 flex items-center justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-10" />
                </div>
              </div>

              <div>
                <div className="bg-gray-200 rounded-lg px-4 py-2.5 flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <DashboardProfile user={user} />
        )}

        {/* Three Cards: Streak, Daily Usage, and Longest Streak */}
        {isLoading ? (
          // Cards Skeleton
          <div
            className="col-span-1 grid grid-cols-2 grid-rows-2 gap-5"
            style={{ gridTemplateRows: "auto auto" }}
          >
            <Card
              className="text-white shadow-sm rounded-2xl overflow-hidden border-0 self-start"
              style={{
                background: "linear-gradient(to bottom, #6EBDFB, #5C9DFF)",
              }}
            >
              <CardContent className="p-4 flex flex-col">
                <div className="flex items-start justify-between mb-auto">
                  <Skeleton className="h-4 w-16 bg-white/20" />
                  <Skeleton className="h-7 w-7 rounded-full bg-white/20" />
                </div>
                <div className="flex items-end justify-between mt-[1rem]">
                  <Skeleton className="h-10 w-20 bg-white/20" />
                  <Skeleton className="h-12 w-12 rounded-xl bg-white/20" />
                </div>
              </CardContent>
            </Card>
            <Card
              className="text-white shadow-sm rounded-2xl overflow-hidden border-0 self-start"
              style={{
                background: "linear-gradient(to bottom, #6EBDFB, #5C9DFF)",
              }}
            >
              <CardContent className="p-4 flex flex-col">
                <div className="flex items-start justify-between mb-auto">
                  <Skeleton className="h-4 w-20 bg-white/20" />
                  <Skeleton className="h-7 w-7 rounded-full bg-white/20" />
                </div>
                <div className="flex items-end justify-between mt-[1rem]">
                  <Skeleton className="h-10 w-20 bg-white/20" />
                  <Skeleton className="h-12 w-12 rounded-xl bg-white/20" />
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm col-span-2 rounded-2xl overflow-hidden border-0 relative bg-[#89CBFC2B]">
              <CardContent className="p-4 flex flex-row items-center gap-4 relative">
                <div className="flex flex-col items-start gap-2 flex-shrink-0">
                  <Skeleton className="w-20 h-20 rounded-lg" />
                  <div className="flex flex-col gap-0.5">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
                <div className="flex-1 flex items-center justify-center relative mt-20 ms-4">
                  <Skeleton className="h-8 w-16" />
                </div>
                <div className="flex-shrink-0 flex items-end justify-end -mr-14">
                  <Skeleton className="h-[9.5rem] w-32" />
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div
            className="col-span-1 grid grid-cols-2 grid-rows-2 gap-5"
            style={{ gridTemplateRows: "auto auto" }}
          >
            <Card
              className="text-white shadow-sm rounded-2xl overflow-hidden border-0 self-start"
              style={{
                background: "linear-gradient(to bottom, #6EBDFB, #5C9DFF)",
              }}
            >
              <CardContent className="p-4 flex flex-col">
                {/* Top Row: Streak label and Arrow icon */}
                <div className="flex items-start justify-between mb-auto">
                  <h4 className="text-sm font-medium text-white">Streak</h4>
                  <div className="w-7 h-7 rounded-full bg-white bg-opacity-10 flex items-center justify-center flex-shrink-0">
                    <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>

                {/* Bottom Row: Number and Flame icon */}
                <div className="flex items-end justify-between mt-[1rem]">
                  <div className="text-4xl font-bold text-white leading-none">
                    {data?.streak ?? 0}
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-white bg-opacity-10 flex items-center justify-center flex-shrink-0">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 h-8"
                    >
                      <path
                        d="M19.9998 9.61542C20.769 12.6923 22.3075 15.1923 24.6152 17.1154C26.9228 19.0385 28.0767 21.1539 28.0767 23.4616C28.0767 25.6037 27.2257 27.6581 25.711 29.1728C24.1963 30.6875 22.1419 31.5385 19.9998 31.5385C17.8576 31.5385 15.8032 30.6875 14.2885 29.1728C12.7738 27.6581 11.9229 25.6037 11.9229 23.4616C11.9229 22.2133 12.3277 20.9987 13.0767 20C13.0767 20.7651 13.3806 21.4988 13.9216 22.0398C14.4626 22.5807 15.1963 22.8846 15.9613 22.8846C16.7264 22.8846 17.4601 22.5807 18.001 22.0398C18.542 21.4988 18.8459 20.7651 18.8459 20C18.8459 17.6923 17.1152 16.5385 17.1152 14.2308C17.1152 12.6923 18.0767 11.1539 19.9998 9.61542Z"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className="text-white shadow-sm rounded-2xl overflow-hidden border-0 self-start"
              style={{
                background: "linear-gradient(to bottom, #6EBDFB, #5C9DFF)",
              }}
            >
              <CardContent className="p-4 flex flex-col">
                {/* Top Row: Daily Usage label and Arrow icon */}
                <div className="flex items-start justify-between mb-auto">
                  <h4 className="text-sm font-medium text-white whitespace-nowrap">
                    Daily Usage
                  </h4>
                  <div className="w-7 h-7 rounded-full bg-white bg-opacity-10 flex items-center justify-center flex-shrink-0">
                    <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>

                {/* Bottom Row: Number and Activity icon */}
                <div className="flex items-end justify-between mt-[1rem]">
                  <div className="text-4xl font-bold text-white leading-none">
                    {data?.dailyUsage ?? 0}
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-white bg-opacity-10 flex items-center justify-center flex-shrink-0">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 h-8"
                    >
                      <path
                        d="M31.5383 20H28.6768C28.1725 19.9989 27.6818 20.1631 27.2796 20.4673C26.8775 20.7715 26.586 21.1991 26.4499 21.6846L23.7383 31.3308C23.7209 31.3907 23.6844 31.4433 23.6345 31.4808C23.5846 31.5182 23.5238 31.5385 23.4614 31.5385C23.399 31.5385 23.3383 31.5182 23.2883 31.4808C23.2384 31.4433 23.202 31.3907 23.1845 31.3308L16.8153 8.66924C16.7978 8.60932 16.7614 8.55669 16.7114 8.51924C16.6615 8.48179 16.6008 8.46155 16.5383 8.46155C16.4759 8.46155 16.4152 8.48179 16.3653 8.51924C16.3153 8.55669 16.2789 8.60932 16.2614 8.66924L13.5499 18.3154C13.4143 18.799 13.1246 19.2252 12.7247 19.5293C12.3249 19.8333 11.8368 19.9986 11.3345 20H8.46143"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm col-span-2 rounded-2xl overflow-hidden border-0 relative bg-[#89CBFC2B]">
              <style>{`
                @media (min-width: 545px) and (max-width: 1023px) {
                  .streak-badge-container {
                    flex-direction: row !important;
                    align-items: center !important;
                    gap: 1rem !important;
                  }
                  .streak-badge-wrapper {
                    width: 10rem !important;
                    height: 10rem !important;
                    flex-shrink: 0;
                  }
                  .streak-badge-img {
                    width: 100% !important;
                    height: 100% !important;
                  }
                  .streak-text-overlay {
                    display: none !important;
                  }
                  .streak-text-below {
                    display: flex !important;
                    flex-direction: column;
                    gap: 0.125rem;
                  }
                  .streak-text-title {
                    font-size: 2rem !important;
                    line-height: 2.75rem !important;
                  }
                  .streak-text-subtitle {
                    font-size: 1rem !important;
                    line-height: 1rem !important;
                  }
                  .streak-number-container {
                    margin-top: 0 !important;
                    margin-left: 0 !important;
                  }
                  .streak-number-value {
                    font-size: 3rem !important;
                    line-height: 1 !important;
                  }
                  .streak-bird-container {
                    margin-right: -5rem;
                    margin-bottom: -3rem;
                  }
                  .streak-bird-img {
                    height: 15rem !important;
                  }
                }
              `}</style>
              <CardContent className="p-4 flex flex-row items-center gap-4 relative">
                {/* Left Section: Badge and Text */}
                <div className="flex flex-col items-start gap-2 flex-shrink-0 streak-badge-container">
                  {/* Badge Icon - Made bigger */}
                  <div className="flex-shrink-0 streak-badge-wrapper">
                    <img
                      src={DashboardBadge}
                      alt="Badge"
                      className="w-20 h-20 streak-badge-img"
                    />
                    {/* Text overlapping the badge - Hidden in media query */}
                    <div className="hidden streak-text-overlay">
                      <h4
                        className="text-lg font-bold leading-tight"
                        style={{
                          background:
                            "linear-gradient(135deg, #6250E9, #69BDFF)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        Longest Streak
                      </h4>
                      <p className="text-[10px] text-gray-500 leading-tight">
                        here is the level of your progress
                      </p>
                    </div>
                  </div>

                  {/* Text Section - Shown to the right of badge in media query */}
                  <div className="flex flex-col gap-0.5 streak-text-below">
                    <h4
                      className="text-lg font-bold leading-tight streak-text-title"
                      style={{
                        background: "linear-gradient(135deg, #6250E9, #69BDFF)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      Longest Streak
                    </h4>
                    <p className="text-[10px] text-gray-500 leading-tight streak-text-subtitle">
                      here is the level of your progress
                    </p>
                  </div>
                </div>

                {/* Center Section: Streak Number */}
                <div className="flex-1 flex items-center justify-center relative mt-20 ms-4 streak-number-container">
                  <div
                    className="absolute w-14 h-10 rounded-full opacity-10"
                    style={{ backgroundColor: "#9E9E9E" }}
                  />
                  <div
                    className="text-2xl font-bold leading-none relative z-10 streak-number-value"
                    style={{
                      background: "linear-gradient(135deg, #6250E9, #69BDFF)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {data?.longestStreak ?? 0}
                  </div>
                </div>

                {/* Right Section: Bird Illustration - Made bigger */}
                <div className="flex-shrink-0 flex items-end justify-end -mr-14 streak-bird-container">
                  <img
                    src={TeachBird}
                    alt="Bird"
                    className="h-[9.5rem] w-auto object-contain streak-bird-img"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {isLoading ? (
          // Calendar Skeleton
          <div className="col-span-1 border rounded-lg shadow p-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <div className="grid grid-cols-7 gap-2 mt-2">
                {Array.from({ length: 7 }).map((_, index) => (
                  <Skeleton key={index} className="h-4 w-8" />
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2 mt-4">
                {Array.from({ length: 35 }).map((_, index) => (
                  <Skeleton key={index} className="h-10 w-10 rounded-md" />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 sm:mt-0 col-span-1 border rounded-lg shadow">
            <Calendar mode="single" usageRecords={usageRecords} />
          </div>
        )}
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completed Topics Section */}
        <Card className="shadow-md border-slate-200">
          <style>{`
            @media (max-width: 457px) and (min-width: 412px) {
              .modes-link {
                width: 8rem !important;
              }
            }

            @media (max-width: 412px) and (min-width: 375px) {
              .modes-link {
                width: 9rem !important;
              }
            }
            
            @media (max-width: 375px) {
              .modes-link {
                width: 12rem !important;
              }
            }
          `}</style>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                ) : (
                  <>
                    <CardTitle className="text-xl md:text-2xl font-bold text-slate-800">
                      Completed Topics
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      Your progress across learning modules
                    </CardDescription>
                  </>
                )}
              </div>

              {isLoading ? (
                <Skeleton className="h-8 w-24 rounded-full" />
              ) : (
                <Link
                  to="/student/learning-modes"
                  className="flex items-center gap-1 px-4 py-2 rounded-full bg-[#F8F8F8] text-blue-600 hover:text-blue-700 font-medium text-sm modes-link"
                >
                  {data?.completedTopics
                    ? Object.keys(data.completedTopics).length
                    : 0}{" "}
                  modes <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-300 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-12" />
                  </div>
                ))}
              </div>
            ) : data?.completedTopics &&
              Object.keys(data.completedTopics).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(data.completedTopics).map(([topic, count]) => (
                  <div
                    key={topic}
                    className="flex items-center justify-between p-4 rounded-lg border border-[#F4F4F4] bg-gradient-to-r from-[#89cafc27] to-[#FFFFFF]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 relative">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10 9L7 12L10 15"
                            stroke="#065FF0"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M14 15L17 12L14 9"
                            stroke="#065FF0"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M2.99218 16.3419C3.13922 16.7129 3.17195 17.1193 3.08618 17.5089L2.02118 20.7989C1.98686 20.9658 1.99574 21.1386 2.04696 21.3011C2.09817 21.4635 2.19004 21.6102 2.31385 21.7272C2.43765 21.8442 2.58929 21.9276 2.75438 21.9696C2.91947 22.0115 3.09254 22.0106 3.25718 21.9669L6.67018 20.9689C7.0379 20.896 7.41871 20.9279 7.76918 21.0609C9.90457 22.0582 12.3235 22.2691 14.5993 21.6567C16.8751 21.0442 18.8614 19.6476 20.2079 17.7133C21.5543 15.779 22.1743 13.4313 21.9585 11.0845C21.7427 8.73763 20.7049 6.54241 19.0282 4.88613C17.3516 3.22986 15.1439 2.21898 12.7946 2.03183C10.4452 1.84469 8.10531 2.49332 6.18762 3.86328C4.26993 5.23323 2.89771 7.23648 2.31307 9.51958C1.72843 11.8027 1.96895 14.2189 2.99218 16.3419Z"
                            stroke="#065FF0"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-800">
                          {topic
                            .split("-")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {count} completed {count === 1 ? "item" : "items"}
                        </p>
                      </div>
                    </div>
                    <div className="text-blue-600 font-bold text-lg">
                      {count}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-slate-500 text-sm py-8">
                No completed topics yet. Keep learning and your progress will
                show up here!
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Performance Section */}
        <PerformanceGraph
          assessmentGraphData={assessmentGraphData}
          timeFilter={timeFilter}
          onTimeFilterChange={setTimeFilter}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
