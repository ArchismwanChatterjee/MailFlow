import React, { useState, useEffect } from "react";
import {
  Shield,
  AlertTriangle,
  Eye,
  Lock,
  ExternalLink,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { EmailDraft } from "../types/gmail";

interface SecurityScannerProps {
  emailContent: EmailDraft;
  onWarningsUpdate: (warnings: string[]) => void;
}

interface SecurityIssue {
  type:
    | "sensitive_data"
    | "suspicious_link"
    | "weak_security"
    | "phishing_risk";
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  details: string;
  suggestion: string;
}

interface SensitivePattern {
  pattern: RegExp;
  type: string;
  description: string;
}

export const SecurityScanner: React.FC<SecurityScannerProps> = ({
  emailContent,
  onWarningsUpdate,
}) => {
  const [securityIssues, setSecurityIssues] = useState<SecurityIssue[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanTime, setLastScanTime] = useState<Date | null>(null);

  // Sensitive data patterns
  const sensitivePatterns: SensitivePattern[] = [
    {
      pattern: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
      type: "Credit Card",
      description: "Credit card number detected",
    },
    {
      pattern: /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g,
      type: "SSN",
      description: "Social Security Number detected",
    },
    {
      pattern:
        /\b[A-Z]{2}\d{2}[-\s]?[A-Z0-9]{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{2}\b/g,
      type: "IBAN",
      description: "International Bank Account Number detected",
    },
    {
      pattern: /password\s*[:=]\s*\S+/gi,
      type: "Password",
      description: "Password information detected",
    },
    {
      pattern: /api[_-]?key\s*[:=]\s*\S+/gi,
      type: "API Key",
      description: "API key detected",
    },
    {
      pattern: /token\s*[:=]\s*\S+/gi,
      type: "Token",
      description: "Authentication token detected",
    },
    {
      pattern: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
      type: "IP Address",
      description: "IP address detected",
    },
  ];

  const suspiciousPatterns = [
    /bit\.ly|tinyurl|t\.co|goo\.gl|ow\.ly/gi, // URL shorteners
    /urgent|immediate|act now|limited time|expires today/gi, // Urgency indicators
    /click here|download now|verify account|update payment/gi, // Phishing phrases
    /congratulations|you've won|claim your prize/gi, // Scam indicators
  ];

  const performSecurityScan = async () => {
    if (!emailContent.body && !emailContent.subject) {
      setSecurityIssues([]);
      onWarningsUpdate([]);
      return;
    }

    setIsScanning(true);

    // Simulate scanning time
    await new Promise((resolve) => setTimeout(resolve, 800));

    const issues: SecurityIssue[] = [];
    const fullText = `${emailContent.subject} ${emailContent.body}`;

    // Check for sensitive data
    sensitivePatterns.forEach(({ pattern, type, description }) => {
      const matches = fullText.match(pattern);
      if (matches) {
        issues.push({
          type: "sensitive_data",
          severity:
            type === "Password" || type === "API Key" || type === "Token"
              ? "critical"
              : type === "Credit Card" || type === "SSN"
              ? "high"
              : "medium",
          message: `${type} detected in email content`,
          details: description,
          suggestion: `Consider removing or encrypting ${type.toLowerCase()} information`,
        });
      }
    });

    // Check for suspicious links
    const urlPattern = /https?:\/\/[^\s]+/gi;
    const urls = fullText.match(urlPattern) || [];

    urls.forEach((url) => {
      // Check for suspicious domains
      if (suspiciousPatterns[0].test(url)) {
        issues.push({
          type: "suspicious_link",
          severity: "medium",
          message: "URL shortener detected",
          details: `Shortened URL found: ${url}`,
          suggestion: "Consider using full URLs for transparency",
        });
      }

      // Check for non-HTTPS links
      if (url.startsWith("http://")) {
        issues.push({
          type: "weak_security",
          severity: "low",
          message: "Non-secure HTTP link detected",
          details: `Insecure link: ${url}`,
          suggestion: "Use HTTPS links when possible",
        });
      }
    });

    // Check for phishing indicators
    suspiciousPatterns.slice(1).forEach((pattern, index) => {
      const matches = fullText.match(pattern);
      if (matches) {
        const types = ["urgency", "phishing", "scam"];
        issues.push({
          type: "phishing_risk",
          severity: "high",
          message: `Potential ${types[index]} language detected`,
          details: `Suspicious phrases found: ${matches.join(", ")}`,
          suggestion: "Review language to ensure it doesn't appear suspicious",
        });
      }
    });

    // Check recipient domain for business context
    if (emailContent.to) {
      const domain = emailContent.to.split("@")[1];
      const personalDomains = [
        "gmail.com",
        "yahoo.com",
        "hotmail.com",
        "outlook.com",
      ];

      if (
        !personalDomains.includes(domain) &&
        issues.some(
          (issue) => issue.severity === "critical" || issue.severity === "high"
        )
      ) {
        issues.push({
          type: "sensitive_data",
          severity: "high",
          message: "Sensitive data in business email",
          details: "Sending sensitive information to a business domain",
          suggestion:
            "Consider using secure channels for sensitive business communications",
        });
      }
    }

    setSecurityIssues(issues);
    setLastScanTime(new Date());
    setIsScanning(false);

    // Update parent component with warnings
    const warnings = issues
      .filter(
        (issue) => issue.severity === "high" || issue.severity === "critical"
      )
      .map((issue) => issue.message);
    onWarningsUpdate(warnings);
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      low: "text-yellow-700 bg-yellow-100 border-yellow-200",
      medium: "text-orange-700 bg-orange-100 border-orange-200",
      high: "text-red-700 bg-red-100 border-red-200",
      critical: "text-red-800 bg-red-200 border-red-300",
    };
    return colors[severity as keyof typeof colors] || colors.low;
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "high":
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case "medium":
        return <Eye className="w-5 h-5 text-orange-500" />;
      case "low":
        return <CheckCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Shield className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "sensitive_data":
        return <Lock className="w-4 h-4" />;
      case "suspicious_link":
        return <ExternalLink className="w-4 h-4" />;
      case "weak_security":
        return <Shield className="w-4 h-4" />;
      case "phishing_risk":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Eye className="w-4 h-4" />;
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSecurityScan();
    }, 1000);

    return () => clearTimeout(debounceTimer);
  }, [emailContent.body, emailContent.subject, emailContent.to]);

  return (
    <div className="p-4 lg:p-6 bg-gradient-to-br from-red-50 to-orange-50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Security Scanner
          </h3>
        </div>
        {lastScanTime && (
          <span className="text-xs text-gray-500">
            Last scan: {lastScanTime.toLocaleTimeString()}
          </span>
        )}
      </div>

      {isScanning && (
        <div className="text-center py-8">
          <Shield className="w-8 h-8 animate-pulse text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Scanning for security issues...</p>
        </div>
      )}

      {!isScanning && securityIssues.length === 0 && (
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            No Security Issues Detected
          </h4>
          <p className="text-gray-600 text-sm">
            Your email appears to be secure and doesn't contain sensitive
            information.
          </p>
        </div>
      )}

      {!isScanning && securityIssues.length > 0 && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="bg-white rounded-lg p-4 border border-red-200">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h4 className="font-medium text-gray-900">
                Security Issues Found
              </h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">
                  {
                    securityIssues.filter((i) => i.severity === "critical")
                      .length
                  }
                </div>
                <div className="text-gray-600">Critical</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-red-500">
                  {securityIssues.filter((i) => i.severity === "high").length}
                </div>
                <div className="text-gray-600">High</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-500">
                  {securityIssues.filter((i) => i.severity === "medium").length}
                </div>
                <div className="text-gray-600">Medium</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-500">
                  {securityIssues.filter((i) => i.severity === "low").length}
                </div>
                <div className="text-gray-600">Low</div>
              </div>
            </div>
          </div>

          {/* Issues List */}
          <div className="space-y-3">
            {securityIssues.map((issue, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${getSeverityColor(
                  issue.severity
                )}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getSeverityIcon(issue.severity)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      {getTypeIcon(issue.type)}
                      <h5 className="font-medium text-gray-900">
                        {issue.message}
                      </h5>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(
                          issue.severity
                        )}`}
                      >
                        {issue.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      {issue.details}
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      💡 {issue.suggestion}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Security Best Practices */}
          <div className="bg-white rounded-lg p-4 border border-red-200">
            <h4 className="font-medium text-gray-900 mb-3">
              Security Best Practices
            </h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium text-gray-800 mb-2">
                  Sensitive Data
                </h5>
                <ul className="text-gray-600 space-y-1">
                  <li>• Never include passwords in emails</li>
                  <li>• Use secure file sharing for documents</li>
                  <li>• Encrypt sensitive information</li>
                  <li>• Verify recipient before sending</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-gray-800 mb-2">Link Safety</h5>
                <ul className="text-gray-600 space-y-1">
                  <li>• Use full URLs instead of shorteners</li>
                  <li>• Prefer HTTPS links</li>
                  <li>• Verify links before including them</li>
                  <li>• Avoid suspicious language</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
