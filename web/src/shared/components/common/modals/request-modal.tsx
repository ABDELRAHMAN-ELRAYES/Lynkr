"use client";

import type React from "react";

import { useState, useRef, useCallback } from "react";
import {
  X,
  Bold,
  Italic,
  List,
  Calendar,
  Clock,
  ChevronDown,
  Upload,
  FileText,
  Trash2,
  Code,
  Undo,
  Redo,
  Type,
  Quote,
  Eye,
  EyeOff,
  CheckCircle,
  Loader2,
  Download,
  FileImage,
  FileVideo,
  Archive,
  Sheet,
  AlertTriangle,
} from "lucide-react";
import Button from "@/shared/components/ui/Button";
import axios from "axios";

interface UploadedFile {
  id: number;
  file: File;
  name: string;
  size: number;
  type: string;
  status: string;
}

interface UploadProgress {
  [key: number]: {
    progress: number;
    status: "uploading" | "complete" | "error";
  };
}

interface FileTypeInfo {
  icon: any;
  color: string;
  bgColor: string;
  label: string;
}
interface OperationRequestFormProps {
  close: () => void;
  isOpen: boolean;
}

export default function OperationRequestForm({
  close,
  isOpen,
}: OperationRequestFormProps) {
  if (!isOpen) return null;
  const [projectTitle, setProjectTitle] = useState(
    "Heat Exchanger Optimization for MSc Thesis"
  );
  const [description, setDescription] = useState(
    "I need a CFD simulation, validation, and a written chapter (approx. 6 pages) following APA style."
  );
  const [selectedDate, setSelectedDate] = useState("2025-02-24");
  const [selectedTime, setSelectedTime] = useState("17:00");
  const [budgetType, setBudgetType] = useState<"Fixed" | "Hourly">("Fixed");
  const [currency, setCurrency] = useState("USD");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [ndaChecked, setNdaChecked] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});

  const [editorHistory, setEditorHistory] = useState([description]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wordCount = description.trim()
    ? description.trim().split(/\s+/).length
    : 0;
  const titleCharCount = projectTitle.length;
  const titleLimit = 50;
  const isNearTitleLimit = titleCharCount > titleLimit * 0.8;

  const getFileTypeInfo = (
    fileName: string,
    mimeType: string
  ): FileTypeInfo => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    if (
      mimeType?.startsWith("image/") ||
      ["png", "jpg", "jpeg", "gif", "webp"].includes(extension || "")
    ) {
      return {
        icon: FileImage,
        color: "text-green-600",
        bgColor: "bg-green-50",
        label: "Image",
      };
    }
    if (
      mimeType?.startsWith("video/") ||
      ["mp4", "avi", "mov", "wmv"].includes(extension || "")
    ) {
      return {
        icon: FileVideo,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        label: "Video",
      };
    }
    if (["zip", "rar", "7z", "tar", "gz"].includes(extension || "")) {
      return {
        icon: Archive,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        label: "Archive",
      };
    }
    if (["xlsx", "xls", "csv"].includes(extension || "")) {
      return {
        icon: Sheet,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
        label: "Spreadsheet",
      };
    }
    if (["pdf"].includes(extension || "")) {
      return {
        icon: FileText,
        color: "text-red-600",
        bgColor: "bg-red-50",
        label: "PDF",
      };
    }
    if (["docx", "doc", "txt"].includes(extension || "")) {
      return {
        icon: FileText,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        label: "Document",
      };
    }

    return {
      icon: FileText,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      label: "File",
    };
  };

  const downloadFile = (file: UploadedFile) => {
    const url = URL.createObjectURL(file.file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const addToHistory = useCallback(
    (newText: string) => {
      const newHistory = editorHistory.slice(0, historyIndex + 1);
      newHistory.push(newText);
      setEditorHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    },
    [editorHistory, historyIndex]
  );

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setDescription(editorHistory[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < editorHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setDescription(editorHistory[newIndex]);
    }
  };

  const handleDeadlineClick = (option: string) => {
    const today = new Date();
    const newDate = new Date(today);

    switch (option) {
      case "ASAP":
        break;
      case "3days":
        newDate.setDate(today.getDate() + 3);
        break;
      case "1week":
        newDate.setDate(today.getDate() + 7);
        break;
      case "2weeks":
        newDate.setDate(today.getDate() + 14);
        break;
      default:
        break;
    }

    const formattedDate = newDate.toISOString().split("T")[0];
    setSelectedDate(formattedDate);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const simulateUpload = (fileId: number) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadProgress((prev) => ({
          ...prev,
          [fileId]: { progress: 100, status: "complete" },
        }));
      } else {
        setUploadProgress((prev) => ({
          ...prev,
          [fileId]: { progress, status: "uploading" },
        }));
      }
    }, 200);
  };

  const handleFiles = (files: File[]) => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/zip",
      "image/png",
      "image/jpeg",
      "video/mp4",
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    const maxSize = 200 * 1024 * 1024; // 200MB
    const maxFiles = 10;

    const validFiles = files.filter((file) => {
      if (
        !validTypes.includes(file.type) &&
        !file.name.toLowerCase().match(/\.(docx|xlsx|xls)$/)
      ) {
        alert(`Invalid file type: ${file.name}`);
        return false;
      }
      if (file.size > maxSize) {
        alert(`File too large: ${file.name} (max 200MB)`);
        return false;
      }
      return true;
    });

    if (uploadedFiles.length + validFiles.length > maxFiles) {
      alert(`Too many files. Maximum ${maxFiles} files allowed.`);
      return;
    }

    const newFiles: UploadedFile[] = validFiles.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: "uploading",
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload progress for each file
    newFiles.forEach((file) => {
      setUploadProgress((prev) => ({
        ...prev,
        [file.id]: { progress: 0, status: "uploading" },
      }));
      simulateUpload(file.id);
    });
  };

  const removeFile = (fileId: number) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const insertTextAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText =
      description.substring(0, start) + text + description.substring(end);

    setDescription(newText);
    addToHistory(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const wrapSelectedText = (before: string, after = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = description.substring(start, end);

    if (selectedText) {
      const newText =
        description.substring(0, start) +
        before +
        selectedText +
        after +
        description.substring(end);
      setDescription(newText);
      addToHistory(newText);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + before.length, end + before.length);
      }, 0);
    } else {
      insertTextAtCursor(before + after);
    }
  };

  const handleBold = () => wrapSelectedText("**", "**");
  const handleItalic = () => wrapSelectedText("*", "*");
  const handleList = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const lines = description.substring(0, start).split("\n");
    const currentLine = lines[lines.length - 1];

    if (currentLine.trim() === "") {
      insertTextAtCursor("• ");
    } else {
      insertTextAtCursor("\n• ");
    }
  };

  const handleHeading = (level: number) => {
    const hashes = "#".repeat(level);
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const lines = description.substring(0, start).split("\n");
    const currentLine = lines[lines.length - 1];

    if (currentLine.trim() === "") {
      insertTextAtCursor(`${hashes} `);
    } else {
      insertTextAtCursor(`\n${hashes} `);
    }
  };

  const handleInlineCode = () => {
    wrapSelectedText("`", "`");
  };

  const handleQuote = () => {
    insertTextAtCursor("\n> ");
  };

  const handleNumberInput = (
    value: string,
    setter: (value: string) => void
  ) => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    const parts = numericValue.split(".");
    if (parts.length > 2) {
      return;
    }
    setter(numericValue);
  };
  const handleOnSubmit = async () => {
    const formData = new FormData();
    // This is the required format for the deadline in the API as -> LocalDateTime
    const deadline = `${selectedDate} ${selectedTime}:00`;
    const operation = {
      title: projectTitle,
      description,
      deadline,
      budgetType: budgetType,
      budgetCurrency: currency,
      fromBudget: Number(minAmount),
      toBudget: Number(maxAmount),
      category: "RESEARCH",
      providerId: "748d0f22-bf12-4221-87c8-f5e5a588c387",
    };
    formData.append(
      "operation",
      new Blob([JSON.stringify(operation)], { type: "application/json" })
    );

    if (uploadedFiles.length > 0) {
      uploadedFiles.forEach((uploadedFile, index) => {
        formData.append(`files`, uploadedFile.file);
      });
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/operations",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // const response = await fetch("http://localhost:8080/api/operations", {
      //   method: "POST",
      //   headers: { "content-type": "application/json" },
      //   body: JSON.stringify(data),
      //   });
      console.log(response);
    } catch (error) {
      console.log("Error ----------->", error);
    }
  };

  const renderPreview = () => {
    return (
      <div
        className={`prose prose-sm max-w-none p-3 min-h-[150px] bg-gray-50 border border-gray-300 rounded-b-md`}
      >
        {description.split("\n").map((line, index) => {
          if (line.startsWith("### ")) {
            return (
              <h3 key={index} className="text-lg font-semibold mt-4 mb-2">
                {line.substring(4)}
              </h3>
            );
          }
          if (line.startsWith("## ")) {
            return (
              <h2 key={index} className="text-xl font-semibold mt-4 mb-2">
                {line.substring(3)}
              </h2>
            );
          }
          if (line.startsWith("# ")) {
            return (
              <h1 key={index} className="text-2xl font-bold mt-4 mb-2">
                {line.substring(2)}
              </h1>
            );
          }
          if (line.startsWith("> ")) {
            return (
              <blockquote
                key={index}
                className="border-l-4 border-gray-300 pl-4 italic text-gray-600"
              >
                {line.substring(2)}
              </blockquote>
            );
          }
          if (line.startsWith("• ")) {
            return (
              <li key={index} className="ml-4">
                {line.substring(2)}
              </li>
            );
          }

          // Handle inline formatting
          const processedLine = line
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*(.*?)\*/g, "<em>$1</em>")
            .replace(
              /`(.*?)`/g,
              '<code class="bg-gray-200 px-1 rounded">$1</code>'
            )
            .replace(
              /\[([^\]]+)\]$$([^)]+)$$/g,
              '<a href="$2" class="text-blue-600 underline">$1</a>'
            );

          return (
            <p
              key={index}
              dangerouslySetInnerHTML={{ __html: processedLine }}
              className="mb-2"
            />
          );
        })}
      </div>
    );
  };

  return (
    <div
      className={`w-full max-w-7xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden`}
    >
      {/* Header */}
      <div className="bg-[#7682e86b] px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="/images/pages/home/small-girl.png"
              alt="Dr. Amina Khalid"
              className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-md"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Dr. Amina K
              </h2>
              <p className="text-sm text-gray-600">Thermal & CFD Specialist</p>
            </div>
          </div>
          <Button
            className=" text-gray-600 border-2 border-gray-600 transition-colors p-2 bg-white hover:bg-white rounded-full"
            onClick={close}
          >
            <X size={24} />
          </Button>
        </div>
      </div>

      <div className="p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Project Details */}
          <div className="space-y-8">
            {/* Project Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Project Title <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all ${
                    isNearTitleLimit
                      ? "border-orange-300 focus:ring-orange-500"
                      : "border-gray-300"
                  }`}
                  maxLength={titleLimit}
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isNearTitleLimit && (
                      <div className="flex items-center gap-1 text-orange-600">
                        <AlertTriangle size={14} />
                        <span className="text-xs font-medium">
                          Approaching limit
                        </span>
                      </div>
                    )}
                  </div>
                  <div
                    className={`text-xs font-medium ${
                      isNearTitleLimit ? "text-orange-600" : "text-gray-500"
                    }`}
                  >
                    {titleCharCount} / {titleLimit}
                  </div>
                </div>
              </div>
            </div>

            {/* Project Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Project Description <span className="text-red-500">*</span>
              </label>

              <div className="flex flex-col gap-2 p-3 border border-gray-300 border-b-0 rounded-t-lg bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 flex-wrap">
                    {/* Undo/Redo */}
                    <button
                      type="button"
                      onClick={handleUndo}
                      disabled={historyIndex <= 0}
                      className="cursor-pointer p-2 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Undo"
                    >
                      <Undo size={16} className="text-gray-600" />
                    </button>
                    <button
                      type="button"
                      onClick={handleRedo}
                      disabled={historyIndex >= editorHistory.length - 1}
                      className="cursor-pointer p-2 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Redo"
                    >
                      <Redo size={16} className="text-gray-600" />
                    </button>

                    <div className="w-px h-6 bg-gray-300 mx-2" />

                    {/* Headings */}
                    <div className="relative group">
                      <button
                        type="button"
                        className="cursor-pointer p-2 hover:bg-gray-200 rounded-md transition-colors"
                        title="Headings"
                      >
                        <Type size={16} className="text-gray-600" />
                      </button>
                      <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                        <button
                          onClick={() => handleHeading(1)}
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                        >
                          H1
                        </button>
                        <button
                          onClick={() => handleHeading(2)}
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                        >
                          H2
                        </button>
                        <button
                          onClick={() => handleHeading(3)}
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                        >
                          H3
                        </button>
                      </div>
                    </div>

                    {/* Text Formatting */}
                    <button
                      type="button"
                      onClick={handleBold}
                      className="cursor-pointer p-2 hover:bg-gray-200 rounded-md transition-colors"
                      title="Bold"
                    >
                      <Bold size={16} className="text-gray-600" />
                    </button>
                    <button
                      type="button"
                      onClick={handleItalic}
                      className="cursor-pointer p-2 hover:bg-gray-200 rounded-md transition-colors"
                      title="Italic"
                    >
                      <Italic size={16} className="text-gray-600" />
                    </button>

                    <div className="w-px h-6 bg-gray-300 mx-2" />

                    {/* Lists and Structure */}
                    <button
                      type="button"
                      onClick={handleList}
                      className="cursor-pointer p-2 hover:bg-gray-200 rounded-md transition-colors"
                      title="Bullet List"
                    >
                      <List size={16} className="text-gray-600" />
                    </button>
                    <button
                      type="button"
                      onClick={handleQuote}
                      className="cursor-pointer p-2 hover:bg-gray-200 rounded-md transition-colors"
                      title="Quote"
                    >
                      <Quote size={16} className="text-gray-600" />
                    </button>
                    <div className="w-px h-6 bg-gray-300 mx-2" />

                    {/* Code and Table */}
                    <button
                      type="button"
                      onClick={handleInlineCode}
                      className="cursor-pointer p-2 hover:bg-gray-200 rounded-md transition-colors"
                      title="Inline Code"
                    >
                      <Code size={16} className="text-gray-600" />
                    </button>
                  </div>

                  {/* Preview Toggle */}
                  <button
                    type="button"
                    onClick={() => setIsPreviewMode(!isPreviewMode)}
                    className={`cursor-pointer p-2 rounded-md transition-colors shrink-0 ${
                      isPreviewMode
                        ? "bg-blue-100 text-[#7682e8]"
                        : "hover:bg-gray-200 text-gray-600"
                    }`}
                    title={isPreviewMode ? "Edit Mode" : "Preview Mode"}
                  >
                    {isPreviewMode ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="relative">
                {isPreviewMode ? (
                  renderPreview()
                ) : (
                  <textarea
                    ref={textareaRef}
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      addToHistory(e.target.value);
                    }}
                    className="w-full px-4 py-4 border border-gray-300 border-t-0 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-[#7682e8] focus:border-[#7682e8] resize-none text-sm leading-relaxed font-mono"
                    rows={8}
                    placeholder="Include scope, deliverables, and any datasets. Use toolbar buttons for formatting."
                  />
                )}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span className="font-medium">{wordCount} words</span>
                <span className="hidden sm:inline">
                  Supports Markdown formatting
                </span>
              </div>
            </div>

            {/* Attachments */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Attachments
              </label>
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
                  isDragOver
                    ? "border-blue-400 bg-blue-50 scale-[1.02]"
                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="w-16 h-16 bg-[#7682e846] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-[#7682e8]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Upload your files
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="font-semibold text-[#7682e8] cursor-pointer underline"
                  >
                    Choose files
                  </button>{" "}
                  or drag and drop them here
                </p>
                <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500 mb-3">
                  <span className="bg-gray-100 px-3 py-1 rounded-full">
                    PDF
                  </span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full">
                    DOCX
                  </span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full">
                    ZIP
                  </span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full">
                    Images
                  </span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full">
                    Videos
                  </span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full">
                    CSV
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Max 200MB per file • 10 files maximum
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  accept=".pdf,.docx,.zip,.png,.jpg,.jpeg,.mp4,.csv,.xlsx,.xls"
                  className="hidden"
                />
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h4 className="text-sm font-semibold text-gray-900">
                    Uploaded Files ({uploadedFiles.length}/10)
                  </h4>
                  {uploadedFiles.map((file) => {
                    const progress = uploadProgress[file.id];
                    const isComplete = progress?.status === "complete";
                    const isUploading = progress?.status === "uploading";
                    const fileTypeInfo = getFileTypeInfo(file.name, file.type);
                    const FileIcon = fileTypeInfo.icon;

                    return (
                      <div
                        key={file.id}
                        className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div
                              className={`w-12 h-12 ${fileTypeInfo.bgColor} rounded-xl flex items-center justify-center shrink-0`}
                            >
                              {isComplete ? (
                                <CheckCircle className="w-6 h-6 text-green-500" />
                              ) : isUploading ? (
                                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                              ) : (
                                <FileIcon
                                  className={`w-6 h-6 ${fileTypeInfo.color}`}
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {file.name}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap mt-1">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${fileTypeInfo.bgColor} ${fileTypeInfo.color}`}
                                >
                                  {fileTypeInfo.label}
                                </span>
                                <span>•</span>
                                <span>{formatFileSize(file.size)}</span>
                                {isComplete && (
                                  <>
                                    <span>•</span>
                                    <span className="text-green-600 font-medium">
                                      Uploaded
                                    </span>
                                  </>
                                )}
                                {isUploading && (
                                  <>
                                    <span>•</span>
                                    <span className="text-blue-600 font-medium">
                                      {Math.round(progress.progress)}%
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {isComplete && (
                              <button
                                onClick={() => downloadFile(file)}
                                className="text-gray-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-lg"
                                title="Download file"
                              >
                                <Download size={18} />
                              </button>
                            )}
                            <button
                              onClick={() => removeFile(file.id)}
                              className="text-red-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                              title="Remove file"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>

                        {/* Progress bar */}
                        {isUploading && (
                          <div className="mt-3">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Settings & Configuration */}
          <div className="space-y-8">
            {/* Deadline & Time */}
            <div className="bg-gray-50 rounded-xl p-6">
              <label className="block text-sm font-semibold text-gray-900 mb-4">
                Deadline & Time <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="relative">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7682e8] focus:border-[#7682e8] text-sm"
                  />
                  <Calendar className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                <div className="relative">
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7682e8] focus:border-[#7682e8] text-sm"
                  />
                  <Clock className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => handleDeadlineClick("ASAP")}
                  className="cursor-pointer px-4 py-2 text-xs font-medium border border-gray-300 rounded-full hover:bg-white hover:shadow-sm transition-all"
                >
                  ASAP
                </button>
                <button
                  type="button"
                  onClick={() => handleDeadlineClick("3days")}
                  className="cursor-pointer px-4 py-2 text-xs font-medium border border-gray-300 rounded-full hover:bg-white hover:shadow-sm transition-all"
                >
                  In 3 days
                </button>
                <button
                  type="button"
                  onClick={() => handleDeadlineClick("1week")}
                  className="cursor-pointer px-4 py-2 text-xs font-medium border border-gray-300 rounded-full hover:bg-white hover:shadow-sm transition-all"
                >
                  1 week
                </button>
                <button
                  type="button"
                  onClick={() => handleDeadlineClick("2weeks")}
                  className="cursor-pointer px-4 py-2 text-xs font-medium border border-gray-300 rounded-full hover:bg-white hover:shadow-sm transition-all"
                >
                  2 weeks
                </button>
              </div>
              <p className="text-xs text-gray-500 font-medium">
                Due in 14 days
              </p>
            </div>

            {/* Budget */}
            <div className="bg-gray-50 rounded-xl p-6">
              <label className="block text-sm font-semibold text-gray-900 mb-4">
                Budget <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setBudgetType("Fixed")}
                  className={`cursor-pointer flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                    budgetType === "Fixed"
                      ? "bg-[#7682e83a] text-[#7682e8] border-2 border-[#7682e8] shadow-sm"
                      : "bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Fixed
                </button>
                <button
                  type="button"
                  onClick={() => setBudgetType("Hourly")}
                  className={`cursor-pointer flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                    budgetType === "Hourly"
                      ? "bg-[#7682e82a] text-[#7682e8] border-2 border-[#7682e8]  shadow-sm"
                      : "bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Hourly
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={minAmount}
                  onChange={(e) =>
                    handleNumberInput(e.target.value, setMinAmount)
                  }
                  placeholder="From"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7682e8] focus:border-[#7682e8] text-sm"
                />
                <input
                  type="text"
                  value={maxAmount}
                  onChange={(e) =>
                    handleNumberInput(e.target.value, setMaxAmount)
                  }
                  placeholder="To"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7682e8] focus:border-[#7682e8] text-sm"
                />
              </div>
              <div className="mt-3">
                <div className="relative">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full appearance-none px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7682e8] focus:border-[#7682e8] bg-white text-sm"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="CAD">CAD</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* NDA Checkbox */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  id="nda"
                  checked={ndaChecked}
                  onChange={(e) => setNdaChecked(e.target.checked)}
                  className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-[#7682e8] focus:ring-2"
                />
                <div className="flex-1">
                  <label
                    htmlFor="nda"
                    className="text-sm font-semibold text-gray-900 cursor-pointer"
                  >
                    Attach platform NDA (required for confidential docs)
                  </label>
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                    Standard confidentiality agreement covers data protection
                    and IP rights.
                    <button className="text-[#7682e8] underline cursor-pointer ml-1 font-medium">
                      View NDA
                    </button>
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 pt-6 border-t border-gray-200">
              <div className="flex gap-4">
                <Button
                  onClick={close}
                  className="cursor-pointer flex-1 px-6 py-3 text-sm font-medium text-gray-600 border-2 border-gray-300 rounded-lg bg-white hover:bg-white hover:border-gray-400 transition-all"
                >
                  Cancel
                </Button>
                <Button
                  className="cursor-pointer flex-1 px-6 py-3 text-sm font-semibold text-white bg-[#7682e8] rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl"
                  onClick={handleOnSubmit}
                >
                  Submit Request
                </Button>
              </div>
              <Button className="text-sm bg-transparent transition-colors font-medium cursor-pointer">
                Save draft
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
