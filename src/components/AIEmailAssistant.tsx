import React, { useState } from "react";
import {
  Sparkles,
  Wand2,
  Target,
  Clock,
  Lightbulb,
  RefreshCw,
} from "lucide-react";
import { EmailDraft } from "../types/gmail";

interface AIEmailAssistantProps {
  currentDraft: EmailDraft;
  onSuggestion: (suggestion: { subject?: string; body?: string }) => void;
}

interface AISuggestion {
  type: "subject" | "body" | "tone" | "length";
  title: string;
  content: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
}

export const AIEmailAssistant: React.FC<AIEmailAssistantProps> = ({
  currentDraft,
  onSuggestion,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTone, setSelectedTone] = useState<
    "professional" | "friendly" | "casual" | "formal"
  >("professional");
  const [selectedLength, setSelectedLength] = useState<
    "short" | "medium" | "long"
  >("medium");

  const generateSuggestions = (): AISuggestion[] => {
    const suggestions: AISuggestion[] = [];

    if (!currentDraft.subject || currentDraft.subject.length < 5) {
      suggestions.push({
        type: "subject",
        title: "Subject Line Ideas",
        content: getSubjectSuggestion(),
        description: "AI-generated subject lines for better open rates",
        icon: Target,
        color: "blue",
      });
    }

    if (!currentDraft.body || currentDraft.body.length < 20) {
      suggestions.push({
        type: "body",
        title: "Email Content",
        content: getBodySuggestion(),
        description: "Professional email template based on your recipient",
        icon: Wand2,
        color: "purple",
      });
    }

    if (currentDraft.body && currentDraft.body.length > 50) {
      suggestions.push({
        type: "tone",
        title: "Tone Enhancement",
        content: getToneImprovement(),
        description: `Adjust tone to be more ${selectedTone}`,
        icon: Lightbulb,
        color: "green",
      });
    }

    if (currentDraft.body && currentDraft.body.length > 100) {
      suggestions.push({
        type: "length",
        title: "Length Optimization",
        content: getLengthOptimization(),
        description: `Make email ${
          selectedLength === "short"
            ? "more concise"
            : selectedLength === "long"
            ? "more detailed"
            : "well-balanced"
        }`,
        icon: Clock,
        color: "orange",
      });
    }

    return suggestions;
  };

  const getSubjectSuggestion = (): string => {
    const recipient = currentDraft.to.split("@")[0] || "there";
    const subjects = [
      `Quick question for you`,
      `Following up on our conversation`,
      `Important update regarding [topic]`,
      `Collaboration opportunity`,
      `Meeting request - [topic]`,
      `Thank you for your time`,
    ];
    return subjects[Math.floor(Math.random() * subjects.length)];
  };

  const getBodySuggestion = (): string => {
    const recipient = currentDraft.to.split("@")[0] || "there";

    const templates = {
      professional: `Dear ${recipient},

I hope this email finds you well. I'm reaching out regarding [specific topic/purpose].

[Main content - explain your request, proposal, or information clearly and concisely]

I would appreciate your thoughts on this matter. Please let me know if you need any additional information or if you'd like to schedule a call to discuss further.

Thank you for your time and consideration.

Best regards,
[Your name]`,

      friendly: `Hi ${recipient}!

Hope you're having a great day! I wanted to reach out about [topic/purpose].

[Main content - share your thoughts, request, or information in a warm, approachable way]

Let me know what you think! I'm always happy to chat more about this if you'd like.

Thanks so much!
[Your name]`,

      casual: `Hey ${recipient},

Quick note about [topic]. 

[Main content - brief and to the point]

Let me know your thoughts when you get a chance.

Thanks!
[Your name]`,

      formal: `Dear ${recipient},

I am writing to [state purpose clearly and formally].

[Main content - detailed, structured information with clear points]

I would be grateful for your consideration of this matter and look forward to your response.

Yours sincerely,
[Your name]`,
    };

    return templates[selectedTone];
  };

  const getToneImprovement = (): string => {
    // Simulate tone adjustment based on current content
    const improvements = {
      professional:
        "Consider adding 'I hope this email finds you well' and using more formal language.",
      friendly:
        "Try adding personal touches and using warmer language like 'Hope you're doing well!'",
      casual:
        "Make it more conversational with shorter sentences and casual greetings.",
      formal:
        "Use more structured language and formal salutations for a professional tone.",
    };

    return improvements[selectedTone];
  };

  const getLengthOptimization = (): string => {
    const optimizations = {
      short:
        "Remove unnecessary details and focus on the key message. Use bullet points for clarity.",
      medium:
        "Balance detail with brevity. Include context but keep paragraphs concise.",
      long: "Add more context, examples, and detailed explanations to provide comprehensive information.",
    };

    return optimizations[selectedLength];
  };

  const handleApplySuggestion = async (suggestion: AISuggestion) => {
    setIsGenerating(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (suggestion.type === "subject") {
      onSuggestion({ subject: suggestion.content });
    } else if (suggestion.type === "body") {
      onSuggestion({ body: suggestion.content });
    } else if (suggestion.type === "tone" || suggestion.type === "length") {

      onSuggestion({
        body:
          currentDraft.body + "\n\n[AI Suggestion: " + suggestion.content + "]",
      });
    }

    setIsGenerating(false);
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100",
      purple:
        "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100",
      green: "bg-green-50 border-green-200 text-green-700 hover:bg-green-100",
      orange:
        "bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100",
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const suggestions = generateSuggestions();

  return (
    <div className="p-4 lg:p-6 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          AI Email Assistant
        </h3>
      </div>

      {/* AI Settings */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tone
          </label>
          <select
            value={selectedTone}
            onChange={(e) => setSelectedTone(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          >
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="casual">Casual</option>
            <option value="formal">Formal</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Length
          </label>
          <select
            value={selectedLength}
            onChange={(e) => setSelectedLength(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          >
            <option value="short">Short & Concise</option>
            <option value="medium">Medium Length</option>
            <option value="long">Detailed</option>
          </select>
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="space-y-4">
        {suggestions.length > 0 ? (
          suggestions.map((suggestion, index) => {
            const IconComponent = suggestion.icon;
            return (
              <div
                key={index}
                className={`border-2 rounded-lg p-4 transition-all ${getColorClasses(
                  suggestion.color
                )}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {suggestion.title}
                      </h4>
                      <p className="text-sm opacity-75 mb-3">
                        {suggestion.description}
                      </p>
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                          {suggestion.content}
                        </pre>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleApplySuggestion(suggestion)}
                    disabled={isGenerating}
                    className="ml-3 px-3 py-1 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm disabled:opacity-50 flex items-center space-x-1"
                  >
                    {isGenerating ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Wand2 className="w-4 h-4" />
                    )}
                    <span>Apply</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 text-purple-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              AI Ready to Help!
            </h4>
            <p className="text-gray-600 text-sm">
              Start typing your email and I'll provide intelligent suggestions
              to improve your content.
            </p>
          </div>
        )}
      </div>

      {/* AI Tips */}
      <div className="mt-6 bg-white rounded-lg p-4 border border-purple-200">
        <div className="flex items-start space-x-2">
          <Lightbulb className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <h5 className="text-sm font-medium text-gray-900 mb-1">
              AI Writing Tips
            </h5>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>
                • Keep subject lines under 50 characters for better mobile
                display
              </li>
              <li>• Use active voice and clear, direct language</li>
              <li>• Include a clear call-to-action when needed</li>
              <li>• Personalize your greeting when possible</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
