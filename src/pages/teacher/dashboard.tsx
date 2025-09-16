import { useState, useEffect, useMemo } from "react";
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
import { Search, Loader2, Eye, X, Download } from "lucide-react";
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
import { useDebounce } from "@/hooks/useDebounce";
import {
  TeacherDashboardFilters,
  downloadIndividualStudentReport,
} from "@/services/teacherService";
import { generateStudentReportPDF } from "@/utils/pdfGenerator";
import { toast } from "sonner";

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
  } = useAppSelector((state) => state.teacher);

  // Local state for form inputs
  const [searchTerm, setSearchTerm] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [topicStatusFilter, setTopicStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("points");
  const [sortOrder, setSortOrder] = useState("desc");
  const [minCompletedTopics, setMinCompletedTopics] = useState("");
  const [maxCompletedTopics, setMaxCompletedTopics] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = pagination?.limit || 10;

  // Debounced search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    grade: true,
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
    if (selectedStudents.size === paginatedStudents.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(
        new Set(paginatedStudents.map((student) => student.id))
      );
    }
  };

  const handleBulkDownload = async () => {
    if (selectedStudents.size === 0) {
      toast.error("Please select at least one student to download reports");
      return;
    }

    setIsDownloading(true);
    try {
      const studentIds = Array.from(selectedStudents);
      let successCount = 0;
      let errorCount = 0;

      for (const studentId of studentIds) {
        try {
          const student = transformedStudents.find((s) => s.id === studentId);
          if (!student) {
            console.warn(
              `Student with ID ${studentId} not found in current data`
            );
            errorCount++;
            continue;
          }

          setDownloadingStudent(student.name);

          const studentData = await downloadIndividualStudentReport(
            teacherId,
            studentId
          );

          await generateStudentReportPDF(studentData);
          successCount++;

          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (error) {
          console.error(
            `Error downloading report for student ${studentId}:`,
            error
          );
          errorCount++;
        } finally {
          setDownloadingStudent(null);
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully downloaded ${successCount} report(s)`);
      }
      if (errorCount > 0) {
        toast.error(`Failed to download ${errorCount} report(s)`);
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

    if (gradeFilter !== "all") {
      const numericGrade = gradeFilter.replace("Grade ", "");
      filters.grade = numericGrade;
    }

    if (topicStatusFilter !== "all") {
      filters.topicStatus = topicStatusFilter as any;
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
    if (debouncedSearchTerm.trim()) {
      filters.search = debouncedSearchTerm.trim();
    }

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
    gradeFilter,
    topicStatusFilter,
    sortBy,
    sortOrder,
    minCompletedTopics,
    maxCompletedTopics,
    currentPage,
    debouncedSearchTerm,
  ]);

  const transformedStudents = useMemo(() => {
    return students.map((student) => ({
      id: student.id,
      name: student.studentName,
      grade: student.grade,
      cefrLevel: student.cefrLevel,
      streak: student.currentStreak,
      usage: student.usage,
      totalPoints: student.totalPoints,
      completedTopics: student.completedTopics,
    }));
  }, [students]);

  // Use API pagination data
  const totalPages = pagination?.totalPages || 1;
  const paginatedStudents = transformedStudents;

  useEffect(() => {
    setCurrentPage(1);
    setSelectedStudents(new Set());
  }, [
    gradeFilter,
    topicStatusFilter,
    sortBy,
    sortOrder,
    minCompletedTopics,
    maxCompletedTopics,
  ]);

  const handleViewProfile = (studentId: string) => {
    navigate(`/teacher/student-profile/${studentId}`);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setGradeFilter("all");
    setTopicStatusFilter("all");
    setSortBy("points");
    setSortOrder("desc");
    setMinCompletedTopics("");
    setMaxCompletedTopics("");
    setCurrentPage(1);
    setSelectedStudents(new Set());
  };

  const hasActiveFilters = useMemo(() => {
    return (
      searchTerm ||
      gradeFilter !== "all" ||
      topicStatusFilter !== "all" ||
      minCompletedTopics ||
      maxCompletedTopics
    );
  }, [
    searchTerm,
    gradeFilter,
    topicStatusFilter,
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

  return (
    <div>
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
              value={gradeFilter}
              onValueChange={setGradeFilter}
              disabled={filterValuesLoading}
            >
              <SelectTrigger className="flex-1 min-w-[140px]">
                <SelectValue
                  placeholder={filterValuesLoading ? "Loading..." : "Grade"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                {filterValues?.grades?.length ? (
                  filterValues.grades.map((grade) => (
                    <SelectItem key={grade} value={`Grade ${grade}`}>
                      Grade {grade}
                    </SelectItem>
                  ))
                ) : (
                  // Fallback options if filter values are not loaded
                  <>
                    <SelectItem value="Grade 9">Grade 9</SelectItem>
                    <SelectItem value="Grade 10">Grade 10</SelectItem>
                    <SelectItem value="Grade 11">Grade 11</SelectItem>
                    <SelectItem value="Grade 12">Grade 12</SelectItem>
                  </>
                )}
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
          </div>

          {/* Search and Sort */}
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            <div className="relative w-full sm:w-56">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--font-light2)]" />
              <Input
                className="pl-9 w-full"
                placeholder="Search by student name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

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
              disabled={selectedStudents.size === 0 || isDownloading}
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
                  Download Bulk Reports ({selectedStudents.size})
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
                        paginatedStudents.length > 0 &&
                        selectedStudents.size === paginatedStudents.length
                      }
                      onCheckedChange={toggleSelectAll}
                      aria-label="Select all students"
                    />
                  </TableHead>
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
                        Object.values(visibleColumns).filter(Boolean).length + 2
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
            {paginatedStudents.length > 0 && (
              <div className="flex justify-between items-center mt-4 mb-4">
                <span className="text-sm text-gray-600">
                  {selectedStudents.size} of {paginatedStudents.length} selected
                </span>
                <Button variant="outline" size="sm" onClick={toggleSelectAll}>
                  {selectedStudents.size === paginatedStudents.length
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
