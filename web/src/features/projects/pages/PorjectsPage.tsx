import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/shared/components/ui/Button";
import SearchView from "@/shared/components/ui/SearchView";
import Dropdown from "@/shared/components/ui/Dropdown";
import Navbar from "@/shared/components/common/Navbar";
import Footer from "@/shared/components/common/Footer";
import { ProjectStatusTag } from "@/shared/components/common/tags";
import { Pagination } from "@/shared/components/common/pagination";
import { projectService } from "@/shared/services/project.service";
import { meetingService } from "@/shared/services/meeting.service";
import type { Project, Meeting } from "@/shared/types/project";
import {
  Loader2,
  MessagesSquare,
  Video,
  Calendar,
  DollarSign,
  Clock,
  Users,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

type FilterStatus = "all" | "IN_PROGRESS" | "AWAITING_REVIEW" | "COMPLETED" | "CANCELLED";

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchProjects();
    fetchUpcomingMeetings();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectService.getMyProjects();
      setProjects(data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to load projects");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingMeetings = async () => {
    try {
      const data = await meetingService.getUserMeetings();
      // Filter to only show pending/active meetings
      const upcoming = data.filter(
        (m) => m.status === "PENDING" || m.status === "ACTIVE"
      );
      setUpcomingMeetings(upcoming);
    } catch (err) {
      console.error("Failed to load meetings:", err);
    }
  };

  // Filter projects based on search and status
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      searchQuery === "" ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProjects, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Calculate progress percentage based on project status
  const getProgressPercentage = (status: string) => {
    const progressMap: Record<string, number> = {
      PENDING_PAYMENT: 10,
      IN_PROGRESS: 50,
      AWAITING_REVIEW: 80,
      COMPLETED: 100,
      CONFIRMED: 100,
      CANCELLED: 0,
      DISPUTED: 50,
    };
    return progressMap[status] || 0;
  };

  const getSummaryStats = () => {
    const inProgress = projects.filter((p) => p.status === "IN_PROGRESS").length;
    const awaitingReview = projects.filter((p) => p.status === "AWAITING_REVIEW").length;
    const completed = projects.filter((p) => p.status === "COMPLETED").length;
    const upcoming = upcomingMeetings.length;

    return [
      { label: "In Progress", count: inProgress },
      { label: "Awaiting Review", count: awaitingReview },
      { label: "Completed", count: completed },
      { label: "Upcoming Meetings", count: upcoming },
    ];
  };

  const statusOptions = [
    { value: "all", label: "All Projects" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "AWAITING_REVIEW", label: "Awaiting Review" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELLED", label: "Cancelled" },
  ];

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No deadline";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getDaysRemaining = (deadline?: string) => {
    if (!deadline) return null;
    const now = new Date();
    const due = new Date(deadline);
    const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  const handleJoinMeeting = async (meetingId: string) => {
    try {
      const tokenData = await meetingService.getJoinToken(meetingId);
      // Navigate to meeting room with token data
      navigate(`/meeting/${meetingId}`, { state: tokenData });
    } catch (err) {
      toast.error("Failed to join meeting");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-global-5">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-global-5">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <p className="text-lg text-global-4">{error}</p>
          <Button onClick={fetchProjects}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-global-5">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="w-full max-w-[90rem] mt-[6rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 mb-6">
          <div>
            <h2 className="max-w-[90rem] mb-4 bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-4xl font-extrabold leading-tight tracking-tighter text-transparent md:text-[4rem] lg:text-[5rem]">
              My Projects
            </h2>
            <p className="text-sm font-inter font-normal text-global-5">
              Manage your active projects and collaborations
            </p>
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto">
            <SearchView
              placeholder="Search projects..."
              leftIcon="/images/img_search.svg"
              onSearch={setSearchQuery}
              className="flex-1 lg:w-[400px] focus:ring-[#7682e8]"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-[5rem]">
          {/* Projects List */}
          <div className="flex-1">
            {filteredProjects.length === 0 ? (
              <div className="bg-global-5 border border-primary rounded-xl p-8 text-center">
                <Users className="w-12 h-12 mx-auto text-global-6 mb-4" />
                <h3 className="text-lg font-medium text-global-2 mb-2">
                  {projects.length === 0
                    ? "No projects yet"
                    : "No projects match your filters"}
                </h3>
                <p className="text-sm text-global-5">
                  {projects.length === 0
                    ? "Your projects will appear here once you accept a proposal."
                    : "Try adjusting your search or filters."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {paginatedProjects.map((project) => {
                  const daysRemaining = getDaysRemaining(project.deadline);
                  const progressPercentage = getProgressPercentage(project.status);

                  return (
                    <div
                      key={project.id}
                      className="bg-global-5 border border-primary rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleProjectClick(project.id)}
                    >
                      <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-3">
                        <div className="flex-1">
                          <h3 className="text-base font-inter font-semibold text-global-2 mb-2">
                            {project.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <ProjectStatusTag status={project.status} />
                            {project.request?.service && (
                              <span className="px-2 py-1 text-xs font-inter font-normal rounded-md bg-global-3 text-global-4">
                                {project.request.service.name}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            size="sm"
                            className="bg-global-1 text-global-8 flex items-center gap-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProjectClick(project.id);
                            }}
                          >
                            <MessagesSquare size={16} />
                            Open Chat
                          </Button>
                        </div>
                      </div>

                      <p className="text-sm font-inter font-normal text-global-5 mb-3 line-clamp-2">
                        {project.description || "No description provided"}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-inter font-normal text-global-6">
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          <span>
                            {project.client?.name || "Client"} ↔{" "}
                            {project.provider?.user?.name || "Provider"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign size={14} />
                          <span>{formatCurrency(project.totalPrice)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{formatDate(project.deadline)}</span>
                        </div>
                        {daysRemaining !== null && (
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span
                              className={
                                daysRemaining < 0
                                  ? "text-red-500"
                                  : daysRemaining <= 3
                                    ? "text-amber-500"
                                    : ""
                              }
                            >
                              {daysRemaining < 0
                                ? `${Math.abs(daysRemaining)} days overdue`
                                : daysRemaining === 0
                                  ? "Due today"
                                  : `${daysRemaining} days left`}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-inter font-normal text-global-5">Progress</span>
                          <span className="text-xs font-inter font-medium text-global-2">{progressPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${progressPercentage}%`,
                              backgroundColor:
                                progressPercentage === 100
                                  ? "#10b981"
                                  : progressPercentage >= 50
                                    ? "#7682e8"
                                    : "#f59e0b",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {filteredProjects.length > ITEMS_PER_PAGE && (
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-[320px] space-y-6">
            {/* Summary Stats */}
            <div className="bg-global-5 border border-primary rounded-xl p-6">
              <h3 className="text-base font-inter font-normal text-global-2 mb-4">
                Projects Summary
              </h3>
              <div className="space-y-4">
                {getSummaryStats().map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm font-inter font-normal text-global-5">
                      {item.label}
                    </span>
                    <span className="text-base font-inter font-semibold text-global-2">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>

              {/* Upcoming Meeting */}
              {upcomingMeetings.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-base font-inter font-normal text-global-2 mb-2">
                    Next Meeting
                  </h4>
                  <div className="bg-global-4 rounded-lg p-3">
                    <div className="text-sm font-inter font-normal text-global-1 mb-1">
                      {upcomingMeetings[0].project?.title || "Project Meeting"}
                    </div>
                    <div className="text-xs font-inter font-normal text-global-5 mb-2">
                      {upcomingMeetings[0].scheduledAt
                        ? new Date(upcomingMeetings[0].scheduledAt).toLocaleString()
                        : "Instant meeting"}
                    </div>
                    <Button
                      size="sm"
                      className="bg-global-1 text-global-8 flex items-center gap-1"
                      onClick={() => handleJoinMeeting(upcomingMeetings[0].id)}
                    >
                      <Video size={16} />
                      Join Meeting
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Filters */}
            <div className="bg-global-5 border border-primary rounded-xl p-6">
              <h3 className="text-base font-inter font-normal text-global-2 mb-4">
                Quick Filters
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-inter font-normal text-global-4 mb-2">
                    Status
                  </label>
                  <Dropdown
                    options={statusOptions}
                    placeholder="All Projects"
                    rightIcon="/images/img_arrowdown_black_900.svg"
                    onSelect={(option) =>
                      setStatusFilter(option.value as FilterStatus)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[90rem] h-px bg-gray-300 mx-auto"></div>

        <Footer />
      </main>
    </div>
  );
};

export default ProjectsPage;