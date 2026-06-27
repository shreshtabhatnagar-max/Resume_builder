"use client";
import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useStartInterview, useSubmitAnswer } from "@/hooks/useInterview";
import { interviewService } from "@/services/interview.service";
import {
  InterviewSessionResponse,
  InterviewQuestion,
  AnswerResponse,
  InterviewReportResponse,
} from "@/types";
import {
  Upload,
  Mic,
  Square,
  Loader2,
  FileText,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

type Screen = "upload" | "interview" | "report";

export default function MockInterviewPage() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>("upload");

  // Upload screen state
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [roleTitle, setRoleTitle] = useState("");

  // Interview screen state
  const [session, setSession] = useState<InterviewSessionResponse | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [lastAnswer, setLastAnswer] = useState<AnswerResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Report screen state
  const [report, setReport] = useState<InterviewReportResponse | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { mutate: startInterview, isPending: starting } = useStartInterview();
  const { mutate: submitAnswerMutation } = useSubmitAnswer();

  // ─── Upload screen handlers ─────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = [".pdf", ".docx"];
    const isValid = validTypes.some((ext) => file.name.toLowerCase().endsWith(ext));
    if (!isValid) {
      toast.error("Please upload a PDF or DOCX file");
      return;
    }
    setCvFile(file);
  };

  const handleStart = () => {
    if (!cvFile) {
      toast.error("Please upload your CV first");
      return;
    }
    if (!roleTitle.trim()) {
      toast.error("Please enter the role you're targeting");
      return;
    }
    startInterview(
      { cv: cvFile, roleTitle: roleTitle.trim() },
      {
        onSuccess: (data) => {
          setSession(data);
          setCurrentIndex(0);
          setLastAnswer(null);
          setScreen("interview");
          toast.success("Interview ready! Let's begin.");
        },
      }
    );
  };

  // ─── Recording handlers ─────────────────────────────────────
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    } catch {
      toast.error("Microphone access denied. Please allow microphone access to continue.");
    }
  }, []);

  const stopRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || !session) return;

    recorder.onstop = async () => {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsRecording(false);

      const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
      const currentQuestion = session.questions[currentIndex];

      setSubmitting(true);
      submitAnswerMutation(
        {
          sessionId: session.sessionId,
          questionId: currentQuestion.questionId,
          audioBlob,
        },
        {
          onSuccess: (data) => {
            setLastAnswer(data);
            setSubmitting(false);
          },
          onError: () => setSubmitting(false),
        }
      );
    };

    recorder.stop();
    recorder.stream.getTracks().forEach((track) => track.stop());
  }, [session, currentIndex, submitAnswerMutation]);

  // ─── Navigation between questions ───────────────────────────
  const handleNextQuestion = () => {
    if (!session) return;
    setLastAnswer(null);
    setRecordingSeconds(0);
    if (currentIndex < session.questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    if (!session) return;
    setLoadingReport(true);
    setScreen("report");
    try {
      const data = await interviewService.getReport(session.sessionId);
      setReport(data);
    } catch {
      toast.error("Failed to load your report. Please try again.");
    } finally {
      setLoadingReport(false);
    }
  };

  const handleRestart = () => {
    setScreen("upload");
    setCvFile(null);
    setRoleTitle("");
    setSession(null);
    setCurrentIndex(0);
    setLastAnswer(null);
    setReport(null);
  };

  // ─── Render: Upload Screen ───────────────────────────────────
  if (screen === "upload") {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-[var(--accent-muted)] flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-[var(--accent)]" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-2">AI Mock Interview</h1>
          <p className="text-[var(--muted-foreground)]">
            Upload your CV and practice with voice-based interview questions tailored to your experience.
          </p>
        </div>

        <Card>
          <CardHeader>
            <h2 className="font-display font-semibold text-lg">Get Started</h2>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <label className="text-sm font-medium text-[#aaa] mb-1.5 block">Upload your CV</label>
              <label
                htmlFor="cv-upload"
                className="flex flex-col items-center justify-center gap-2 border border-dashed border-[var(--border)] rounded-xl py-8 cursor-pointer hover:border-[var(--accent)]/40 hover:bg-[var(--accent-muted)] transition-all"
              >
                {cvFile ? (
                  <>
                    <FileText className="w-6 h-6 text-[var(--accent)]" />
                    <span className="text-sm font-medium">{cvFile.name}</span>
                    <span className="text-xs text-[var(--muted-foreground)]">Click to change</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-[var(--muted-foreground)]" />
                    <span className="text-sm text-[var(--muted-foreground)]">PDF or DOCX, up to 5MB</span>
                  </>
                )}
                <input
                  id="cv-upload"
                  type="file"
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            <Input
              label="Target Role"
              placeholder="e.g. Java Backend Developer"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
            />

            <Button onClick={handleStart} loading={starting} className="w-full" size="lg">
              Start Mock Interview
              <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Render: Interview Screen ────────────────────────────────
  if (screen === "interview" && session) {
    const currentQuestion: InterviewQuestion = session.questions[currentIndex];
    const isLastQuestion = currentIndex === session.questions.length - 1;

    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-[var(--muted-foreground)]">
            Question {currentIndex + 1} of {session.questions.length}
          </span>
          <div className="flex gap-1">
            {session.questions.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 w-8 rounded-full ${
                  i <= currentIndex ? "bg-[var(--accent)]" : "bg-[var(--border)]"
                }`}
              />
            ))}
          </div>
        </div>

        <Card>
          <CardContent className="p-6 sm:p-8">
            <p className="text-lg font-medium leading-relaxed mb-8">
              {currentQuestion.questionText}
            </p>

            {!lastAnswer ? (
              <div className="flex flex-col items-center gap-4 py-6">
                {submitting ? (
                  <>
                    <Loader2 className="w-10 h-10 text-[var(--accent)] animate-spin" />
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Evaluating your answer...
                    </p>
                  </>
                ) : isRecording ? (
                  <>
                    <button
                      onClick={stopRecording}
                      className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-all animate-pulse"
                    >
                      <Square className="w-6 h-6 text-white" fill="white" />
                    </button>
                    <p className="text-sm text-red-400 font-medium">
                      Recording... {recordingSeconds}s
                    </p>
                  </>
                ) : (
                  <>
                    <button
                      onClick={startRecording}
                      className="w-16 h-16 rounded-full bg-[var(--accent)] flex items-center justify-center hover:opacity-90 transition-all"
                    >
                      <Mic className="w-6 h-6 text-[#080808]" />
                    </button>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Tap to record your answer
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-[var(--card-hover)] rounded-xl p-4">
                  <p className="text-xs text-[var(--muted-foreground)] mb-1">Your answer</p>
                  <p className="text-sm leading-relaxed">{lastAnswer.answerTranscript}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 bg-[var(--accent-muted)] text-[var(--accent)] px-3 py-1 rounded-full text-sm font-semibold">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {lastAnswer.score}/100
                  </div>
                </div>
                <div className="bg-[var(--card-hover)] rounded-xl p-4">
                  <p className="text-xs text-[var(--muted-foreground)] mb-1">Feedback</p>
                  <p className="text-sm leading-relaxed">{lastAnswer.feedback}</p>
                </div>
                <Button onClick={handleNextQuestion} className="w-full" size="lg">
                  {isLastQuestion ? "Finish & See Report" : "Next Question"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Render: Report Screen ────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {loadingReport ? (
        <div className="flex flex-col items-center gap-4 py-24">
          <Loader2 className="w-10 h-10 text-[var(--accent)] animate-spin" />
          <p className="text-[var(--muted-foreground)]">Generating your report...</p>
        </div>
      ) : report ? (
        <>
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-[var(--accent-muted)] flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7 text-[var(--accent)]" />
            </div>
            <h1 className="font-display text-3xl font-bold mb-2">Interview Complete</h1>
            <p className="text-[var(--muted-foreground)]">Here's how you did overall.</p>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6 sm:p-8 text-center">
              <p className="text-sm text-[var(--muted-foreground)] mb-2">Overall Score</p>
              <p className="font-display text-5xl font-bold text-[var(--accent)]">
                {report.overallScore}
                <span className="text-2xl text-[var(--muted-foreground)]">/100</span>
              </p>
            </CardContent>
          </Card>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3 text-green-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <h3 className="font-semibold text-sm">Strengths</h3>
                </div>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed whitespace-pre-line">
                  {report.strengths}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3 text-amber-400">
                  <AlertCircle className="w-4 h-4" />
                  <h3 className="font-semibold text-sm">Areas to Improve</h3>
                </div>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed whitespace-pre-line">
                  {report.improvements}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardContent className="p-5">
              <h3 className="font-semibold text-sm mb-2">Summary</h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                {report.summary}
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <h3 className="font-semibold">Question Breakdown</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {report.questions.map((q, i) => (
                <div
                  key={i}
                  className="border-t border-[var(--border)] pt-4 first:border-t-0 first:pt-0"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-sm font-medium flex-1">{q.questionText}</p>
                    {q.score !== null && (
                      <span className="text-xs font-semibold text-[var(--accent)] flex-shrink-0">
                        {q.score}/100
                      </span>
                    )}
                  </div>
                  {q.answerTranscript ? (
                    <p className="text-xs text-[var(--muted-foreground)]">{q.feedback}</p>
                  ) : (
                    <p className="text-xs text-red-400">Not answered</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={handleRestart}>
              Practice Again
            </Button>
            <Button className="flex-1" onClick={() => router.push("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </>
      ) : null}
    </div>
  );
}
