import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchCourses, fetchAssignments } from '@/redux/slices/coursesSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Users,
  FileText,
  ChevronRight,
  Plus,
  Clipboard,
  Bell,
} from 'lucide-react';

export default function TeacherDashboard() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { courses, assignments, loading } = useAppSelector((state) => state.courses);

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchAssignments());
  }, [dispatch]);

  // Generate some dummy stats for the teacher
  const totalStudents = courses.reduce((sum, course) => sum + (course.students || 0), 0);
  const pendingReviews = 7; // Mock data
  const averageRating = 4.8; // Mock data

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--font-dark)]">
          Welcome back, {user?.username?.split(' ')[0] || 'Teacher'}
        </h1>
        <p className="text-[var(--font-light2)]">
          Here's an overview of your courses and teaching metrics.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[var(--font-light2)] text-sm">Active Courses</p>
                <h3 className="text-3xl font-bold text-[var(--font-dark)]">
                  {courses.length}
                </h3>
              </div>
              <div className="rounded-full w-12 h-12 flex items-center justify-center bg-[var(--primarybg)]/10">
                <BookOpen className="h-6 w-6 text-[var(--primarybg)]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[var(--font-light2)] text-sm">Total Students</p>
                <h3 className="text-3xl font-bold text-[var(--font-dark)]">
                  {totalStudents}
                </h3>
              </div>
              <div className="rounded-full w-12 h-12 flex items-center justify-center bg-[var(--primarybg)]/10">
                <Users className="h-6 w-6 text-[var(--primarybg)]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[var(--font-light2)] text-sm">Pending Reviews</p>
                <h3 className="text-3xl font-bold text-[var(--font-dark)]">
                  {pendingReviews}
                </h3>
              </div>
              <div className="rounded-full w-12 h-12 flex items-center justify-center bg-[var(--primarybg)]/10">
                <Clipboard className="h-6 w-6 text-[var(--primarybg)]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[var(--font-light2)] text-sm">Instructor Rating</p>
                <h3 className="text-3xl font-bold text-[var(--font-dark)]">
                  {averageRating}
                </h3>
              </div>
              <div className="rounded-full w-12 h-12 flex items-center justify-center bg-[var(--primarybg)]/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[var(--primarybg)]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses and Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Courses */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold">Your Courses</CardTitle>
                <div className="flex gap-2">
                  <Link to="/teacher/courses">
                    <Button variant="ghost" size="sm" className="gap-1">
                      View all <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/teacher/courses/new">
                    <Button size="sm" className="gap-1 bg-[var(--primarybg)] hover:bg-[var(--primarybg)]/90">
                      <Plus className="h-4 w-4" /> New Course
                    </Button>
                  </Link>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-6">
                  <div className="animate-pulse text-[var(--font-light2)]">Loading courses...</div>
                </div>
              ) : courses.length > 0 ? (
                <div className="space-y-6">
                  {courses.slice(0, 3).map((course) => (
                    <div key={course.id} className="flex space-x-4">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-[var(--font-dark)]">
                            {course.title}
                          </h3>
                          <Badge variant="outline">{course.students} Students</Badge>
                        </div>
                        <p className="text-sm text-[var(--font-light2)] mb-2">
                          {course.description.substring(0, 80)}...
                        </p>
                        <div className="flex justify-end">
                          <Link to={`/teacher/courses/${course.id}`}>
                            <Button size="sm" variant="outline">
                              Manage Course
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-[var(--font-light2)] mb-4">
                    You haven't created any courses yet.
                  </p>
                  <Link to="/teacher/courses/new">
                    <Button className="bg-[var(--primarybg)] hover:bg-[var(--primarybg)]/90">
                      Create Your First Course
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Notifications & To-Do */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
                <Button variant="ghost" size="sm" className="gap-1">
                  <Bell className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-1">
                  <div className="font-medium">New student enrolled</div>
                  <div className="text-sm text-[var(--font-light2)]">
                    Sarah Johnson joined "Web Development Masterclass"
                  </div>
                  <div className="text-xs text-[var(--font-light2)]">2 hours ago</div>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4 py-1">
                  <div className="font-medium">Assignment submissions</div>
                  <div className="text-sm text-[var(--font-light2)]">
                    5 new submissions for "JavaScript Basics Quiz"
                  </div>
                  <div className="text-xs text-[var(--font-light2)]">Yesterday</div>
                </div>
                
                <div className="border-l-4 border-yellow-500 pl-4 py-1">
                  <div className="font-medium">Course feedback</div>
                  <div className="text-sm text-[var(--font-light2)]">
                    New review for "Advanced Data Structures"
                  </div>
                  <div className="text-xs text-[var(--font-light2)]">2 days ago</div>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4 py-1">
                  <div className="font-medium">Course milestone</div>
                  <div className="text-sm text-[var(--font-light2)]">
                    "Introduction to Programming" reached 30 students
                  </div>
                  <div className="text-xs text-[var(--font-light2)]">3 days ago</div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-3">To-Do List</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 mr-2 rounded border-gray-300"
                    />
                    <span className="text-sm">Review 5 pending assignments</span>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 mr-2 rounded border-gray-300"
                    />
                    <span className="text-sm">Update course materials for Week 3</span>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 mr-2 rounded border-gray-300"
                    />
                    <span className="text-sm">Respond to student questions (3)</span>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 mr-2 rounded border-gray-300"
                    />
                    <span className="text-sm">Create new assignment for Data Structures</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Assignments */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold">Recent Assignments</CardTitle>
              <Link to="/teacher/assignments">
                <Button variant="ghost" size="sm" className="gap-1">
                  View all <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-6">
                <div className="animate-pulse text-[var(--font-light2)]">Loading assignments...</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-3 font-medium text-[var(--font-light2)]">Assignment</th>
                      <th className="text-left pb-3 font-medium text-[var(--font-light2)]">Course</th>
                      <th className="text-left pb-3 font-medium text-[var(--font-light2)]">Due Date</th>
                      <th className="text-left pb-3 font-medium text-[var(--font-light2)]">Submissions</th>
                      <th className="text-right pb-3 font-medium text-[var(--font-light2)]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.slice(0, 5).map((assignment) => {
                      const course = courses.find((c) => c.id === assignment.courseId);
                      return (
                        <tr key={assignment.id} className="border-b">
                          <td className="py-3">
                            <div className="font-medium">{assignment.title}</div>
                          </td>
                          <td className="py-3">
                            <div className="text-sm">{course?.title || 'Unknown Course'}</div>
                          </td>
                          <td className="py-3">
                            <div className="text-sm">{formatDate(assignment.dueDate)}</div>
                          </td>
                          <td className="py-3">
                            <Badge variant="outline">7/{course?.students || 0}</Badge>
                          </td>
                          <td className="py-3 text-right">
                            <Button size="sm" variant="ghost">
                              <FileText className="h-4 w-4 mr-2" /> View
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}