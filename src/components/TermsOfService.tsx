import React from "react";
import {
  FileText,
  Scale,
  Shield,
  Users,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";

interface TermsOfServiceProps {
  onBack: () => void;
}

export const TermsOfService: React.FC<TermsOfServiceProps> = ({ onBack }) => {
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
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Scale className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Terms of Service
              </h1>
              <p className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="p-6 space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Agreement to Terms
              </h2>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-gray-700">
                  By accessing and using Mail Flow ("the Service"), you accept
                  and agree to be bound by the terms and provision of this
                  agreement. If you do not agree to abide by the above, please
                  do not use this service.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Service Description
                </h2>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 space-y-3">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    What Mail Flow Provides
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• A modern web-based interface for accessing Gmail</li>
                    <li>
                      • Email reading, composing, and sending capabilities
                    </li>
                    <li>• Enhanced email management features</li>
                    <li>• Secure OAuth 2.0 authentication with Google</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    Service Limitations
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>
                      • Mail Flow is a client application that interfaces with
                      Gmail
                    </li>
                    <li>
                      • We do not provide email hosting or storage services
                    </li>
                    <li>
                      • Service availability depends on Google's Gmail API
                    </li>
                    <li>• Features are subject to Google's API limitations</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center space-x-2 mb-4">
                <Users className="w-5 h-5 text-teal-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  User Responsibilities
                </h2>
              </div>
              <div className="bg-teal-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">
                  You agree to:
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">
                      Account Security
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Maintain the security of your Google account</li>
                      <li>• Sign out when using shared devices</li>
                      <li>• Report any unauthorized access immediately</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">
                      Acceptable Use
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Use the service for lawful purposes only</li>
                      <li>• Respect others' privacy and rights</li>
                      <li>• Comply with Google's Terms of Service</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center space-x-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Prohibited Activities
                </h2>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  You may not use Mail Flow to:
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Send spam or unsolicited emails</li>
                    <li>• Distribute malware or harmful content</li>
                    <li>• Violate any applicable laws or regulations</li>
                    <li>• Infringe on intellectual property rights</li>
                  </ul>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Attempt to reverse engineer the service</li>
                    <li>• Interfere with service operation</li>
                    <li>• Access other users' accounts</li>
                    <li>
                      • Use the service for commercial purposes without
                      permission
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Privacy and Data Protection
                </h2>
              </div>
              <div className="bg-green-50 rounded-lg p-4 space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      No Data Storage
                    </h3>
                    <p className="text-sm text-gray-600">
                      Mail Flow does not store your email data on our servers.
                      All processing occurs within your browser.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Google API Compliance
                    </h3>
                    <p className="text-sm text-gray-600">
                      Our use of Gmail data complies with Google's API Services
                      User Data Policy, including Limited Use requirements.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Privacy Policy
                    </h3>
                    <p className="text-sm text-gray-600">
                      Please review our Privacy Policy for detailed information
                      about data handling practices.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Intellectual Property
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <h3 className="font-medium text-gray-900">
                    Service Ownership
                  </h3>
                  <p className="text-sm text-gray-600">
                    Mail Flow and its original content, features, and
                    functionality are owned by Mail Flow and are protected by
                    international copyright, trademark, patent, trade secret,
                    and other intellectual property laws.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">User Content</h3>
                  <p className="text-sm text-gray-600">
                    You retain all rights to your email content. We do not claim
                    ownership of any content you access through our service.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Service Availability
              </h2>
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Service Uptime
                    </h3>
                    <p className="text-sm text-gray-600">
                      While we strive to maintain high availability, we do not
                      guarantee uninterrupted service. The service may be
                      temporarily unavailable due to maintenance, updates, or
                      technical issues.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Third-Party Dependencies
                    </h3>
                    <p className="text-sm text-gray-600">
                      Our service depends on Google's Gmail API. Service
                      interruptions may occur due to changes or issues with
                      Google's services.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Limitation of Liability
              </h2>
              <div className="bg-red-50 rounded-lg p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium text-gray-900">Disclaimer</h3>
                    <p className="text-sm text-gray-600">
                      Mail Flow is provided "as is" without any warranties,
                      express or implied. We do not warrant that the service
                      will be uninterrupted, secure, or error-free.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Liability Limitation
                    </h3>
                    <p className="text-sm text-gray-600">
                      In no event shall Mail Flow be liable for any indirect,
                      incidental, special, consequential, or punitive damages,
                      including without limitation, loss of profits, data, use,
                      goodwill, or other intangible losses.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Termination
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      User Termination
                    </h3>
                    <p className="text-sm text-gray-600">
                      You may stop using our service at any time by revoking
                      access permissions in your Google Account settings.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Service Termination
                    </h3>
                    <p className="text-sm text-gray-600">
                      We may terminate or suspend access to our service
                      immediately, without prior notice, for conduct that we
                      believe violates these Terms of Service.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Changes to Terms
              </h2>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  We reserve the right to modify or replace these Terms at any
                  time. If a revision is material, we will try to provide at
                  least 30 days notice prior to any new terms taking effect.
                  What constitutes a material change will be determined at our
                  sole discretion.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Governing Law
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  These Terms shall be interpreted and governed by the laws of
                  the jurisdiction in which Mail Flow operates, without regard
                  to its conflict of law provisions.
                </p>
              </div>
            </section>

            <section className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Contact Information
              </h2>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-2">
                  If you have any questions about these Terms of Service, please
                  contact us:
                </p>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Email:</strong>{" "}
                    <span className="text-blue-600">legal@mailflow.app</span>
                  </p>
                  <p>
                    <strong>Subject:</strong> Terms of Service Inquiry
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  We will respond to all legal inquiries within 30 days.
                </p>
              </div>
            </section>

            <section className="border-t border-gray-200 pt-6">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="font-medium text-gray-900">Acknowledgment</h3>
                </div>
                <p className="text-sm text-gray-700">
                  By using Mail Flow, you acknowledge that you have read these
                  Terms of Service, understand them, and agree to be bound by
                  them.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
