import { Routes, Route, Navigate } from "react-router-dom";
// import { useAppSelector } from '@/redux/hooks';

// Layouts
import { StudentLayout } from "@/components/layouts/student-layout";
import { TeacherLayout } from "@/components/layouts/teacher-layout";

// Public Pages
import Main from "@/pages/public/Main";
import MainChinese from "@/pages/public/chinese/Main";
import ContactUs from "@/pages/public/contact-us";
import ChineseContactUs from "@/pages/public/chinese/ChineseContactUs";

// Student Pages
import LearningModes from "@/pages/student/learning-modes";
import StudentDashboard from "@/pages/student/dashboard";

// Teacher Pages
import TeacherDashboard from "@/pages/teacher/dashboard";
import StudentProfile from "@/pages/teacher/student-profile";

// Auth Pages
// import { AuthLayout } from "@/components/layouts/auth-layout";
import LoginPage from "@/pages/auth/login";
import ChatModeTopics from "@/pages/student/topics/ChatModeTopics";
import PhotoModeTopics from "@/pages/student/topics/PhotoModeTopics";
import DebateModeTopics from "@/pages/student/topics/DebateModeTopics";
import Leaderboard from "@/pages/student/Leaderboard";
import Chat from "@/pages/student/ChatPage";
import Rewards from "@/pages/student/Rewards";
import ReadingModeTopics from "@/pages/student/topics/ReadingModeTopics";
import RolePlayModeTopics from "@/pages/student/topics/RolePlayModeTopics";
import ListeningModeTopics from "@/pages/student/topics/ListeningModeTopics";
import CurriculumModeTopics from "@/pages/student/topics/CurriculumModeTopics";
import ChapterTopics from "@/pages/student/topics/ChapterTopics";

const AppRoutes = () => {
  // const { user } = useAppSelector((state) => state.auth);

  // Protected route component for students
  const StudentRoute = ({ children }: { children: JSX.Element }) => {
    // if (!isAuthenticated) {
    //   return <Navigate to="/login" replace />;
    // }

    // if (user?.role !== 'student') {
    //   return <Navigate to="/" replace />;
    // }

    return children;
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Main />} />
      <Route path="/chinese" element={<MainChinese />} />
      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/chinese/contact-us" element={<ChineseContactUs />} />
      <Route
        path="/teacher/dashboard"
        element={
          <TeacherLayout>
            <TeacherDashboard />
          </TeacherLayout>
        }
      />
      <Route
        path="/teacher/student-profile/:studentId"
        element={
          <TeacherLayout>
            <StudentProfile />
          </TeacherLayout>
        }
      />
      <Route
        path="/login"
        element={
          // <AuthLayout>
          <LoginPage />
          // </AuthLayout>
        }
      />
      {/* <Route
        path="/signup"
        element={
          <AuthLayout>
            <SignupPage />
          </AuthLayout>
        }
      /> */}

      {/* Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <StudentRoute>
            <StudentLayout>
              <StudentDashboard />
            </StudentLayout>
          </StudentRoute>
        }
      />

      <Route
        path="/student/achievements"
        element={
          <StudentRoute>
            <StudentLayout>
              <Rewards />
            </StudentLayout>
          </StudentRoute>
        }
      />

      <Route
        path="/student/learning-modes"
        element={
          <StudentRoute>
            <StudentLayout>
              <LearningModes />
            </StudentLayout>
          </StudentRoute>
        }
      />
      <Route
        path="/student/learning-modes"
        element={
          <StudentRoute>
            <StudentLayout>
              <LearningModes />
            </StudentLayout>
          </StudentRoute>
        }
      />
      <Route
        path="/student/leaderboard"
        element={
          <StudentRoute>
            <StudentLayout>
              <Leaderboard />
            </StudentLayout>
          </StudentRoute>
        }
      />
      <Route
        path="/student/learning-modes/chat-mode"
        element={
          <StudentRoute>
            <StudentLayout>
              <ChatModeTopics />
            </StudentLayout>
          </StudentRoute>
        }
      />
      <Route
        path="/student/learning-modes/photo-mode"
        element={
          <StudentRoute>
            <StudentLayout>
              <PhotoModeTopics />
            </StudentLayout>
          </StudentRoute>
        }
      />
      <Route
        path="/student/learning-modes/reading-mode"
        element={
          <StudentRoute>
            <StudentLayout>
              <ReadingModeTopics />
            </StudentLayout>
          </StudentRoute>
        }
      />
      <Route
        path="/student/learning-modes/roleplay-mode"
        element={
          <StudentRoute>
            <StudentLayout>
              <RolePlayModeTopics />
            </StudentLayout>
          </StudentRoute>
        }
      />
      <Route
        path="/student/learning-modes/listening-mode"
        element={
          <StudentRoute>
            <StudentLayout>
              <ListeningModeTopics />
            </StudentLayout>
          </StudentRoute>
        }
      />
      <Route
        path="/student/learning-modes/debate-mode"
        element={
          <StudentRoute>
            <StudentLayout>
              <DebateModeTopics />
            </StudentLayout>
          </StudentRoute>
        }
      />
      <Route
        path="/student/learning-modes/curriculum-mode"
        element={
          <StudentRoute>
            <StudentLayout>
              <CurriculumModeTopics />
            </StudentLayout>
          </StudentRoute>
        }
      />
      <Route
        path="/student/learning-modes/curriculum-mode/chapter/:chapterId"
        element={
          <StudentRoute>
            <StudentLayout>
              <ChapterTopics />
            </StudentLayout>
          </StudentRoute>
        }
      />
      <Route
        path="/student/learning-mode/:topicId/:topicName"
        element={
          <StudentRoute>
            <StudentLayout>
              <Chat />
            </StudentLayout>
          </StudentRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
