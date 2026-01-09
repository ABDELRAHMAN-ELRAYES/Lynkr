import React, { useState } from "react";
import Button from "@/shared/components/ui/Button";
import SearchView from "@/shared/components/ui/SearchView";
import Dropdown from "@/shared/components/ui/Dropdown";
import Navbar from "@/shared/components/common/Navbar";
import Footer from "@/shared/components/common/Footer";
import { Ellipsis, FileUp, MessagesSquare, TriangleAlert, Video } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: string;
  dueDate: string;
  budget: string;
  files: number;
  category: string;
  priority: "urgent" | "normal";
  type: "new" | "pending" | "in-progress" | "needs-review" | "overdue";
  actions: (
    | "accept"
    | "decline"
    | "message"
    | "meeting"
    | "join-meeting"
    | "upload"
  )[];
  startDate?: string; // Added for progress calculation
}

interface SummaryItem {
  label: string;
  count: number;
}

const OperationsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState("");

  // Function to calculate progress percentage
  const calculateProgress = (dueDate: string, startDate?: string): number => {
    const due = new Date(dueDate);
    const now = new Date();
    
    // If start date is provided, use it; otherwise assume task started 7 days before due date
    const start = startDate ? new Date(startDate) : new Date(due.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const totalDuration = due.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    
    let progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
    
    // If overdue, show 100% progress
    if (now > due) {
      progress = 100;
    }
    
    return Math.round(progress);
  };

  const tasks: Task[] = [
    {
      id: "1",
      title: "CFD Simulation for MSc Thesis — Shell & Tube Heat Exchanger",
      description:
        "Need CFD analysis for heat exchanger optimization. Includes geometry files and boundary conditions...",
      tags: ["Research", "Urgent", "New"],
      status: "Due in 3 days",
      dueDate: "Sep 12, 2025",
      budget: "$450",
      files: 3,
      category: "MSc",
      priority: "urgent",
      type: "new",
      actions: ["accept", "decline"],
      startDate: "Sep 5, 2025", // Added for progress calculation
    },
    {
      id: "2",
      title: "Chapter Editing & Formatting — MSc Thesis",
      description:
        "Professional editing and APA formatting for thesis chapters 3-5. Deadline flexible...",
      tags: ["Courses", "Normal", "Pending"],
      status: "Accepted by you",
      dueDate: "Sep 20, 2025",
      budget: "$300",
      files: 2,
      category: "MSc",
      priority: "normal",
      type: "pending",
      actions: ["message", "meeting"],
      startDate: "Sep 10, 2025", // Added for progress calculation
    },
    {
      id: "3",
      title: "Online Tutoring Session — Advanced Thermo",
      description:
        "1-hour session covering entropy, enthalpy calculations, and cycle analysis...",
      tags: ["Courses", "Normal", "In Progress"],
      status: "Meeting tomorrow 2PM",
      dueDate: "Sep 14, 2025",
      budget: "$80/hr",
      files: 1,
      category: "BSc",
      priority: "normal",
      type: "in-progress",
      actions: ["join-meeting"],
      startDate: "Sep 10, 2025", // Added for progress calculation
    },
    {
      id: "4",
      title: "HVAC Ducting Design — Small Clinic",
      description:
        "Complete HVAC system design for 2,000 sq ft medical clinic. Load calculations included...",
      tags: ["Mechanical", "Normal", "Needs Review"],
      status: "Milestone waiting",
      dueDate: "Sep 18, 2025",
      budget: "$1,200",
      files: 5,
      category: "Commercial",
      priority: "normal",
      type: "needs-review",
      actions: ["upload"],
      startDate: "Sep 8, 2025", // Added for progress calculation
    },
    {
      id: "5",
      title: "Data Analysis — Regression & Plots",
      description:
        "Statistical analysis of experimental data with regression models and publication-ready plots...",
      tags: ["Research", "Urgent", "Overdue"],
      status: "2 days overdue",
      dueDate: "Sep 11, 2025",
      budget: "$350",
      files: 8,
      category: "PhD",
      priority: "urgent",
      type: "overdue",
      actions: ["accept"],
      startDate: "Sep 5, 2025", // Added for progress calculation
    },
  ];

  const summaryItems: SummaryItem[] = [
    { label: "New requests", count: 2 },
    { label: "Due today", count: 1 },
    { label: "Upcoming meetings", count: 1 },
    { label: "Overdue", count: 1 },
  ];

  const serviceOptions = [
    { value: "all", label: "All Services" },
    { value: "research", label: "Research" },
    { value: "courses", label: "Courses" },
    { value: "mechanical", label: "Mechanical" },
  ];

  const priorityOptions = [
    { value: "all", label: "All Priorities" },
    { value: "urgent", label: "Urgent" },
    { value: "normal", label: "Normal" },
  ];

  const assignmentOptions = [
    { value: "all", label: "All Requests" },
    { value: "assigned", label: "Assigned to Me" },
    { value: "pending", label: "Pending Review" },
  ];

  const getTagColor = (tag: string) => {
    const colors: { [key: string]: string } = {
      Research: "bg-global-3 text-global-4",
      Urgent: "bg-global-3 text-global-4",
      New: "bg-global-3 text-global-4",
      Courses: "bg-global-3 text-global-4",
      Normal: "bg-global-3 text-global-4",
      Pending: "bg-global-3 text-global-4",
      "In Progress": "bg-global-3 text-global-4",
      Mechanical: "bg-global-3 text-global-4",
      "Needs Review": "bg-global-3 text-global-4",
      Overdue: "bg-global-3 text-global-4",
    };
    return colors[tag] || "bg-global-3 text-global-4";
  };

  const renderActionButtons = (task: Task) => {
    return (
      <div className="flex flex-col sm:flex-row gap-2">
        {task.actions.includes("accept") && (
          <Button size="sm" className="bg-global-1 text-global-8">
            Accept
          </Button>
        )}
        {task.actions.includes("decline") && (
          <Button
            variant="outline"
            size="sm"
            className="border-primary text-global-4"
          >
            Decline
          </Button>
        )}
        {task.actions.includes("message") && (
          <Button
            size="sm"
            className="bg-global-1 text-global-8 flex items-center gap-1"
          >
            <MessagesSquare size={28} color="#ffffff" />
            Message
          </Button>
        )}
        {task.actions.includes("meeting") && (
          <Button
            variant="outline"
            size="sm"
            className="border-primary text-global-4 flex items-center gap-1"
          >
            <img
              src="/images/img_vector_gray_800.svg"
              alt="meeting"
              className="w-3 h-3.5"
            />
            Meeting
          </Button>
        )}
        {task.actions.includes("join-meeting") && (
          <Button
            size="sm"
            className="bg-global-1 text-global-8 flex items-center gap-1"
          >
            <Video size={30} color="#ffffff" />
            Join Meeting
          </Button>
        )}
        {task.actions.includes("upload") && (
          <Button
            size="sm"
            className="bg-global-1 text-global-8 flex items-center gap-1"
          >
            <FileUp size={28} color="#ffffff" absoluteStrokeWidth />
            New Upload
          </Button>
        )}
        {task.actions.includes("urgent") && (
          <Button
            size="sm"
            className="bg-global-1 text-global-8 flex items-center gap-1"
          >
            <TriangleAlert size={28} color="#ffffff" absoluteStrokeWidth />
            Urgent
          </Button>
        )}
        <button className="p-1 cursor-pointer">
          <Ellipsis size={28} color="#bdbdbd" absoluteStrokeWidth />
        </button>
      </div>
    );
  };

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
              Daily Operations
            </h2>
            <p className="text-sm font-inter font-normal text-global-5">
              Tasks & requests assigned to you
            </p>
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto">
            <img
              src="/images/img_div_gray_300.svg"
              alt="view options"
              className="w-[114px] h-[42px] hidden sm:block"
            />
            <SearchView
              placeholder="Search requests, client names, tags..."
              leftIcon="/images/img_search.svg"
              rightIcon="/images/img_button_gray_500.svg"
              onSearch={setSearchQuery}
              className="flex-1 lg:w-[400px] focus:ring-[#7682e8]"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-[5rem]">
          {/* Tasks List */}
          <div className="flex-1">
            <div className="space-y-4">
              {tasks.map((task) => {
                const progress = calculateProgress(task.dueDate, task.startDate);
                
                return (
                  <div
                    key={task.id}
                    className="bg-global-5 border border-primary rounded-xl p-4 sm:p-6"
                  >
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-3">
                      <div className="flex-1">
                        <h3 className="text-base font-inter font-normal text-global-2 mb-2 cursor-pointer">
                          {task.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          {task.tags.map((tag, index) => (
                            <span
                              key={index}
                              className={`px-2 py-1 text-xs font-inter font-normal rounded-md ${getTagColor(
                                tag
                              )}`}
                            >
                              {tag}
                            </span>
                          ))}
                          <span className="text-xs font-inter font-normal text-global-5 ml-2">
                            {task.status}
                          </span>
                        </div>
                      </div>
                      {renderActionButtons(task)}
                    </div>

                    <p className="text-sm font-inter font-normal text-global-5 mb-3">
                      {task.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-inter font-normal text-global-6 mb-4">
                      <div className="flex items-center gap-1">
                        <img
                          src="/images/img_frame_gray_600_12x14.svg"
                          alt="category"
                          className="w-3.5 h-3"
                        />
                        <span>{task.category}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <img
                          src="/images/img_frame_gray_600_12x10.svg"
                          alt="files"
                          className="w-2.5 h-3"
                        />
                        <span>{task.files} files</span>
                      </div>
                      <span>Created: {task.dueDate}</span>
                      <span>Budget: {task.budget}</span>
                    </div>

                    <div className="border-t border-primary pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-base font-inter font-normal text-global-2">
                          Deadline
                        </span>
                        <span className="text-sm font-inter font-normal text-[#7682e8]">
                          {progress}% complete
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-[#7682e8] rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs font-inter font-normal text-global-5">
                          {task.dueDate}
                        </span>
                        <span className="text-xs font-inter font-normal text-global-5">
                          {task.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-[320px] space-y-6">
            {/* Today's Summary */}
            <div className="bg-global-5 border border-primary rounded-xl p-6">
              <h3 className="text-base font-inter font-normal text-global-2 mb-4">
                Today's Summary
              </h3>
              <div className="space-y-4">
                {summaryItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm font-inter font-normal text-global-5">
                      {item.label}
                    </span>
                    <span className="text-base font-inter font-normal text-global-5">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>

              {/* Next Meeting */}
              <div className="mt-8">
                <h4 className="text-base font-inter font-normal text-global-2 mb-2">
                  Next Meeting
                </h4>
                <div className="bg-global-4 rounded-lg p-3">
                  <div className="text-sm font-inter font-normal text-global-1 mb-1">
                    Advanced Thermo Session
                  </div>
                  <div className="text-xs font-inter font-normal text-global-5 mb-2">
                    Tomorrow at 2:00 PM
                  </div>
                  <Button
                    size="sm"
                    className="bg-global-1 text-global-8 flex items-center gap-1"
                  >
                    <Video size={30} color="#ffffff" />
                    Join Meeting
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="bg-global-5 border border-primary rounded-xl p-6">
              <h3 className="text-base font-inter font-normal text-global-2 mb-4">
                Quick Filters
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-inter font-normal text-global-4 mb-2">
                    Service
                  </label>
                  <Dropdown
                    options={serviceOptions}
                    placeholder="All Services"
                    rightIcon="/images/img_arrowdown_black_900.svg"
                    onSelect={(option) => setSelectedService(option.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-inter font-normal text-global-4 mb-2">
                    Priority
                  </label>
                  <Dropdown
                    options={priorityOptions}
                    placeholder="All Priorities"
                    rightIcon="/images/img_arrowdown_black_900.svg"
                    onSelect={(option) => setSelectedPriority(option.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-inter font-normal text-global-4 mb-2">
                    Assignment
                  </label>
                  <Dropdown
                    options={assignmentOptions}
                    placeholder="All Requests"
                    rightIcon="/images/img_arrowdown_black_900.svg"
                    onSelect={(option) => setSelectedAssignment(option.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-inter font-normal text-global-4 mb-2">
                    Date Range
                  </label>
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

export default OperationsPage;