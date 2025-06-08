import React from "react";
import {
  Shield,
  Lock,
  Eye,
  Database,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";

interface SecurityPolicyProps {
  onBack: () => void;
}

export const SecurityPolicy: React.FC<SecurityPolicyProps> = ({ onBack }) => {
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
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Security Policy
              </h1>
              <p className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="p-6 space-y-8">
            <section>
              <div className="flex items-center space-x-2 mb-4">
                <Lock className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Data Security
                </h2>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      OAuth 2.0 Authentication
                    </h3>
                    <p className="text-sm text-gray-600">
                      We use Google's secure OAuth 2.0 protocol for
                      authentication. Your Gmail credentials are never stored on
                      our servers.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      HTTPS Encryption
                    </h3>
                    <p className="text-sm text-gray-600">
                      All data transmission between your browser and our
                      application is encrypted using industry-standard HTTPS/TLS
                      protocols.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Client-Side Processing
                    </h3>
                    <p className="text-sm text-gray-600">
                      Email data is processed entirely in your browser. We do
                      not store or transmit your email content to external
                      servers.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center space-x-2 mb-4">
                <Database className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Data Handling
                </h2>
              </div>
              <div className="prose max-w-none text-gray-700">
                <ul className="space-y-2">
                  <li>
                    <strong>No Data Storage:</strong> Mail Flow does not store
                    your email data on any servers. All email content remains
                    within your browser session.
                  </li>
                  <li>
                    <strong>Temporary Access:</strong> We only access your Gmail
                    data temporarily to display it in the application interface.
                  </li>
                  <li>
                    <strong>Limited Scope:</strong> We request only the minimum
                    necessary permissions to provide email functionality.
                  </li>
                  <li>
                    <strong>Session-Based:</strong> All data access is
                    session-based and expires when you sign out or close the
                    application.
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center space-x-2 mb-4">
                <Eye className="w-5 h-5 text-teal-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Access Controls
                </h2>
              </div>
              <div className="bg-teal-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  Gmail API Permissions
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Mail Flow requests the following specific permissions:
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>
                    • <code>gmail.readonly</code> - Read your email messages and
                    settings
                  </li>
                  <li>
                    • <code>gmail.compose</code> - Create and save draft emails
                  </li>
                  <li>
                    • <code>gmail.send</code> - Send emails on your behalf
                  </li>
                </ul>
                <p className="text-sm text-gray-600 mt-3">
                  You can revoke these permissions at any time through your
                  Google Account settings.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center space-x-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Security Best Practices
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-orange-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">For Users</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Always sign out when using shared computers</li>
                    <li>
                      • Verify the application URL before entering credentials
                    </li>
                    <li>• Keep your browser updated for security patches</li>
                    <li>• Review granted permissions regularly</li>
                  </ul>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Our Commitments
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Regular security audits and updates</li>
                    <li>• Compliance with Google's security standards</li>
                    <li>• Transparent data handling practices</li>
                    <li>• Prompt security incident response</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Incident Response
                </h2>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-3">
                  If you suspect any security issues or unauthorized access to
                  your account:
                </p>
                <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                  <li>Immediately sign out of Mail Flow</li>
                  <li>
                    Revoke application permissions in your Google Account
                    settings
                  </li>
                  <li>Change your Google Account password if necessary</li>
                  <li>Contact us at security@mailflow.app with details</li>
                </ol>
              </div>
            </section>

            <section className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Contact Information
              </h2>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  For security-related questions or to report vulnerabilities,
                  please contact us at:
                </p>
                <p className="text-sm font-medium text-blue-600 mt-2">
                  security@mailflow.app
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  We take security seriously and will respond to all legitimate
                  security concerns within 48 hours.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
