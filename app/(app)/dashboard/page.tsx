"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";
import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Save, Loader2, RefreshCcw, Lightbulb } from "lucide-react";

function Page() {
  type Insight = {
    title: string;
    description: string;
    quote: string;
    count: number;
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const [feedbackContext, setFeedbackContext] = useState("");
  const [isSavingContext, setIsSavingContext] = useState(false);
  const [isLoadingContext, setIsLoadingContext] = useState(false);

  const [insights, setInsights] = useState<Insight[]>([]);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [insightsError, setInsightsError] = useState("");

  const handleDeleteMessage = (messageId: string) => {
    setMessages(
      messages.filter((message) => message._id.toString() !== messageId),
    );
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      acceptMessages: false,
    },
  });

  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>(`/api/accept-messages`);
      setValue("acceptMessages", response.data.isAcceptingMessages ?? false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.add({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to fetch message settings",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);

      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast.add({
            title: "Refreshed messages",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.add({
          title: "Error",
          description:
            axiosError.response?.data.message ||
            "Failed to fetch message settings",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setMessages],
  );

  const fetchFeedbackContext = useCallback(async () => {
    setIsLoadingContext(true);
    try {
      const response = await axios.get<ApiResponse>("/api/feedback-context");
      setFeedbackContext(response.data.feedbackContext ?? "");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.add({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to load feedback context",
      });
    } finally {
      setIsLoadingContext(false);
    }
  }, []);

  const handleSaveContext = async () => {
    setIsSavingContext(true);
    try {
      const response = await axios.post<ApiResponse>("/api/feedback-context", {
        context: feedbackContext,
      });
      toast.add({ title: response.data.message });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.add({
        title: "Error",
        description:
          axiosError.response?.data.message || "Failed to save context",
      });
    } finally {
      setIsSavingContext(false);
    }
  };

  const handleGenerateInsights = async () => {
    setIsGeneratingInsights(true);
    setInsightsError("");
    setInsights([]);

    function parseInsights(raw: string): Insight[] {
      const chunks = raw
        .split("|||")
        .map((c) => c.trim())
        .filter(Boolean);
      const parsed: Insight[] = [];

      for (const chunk of chunks) {
        const parts = chunk.split("::");
        if (parts.length < 4) continue; // still streaming in, incomplete — skip until whole
        const [title, description, quote, countStr] = parts;
        const count = parseInt(countStr, 10);
        parsed.push({
          title: title.trim(),
          description: description.trim(),
          quote: quote.trim(),
          count: isNaN(count) ? 0 : count,
        });
      }

      return parsed;
    }

    try {
      const response = await fetch("/api/feedback-insights", {
        method: "POST",
      });

      if (!response.ok || !response.body) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.message ?? "Failed to generate insights");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        setInsights(parseInsights(fullText));
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to generate insights";
      setInsightsError(message);
      toast.add({ title: "Error", description: message });
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
    fetchFeedbackContext();
  }, [
    session,
    setValue,
    fetchAcceptMessage,
    fetchMessages,
    fetchFeedbackContext,
  ]);

  // handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast.add({
        title: response.data.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.add({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to fetch message settings",
      });
    }
  };

  if (!session || !session.user) {
    return <div>Please Login</div>;
  }

  const { username } = session?.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.add({
      title: "URL copied",
      description: "Profile URL has been copied to clipboard",
    });
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
        <div className="mb-4">
          <Switch
            {...register("acceptMessages")}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span className="ml-2">
            Accept Messages: {acceptMessages ? "On" : "Off"}
          </span>
        </div>
        <Separator />
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">AI Feedback Context</h2>
          <p className="text-sm text-muted-foreground mb-3">
            Tell the AI what kind of feedback you are looking for.
          </p>
          <Textarea
            value={feedbackContext}
            onChange={(e) => setFeedbackContext(e.target.value)}
            placeholder="I am a Full Stack web developer, need feedback on my latest website?"
            rows={4}
            disabled={isLoadingContext}
            className="mb-3"
          />
          <Button
            onClick={handleSaveContext}
            disabled={isSavingContext}
            className="gap-2"
          >
            {isSavingContext ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Context
          </Button>
        </div>
        <Separator className="mb-6" />
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">AI Feedback Insights</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateInsights}
              disabled={isGeneratingInsights || messages.length < 3}
              className="gap-2"
            >
              {isGeneratingInsights ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Refresh Insights
            </Button>
          </div>


          {messages.length < 3 ? (
            <p className="text-sm text-muted-foreground">
              Need at least 3 messages to generate insights.
            </p>
          ) : insightsError ? (
            <p className="text-sm text-red-500">{insightsError}</p>
          ) : insights.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Click &quot;Refresh Insights&quot; to generate insights from your
              messages.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.map((insight, index) => (
                <div key={index} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-2 gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Lightbulb className="h-4 w-4 text-yellow-500 shrink-0" />
                      <h3 className="font-semibold truncate">
                        {insight.title}
                      </h3>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {insight.count}{" "}
                      {insight.count === 1 ? "message" : "messages"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {insight.description}
                  </p>
                  <blockquote className="border-l-2 pl-3 text-sm italic text-muted-foreground">
                    &quot;{insight.quote}&quot;
                  </blockquote>
                </div>
              ))}
            </div>
          )}
        </div>
        <Button
          className="mt-4"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
        </Button>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageCard
                key={message._id.toString()}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <p>No messages to display.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;
