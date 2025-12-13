/* eslint-disable @next/next/no-img-element */
"use client";

import {
  useState,
  useRef,
  useEffect,
  MouseEvent,
  DragEvent,
  ChangeEvent,
} from "react";
import { useForm } from "react-hook-form";
import { Header } from "./components/header";
import { useMutation } from "@tanstack/react-query";
import { UserMessage } from "./components/user-message";
import { AssistantMessage } from "./components/assistant-message";
import { Detection, detectObjects, askGemini } from "@/api";
import { calculateBoundingBoxArea } from "@/utils";
import { ProfileContextProvider } from "./contexts/profile";

interface Message {
  content: string;
  role: "user" | "assistant";
}

interface DetectionFormData {
  file: File | null;
}

interface QuestionFormData {
  question: string;
}

interface DetectionResponse {
  annotatedImage: string;
  detections: Detection[];
}

interface AskGeminiFormData {
  file: File;
  detections: Detection[];
  question: string;
}

export default function DashboardPage() {
  const [previewImage, setPreviewImage] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [sortColumn, setSortColumn] = useState<0 | 1 | 2 | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [detections, setDetections] = useState<Detection[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [annotatedImage, setAnnotatedImage] = useState(
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect fill='%23f1f5f9' width='600' height='400'/%3E%3Crect x='80' y='120' width='180' height='160' fill='none' stroke='%2310b981' stroke-width='3' stroke-dasharray='8 4'/%3E%3Ctext x='90' y='145' font-family='Arial' font-size='14' font-weight='bold' fill='%2310b981'%3ECar (0.94)%3C/text%3E%3Crect x='340' y='80' width='140' height='180' fill='none' stroke='%232563eb' stroke-width='3' stroke-dasharray='8 4'/%3E%3Ctext x='350' y='105' font-family='Arial' font-size='14' font-weight='bold' fill='%232563eb'%3EPerson (0.89)%3C/text%3E%3Crect x='150' y='260' width='100' height='80' fill='none' stroke='%23f59e0b' stroke-width='3' stroke-dasharray='8 4'/%3E%3Ctext x='160' y='285' font-family='Arial' font-size='14' font-weight='bold' fill='%23f59e0b'%3EBike (0.87)%3C/text%3E%3Crect x='380' y='280' width='120' height='90' fill='none' stroke='%23ec4899' stroke-width='3' stroke-dasharray='8 4'/%3E%3Ctext x='390' y='305' font-family='Arial' font-size='14' font-weight='bold' fill='%23ec4899'%3ESign (0.76)%3C/text%3E%3Crect x='20' y='30' width='80' height='60' fill='none' stroke='%238b5cf6' stroke-width='3' stroke-dasharray='8 4'/%3E%3Ctext x='30' y='55' font-family='Arial' font-size='14' font-weight='bold' fill='%238b5cf6'%3ETree (0.82)%3C/text%3E%3C/svg%3E"
  );
  const [detectionError, setDetectionError] = useState<string | null>(null);
  const [questionError, setQuestionError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm<DetectionFormData>();

  const {
    register: registerQuestion,
    handleSubmit: handleQuestionSubmit,
    reset: resetQuestion,
    formState: { errors: questionErrors },
  } = useForm<QuestionFormData>();

  const detectMutation = useMutation<DetectionResponse, Error, File>({
    mutationFn: async (file) => {
      const response = await detectObjects(file);
      return response.data as DetectionResponse;
    },
    onSuccess: (data) => {
      setDetectionError(null);
      setDetections(data.detections);
      setAnnotatedImage(data.annotatedImage);
    },
    onError: () => setDetectionError("An error occurred. Please try again."),
  });

  const askGeminiMutation = useMutation<Message, Error, AskGeminiFormData>({
    mutationFn: async ({ file, detections, question }) => {
      const response = await askGemini(file, detections, question);
      return response.data as Message;
    },
    onSuccess: (data) => {
      setQuestionError(null);
      setMessages((prev) => [...prev, data]);
    },
    onError: () => setQuestionError("An error occurred. Please try again."),
  });

  const onSubmit = async (data: DetectionFormData) => {
    const file = data.file;
    if (file) detectMutation.mutate(file);
  };

  const onQuestionSubmit = async (data: QuestionFormData) => {
    const file = getValues("file");
    if (file) {
      const question = data.question.trim();
      setMessages((prev) => [...prev, { content: question, role: "user" }]);
      resetQuestion();
      askGeminiMutation.mutate({
        file,
        detections,
        question,
      });
    }
  };

  const handleFile = (file: File) => {
    setDetectionError(null);
    setQuestionError(null);
    const reader = new FileReader();
    reader.onload = (event) => setPreviewImage(event.target?.result as string);
    reader.readAsDataURL(file);
    setValue("file", file);
  };

  const handleUploadAreaClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target !== fileInputRef.current) fileInputRef.current?.click();
  };

  const handleUploadButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemoveImage = () => {
    setDetectionError(null);
    setQuestionError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setPreviewImage("");
    setValue("file", null);
    setDetections([]);
    setAnnotatedImage(
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect fill='%23f1f5f9' width='600' height='400'/%3E%3Crect x='80' y='120' width='180' height='160' fill='none' stroke='%2310b981' stroke-width='3' stroke-dasharray='8 4'/%3E%3Ctext x='90' y='145' font-family='Arial' font-size='14' font-weight='bold' fill='%2310b981'%3ECar (0.94)%3C/text%3E%3Crect x='340' y='80' width='140' height='180' fill='none' stroke='%232563eb' stroke-width='3' stroke-dasharray='8 4'/%3E%3Ctext x='350' y='105' font-family='Arial' font-size='14' font-weight='bold' fill='%232563eb'%3EPerson (0.89)%3C/text%3E%3Crect x='150' y='260' width='100' height='80' fill='none' stroke='%23f59e0b' stroke-width='3' stroke-dasharray='8 4'/%3E%3Ctext x='160' y='285' font-family='Arial' font-size='14' font-weight='bold' fill='%23f59e0b'%3EBike (0.87)%3C/text%3E%3Crect x='380' y='280' width='120' height='90' fill='none' stroke='%23ec4899' stroke-width='3' stroke-dasharray='8 4'/%3E%3Ctext x='390' y='305' font-family='Arial' font-size='14' font-weight='bold' fill='%23ec4899'%3ESign (0.76)%3C/text%3E%3Crect x='20' y='30' width='80' height='60' fill='none' stroke='%238b5cf6' stroke-width='3' stroke-dasharray='8 4'/%3E%3Ctext x='30' y='55' font-family='Arial' font-size='14' font-weight='bold' fill='%238b5cf6'%3ETree (0.82)%3C/text%3E%3C/svg%3E"
    );
  };

  const handleSortTable = (columnIndex: 0 | 1 | 2 | null) => {
    const isAscending = sortColumn === columnIndex && sortDirection === "asc";
    const newDirection = isAscending ? "desc" : "asc";
    setSortColumn(columnIndex);
    setSortDirection(newDirection);
    setDetections(
      [...detections].sort((a, b) => {
        switch (columnIndex) {
          case 0:
            return newDirection === "asc"
              ? a.object.localeCompare(b.object)
              : b.object.localeCompare(a.object);
          case 1:
            return newDirection === "asc"
              ? a.confidence - b.confidence
              : b.confidence - a.confidence;
          case 2:
            const areaA = calculateBoundingBoxArea(a.boundingBox);
            const areaB = calculateBoundingBoxArea(b.boundingBox);
            return newDirection === "asc" ? areaA - areaB : areaB - areaA;
          default:
            return 0;
        }
      })
    );
  };

  useEffect(() => {
    if (chatContainerRef.current)
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
  }, [messages]);

  return (
    <ProfileContextProvider>
      <Header />
      <main className="mx-auto max-w-[1400px] px-8 pb-[60px] pt-8 md:px-5">
        <section className="mb-7 rounded-2xl border border-slate-200 bg-white p-9 shadow-[0_1px_3px_rgba(0,0,0,0.04)] md:p-6">
          <h2 className="mb-2 text-xl font-bold tracking-[-0.3px] text-slate-900 sm:text-lg">
            Upload Image for Detection
          </h2>
          <p className="mb-7 text-sm text-slate-500">
            Upload an image to detect objects using our advanced YOLO model
          </p>

          <div
            className={`relative cursor-pointer rounded-xl border-2 border-dashed bg-slate-50 p-12 px-8 text-center transition-all hover:border-blue-600 hover:bg-blue-50 sm:p-8 sm:px-5 ${
              isDragOver ? "border-blue-600 bg-blue-50" : "border-slate-300"
            }`}
            onClick={handleUploadAreaClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="mx-auto mb-[18px] flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-[0_4px_12px_rgba(37,99,235,0.15)]">
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7 stroke-blue-600 stroke-2 fill-none"
              >
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div className="mb-1.5 text-base font-semibold text-slate-900">
              Drop your image here
            </div>
            <div className="mb-5 text-sm text-slate-500">
              or click to browse (PNG, JPG, JPEG up to 10MB)
            </div>
            <button
              className="rounded-lg bg-linear-to-br from-blue-600 to-blue-800 px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(37,99,235,0.3)] font-['Inter',sans-serif]"
              onClick={handleUploadButtonClick}
            >
              Select Image
            </button>
            <input
              type="file"
              {...register("file", {
                required: "Please select an image file",
                validate: (file) => {
                  if (!file) return "Please select a file";
                  if (!file.type.startsWith("image/"))
                    return "File must be an image";
                  if (file.size > 10 * 1024 * 1024)
                    return "File size must be less than 10MB";
                  return true;
                },
              })}
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileInputChange}
            />
          </div>

          <div className={`mt-7 ${previewImage ? "block" : "hidden"}`}>
            <div className="flex gap-6 items-start lg:flex-col">
              <div className="relative max-w-[500px] flex-1 overflow-hidden rounded-xl bg-slate-100 lg:max-w-full">
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="block h-auto w-full"
                  />
                )}
              </div>
              {errors.file && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.file.message}
                </p>
              )}
              {!errors.file && detectionError && (
                <p className="mt-1 text-sm text-red-600">{detectionError}</p>
              )}
              <div className="flex shrink-0 flex-col gap-3 lg:w-full lg:flex-row">
                <button
                  type="button"
                  className="whitespace-nowrap rounded-lg border-none px-6 py-3 text-sm font-semibold transition-all cursor-pointer font-['Inter',sans-serif] bg-linear-to-br from-emerald-500 to-emerald-700 text-white shadow-[0_4px_12px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(16,185,129,0.4)] lg:flex-1"
                  onClick={handleSubmit(onSubmit)}
                  disabled={detectMutation.isPending || !getValues("file")}
                >
                  {detectMutation.isPending ? "Detecting..." : "Detect Objects"}
                </button>
                <button
                  type="button"
                  className="whitespace-nowrap rounded-lg border-[1.5px] border-red-200 bg-white px-6 py-3 text-sm font-semibold text-red-500 transition-all cursor-pointer font-['Inter',sans-serif] hover:border-red-300 hover:bg-red-50 lg:flex-1"
                  onClick={handleRemoveImage}
                >
                  Remove Image
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-7 block" id="resultsSection">
          <div className="mb-7 grid grid-cols-2 gap-6 lg:grid-cols-1">
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_1px_3px_rgba(0,0,0,0.04)] md:p-6">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-[17px] font-bold tracking-[-0.2px] text-slate-900">
                  Annotated Image
                </h3>
                <span className="rounded-[20px] bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                  {detections.length}{" "}
                  {detections.length === 1 ? "Object" : "Objects"}
                </span>
              </div>
              <div className="overflow-hidden rounded-[10px] bg-slate-100">
                <img
                  src={annotatedImage}
                  alt="Annotated"
                  className="block h-auto w-full"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_1px_3px_rgba(0,0,0,0.04)] md:p-6">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-[17px] font-bold tracking-[-0.2px] text-slate-900">
                  Detection Results
                </h3>
                <span className="rounded-[20px] bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                  Sortable
                </span>
              </div>
              <div className="overflow-x-auto rounded-[10px] border border-slate-200 md:text-[13px]">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th
                        onClick={() => handleSortTable(0)}
                        className={`relative cursor-pointer select-none px-4 py-3.5 text-left text-[13px] font-semibold uppercase tracking-[0.3px] text-slate-600 hover:bg-slate-100 ${
                          sortColumn === 0 ? "" : ""
                        }`}
                      >
                        Object
                        <span
                          className={`ml-1.5 inline-block text-[11px] ${
                            sortColumn === 0 ? "opacity-100" : "opacity-40"
                          }`}
                        >
                          {sortColumn === 0
                            ? sortDirection === "asc"
                              ? "▲"
                              : "▼"
                            : "▼"}
                        </span>
                      </th>
                      <th
                        onClick={() => handleSortTable(1)}
                        className={`relative cursor-pointer select-none px-4 py-3.5 text-left text-[13px] font-semibold uppercase tracking-[0.3px] text-slate-600 hover:bg-slate-100 ${
                          sortColumn === 1 ? "" : ""
                        }`}
                      >
                        Confidence
                        <span
                          className={`ml-1.5 inline-block text-[11px] ${
                            sortColumn === 1 ? "opacity-100" : "opacity-40"
                          }`}
                        >
                          {sortColumn === 1
                            ? sortDirection === "asc"
                              ? "▲"
                              : "▼"
                            : "▼"}
                        </span>
                      </th>
                      <th
                        onClick={() => handleSortTable(2)}
                        className={`relative cursor-pointer select-none px-4 py-3.5 text-left text-[13px] font-semibold uppercase tracking-[0.3px] text-slate-600 hover:bg-slate-100 ${
                          sortColumn === 2 ? "" : ""
                        }`}
                      >
                        Bounding Box
                        <span
                          className={`ml-1.5 inline-block text-[11px] ${
                            sortColumn === 2 ? "opacity-100" : "opacity-40"
                          }`}
                        >
                          {sortColumn === 2
                            ? sortDirection === "asc"
                              ? "▲"
                              : "▼"
                            : "▼"}
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {detections.map((detection, index) => (
                      <tr key={index} className="hover:bg-slate-50">
                        <td className="border-t border-slate-200 px-4 py-3.5 text-slate-700 md:px-3 md:py-2.5">
                          <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-[13px] font-medium text-slate-600">
                            {detection.object}
                          </span>
                        </td>
                        <td className="border-t border-slate-200 px-4 py-3.5 text-slate-700 md:px-3 md:py-2.5">
                          <div className="flex items-center gap-2.5">
                            <div className="flex-1 overflow-hidden rounded-[3px] bg-slate-200 h-1.5">
                              <div
                                className="h-full rounded-[3px] bg-linear-to-r from-emerald-500 to-emerald-700 transition-[width] duration-300 ease-in-out"
                                style={{
                                  width: `${detection.confidence * 100}%`,
                                }}
                              />
                            </div>
                            <span className="min-w-[45px] text-[13px] font-semibold text-slate-900">
                              {Math.round(detection.confidence * 100)}%
                            </span>
                          </div>
                        </td>
                        <td className="border-t border-slate-200 px-4 py-3.5 text-slate-700 md:px-3 md:py-2.5">
                          <span className="font-['Courier_New',monospace] text-xs text-slate-500">
                            (
                            {detection.boundingBox
                              .map((coordinate) => Math.round(coordinate))
                              .join(", ")}
                            )
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_1px_3px_rgba(0,0,0,0.04)] md:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-linear-to-br from-purple-500 to-purple-700">
                <svg
                  viewBox="0 0 24 24"
                  className="h-[22px] w-[22px] stroke-white stroke-[2.5] fill-none"
                >
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-[17px] font-bold tracking-[-0.2px] text-slate-900">
                  Ask Questions About Results
                </h3>
                <p className="m-0 text-sm text-slate-500">
                  Powered by Gemini 2.5 Flash
                </p>
              </div>
            </div>

            <div
              className="mb-5 max-h-80 overflow-y-auto rounded-[10px] border border-slate-200 bg-slate-50 p-4"
              ref={chatContainerRef}
            >
              {messages.length === 0 ? (
                <AssistantMessage content="No messages yet. Start a conversation!" />
              ) : (
                messages.map((message, index) =>
                  message.role === "user" ? (
                    <UserMessage key={index} content={message.content} />
                  ) : (
                    <AssistantMessage key={index} content={message.content} />
                  )
                )
              )}
            </div>

            <form
              className="flex gap-3 sm:flex-col"
              onSubmit={handleQuestionSubmit(onQuestionSubmit)}
            >
              <input
                type="text"
                className="flex-1 rounded-[10px] border-[1.5px] border-slate-200 px-[18px] py-3 text-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100 font-['Inter',sans-serif]"
                placeholder="Ask a question about the detected objects..."
                {...registerQuestion("question", {
                  required: "Please enter a question",
                  minLength: {
                    value: 1,
                    message: "Question cannot be empty",
                  },
                })}
                disabled={
                  askGeminiMutation.isPending ||
                  !getValues("file") ||
                  detections.length === 0
                }
              />
              {questionErrors.question && (
                <p className="mt-1 text-sm text-red-600">
                  {questionErrors.question.message}
                </p>
              )}
              {!questionErrors.question && questionError && (
                <p className="mt-1 text-sm text-red-600">{questionError}</p>
              )}
              <button
                type="submit"
                className="whitespace-nowrap rounded-[10px] border-none bg-linear-to-br from-purple-500 to-purple-700 px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(139,92,246,0.3)] cursor-pointer font-['Inter',sans-serif] sm:w-full"
                disabled={
                  askGeminiMutation.isPending ||
                  !getValues("file") ||
                  detections.length === 0
                }
              >
                {askGeminiMutation.isPending ? "Sending..." : "Send"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </ProfileContextProvider>
  );
}
