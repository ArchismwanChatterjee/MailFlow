import React, { useState } from "react";
import {
  Zap,
  Briefcase,
  Heart,
  Calendar,
  MessageSquare,
  Star,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface EmailTemplate {
  id: string;
  name: string;
  category: "business" | "personal" | "follow-up" | "meeting";
  subject: string;
  body: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface EmailTemplatesProps {
  onSelectTemplate: (template: { subject: string; body: string }) => void;
}

const templates: EmailTemplate[] = [
  // Business Templates
  {
    id: "business-intro",
    name: "Business Introduction",
    category: "business",
    subject: "Introduction - [Your Name] from [Company]",
    body: `Hello [Name],

I hope this email finds you well. My name is [Your Name], and I'm reaching out from [Company Name].

[Brief introduction about yourself and your company]

I'd love to explore potential opportunities for collaboration between our organizations. Would you be available for a brief call next week to discuss this further?

Looking forward to hearing from you.

Best regards,
[Your Name]
[Your Title]
[Company Name]
[Contact Information]`,
    icon: Briefcase,
    color: "blue",
  },
  {
    id: "proposal-follow-up",
    name: "Proposal Follow-up",
    category: "follow-up",
    subject: "Following up on our proposal - [Project Name]",
    body: `Hi [Name],

I wanted to follow up on the proposal we submitted for [Project Name] on [Date].

I understand you're likely reviewing multiple options, and I'm happy to answer any questions or provide additional information that might be helpful in your decision-making process.

Key highlights of our proposal:
• [Key Point 1]
• [Key Point 2]
• [Key Point 3]

Would you like to schedule a brief call to discuss any aspects of the proposal in more detail?

Thank you for your time and consideration.

Best regards,
[Your Name]`,
    icon: Star,
    color: "purple",
  },
  // Meeting Templates
  {
    id: "meeting-request",
    name: "Meeting Request",
    category: "meeting",
    subject: "Meeting Request - [Topic]",
    body: `Hello [Name],

I hope you're doing well. I'd like to schedule a meeting to discuss [specific topic/project].

Proposed agenda:
• [Agenda Item 1]
• [Agenda Item 2]
• [Agenda Item 3]

I'm available on the following dates and times:
• [Option 1]
• [Option 2]
• [Option 3]

The meeting should take approximately [duration]. Please let me know which time works best for you, or suggest an alternative if none of these options are suitable.

Looking forward to our discussion.

Best regards,
[Your Name]`,
    icon: Calendar,
    color: "green",
  },
  {
    id: "meeting-confirmation",
    name: "Meeting Confirmation",
    category: "meeting",
    subject: "Meeting Confirmation - [Date] at [Time]",
    body: `Hi [Name],

This is to confirm our meeting scheduled for [Date] at [Time].

Meeting Details:
• Date: [Date]
• Time: [Time]
• Duration: [Duration]
• Location/Link: [Meeting Location or Video Call Link]
• Topic: [Meeting Topic]

Agenda:
• [Agenda Item 1]
• [Agenda Item 2]
• [Agenda Item 3]

Please let me know if you need to reschedule or if you have any questions before our meeting.

See you then!

Best regards,
[Your Name]`,
    icon: Calendar,
    color: "green",
  },
  // Personal Templates
  {
    id: "thank-you",
    name: "Thank You Note",
    category: "personal",
    subject: "Thank you for [specific reason]",
    body: `Dear [Name],

I wanted to take a moment to express my sincere gratitude for [specific reason].

[Elaborate on what they did and how it helped you]

Your [kindness/support/expertise/time] made a real difference, and I truly appreciate it.

Thank you again for everything.

Warm regards,
[Your Name]`,
    icon: Heart,
    color: "pink",
  },
  // Follow-up Templates
  {
    id: "general-follow-up",
    name: "General Follow-up",
    category: "follow-up",
    subject: "Following up on our conversation",
    body: `Hi [Name],

I hope you're having a great week. I wanted to follow up on our conversation about [topic] from [when you spoke].

[Briefly recap the key points discussed]

As discussed, I'm attaching [relevant documents/information] for your review.

Next steps:
• [Action Item 1]
• [Action Item 2]
• [Action Item 3]

Please let me know if you have any questions or if there's anything else I can provide.

Best regards,
[Your Name]`,
    icon: MessageSquare,
    color: "orange",
  },
];

export const EmailTemplates: React.FC<EmailTemplatesProps> = ({
  onSelectTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);

  const categories = [
    { id: "all", name: "All Templates", count: templates.length },
    {
      id: "business",
      name: "Business",
      count: templates.filter((t) => t.category === "business").length,
    },
    {
      id: "meeting",
      name: "Meetings",
      count: templates.filter((t) => t.category === "meeting").length,
    },
    {
      id: "follow-up",
      name: "Follow-ups",
      count: templates.filter((t) => t.category === "follow-up").length,
    },
    {
      id: "personal",
      name: "Personal",
      count: templates.filter((t) => t.category === "personal").length,
    },
  ];

  const filteredTemplates =
    selectedCategory === "all"
      ? templates
      : templates.filter((t) => t.category === selectedCategory);

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "bg-blue-100 text-blue-700 border-blue-200",
      purple: "bg-purple-100 text-purple-700 border-purple-200",
      green: "bg-green-100 text-green-700 border-green-200",
      pink: "bg-pink-100 text-pink-700 border-pink-200",
      orange: "bg-orange-100 text-orange-700 border-orange-200",
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="p-4 lg:p-6 bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="flex items-center space-x-2 mb-4">
        <Zap className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Smart Email Templates
        </h3>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            {category.name} ({category.count})
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid gap-3">
        {filteredTemplates.map((template) => {
          const IconComponent = template.icon;
          const isExpanded = expandedTemplate === template.id;

          return (
            <div
              key={template.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${getColorClasses(
                        template.color
                      )}`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {template.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {template.subject}
                      </p>
                      {isExpanded && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                            {template.body}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-3">
                    <button
                      onClick={() =>
                        setExpandedTemplate(isExpanded ? null : template.id)
                      }
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title={isExpanded ? "Collapse" : "Preview"}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() =>
                        onSelectTemplate({
                          subject: template.subject,
                          body: template.body,
                        })
                      }
                      className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Use Template
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8">
          <Zap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No templates found in this category.</p>
        </div>
      )}
    </div>
  );
};
