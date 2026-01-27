import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@/shared/components/ui/Button";
import Navbar from "@/shared/components/common/Navbar";
import Footer from "@/shared/components/common/Footer";
import { ProjectStatusTag, MeetingStatusTag } from "@/shared/components/common/tags";
import { projectService } from "@/shared/services/project.service";
import { conversationService } from "@/shared/services/conversation.service";
import { messageService } from "@/shared/services/message.service";
import { meetingService } from "@/shared/services/meeting.service";
import type {
  Project,
  Conversation,
  Message,
  Meeting,
  ProjectFile,
  ProjectActivity,
} from "@/shared/types/project";
import { useAuth } from "@/shared/hooks/use-auth";
import { useWebSocket } from "@/shared/hooks/useWebSocket";
import {
  Loader2,
  Send,
  Paperclip,
  Video,
  Calendar,
  Download,
  Trash2,
  FileIcon,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  MessageSquare,
  Activity,
  AlertCircle,
  Check,
  CheckCheck,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get token for WebSocket auth
  const token = localStorage.getItem('accessToken');

  // Socket.IO for real-time messaging
  const {
    connected: wsConnected,
    messages: wsMessages,
    typingUsers,
    projectActivities: wsActivities,
    joinConversation,
    leaveConversation,
    joinProject,
    leaveProject,
    sendTypingIndicator,
  } = useWebSocket(token);

  // State
  const [project, setProject] = useState<Project | null>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [activities, setActivities] = useState<ProjectActivity[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [messageText, setMessageText] = useState("");

  const [isProjectDetailsExpanded, setIsProjectDetailsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<"chat" | "files" | "activity">("chat");

  // Data fetching
  useEffect(() => {
    if (id) {
      fetchProjectData();
    }
  }, [id]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Join conversation/project rooms when data is loaded
  useEffect(() => {
    if (conversation?.id && wsConnected) {
      joinConversation(conversation.id);
    }
    return () => leaveConversation();
  }, [conversation?.id, wsConnected, joinConversation, leaveConversation]);

  useEffect(() => {
    if (id && wsConnected) {
      joinProject(id);
    }
    return () => leaveProject();
  }, [id, wsConnected, joinProject, leaveProject]);

  // Handle incoming WebSocket messages
  useEffect(() => {
    if (wsMessages.length > 0 && conversation) {
      // Filter messages for this conversation and add any new ones
      const newMessages = wsMessages.filter(
        (wsMsg) => wsMsg.conversationId === conversation.id &&
          !messages.some((msg) => msg.id === wsMsg.id)
      );
      if (newMessages.length > 0) {
        setMessages((prev) => [...prev, ...newMessages]);
      }
    }
  }, [wsMessages, conversation?.id]);

  // Handle incoming WebSocket activity updates
  useEffect(() => {
    if (wsActivities.length > 0 && id) {
      // Filter activities for this project and add any new ones
      const newActivities = wsActivities.filter(
        (wsActivity) => wsActivity.projectId === id &&
          !activities.some((act) => act.id === wsActivity.id)
      );
      if (newActivities.length > 0) {
        setActivities((prev) => [...newActivities, ...prev]);
      }
    }
  }, [wsActivities, id]);

  const fetchProjectData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [projectData, filesData, activitiesData, meetingsData] =
        await Promise.all([
          projectService.getProjectById(id),
          projectService.getProjectFiles(id),
          projectService.getProjectActivities(id),
          meetingService.getProjectMeetings(id),
        ]);

      setProject(projectData);
      setFiles(filesData);
      setActivities(activitiesData);
      setMeetings(meetingsData);

      // Fetch conversation and messages
      try {
        const conv = await conversationService.getConversationByProjectId(id);
        setConversation(conv);

        if (conv?.id) {
          const messagesData = await messageService.getMessagesByConversation(
            conv.id
          );
          setMessages(messagesData.messages || []);
          // Mark messages as read
          await messageService.markConversationAsRead(conv.id);
        }
      } catch (convErr) {
        console.log("No conversation found for project");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to load project");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !conversation?.id) return;

    try {
      setSendingMessage(true);
      const newMessage = await messageService.sendMessage({
        conversationId: conversation.id,
        content: messageText.trim(),
      });
      setMessages((prev) => [...prev, newMessage]);
      setMessageText("");
    } catch (err) {
      toast.error("Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;

    try {
      setUploadingFile(true);
      const uploadedFile = await projectService.uploadProjectFile(id, file);
      setFiles((prev) => [...prev, uploadedFile]);
      toast.success("File uploaded successfully");
      // Refresh activities
      const activitiesData = await projectService.getProjectActivities(id);
      setActivities(activitiesData);
    } catch (err) {
      toast.error("Failed to upload file");
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!id) return;

    try {
      await projectService.deleteProjectFile(id, fileId);
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
      toast.success("File deleted");
      // Refresh activities
      const activitiesData = await projectService.getProjectActivities(id);
      setActivities(activitiesData);
    } catch (err) {
      toast.error("Failed to delete file");
    }
  };

  const handleMarkComplete = async () => {
    if (!id) return;

    try {
      const updated = await projectService.markProjectComplete(id);
      setProject(updated);
      toast.success("Project marked as complete");
      // Refresh activities
      const activitiesData = await projectService.getProjectActivities(id);
      setActivities(activitiesData);
    } catch (err) {
      toast.error("Failed to mark project as complete");
    }
  };

  const handleConfirmComplete = async () => {
    if (!id) return;

    try {
      const updated = await projectService.confirmProjectComplete(id);
      setProject(updated);
      toast.success("Project completion confirmed. Funds released.");
      // Refresh activities
      const activitiesData = await projectService.getProjectActivities(id);
      setActivities(activitiesData);
    } catch (err) {
      toast.error("Failed to confirm completion");
    }
  };

  const handleCancelProject = async () => {
    if (!id) return;

    if (!window.confirm("Are you sure you want to cancel this project?")) return;

    try {
      const updated = await projectService.cancelProject(id);
      setProject(updated);
      toast.success("Project cancelled");
    } catch (err) {
      toast.error("Failed to cancel project");
    }
  };

  const handleScheduleMeeting = async () => {
    if (!id || !project) return;

    try {
      // For instant meeting, no scheduledAt
      const guestId =
        user?.id === project.clientId
          ? project.provider?.user?.id
          : project.clientId;

      if (!guestId) {
        toast.error("Could not determine meeting participant");
        return;
      }

      const meeting = await meetingService.createMeeting({
        projectId: id,
        guestId,
      });
      setMeetings((prev) => [...prev, meeting]);
      toast.success("Meeting created");
    } catch (err) {
      toast.error("Failed to create meeting");
    }
  };

  const handleJoinMeeting = async (meetingId: string) => {
    try {
      const tokenData = await meetingService.getJoinToken(meetingId);
      // Navigate to meeting page or open in new window
      navigate(`/meeting/${meetingId}`, { state: tokenData });
    } catch (err) {
      toast.error("Failed to join meeting");
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const isProvider = user?.role === "PROVIDER" || user?.role === "PENDING_PROVIDER";
  const isClient = user?.role === "CLIENT";

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

  if (error || !project) {
    return (
      <div className="min-h-screen bg-global-5">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <p className="text-lg text-global-4">{error || "Project not found"}</p>
          <Button onClick={() => navigate("/projects")}>Back to Projects</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-global-5">
      <div className="flex flex-col w-full">
        {/* Header */}
        <Navbar />

        {/* Main Content */}
        <div className="w-full max-w-[90rem] mx-auto py-6 px-4">
          <div className="flex flex-col gap-6 mt-[7rem]">
            {/* Project Header Card */}
            <div className="bg-global-4 rounded-xl p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h1 className="text-xl sm:text-2xl font-inter font-semibold text-global-1">
                      {project.title}
                    </h1>
                    <ProjectStatusTag status={project.status} />
                  </div>
                  <p className="text-base font-inter font-normal text-global-5 mb-4">
                    {project.description || "No description provided"}
                  </p>

                  {/* Participants */}
                  <div className="flex items-center gap-2 text-sm text-global-5">
                    <Users size={16} />
                    <span>
                      {project.client?.name || "Client"} ↔{" "}
                      {project.provider?.user?.name || "Provider"}
                    </span>
                  </div>
                </div>

                {/* Project Info */}
                <div className="flex flex-col gap-4 items-end">
                  <div className="text-right">
                    <p className="text-sm font-inter font-normal text-global-6 mb-1">
                      Budget
                    </p>
                    <div className="flex items-baseline justify-end">
                      <span className="text-[2rem] font-inter font-semibold text-global-1">
                        {formatCurrency(project.totalPrice)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-inter font-normal text-global-6 mb-1">
                      Deadline
                    </p>
                    <p className="text-base font-inter font-normal text-global-1">
                      {formatDate(project.deadline)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 mt-6">
                {/* Provider Actions */}
                {isProvider && project.status === "IN_PROGRESS" && (
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                    onClick={handleMarkComplete}
                  >
                    <CheckCircle size={16} />
                    Mark Complete
                  </Button>
                )}

                {/* Client Actions */}
                {isClient && project.status === "AWAITING_REVIEW" && (
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                    onClick={handleConfirmComplete}
                  >
                    <CheckCircle size={16} />
                    Confirm Completion
                  </Button>
                )}

                {isClient && project.status === "IN_PROGRESS" && (
                  <Button
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-50 flex items-center gap-2"
                    onClick={handleCancelProject}
                  >
                    <XCircle size={16} />
                    Cancel Project
                  </Button>
                )}

                {/* Meeting Button */}
                <Button
                  className="bg-global-1 text-global-8 flex items-center gap-2"
                  onClick={handleScheduleMeeting}
                >
                  <Video size={16} />
                  Start Meeting
                </Button>

                {/* Upload Button */}
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingFile}
                >
                  {uploadingFile ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Upload size={16} />
                  )}
                  Upload File
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="flex flex-col xl:flex-row gap-6">
              {/* Left Column */}
              <div className="flex-1 flex flex-col gap-6">
                {/* Project Details */}
                <div className="bg-global-5 border border-primary rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-inter font-medium text-global-1">
                      Project Details
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setIsProjectDetailsExpanded(!isProjectDetailsExpanded)
                      }
                    >
                      <img
                        src="/images/img_arrow_down.svg"
                        alt="toggle"
                        className={`w-4 h-4 transition-transform ${isProjectDetailsExpanded ? "rotate-180" : ""
                          }`}
                      />
                    </Button>
                  </div>

                  {isProjectDetailsExpanded && (
                    <div className="space-y-4">
                      <p className="text-base font-inter font-normal text-global-4 leading-6">
                        {project.description || "No description provided"}
                      </p>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <span className="text-sm text-global-6">Created</span>
                          <p className="text-global-1">
                            {formatDate(project.createdAt)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-global-6">
                            Last Updated
                          </span>
                          <p className="text-global-1">
                            {formatDate(project.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tabs Section */}
                <div className="bg-global-5 border border-primary rounded-xl overflow-hidden">
                  {/* Tab Headers */}
                  <div className="flex border-b border-primary">
                    <button
                      className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === "chat"
                        ? "bg-global-3 text-global-1 border-b-2 border-primary"
                        : "text-global-5 hover:bg-global-4"
                        }`}
                      onClick={() => setActiveTab("chat")}
                    >
                      <MessageSquare size={16} />
                      Chat
                    </button>
                    <button
                      className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === "files"
                        ? "bg-global-3 text-global-1 border-b-2 border-primary"
                        : "text-global-5 hover:bg-global-4"
                        }`}
                      onClick={() => setActiveTab("files")}
                    >
                      <FileIcon size={16} />
                      Files ({files.length})
                    </button>
                    <button
                      className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === "activity"
                        ? "bg-global-3 text-global-1 border-b-2 border-primary"
                        : "text-global-5 hover:bg-global-4"
                        }`}
                      onClick={() => setActiveTab("activity")}
                    >
                      <Activity size={16} />
                      Activity
                    </button>
                  </div>

                  {/* Tab Content */}
                  <div className="p-4">
                    {/* Chat Tab */}
                    {activeTab === "chat" && (
                      <div className="flex flex-col h-[400px]">
                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                          {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-global-5">
                              <MessageSquare className="w-12 h-12 mb-2" />
                              <p>No messages yet</p>
                              <p className="text-sm">Start the conversation!</p>
                            </div>
                          ) : (
                            messages.map((message) => {
                              const isOwn = message.senderId === user?.id;
                              return (
                                <div
                                  key={message.id}
                                  className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""
                                    }`}
                                >
                                  <div
                                    className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"
                                      }`}
                                  >
                                    <div
                                      className={`p-3 rounded-lg ${isOwn
                                        ? "bg-global-1 text-global-8"
                                        : "bg-global-3 text-global-1"
                                        }`}
                                    >
                                      <p className="text-sm">{message.content}</p>
                                    </div>
                                    <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : ''}`}>
                                      <span className="text-xs text-global-6">
                                        {formatTime(message.createdAt)}
                                      </span>
                                      {isOwn && (
                                        message.isRead ? (
                                          <CheckCheck size={14} className="text-blue-500" />
                                        ) : (
                                          <Check size={14} className="text-global-6" />
                                        )
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          )}

                          {/* Typing Indicator */}
                          {typingUsers.length > 0 && (
                            <div className="flex items-center gap-2 text-global-5 text-sm pl-2">
                              <div className="flex gap-1">
                                <span className="w-2 h-2 bg-global-5 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-2 h-2 bg-global-5 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-2 h-2 bg-global-5 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                              </div>
                              <span>typing...</span>
                            </div>
                          )}

                          <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="flex items-center gap-3 border-t border-primary pt-4">
                          <Button variant="ghost" size="sm">
                            <Paperclip size={20} />
                          </Button>
                          <input
                            type="text"
                            placeholder="Type your message..."
                            value={messageText}
                            onChange={(e) => {
                              setMessageText(e.target.value);
                              // Send typing indicator
                              if (conversation?.id) {
                                sendTypingIndicator(conversation.id, e.target.value.length > 0);
                              }
                            }}
                            onKeyPress={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                                // Stop typing indicator
                                if (conversation?.id) {
                                  sendTypingIndicator(conversation.id, false);
                                }
                              }
                            }}
                            onBlur={() => {
                              // Stop typing when leaving input
                              if (conversation?.id) {
                                sendTypingIndicator(conversation.id, false);
                              }
                            }}
                            className="flex-1 px-3 py-2 text-base bg-global-5 border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            disabled={!conversation || sendingMessage}
                          />
                          <Button
                            onClick={handleSendMessage}
                            disabled={
                              !messageText.trim() || !conversation || sendingMessage
                            }
                            className="bg-global-1"
                          >
                            {sendingMessage ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Send size={16} />
                            )}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Files Tab */}
                    {activeTab === "files" && (
                      <div className="space-y-3">
                        {files.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-8 text-global-5">
                            <FileIcon className="w-12 h-12 mb-2" />
                            <p>No files uploaded yet</p>
                          </div>
                        ) : (
                          files.map((file) => (
                            <div
                              key={file.id}
                              className="flex items-center justify-between p-3 border border-primary rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <FileIcon className="w-8 h-8 text-global-5" />
                                <div>
                                  <p className="text-sm font-medium text-global-1">
                                    {file.filename}
                                  </p>
                                  <p className="text-xs text-global-5">
                                    {formatFileSize(file.size)} • Uploaded by{" "}
                                    {file.uploader?.name || "Unknown"}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    window.open(
                                      `${import.meta.env.VITE_API_BASE_URL}/${file.path}`,
                                      "_blank"
                                    )
                                  }
                                >
                                  <Download size={16} />
                                </Button>
                                {file.uploaderId === user?.id && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => handleDeleteFile(file.id)}
                                  >
                                    <Trash2 size={16} />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {/* Activity Tab */}
                    {activeTab === "activity" && (
                      <div className="space-y-3">
                        {activities.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-8 text-global-5">
                            <Activity className="w-12 h-12 mb-2" />
                            <p>No activity yet</p>
                          </div>
                        ) : (
                          activities.map((activity) => (
                            <div
                              key={activity.id}
                              className="flex items-start gap-3 p-3 border-l-2 border-primary"
                            >
                              <Clock className="w-4 h-4 text-global-5 mt-1" />
                              <div>
                                <p className="text-sm text-global-1">
                                  {activity.details}
                                </p>
                                <p className="text-xs text-global-5">
                                  {formatDate(activity.createdAt)} at{" "}
                                  {formatTime(activity.createdAt)} •{" "}
                                  {activity.user?.name || "System"}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="w-full xl:w-80 flex flex-col gap-6">
                {/* Participants */}
                <div className="bg-global-5 border border-primary rounded-xl p-6">
                  <h2 className="text-base font-inter font-medium text-global-1 mb-4">
                    Participants
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-global-3 flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {project.client?.name?.[0] || "C"}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-base font-inter font-normal text-global-1">
                            {project.client?.name || "Client"}
                          </h3>
                          <p className="text-sm font-inter font-normal text-global-6">
                            Client
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-global-3 flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {project.provider?.user?.name?.[0] || "P"}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-base font-inter font-normal text-global-1">
                            {project.provider?.user?.name || "Provider"}
                          </h3>
                          <p className="text-sm font-inter font-normal text-global-6">
                            Provider
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Meetings */}
                <div className="bg-global-5 border border-primary rounded-xl p-6">
                  <h2 className="text-base font-inter font-medium text-global-1 mb-4">
                    Meetings
                  </h2>
                  {meetings.length === 0 ? (
                    <p className="text-sm text-global-5">No meetings scheduled</p>
                  ) : (
                    <div className="space-y-3">
                      {meetings.slice(0, 3).map((meeting) => (
                        <div
                          key={meeting.id}
                          className="bg-global-4 rounded-lg p-3"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <MeetingStatusTag status={meeting.status} />
                            <span className="text-xs text-global-6">
                              {meeting.scheduledAt
                                ? formatDate(meeting.scheduledAt)
                                : "Instant"}
                            </span>
                          </div>
                          {(meeting.status === "PENDING" ||
                            meeting.status === "ACTIVE") && (
                              <Button
                                size="sm"
                                className="w-full bg-global-1 text-global-8 flex items-center justify-center gap-1"
                                onClick={() => handleJoinMeeting(meeting.id)}
                              >
                                <Video size={14} />
                                Join Meeting
                              </Button>
                            )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="bg-global-5 border border-primary rounded-xl p-6">
                  <h2 className="text-base font-inter font-medium text-global-1 mb-4">
                    Quick Actions
                  </h2>
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3"
                      onClick={handleScheduleMeeting}
                    >
                      <Calendar size={16} />
                      Schedule Meeting
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload size={16} />
                      Upload File
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[90rem] w-full mt-[2rem] h-px bg-gray-300 mx-auto"></div>

        <Footer />
      </div>
    </div>
  );
};

export default ProjectDetailPage;
