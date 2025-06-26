import React from "react";
import {
  Shield,
  Eye,
  Database,
  Users,
  Settings,
  FileText,
  ArrowLeft,
} from "lucide-react";

interface PrivacyPolicyProps {
  onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 p-6 border-b border-gray-200">
            <button
              onClick={onBack}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Privacy Policy
              </h1>
              <p className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="p-6 space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Introduction
              </h2>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-gray-700">
                  Mail Flow ("we," "our," or "us") is committed to protecting
                  your privacy. This Privacy Policy explains how we handle your
                  information when you use our Gmail client application. We
                  believe in transparency and want you to understand exactly how
                  your data is handled.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center space-x-2 mb-4">
                <Database className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Information We Access
                </h2>
              </div>
              <div className="space-y-4">
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Gmail Data</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    When you authorize Mail Flow, we access:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Your email messages and their content</li>
                    <li>• Email metadata (sender, recipient, subject, date)</li>
                    <li>• Gmail labels and folders</li>
                    <li>• Your Gmail profile information (email address)</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Authentication Data
                  </h3>
                  <p className="text-sm text-gray-600">
                    We use Google's OAuth 2.0 system for authentication. We
                    receive temporary access tokens but never store your Gmail
                    password or long-term credentials.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center space-x-2 mb-4">
                <Eye className="w-5 h-5 text-teal-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  How We Use Your Information
                </h2>
              </div>
              <div className="bg-teal-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Primary Uses</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">
                      Display Functionality
                    </h4>
                    <p className="text-sm text-gray-600">
                      Show your emails in an organized, user-friendly interface
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">
                      Email Management
                    </h4>
                    <p className="text-sm text-gray-600">
                      Enable you to read, compose, and send emails
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">
                      Search & Navigation
                    </h4>
                    <p className="text-sm text-gray-600">
                      Provide search and filtering capabilities
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">
                      User Experience
                    </h4>
                    <p className="text-sm text-gray-600">
                      Improve application performance and usability
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center space-x-2 mb-4">
                <Database className="w-5 h-5 text-red-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Data Storage and Retention
                </h2>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      No Server Storage
                    </h3>
                    <p className="text-sm text-gray-600">
                      <strong>Important:</strong> Mail Flow does not store your
                      email data on any servers. All email content is processed
                      entirely within your browser and is never transmitted to
                      or stored on external servers.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Session-Only Access
                    </h3>
                    <p className="text-sm text-gray-600">
                      Your email data is only accessible during your active
                      session. When you sign out or close the application, all
                      local data is cleared.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Temporary Tokens
                    </h3>
                    <p className="text-sm text-gray-600">
                      Access tokens are stored temporarily in your browser's
                      memory and are automatically cleared when you sign out.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center space-x-2 mb-4">
                <Users className="w-5 h-5 text-orange-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Data Sharing
                </h2>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  We Do Not Share Your Data
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Mail Flow does not sell, rent, or share your personal
                  information or email data with third parties. Your data
                  remains private and is only used to provide the email client
                  functionality.
                </p>
                <h4 className="font-medium text-gray-800 mb-1">
                  Limited Exceptions
                </h4>
                <p className="text-sm text-gray-600">
                  We may only disclose information if required by law or to
                  protect our rights, but since we don't store your data,
                  there's typically nothing to disclose.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center space-x-2 mb-4">
                <Settings className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Your Rights and Controls
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Access Control
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Revoke access permissions at any time</li>
                    <li>• Sign out to end your session immediately</li>
                    <li>• Control which emails you view and manage</li>
                  </ul>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Google Account Settings
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Manage app permissions in Google Account</li>
                    <li>• View access history and activity</li>
                    <li>• Remove Mail Flow access completely</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Security Measures
                </h2>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      Technical Safeguards
                    </h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• HTTPS encryption for all communications</li>
                      <li>• OAuth 2.0 secure authentication</li>
                      <li>• Client-side processing only</li>
                      <li>• No persistent data storage</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      Operational Security
                    </h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Regular security audits</li>
                      <li>• Compliance with Google's policies</li>
                      <li>• Minimal permission requests</li>
                      <li>• Transparent data handling</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Compliance and Legal
                </h2>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <h3 className="font-medium text-gray-900">
                    Google API Services
                  </h3>
                  <p className="text-sm text-gray-600">
                    Mail Flow's use and transfer of information received from
                    Google APIs adheres to the
                    <a
                      href="https://developers.google.com/terms/api-services-user-data-policy"
                      className="text-blue-600 hover:underline ml-1"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Google API Services User Data Policy
                    </a>
                    , including the Limited Use requirements.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Data Protection</h3>
                  <p className="text-sm text-gray-600">
                    We implement appropriate technical and organizational
                    measures to protect your personal information against
                    unauthorized access, alteration, disclosure, or destruction.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Changes to This Policy
              </h2>
              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  We may update this Privacy Policy from time to time. We will
                  notify you of any changes by posting the new Privacy Policy on
                  this page and updating the "Last updated" date. We encourage
                  you to review this Privacy Policy periodically for any
                  changes.
                </p>
              </div>
            </section>

            <section className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Contact Us
              </h2>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-2">
                  If you have any questions about this Privacy Policy or our
                  data practices, please contact us:
                </p>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Email:</strong>{" "}
                    <span className="text-blue-600">privacy@mailflow.app</span>
                  </p>
                  <p>
                    <strong>Subject:</strong> Privacy Policy Inquiry
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  We will respond to all privacy-related inquiries within 30
                  days.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
