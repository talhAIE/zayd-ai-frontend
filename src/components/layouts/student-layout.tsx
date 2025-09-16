import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useAppSelector } from '@/redux/hooks';
import { Link, useLocation } from "react-router-dom";
import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import learningMode from "@/assets/images/sidebar/learningMode.png";
import learderBoard from "@/assets/images/sidebar/leaderBoard.png";
const LearningModeIcon = () => (
  <img src={learningMode} alt="Learning Mode" className="h-5 w-5" />
);
const LeaderboardIcon = () => (
  <img src={learderBoard} alt="Learning Mode" className="h-5 w-5" />
);

import {
  LayoutDashboard,
  // BookOpen,
  // BarChart2,
  // LogOut,
  // Bell,
  Menu,
  X,
  // Brain,
  ChevronLeft,
  // Bell,
  // Settings,
  // ChevronDown,
  // Languages,
  LogOut,
} from "lucide-react";
// import { ThemeToggle } from '@/components/theme-toggle';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/slices/authSlice";
import { toast } from "sonner";
import StudentReportModal from "../ui/StudentReportModal";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { useDispatch } from 'react-redux';
// import { logout } from '@/redux/slices/authSlice';

interface StudentLayoutProps {
  children: ReactNode;
}

export function StudentLayout({ children }: StudentLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: studentProfileData } = useAppSelector(
    (state) => state.studentProfile
  );

  const pathSegments = location.pathname.split("/").filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1] || "";

  // Capitalize each word
  // const formattedTitle = lastSegment
  //   .split("-")
  //   .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  //   .join(" ");

  const decodeAndFormatTitle = (text: string) => {
    return decodeURIComponent(text) // Decode %20 etc.
      .replace(/[-_]+/g, " ") // Replace dashes and underscores with space
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
      .join(" ");
  };

  let formattedTitle;
  if (location.pathname.startsWith("/teacher/student-profile/")) {
    formattedTitle = "Student Profile";
  } else {
    formattedTitle = decodeAndFormatTitle(lastSegment).split(":")[0];
  }

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (user?.role !== "student") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    await dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleViewReport = () => {
    setIsReportModalOpen(true);
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
  };

  const sidebarItems = [
    { path: "/student/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    {
      path: "/student/learning-modes",
      icon: LearningModeIcon,
      label: "Learning Modes",
    },
    { path: "/student/achievements", icon: Gift, label: "Achievements" },
    {
      path: "/student/leaderboard",
      icon: LeaderboardIcon,
      label: "Leaderboard",
    },
    // { path: '/student/support', icon: BookOpen, label: 'Support' },
  ];

  return (
    <div className="flex min-h-screen bg-background ">
      <div
        className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          className="fixed inset-0 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        ></div>
        <nav className="fixed top-0 left-0 bottom-0 w-72 bg-[#065FF0] p-8 rounded-3xl my-6">
          <div className="flex items-center justify-between mb-8 text-white">
            <Link
              to="/student/dashboard"
              className="flex items-center gap-2 text-2xl font-bold"
            >
              AI Tutor.
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="text-white hover:bg-blue-600"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <ScrollArea className="h-[calc(100vh-8rem)] mt-16">
            <div className="space-y-8">
              {sidebarItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-md font-bold transition-colors ${
                    isActive(item.path)
                      ? "bg-[#065FF0]/10 text-white"
                      : "text-white hover:bg-white/10 hover:text-white"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5 text-white font-bold" />
                  {item.label}
                </Link>
              ))}
            </div>
          </ScrollArea>
        </nav>
      </div>
      {/* )} */}

      {/* Sidebar for desktop */}
      <nav className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-[#065FF0] my-6 rounded-3xl mr-2">
        <div className="p-6">
          <Link
            to="/student/dashboard"
            className="flex items-center gap-2 text-2xl font-bold text-white"
          >
            AI Tutor.
          </Link>
        </div>
        <ScrollArea className="flex-1 px-4 mt-16">
          <div className="space-y-8">
            {sidebarItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-md font-medium transition-colors ${
                  isActive(item.path)
                    ? "bg-white/10 text-white font-bold"
                    : "text-white hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon className="h-5 w-5 font-bold" />
                {item.label}
              </Link>
            ))}
          </div>
        </ScrollArea>
      </nav>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top header */}
        <header className="sticky top-0 z-10 flex lg:hidden items-center justify-between h-16 px-4 bg-background lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-md font-medium tracking-tight">
            {formattedTitle}
          </h1>

          <Button
            onClick={handleLogout}
            size="sm"
            variant="ghost"
            className="rounded-full bg-[#F8F9FD] h-10 w-10 p-0 flex items-center justify-center"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </header>
        <header className="sticky top-0 z-10 hidden lg:flex items-center justify-between h-16 bg-background py-10 px-8 ">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="mr-2"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">{formattedTitle}</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* <Button size="sm" variant="ghost" className="rounded-full bg-[#F8F9FD] h-10 w-10 p-0 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </Button> */}

            {/* User Info */}
            {/* <div className="flex items-center gap-2 bg-[#F8F9FD] px-3 py-1 rounded-full h-10">
              
              <img
                src="https://i.pravatar.cc/30"
                alt="user"
                className="w-7 h-7 rounded-full object-cover"
              />
              <div className="flex flex-col justify-center">
                <span className="text-xs font-semibold leading-tight">hanry</span>
                <span className="text-xs text-gray-500 leading-tight">hanry463@gmail.com</span>
              </div>
              <Button size="icon" variant="ghost" className="rounded-full p-0 h-6 w-6 ml-1">
                <Settings className="w-4 h-4" />
              </Button>
            </div> */}

            {/* Language */}
            {/* <Button variant="ghost" className="rounded-full bg-[#F8F9FD] h-10 flex items-center px-3 py-0">
              <Languages className="w-5 h-5" />
              <ChevronDown className="w-4 h-4 ml-1" />
            </Button> */}

            {/* Logout */}
            <Button
              onClick={handleLogout}
              size="sm"
              variant="ghost"
              className="rounded-full bg-[#F8F9FD] h-10 w-10 p-0 flex items-center justify-center"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          <div className="p-4 lg:p-8">{children}</div>
        </main>
      </div>

      <StudentReportModal
        isOpen={isReportModalOpen}
        onClose={handleCloseReportModal}
        studentData={studentProfileData}
      />
    </div>
  );
}
