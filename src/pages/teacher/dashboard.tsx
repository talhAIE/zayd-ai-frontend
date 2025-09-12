import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Loader2, Eye } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchTeacherData } from "@/redux/slices/teacherSlice";

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { students, isLoading, error } = useAppSelector(
    (state) => state.teacher
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [performanceFilter, setPerformanceFilter] = useState("all");
  const [rankingFilter, setRankingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    grade: true,
    cefrLevel: true,
    streak: true,
    usage: true,
    totalPoints: true,
    completedTopics: true,
  });

  const columnOptions = [
    { key: "grade", label: "Grade" },
    { key: "cefrLevel", label: "CEFR Level" },
    { key: "streak", label: "Streak" },
    { key: "usage", label: "Usage" },
    { key: "totalPoints", label: "Total Points" },
    { key: "completedTopics", label: "Completed Topics" },
  ];

  const toggleColumn = (columnKey: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey as keyof typeof prev],
    }));
  };

  const myUser = localStorage.getItem("AiTutorUser");
  const parsedUser = JSON.parse(myUser || "{}");
  const teacherId = parsedUser?.id;

  useEffect(() => {
    if (teacherId) {
      dispatch(fetchTeacherData(teacherId));
    }
  }, [teacherId, dispatch]);

  const transformedStudents = students.map((student) => ({
    id: student.id,
    name: student.studentName,
    grade: student.grade,
    cefrLevel: student.cefrLevel,
    streak: student.currentStreak,
    usage: student.usage,
    totalPoints: student.totalPoints,
    completedTopics: student.completedTopics,
  }));

  const studentsData = transformedStudents;

  const filteredStudents = studentsData.filter((student) => {
    const matchesSearch = student.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSection =
      sectionFilter === "all" || student.grade === sectionFilter;
    const matchesPerformance =
      performanceFilter === "all" ||
      (performanceFilter === "high" && student.totalPoints > 500) ||
      (performanceFilter === "medium" &&
        student.totalPoints > 200 &&
        student.totalPoints <= 500) ||
      (performanceFilter === "low" && student.totalPoints <= 200);
    const matchesRanking =
      rankingFilter === "all" || student.cefrLevel === rankingFilter;

    return (
      matchesSearch && matchesSection && matchesPerformance && matchesRanking
    );
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "points":
        return b.totalPoints - a.totalPoints;
      case "streak":
        return b.streak - a.streak;
      case "usage":
        return b.usage - a.usage;
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedStudents.length / pageSize);
  const paginatedStudents = sortedStudents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sectionFilter, performanceFilter, rankingFilter, sortBy]);

  const handleViewProfile = (studentId: string) => {
    navigate(`/teacher/student-profile/${studentId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading students data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-6">
          <CardContent className="text-center">
            <p className="text-red-600 mb-4">
              Error loading students data: {error}
            </p>
            <Button
              onClick={() => teacherId && dispatch(fetchTeacherData(teacherId))}
              variant="outline"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex justify-between items-center w-full flex-wrap gap-4">
          {/* Filter Buttons */}
          <div className="flex gap-2 flex-wrap w-full sm:w-auto">
            <Select value={sectionFilter} onValueChange={setSectionFilter}>
              <SelectTrigger className="flex-1 min-w-[140px]">
                <SelectValue placeholder="Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                <SelectItem value="9">Grade 9</SelectItem>
                <SelectItem value="10">Grade 10</SelectItem>
                <SelectItem value="11">Grade 11</SelectItem>
                <SelectItem value="12">Grade 12</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={performanceFilter}
              onValueChange={setPerformanceFilter}
            >
              <SelectTrigger className="flex-1 min-w-[140px]">
                <SelectValue placeholder="Performance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Performance</SelectItem>
                <SelectItem value="high">High (500+ pts)</SelectItem>
                <SelectItem value="medium">Medium (200-500 pts)</SelectItem>
                <SelectItem value="low">Low (0-200 pts)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={rankingFilter} onValueChange={setRankingFilter}>
              <SelectTrigger className="flex-1 min-w-[140px]">
                <SelectValue placeholder="CEFR Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="A1">A1</SelectItem>
                <SelectItem value="A2">A2</SelectItem>
                <SelectItem value="B1">B1</SelectItem>
                <SelectItem value="B2">B2</SelectItem>
                <SelectItem value="C1">C1</SelectItem>
                <SelectItem value="C2">C2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search and Sort */}
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            <div className="relative w-full sm:w-48">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--font-light2)]" />
              <Input
                className="pl-9 w-full"
                placeholder="Search by student name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="points">Total Points</SelectItem>
                <SelectItem value="streak">Streak</SelectItem>
                <SelectItem value="usage">Usage</SelectItem>
              </SelectContent>
            </Select>

            {/* Column Visibility Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {columnOptions.map((column) => (
                  <DropdownMenuItem
                    key={column.key}
                    className="flex items-center space-x-2 cursor-pointer"
                    onSelect={(e) => {
                      e.preventDefault();
                      toggleColumn(column.key);
                    }}
                  >
                    <Checkbox
                      checked={
                        visibleColumns[
                          column.key as keyof typeof visibleColumns
                        ]
                      }
                      onChange={() => toggleColumn(column.key)}
                    />
                    <span>{column.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <Card>
        <CardContent>
          {/* Responsive Table */}
          <div className="hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  {visibleColumns.name && (
                    <TableHead className="px-6 py-4">Student Name</TableHead>
                  )}
                  {visibleColumns.grade && (
                    <TableHead className="text-center px-6 py-4">
                      Grade
                    </TableHead>
                  )}
                  {visibleColumns.cefrLevel && (
                    <TableHead className="text-center px-6 py-4">
                      CEFR Level
                    </TableHead>
                  )}
                  {visibleColumns.streak && (
                    <TableHead className="text-center px-6 py-4">
                      Streak
                    </TableHead>
                  )}
                  {visibleColumns.usage && (
                    <TableHead className="text-center px-6 py-4">
                      Usage
                    </TableHead>
                  )}
                  {visibleColumns.totalPoints && (
                    <TableHead className="text-center px-6 py-4">
                      Total Points
                    </TableHead>
                  )}
                  {visibleColumns.completedTopics && (
                    <TableHead className="text-center px-6 py-4">
                      Completed Topics
                    </TableHead>
                  )}
                  <TableHead className="text-center px-6 py-4">
                    Profile
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedStudents.length > 0 ? (
                  paginatedStudents.map((student) => (
                    <TableRow className="h-24" key={student.id}>
                      {visibleColumns.name && (
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.id}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`}
                                alt={student.name}
                              />
                              <AvatarFallback>
                                {student.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{student.name}</div>
                            </div>
                          </div>
                        </TableCell>
                      )}
                      {visibleColumns.grade && (
                        <TableCell className="text-center px-6 py-4">
                          <div className="flex items-center justify-center">
                            <span className="font-medium">{student.grade}</span>
                          </div>
                        </TableCell>
                      )}
                      {visibleColumns.cefrLevel && (
                        <TableCell className="text-center px-6 py-4">
                          <div className="flex items-center justify-center">
                            <Badge variant="outline" className="font-medium">
                              {student.cefrLevel}
                            </Badge>
                          </div>
                        </TableCell>
                      )}
                      {visibleColumns.streak && (
                        <TableCell className="text-center px-6 py-4">
                          <div className="flex items-center justify-center">
                            <span className="font-bold text-orange-600">
                              {student.streak}
                            </span>
                            <span className="text-xs text-gray-500 ml-1">
                              days
                            </span>
                          </div>
                        </TableCell>
                      )}
                      {visibleColumns.usage && (
                        <TableCell className="text-center px-6 py-4">
                          <div className="flex items-center justify-center">
                            <span className="font-medium">
                              {student.usage.toLocaleString()}
                            </span>
                          </div>
                        </TableCell>
                      )}
                      {visibleColumns.totalPoints && (
                        <TableCell className="text-center px-6 py-4">
                          <div className="flex items-center justify-center">
                            <span className="font-bold text-blue-600">
                              {student.totalPoints}
                            </span>
                            <span className="text-xs text-gray-500 ml-1">
                              pts
                            </span>
                          </div>
                        </TableCell>
                      )}
                      {visibleColumns.completedTopics && (
                        <TableCell className="text-center px-6 py-4">
                          <div className="flex items-center justify-center">
                            <span className="font-bold text-green-600">
                              {student.completedTopics}
                            </span>
                            <span className="text-xs text-gray-500 ml-1">
                              topics
                            </span>
                          </div>
                        </TableCell>
                      )}
                      <TableCell className="text-center px-6 py-4">
                        <div className="flex items-center justify-center">
                          <Button
                            className="bg-[#F1F3FF] text-primary hover:bg-primary hover:text-white hover:shadow-md transition-colors"
                            size="sm"
                            onClick={() => handleViewProfile(student.id)}
                          >
                            View Profile
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={
                        Object.values(visibleColumns).filter(Boolean).length + 1
                      }
                      className="text-center py-6"
                    >
                      <p className="text-[var(--font-light2)] mb-2">
                        No students found matching your criteria.
                      </p>
                      {searchTerm && (
                        <Button
                          onClick={() => setSearchTerm("")}
                          variant="outline"
                        >
                          Clear Search
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Card Layout for Mobile */}
          <div className="block sm:hidden">
            {paginatedStudents.length > 0 ? (
              paginatedStudents.map((student) => (
                <div
                  key={student.id}
                  className="border rounded-lg p-4 mt-4 mb-4 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar>
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.id}`}
                        alt={student.name}
                      />
                      <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{student.name}</div>
                    </div>
                  </div>
                  <div className="text-sm">
                    {visibleColumns.grade && (
                      <p>
                        <strong>Grade:</strong> {student.grade}
                      </p>
                    )}
                    {visibleColumns.cefrLevel && (
                      <p>
                        <strong>CEFR Level:</strong>{" "}
                        <Badge variant="outline" className="ml-1">
                          {student.cefrLevel}
                        </Badge>
                      </p>
                    )}
                    {visibleColumns.streak && (
                      <p>
                        <strong>Streak:</strong>{" "}
                        <span className="font-bold text-orange-600">
                          {student.streak} days
                        </span>
                      </p>
                    )}
                    {visibleColumns.usage && (
                      <p>
                        <strong>Usage:</strong> {student.usage.toLocaleString()}
                      </p>
                    )}
                    {visibleColumns.totalPoints && (
                      <p>
                        <strong>Total Points:</strong>{" "}
                        <span className="font-bold text-blue-600">
                          {student.totalPoints} pts
                        </span>
                      </p>
                    )}
                    {visibleColumns.completedTopics && (
                      <p>
                        <strong>Completed Topics:</strong>{" "}
                        <span className="font-bold text-green-600">
                          {student.completedTopics} topics
                        </span>
                      </p>
                    )}
                  </div>
                  <Button
                    className="bg-[#F1F3FF] text-primary hover:bg-primary hover:text-white hover:shadow-md transition-colors mt-2"
                    size="sm"
                    onClick={() => handleViewProfile(student.id)}
                  >
                    View Profile
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center text-[var(--font-light2)]">
                No students found matching your criteria.
              </p>
            )}
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-wrap justify-between items-center mt-4 gap-2">
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2 items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i + 1}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(i + 1)}
                  className={currentPage === i + 1 ? "font-bold" : ""}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
