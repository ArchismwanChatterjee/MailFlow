import React, { useState } from 'react';
import { Send, Save, Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { EmailDraft } from '../types/gmail';
import { useGmailApi } from '../hooks/useGmailApi';

export const EmailComposer: React.FC = () => {
  const [draft, setDraft] = useState<EmailDraft>({
    to: '',
    subject: '',
    body: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'saved' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');

  const { sendEmail, createDraft, isLoading } = useGmailApi();

  const handleSend = async () => {
    if (!draft.to || !draft.subject) {
      setStatus('error');
      setStatusMessage('Please fill in recipient and subject fields');
      return;
    }

    setStatus('sending');
    const result = await sendEmail(draft);
    
    if (result) {
      setStatus('sent');
      setStatusMessage('Email sent successfully!');
      setDraft({ to: '', subject: '', body: '' });
    } else {
      setStatus('error');
      setStatusMessage('Failed to send email');
    }

    setTimeout(() => setStatus('idle'), 3000);
  };

  const handleSaveDraft = async () => {
    if (!draft.to || !draft.subject) {
      setStatus('error');
      setStatusMessage('Please fill in recipient and subject fields');
      return;
    }

    const result = await createDraft(draft);
    
    if (result) {
      setStatus('saved');
      setStatusMessage('Draft saved successfully!');
    } else {
      setStatus('error');
      setStatusMessage('Failed to save draft');
    }

    setTimeout(() => setStatus('idle'), 3000);
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'sending':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'sent':
      case 'saved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'sent':
      case 'saved':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center space-x-3 p-6 border-b border-gray-200">
        <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
          <Mail className="w-4 h-4 text-teal-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Compose Email</h2>
          <p className="text-sm text-gray-500">Create and send a new message</p>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-2">
            To
          </label>
          <input
            type="email"
            id="to"
            value={draft.to}
            onChange={(e) => setDraft({ ...draft, to: e.target.value })}
            placeholder="recipient@example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            value={draft.subject}
            onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
            placeholder="Enter email subject"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
            Message
          </label>
          <textarea
            id="body"
            value={draft.body}
            onChange={(e) => setDraft({ ...draft, body: e.target.value })}
            placeholder="Write your message here..."
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          />
        </div>

        {status !== 'idle' && statusMessage && (
          <div className={`flex items-center space-x-2 text-sm ${getStatusColor()}`}>
            {getStatusIcon()}
            <span>{statusMessage}</span>
          </div>
        )}

        <div className="flex space-x-3 pt-4">
          <button
            onClick={handleSend}
            disabled={isLoading || status === 'sending'}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {status === 'sending' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            <span>{status === 'sending' ? 'Sending...' : 'Send Email'}</span>
          </button>
          
          <button
            onClick={handleSaveDraft}
            disabled={isLoading}
            className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>Save Draft</span>
          </button>
        </div>
      </div>
    </div>
  );
};