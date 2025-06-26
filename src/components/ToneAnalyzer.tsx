import React, { useState, useEffect } from "react";
import {
  Eye,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  RefreshCw,
} from "lucide-react";
import { EmailDraft } from "../types/gmail";

interface ToneAnalyzerProps {
  emailContent: EmailDraft;
  onSuggestion: (suggestion: { subject?: string; body?: string }) => void;
}

interface ToneAnalysis {
  overall:
    | "professional"
    | "friendly"
    | "casual"
    | "formal"
    | "aggressive"
    | "neutral";
  confidence: number;
  sentiment: "positive" | "negative" | "neutral";
  readability: "easy" | "moderate" | "difficult";
  suggestions: string[];
  improvements: Array<{
    type: "tone" | "clarity" | "politeness" | "conciseness";
    message: string;
    severity: "low" | "medium" | "high";
  }>;
}

export const ToneAnalyzer: React.FC<ToneAnalyzerProps> = ({
  emailContent,
  onSuggestion,
}) => {
  const [analysis, setAnalysis] = useState<ToneAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeEmailTone = (content: EmailDraft): ToneAnalysis => {
    const text = `${content.subject} ${content.body}`.toLowerCase();
    const words = text.split(/\s+/).filter((word) => word.length > 0);

    // Tone indicators
    const professionalWords = [
      "please",
      "thank",
      "regards",
      "sincerely",
      "appreciate",
      "consider",
      "kindly",
      "respectfully",
    ];
    const friendlyWords = [
      "hi",
      "hello",
      "hope",
      "great",
      "awesome",
      "wonderful",
      "excited",
      "looking forward",
    ];
    const casualWords = [
      "hey",
      "yeah",
      "cool",
      "sure",
      "ok",
      "okay",
      "thanks",
      "btw",
    ];
    const formalWords = [
      "pursuant",
      "therefore",
      "furthermore",
      "consequently",
      "hereby",
      "aforementioned",
    ];
    const aggressiveWords = [
      "urgent",
      "immediately",
      "asap",
      "must",
      "need",
      "require",
      "demand",
      "insist",
    ];

    // Sentiment indicators
    const positiveWords = [
      "good",
      "great",
      "excellent",
      "wonderful",
      "amazing",
      "perfect",
      "love",
      "happy",
    ];
    const negativeWords = [
      "bad",
      "terrible",
      "awful",
      "hate",
      "angry",
      "frustrated",
      "disappointed",
      "wrong",
    ];

    // Calculate scores
    const professionalScore = professionalWords.filter((word) =>
      text.includes(word)
    ).length;
    const friendlyScore = friendlyWords.filter((word) =>
      text.includes(word)
    ).length;
    const casualScore = casualWords.filter((word) =>
      text.includes(word)
    ).length;
    const formalScore = formalWords.filter((word) =>
      text.includes(word)
    ).length;
    const aggressiveScore = aggressiveWords.filter((word) =>
      text.includes(word)
    ).length;

    const positiveScore = positiveWords.filter((word) =>
      text.includes(word)
    ).length;
    const negativeScore = negativeWords.filter((word) =>
      text.includes(word)
    ).length;

    // Determine overall tone
    const scores = {
      professional: professionalScore,
      friendly: friendlyScore,
      casual: casualScore,
      formal: formalScore,
      aggressive: aggressiveScore,
      neutral: 0,
    };

    const maxScore = Math.max(...Object.values(scores));
    const overall = Object.keys(scores).find(
      (key) => scores[key as keyof typeof scores] === maxScore
    ) as ToneAnalysis["overall"];

    // Calculate confidence
    const totalWords = words.length;
    const confidence = Math.min(
      100,
      Math.max(20, (maxScore / Math.max(1, totalWords * 0.1)) * 100)
    );

    // Determine sentiment
    let sentiment: ToneAnalysis["sentiment"] = "neutral";
    if (positiveScore > negativeScore) sentiment = "positive";
    else if (negativeScore > positiveScore) sentiment = "negative";

    // Calculate readability
    const avgWordsPerSentence =
      words.length / Math.max(1, content.body.split(/[.!?]+/).length);
    const readability: ToneAnalysis["readability"] =
      avgWordsPerSentence < 15
        ? "easy"
        : avgWordsPerSentence < 25
        ? "moderate"
        : "difficult";

    // Generate suggestions and improvements
    const suggestions: string[] = [];
    const improvements: ToneAnalysis["improvements"] = [];

    // Tone-specific suggestions
    if (overall === "aggressive") {
      suggestions.push(
        "Consider using softer language to maintain professionalism"
      );
      improvements.push({
        type: "tone",
        message: "Replace urgent language with polite requests",
        severity: "high",
      });
    }

    if (overall === "casual" && content.to.includes("@")) {
      const domain = content.to.split("@")[1];
      if (!["gmail.com", "yahoo.com", "hotmail.com"].includes(domain)) {
        suggestions.push(
          "Consider a more professional tone for business emails"
        );
        improvements.push({
          type: "tone",
          message:
            "Use formal greetings and closings for business communication",
          severity: "medium",
        });
      }
    }

    // Clarity suggestions
    if (readability === "difficult") {
      suggestions.push("Break down long sentences for better readability");
      improvements.push({
        type: "clarity",
        message: "Simplify complex sentences and use bullet points",
        severity: "medium",
      });
    }

    // Politeness suggestions
    if (!text.includes("please") && !text.includes("thank")) {
      suggestions.push('Add polite expressions like "please" and "thank you"');
      improvements.push({
        type: "politeness",
        message: "Include courteous language to improve tone",
        severity: "low",
      });
    }

    // Conciseness suggestions
    if (words.length > 200) {
      suggestions.push("Consider making your message more concise");
      improvements.push({
        type: "conciseness",
        message: "Remove unnecessary words and focus on key points",
        severity: "low",
      });
    }

    return {
      overall,
      confidence: Math.round(confidence),
      sentiment,
      readability,
      suggestions,
      improvements,
    };
  };

  const performAnalysis = async () => {
    if (!emailContent.body && !emailContent.subject) return;

    setIsAnalyzing(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const result = analyzeEmailTone(emailContent);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  const applyImprovement = (improvement: ToneAnalysis["improvements"][0]) => {
    let improvedBody = emailContent.body;
    let improvedSubject = emailContent.subject;

    switch (improvement.type) {
      case "tone":
        if (analysis?.overall === "aggressive") {
          improvedBody = improvedBody
            .replace(/urgent/gi, "important")
            .replace(/immediately/gi, "at your earliest convenience")
            .replace(/must/gi, "would appreciate if you could")
            .replace(/need/gi, "would like");
        }
        break;
      case "politeness":
        if (!improvedBody.toLowerCase().includes("please")) {
          improvedBody = improvedBody.replace(
            /could you/gi,
            "could you please"
          );
        }
        if (!improvedBody.toLowerCase().includes("thank")) {
          improvedBody += "\n\nThank you for your time.";
        }
        break;
      case "clarity":
        improvedBody = improvedBody.replace(/\. /g, ".\n\n");
        break;
    }

    onSuggestion({ subject: improvedSubject, body: improvedBody });
  };

  const getToneColor = (tone: string) => {
    const colors = {
      professional: "text-blue-700 bg-blue-100",
      friendly: "text-green-700 bg-green-100",
      casual: "text-yellow-700 bg-yellow-100",
      formal: "text-purple-700 bg-purple-100",
      aggressive: "text-red-700 bg-red-100",
      neutral: "text-gray-700 bg-gray-100",
    };
    return colors[tone as keyof typeof colors] || colors.neutral;
  };

  const getSentimentColor = (sentiment: string) => {
    const colors = {
      positive: "text-green-700 bg-green-100",
      negative: "text-red-700 bg-red-100",
      neutral: "text-gray-700 bg-gray-100",
    };
    return colors[sentiment as keyof typeof colors] || colors.neutral;
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "medium":
        return <TrendingUp className="w-4 h-4 text-yellow-500" />;
      case "low":
        return <Lightbulb className="w-4 h-4 text-blue-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  useEffect(() => {
    if (emailContent.body || emailContent.subject) {
      const debounceTimer = setTimeout(() => {
        performAnalysis();
      }, 1000);

      return () => clearTimeout(debounceTimer);
    }
  }, [emailContent.body, emailContent.subject]);

  return (
    <div className="p-4 lg:p-6 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="flex items-center space-x-2 mb-4">
        <Eye className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-semibold text-gray-900">Tone Analysis</h3>
        {isAnalyzing && (
          <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
        )}
      </div>

      {!analysis && !isAnalyzing && (
        <div className="text-center py-8">
          <Eye className="w-12 h-12 text-indigo-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            Start Writing to Analyze Tone
          </h4>
          <p className="text-gray-600 text-sm">
            I'll analyze your email's tone and provide suggestions for better
            communication.
          </p>
        </div>
      )}

      {isAnalyzing && (
        <div className="text-center py-8">
          <RefreshCw className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-4" />
          <p className="text-gray-600">Analyzing your email tone...</p>
        </div>
      )}

      {analysis && (
        <div className="space-y-6">
          {/* Overall Analysis */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-indigo-200">
              <h4 className="font-medium text-gray-900 mb-2">Overall Tone</h4>
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getToneColor(
                  analysis.overall
                )}`}
              >
                {analysis.overall.charAt(0).toUpperCase() +
                  analysis.overall.slice(1)}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {analysis.confidence}% confidence
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-indigo-200">
              <h4 className="font-medium text-gray-900 mb-2">Sentiment</h4>
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(
                  analysis.sentiment
                )}`}
              >
                {analysis.sentiment.charAt(0).toUpperCase() +
                  analysis.sentiment.slice(1)}
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-indigo-200">
              <h4 className="font-medium text-gray-900 mb-2">Readability</h4>
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  analysis.readability === "easy"
                    ? "text-green-700 bg-green-100"
                    : analysis.readability === "moderate"
                    ? "text-yellow-700 bg-yellow-100"
                    : "text-red-700 bg-red-100"
                }`}
              >
                {analysis.readability.charAt(0).toUpperCase() +
                  analysis.readability.slice(1)}
              </div>
            </div>
          </div>

          {/* Improvements */}
          {analysis.improvements.length > 0 && (
            <div className="bg-white rounded-lg p-4 border border-indigo-200">
              <h4 className="font-medium text-gray-900 mb-3">
                Suggested Improvements
              </h4>
              <div className="space-y-3">
                {analysis.improvements.map((improvement, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-start space-x-3 flex-1">
                      {getSeverityIcon(improvement.severity)}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {improvement.type}
                        </p>
                        <p className="text-sm text-gray-600">
                          {improvement.message}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => applyImprovement(improvement)}
                      className="ml-3 px-3 py-1 bg-indigo-500 text-white text-xs rounded-lg hover:bg-indigo-600 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* General Suggestions */}
          {analysis.suggestions.length > 0 && (
            <div className="bg-white rounded-lg p-4 border border-indigo-200">
              <h4 className="font-medium text-gray-900 mb-3">
                Communication Tips
              </h4>
              <ul className="space-y-2">
                {analysis.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Lightbulb className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tone Guidelines */}
          <div className="bg-white rounded-lg p-4 border border-indigo-200">
            <h4 className="font-medium text-gray-900 mb-3">Tone Guidelines</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium text-gray-800 mb-2">
                  Professional Emails
                </h5>
                <ul className="text-gray-600 space-y-1">
                  <li>• Use formal greetings and closings</li>
                  <li>• Include "please" and "thank you"</li>
                  <li>• Keep sentences clear and concise</li>
                  <li>• Avoid slang and casual expressions</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-gray-800 mb-2">
                  Effective Communication
                </h5>
                <ul className="text-gray-600 space-y-1">
                  <li>• State your purpose clearly</li>
                  <li>• Use positive language when possible</li>
                  <li>• Be specific about next steps</li>
                  <li>• Proofread before sending</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
