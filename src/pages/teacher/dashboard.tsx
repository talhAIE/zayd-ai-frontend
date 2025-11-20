import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  Eye,
  X,
  Download,
  Users,
  Clock,
  UserCheck,
  UserX,
} from "lucide-react";
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
import {
  fetchTeacherData,
  fetchTeacherFilterValues,
} from "@/redux/slices/teacherSlice";
// import { useDebounce } from "@/hooks/useDebounce";
import {
  TeacherDashboardFilters,
  fetchAllTeacherStudents,
  generateBulkPdfReports,
} from "@/services/teacherService";
import { toast } from "sonner";

const convertSecondsToMinutes = (seconds: number): string => {
  const minutes = Math.round(seconds / 60);
  return `${minutes} min`;
};

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    students,
    isLoading,
    error,
    filterValues,
    filterValuesLoading,
    filterValuesError,
    pagination,
    totalStudents,
    summary,
  } = useAppSelector((state) => state.teacher);

  // Local state for form inputs
  // const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [topicStatusFilter, setTopicStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("points");
  const [sortOrder, setSortOrder] = useState("desc");
  const [minCompletedTopics, setMinCompletedTopics] = useState("");
  const [maxCompletedTopics, setMaxCompletedTopics] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = pagination?.limit || 10;

  // Debounced search term to avoid excessive API calls
  // const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    class: true,
    cefrLevel: true,
    streak: true,
    usage: true,
    totalPoints: true,
    completedTopics: true,
  });

  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(
    new Set()
  );
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadingStudent, setDownloadingStudent] = useState<string | null>(
    null
  );
  const [allStudents, setAllStudents] = useState<any[]>([]);

  const columnOptions = [
    { key: "class", label: "Class" },
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

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (
      selectedStudents.size === allStudents.length &&
      allStudents.length > 0
    ) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(allStudents.map((student) => student.id)));
    }
  };

  const handleBulkDownload = async () => {
    setIsDownloading(true);
    try {
      let studentIds: string[] | undefined;

      if (selectedStudents.size > 0) {
        studentIds = Array.from(selectedStudents);
      } else {
        studentIds = allStudents.map((student) => student.id);
      }

      if (studentIds.length === 0) {
        toast.error("No students found to download reports");
        return;
      }

      setDownloadingStudent("Generating bulk PDF reports...");

      const response = await generateBulkPdfReports(teacherId, studentIds);

      if (!response.status || !response.data) {
        throw new Error(
          response.error || response.message || "Failed to generate reports"
        );
      }

      const { zipUrl, zipName, summary } = response.data;

      if (!zipUrl) {
        throw new Error("No download URL received from server");
      }

      // Download the ZIP file
      const link = document.createElement("a");
      link.href = zipUrl;
      link.download = zipName || "student_reports.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show success message with summary
      const successMessage = `Successfully generated ${summary.successfulGenerations} out of ${summary.totalStudents} reports`;
      if (summary.failedGenerations > 0) {
        toast.warning(
          `${successMessage} (${summary.failedGenerations} failed)`
        );
      } else {
        toast.success(successMessage);
      }
    } catch (error: any) {
      console.error("Bulk download error:", error);
      toast.error(error.message || "Failed to download reports");
    } finally {
      setIsDownloading(false);
      setDownloadingStudent(null);
    }
  };

  const myUser = localStorage.getItem("AiTutorUser");
  const parsedUser = JSON.parse(myUser || "{}");
  const teacherId = parsedUser?.id;

  const buildFilters = (): TeacherDashboardFilters => {
    const filters: TeacherDashboardFilters = {
      sortBy: sortBy as any,
      sortOrder: sortOrder as any,
      page: currentPage,
      limit: pageSize,
    };

    if (classFilter !== "all") {
      const numericClass = classFilter.replace("Class ", "");
      filters.class = numericClass;
    }

    if (topicStatusFilter !== "all") {
      filters.topicStatus = topicStatusFilter as any;
    }

    if (timeFilter !== "all") {
      filters.timeFilter = timeFilter as any;
    }

    if (minCompletedTopics) {
      const min = parseInt(minCompletedTopics);
      if (!isNaN(min)) {
        filters.minCompletedTopics = min;
      }
    }

    if (maxCompletedTopics) {
      const max = parseInt(maxCompletedTopics);
      if (!isNaN(max)) {
        filters.maxCompletedTopics = max;
      }
    }

    // Add search term to filters if it exists
    // if (debouncedSearchTerm.trim()) {
    //   filters.search = debouncedSearchTerm.trim();
    // }

    return filters;
  };

  const fetchData = () => {
    if (teacherId) {
      const filters = buildFilters();
      dispatch(fetchTeacherData({ teacherId, filters }));
    }
  };

  useEffect(() => {
    if (teacherId) {
      fetchData();
      dispatch(fetchTeacherFilterValues(teacherId));
    }
  }, [teacherId, dispatch]);

  useEffect(() => {
    if (teacherId) {
      fetchData();
    }
  }, [
    classFilter,
    topicStatusFilter,
    timeFilter,
    sortBy,
    sortOrder,
    minCompletedTopics,
    maxCompletedTopics,
    currentPage,
    // debouncedSearchTerm,
  ]);

  useEffect(() => {
    const fetchAllStudents = async () => {
      if (teacherId) {
        try {
          const filters = buildFilters();
          const { page, limit, ...allStudentsFilters } = filters;
          const allStudentsData = await fetchAllTeacherStudents(
            teacherId,
            allStudentsFilters
          );
          const transformedAllStudents = allStudentsData.map((student) => ({
            id: student.id,
            name: student.studentName,
            class: student.class,
            cefrLevel: student.cefrLevel,
            streak: student.currentStreak,
            usage: student.usage,
            totalPoints: student.totalPoints,
            completedTopics: student.completedTopics,
            totalTopics: student.totalTopics,
          }));
          setAllStudents(transformedAllStudents);
        } catch (error) {
          console.error("Error fetching all students:", error);
        }
      }
    };

    fetchAllStudents();
  }, [
    classFilter,
    topicStatusFilter,
    timeFilter,
    sortBy,
    sortOrder,
    minCompletedTopics,
    maxCompletedTopics,
    // debouncedSearchTerm,
  ]);

  const transformedStudents = useMemo(() => {
    return students.map((student) => ({
      id: student.id,
      name: student.studentName,
      class: student.class,
      cefrLevel: student.cefrLevel,
      streak: student.currentStreak,
      usage: student.usage,
      totalPoints: student.totalPoints,
      completedTopics: student.completedTopics,
      totalTopics: student.totalTopics,
    }));
  }, [students]);

  // Use API pagination data
  const totalPages = pagination?.totalPages || 1;
  const paginatedStudents = transformedStudents;

  useEffect(() => {
    setCurrentPage(1);
    setSelectedStudents(new Set());
  }, [
    classFilter,
    topicStatusFilter,
    timeFilter,
    sortBy,
    sortOrder,
    minCompletedTopics,
    maxCompletedTopics,
  ]);

  const handleViewProfile = (studentId: string) => {
    navigate(`/teacher/student-profile/${studentId}`);
  };

  const handleClearFilters = () => {
    // setSearchTerm("");
    setClassFilter("all");
    setTopicStatusFilter("all");
    setTimeFilter("all");
    setSortBy("points");
    setSortOrder("desc");
    setMinCompletedTopics("");
    setMaxCompletedTopics("");
    setCurrentPage(1);
    setSelectedStudents(new Set());
  };

  const hasActiveFilters = useMemo(() => {
    return (
      // searchTerm ||
      classFilter !== "all" ||
      topicStatusFilter !== "all" ||
      timeFilter !== "all" ||
      minCompletedTopics ||
      maxCompletedTopics
    );
  }, [
    // searchTerm,
    classFilter,
    topicStatusFilter,
    timeFilter,
    minCompletedTopics,
    maxCompletedTopics,
  ]);

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
            <Button onClick={() => teacherId && fetchData()} variant="outline">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatUsageHours = (totalMinutes: number): string => {
    // Convert total minutes to hours
    const totalHours = totalMinutes / 60;

    // Format: show as whole number if it's exactly a whole number, otherwise show one decimal
    if (totalHours % 1 === 0) {
      return `${Math.round(totalHours)} Hrs`;
    }
    // Round to one decimal place for display
    return `${Math.round(totalHours * 10) / 10} Hrs`;
  };

  return (
    <div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Users
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {summary?.totalStudentCount ?? 0}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Usage
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {summary?.averageStudentUsageMinutes !== undefined
                    ? formatUsageHours(summary.averageStudentUsageMinutes)
                    : "0 Hrs"}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Logged in
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {summary?.activeStudentsCount ?? 0}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Yet to Log-in
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {summary?.inactiveStudentsCount ?? 0}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <UserX className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex justify-between items-center w-full flex-wrap gap-4">
          {/* Filter Values Error */}
          {filterValuesError && (
            <div className="w-full mb-2 flex items-center justify-between">
              <p className="text-sm text-orange-600">
                Warning: Filter options could not be loaded. Using default
                values.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  teacherId && dispatch(fetchTeacherFilterValues(teacherId))
                }
                className="ml-2"
              >
                Retry
              </Button>
            </div>
          )}

          {/* Filter Buttons */}
          <div className="flex gap-2 flex-wrap w-full sm:w-auto">
            <Select
              value={classFilter}
              onValueChange={setClassFilter}
              disabled={filterValuesLoading}
            >
              <SelectTrigger className="flex-1 min-w-[140px]">
                <SelectValue
                  placeholder={filterValuesLoading ? "Loading..." : "Class"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {filterValues?.classes?.length
                  ? filterValues.classes.map((classItem) => (
                      <SelectItem key={classItem} value={`Class ${classItem}`}>
                        Class {classItem}
                      </SelectItem>
                    ))
                  : null}
              </SelectContent>
            </Select>

            <Select
              value={topicStatusFilter}
              onValueChange={setTopicStatusFilter}
              disabled={filterValuesLoading}
            >
              <SelectTrigger className="flex-1 min-w-[140px]">
                <SelectValue
                  placeholder={
                    filterValuesLoading ? "Loading..." : "Topic Status"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {filterValues?.topicStatusOptions?.length ? (
                  filterValues.topicStatusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))
                ) : (
                  <>
                    <SelectItem value="all">All Topics</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="incomplete">Incomplete</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>

            <Select
              value={timeFilter}
              onValueChange={setTimeFilter}
              disabled={filterValuesLoading}
            >
              <SelectTrigger className="flex-1 min-w-[140px]">
                <SelectValue
                  placeholder={
                    filterValuesLoading ? "Loading..." : "Time Filter"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search and Sort */}
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            {/* <div className="relative w-full sm:w-56">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--font-light2)]" />
              <Input
                className="pl-9 w-full"
                placeholder="Search by student name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div> */}

            <Select
              value={sortBy}
              onValueChange={setSortBy}
              disabled={filterValuesLoading}
            >
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue
                  placeholder={filterValuesLoading ? "Loading..." : "Sort by"}
                />
              </SelectTrigger>
              <SelectContent>
                {filterValues?.sortByOptions?.length ? (
                  filterValues.sortByOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))
                ) : (
                  <>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="points">Total Points</SelectItem>
                    <SelectItem value="streak">Streak</SelectItem>
                    <SelectItem value="usage">Usage</SelectItem>
                    <SelectItem value="completedTopics">
                      Completed Topics
                    </SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>

            <Select
              value={sortOrder}
              onValueChange={setSortOrder}
              disabled={filterValuesLoading}
            >
              <SelectTrigger className="w-full sm:w-[120px]">
                <SelectValue
                  placeholder={filterValuesLoading ? "Loading..." : "Order"}
                />
              </SelectTrigger>
              <SelectContent>
                {filterValues?.sortOrderOptions?.length ? (
                  filterValues.sortOrderOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))
                ) : (
                  <>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="w-full sm:w-auto"
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}

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

            <Button
              onClick={handleBulkDownload}
              disabled={isDownloading}
              className="w-full sm:w-auto"
              size="sm"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {downloadingStudent
                    ? `Downloading ${downloadingStudent}...`
                    : "Downloading..."}
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  {selectedStudents.size > 0
                    ? `Download Selected Reports (${selectedStudents.size})`
                    : `Download All Reports (${allStudents.length})`}
                </>
              )}
            </Button>
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
                  <TableHead className="w-12 px-6 py-4">
                    <Checkbox
                      checked={
                        allStudents.length > 0 &&
                        selectedStudents.size === allStudents.length
                      }
                      onCheckedChange={toggleSelectAll}
                      aria-label="Select all students"
                    />
                  </TableHead>
                  {visibleColumns.name && (
                    <TableHead className="px-6 py-4">Student Name</TableHead>
                  )}
                  {visibleColumns.class && (
                    <TableHead className="text-center px-6 py-4">
                      Class
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
                      <TableCell className="w-12 px-6 py-4">
                        <Checkbox
                          checked={selectedStudents.has(student.id)}
                          onCheckedChange={() =>
                            toggleStudentSelection(student.id)
                          }
                          aria-label={`Select ${student.name}`}
                        />
                      </TableCell>
                      {visibleColumns.name && (
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>
                                {student.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{student.name}</div>
                            </div>
                          </div>
                        </TableCell>
                      )}
                      {visibleColumns.class && (
                        <TableCell className="text-center px-6 py-4">
                          <div className="flex items-center justify-center">
                            <span className="font-medium">{student.class}</span>
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
                              {convertSecondsToMinutes(student.usage)}
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
                              {student.completedTopics}/{student.totalTopics}
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
                        Object.values(visibleColumns).filter(Boolean).length + 2
                      }
                      className="text-center py-6"
                    >
                      <p className="text-[var(--font-light2)] mb-2">
                        No students found matching your criteria.
                      </p>
                      {/* {searchTerm && (
                        <Button
                          onClick={() => setSearchTerm("")}
                          variant="outline"
                        >
                          Clear Search
                        </Button>
                      )} */}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Card Layout for Mobile */}
          <div className="block sm:hidden">
            {paginatedStudents.length > 0 && (
              <div className="flex justify-between items-center mt-4 mb-4">
                <span className="text-sm text-gray-600">
                  {selectedStudents.size} of {allStudents.length} selected
                </span>
                <Button variant="outline" size="sm" onClick={toggleSelectAll}>
                  {selectedStudents.size === allStudents.length
                    ? "Deselect All"
                    : "Select All"}
                </Button>
              </div>
            )}
            {paginatedStudents.length > 0 ? (
              paginatedStudents.map((student) => (
                <div
                  key={student.id}
                  className="border rounded-lg p-4 mt-4 mb-4 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Checkbox
                      checked={selectedStudents.has(student.id)}
                      onCheckedChange={() => toggleStudentSelection(student.id)}
                      aria-label={`Select ${student.name}`}
                    />
                    <Avatar>
                      <AvatarFallback>
                        {student.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{student.name}</div>
                    </div>
                  </div>
                  <div className="text-sm">
                    {visibleColumns.class && (
                      <p>
                        <strong>Class:</strong> {student.class}
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
                        <strong>Usage:</strong>{" "}
                        {convertSecondsToMinutes(student.usage)}
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
                          {student.completedTopics}/{student.totalTopics} topics
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
              Page {pagination?.currentPage || currentPage} of{" "}
              {pagination?.totalPages || totalPages}
              {pagination && (
                <span className="ml-2">({totalStudents} total students)</span>
              )}
            </span>
            <div className="flex gap-2 items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={!pagination?.hasPrevious}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {/* Page numbers - show limited range around current page */}
              {(() => {
                const current = pagination?.currentPage || currentPage;
                const total = pagination?.totalPages || totalPages;
                const start = Math.max(1, current - 2);
                const end = Math.min(total, current + 2);

                return Array.from({ length: end - start + 1 }, (_, i) => {
                  const pageNum = start + i;
                  return (
                    <Button
                      key={pageNum}
                      variant={current === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className={current === pageNum ? "font-bold" : ""}
                    >
                      {pageNum}
                    </Button>
                  );
                });
              })()}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(pagination?.totalPages || totalPages, p + 1)
                  )
                }
                disabled={!pagination?.hasNext}
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
