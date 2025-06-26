import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  MicOff,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface VoiceToEmailProps {
  onTranscription: (text: string, type: "subject" | "body") => void;
}

interface VoiceRecording {
  isRecording: boolean;
  isPlaying: boolean;
  audioBlob: Blob | null;
  transcription: string;
  confidence: number;
}

export const VoiceToEmail: React.FC<VoiceToEmailProps> = ({
  onTranscription,
}) => {
  const [recording, setRecording] = useState<VoiceRecording>({
    isRecording: false,
    isPlaying: false,
    audioBlob: null,
    transcription: "",
    confidence: 0,
  });
  const [selectedType, setSelectedType] = useState<"subject" | "body">("body");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const isSupported =
    "webkitSpeechRecognition" in window || "SpeechRecognition" in window;

  // const startRecording = async () => {
  //   try {
  //     setError(null);
  //     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  //     const mediaRecorder = new MediaRecorder(stream);
  //     mediaRecorderRef.current = mediaRecorder;
  //     chunksRef.current = [];

  //     mediaRecorder.ondataavailable = (event) => {
  //       if (event.data.size > 0) {
  //         chunksRef.current.push(event.data);
  //       }
  //     };

  //     mediaRecorder.onstop = () => {
  //       const audioBlob = new Blob(chunksRef.current, { type: "audio/wav" });
  //       setRecording((prev) => ({ ...prev, audioBlob, isRecording: false }));

  //       // Stop all tracks to release microphone
  //       stream.getTracks().forEach((track) => track.stop());

  //       // Start transcription
  //       transcribeAudio();
  //     };

  //     mediaRecorder.start();
  //     setRecording((prev) => ({ ...prev, isRecording: true }));
  //   } catch (err) {
  //     setError("Failed to access microphone. Please check permissions.");
  //     console.error("Error starting recording:", err);
  //   }
  // };

  const startDictation = () => {
    setError(null);
    setIsProcessing(true);

    const SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const result = event.results[0];
      const transcription = result[0].transcript;
      const confidence = result[0].confidence;

      setRecording((prev) => ({
        ...prev,
        transcription,
        confidence: confidence * 100,
        isRecording: false,
      }));
      setIsProcessing(false);
    };

    recognition.onerror = (event) => {
      setError(`Speech recognition error: ${event.error}`);
      setIsProcessing(false);
    };

    recognition.onend = () => {
      setIsProcessing(false);
    };

    setRecording((prev) => ({ ...prev, isRecording: true }));
    recognition.start();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording.isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const transcribeAudio = () => {
    if (!isSupported) {
      setError("Speech recognition is not supported in this browser");
      return;
    }

    setIsProcessing(true);

    const SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const result = event.results[0];
      const transcription = result[0].transcript;
      const confidence = result[0].confidence;

      setRecording((prev) => ({
        ...prev,
        transcription,
        confidence: confidence * 100,
      }));
      setIsProcessing(false);
    };

    recognition.onerror = (event: { error: any }) => {
      setError(`Speech recognition error: ${event.error}`);
      setIsProcessing(false);
    };

    recognition.onend = () => {
      setIsProcessing(false);
    };

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        recognition.start();
        // Stop the stream after a short delay to allow recognition to work
        setTimeout(() => {
          stream.getTracks().forEach((track) => track.stop());
        }, 100);
      })
      .catch((err) => {
        setError("Failed to access microphone for transcription");
        setIsProcessing(false);
      });
  };

  const playRecording = () => {
    if (recording.audioBlob) {
      const audioUrl = URL.createObjectURL(recording.audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplay = () =>
        setRecording((prev) => ({ ...prev, isPlaying: true }));
      audio.onended = () =>
        setRecording((prev) => ({ ...prev, isPlaying: false }));
      audio.onerror = () => {
        setError("Failed to play recording");
        setRecording((prev) => ({ ...prev, isPlaying: false }));
      };

      audio.play();
    }
  };

  const pausePlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setRecording((prev) => ({ ...prev, isPlaying: false }));
    }
  };

  const resetRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setRecording({
      isRecording: false,
      isPlaying: false,
      audioBlob: null,
      transcription: "",
      confidence: 0,
    });
    setError(null);
  };

  const applyTranscription = () => {
    if (recording.transcription) {
      onTranscription(recording.transcription, selectedType);
      resetRecording();
    }
  };

  const formatTranscription = (text: string): string => {
    return text
      .split(". ")
      .map((sentence) => sentence.charAt(0).toUpperCase() + sentence.slice(1))
      .join(". ")
      .replace(/\s+/g, " ")
      .trim();
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (mediaRecorderRef.current && recording.isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  if (!isSupported) {
    return (
      <div className="p-4 lg:p-6 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="flex items-center space-x-2 mb-4">
          <MicOff className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900">
            Voice to Email
          </h3>
        </div>
        <div className="text-center py-8">
          <MicOff className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            Voice Input Not Supported
          </h4>
          <p className="text-gray-600 text-sm">
            Your browser doesn't support speech recognition. Please try using
            Chrome or Edge.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="flex items-center space-x-2 mb-4">
        <Mic className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-900">Voice to Email</h3>
      </div>

      <div className="space-y-6">
        {/* Target Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What would you like to dictate?
          </label>
          <div className="flex space-x-3">
            <button
              onClick={() => setSelectedType("subject")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedType === "subject"
                  ? "bg-green-500 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              Subject Line
            </button>
            <button
              onClick={() => setSelectedType("body")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedType === "body"
                  ? "bg-green-500 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              Email Body
            </button>
          </div>
        </div>

        {/* Recording Controls */}
        <div className="bg-white rounded-lg p-6 border border-green-200">
          <div className="text-center">
            {!recording.isRecording && !recording.audioBlob && (
              <div>
                <button
                  onClick={startDictation}
                  className="w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 transition-colors"
                >
                  <Mic className="w-8 h-8" />
                </button>
                <p className="text-gray-600 text-sm">
                  Click to start recording your{" "}
                  {selectedType === "subject"
                    ? "subject line"
                    : "email content"}
                </p>
              </div>
            )}

            {recording.isRecording && (
              <div>
                <button
                  onClick={stopRecording}
                  className="w-16 h-16 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 transition-colors animate-pulse"
                >
                  <MicOff className="w-8 h-8" />
                </button>
                <p className="text-red-600 text-sm font-medium">
                  Recording... Click to stop
                </p>
              </div>
            )}

            {recording.audioBlob && !isProcessing && (
              <div className="space-y-4">
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={
                      recording.isPlaying ? pausePlayback : playRecording
                    }
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    {recording.isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    <span>{recording.isPlaying ? "Pause" : "Play"}</span>
                  </button>
                  <button
                    onClick={resetRecording}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            )}

            {isProcessing && (
              <div>
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mic className="w-8 h-8 text-white animate-pulse" />
                </div>
                <p className="text-blue-600 text-sm">Processing speech...</p>
              </div>
            )}
          </div>
        </div>

        {/* Transcription Results */}
        {recording.transcription && (
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="flex items-center space-x-2 mb-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h4 className="font-medium text-gray-900">
                Transcription Result
              </h4>
              <span className="text-xs text-gray-500">
                {Math.round(recording.confidence)}% confidence
              </span>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-gray-800 text-sm">
                {formatTranscription(recording.transcription)}
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={applyTranscription}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Apply to {selectedType === "subject" ? "Subject" : "Email Body"}
              </button>
              <button
                onClick={resetRecording}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors text-sm"
              >
                Discard
              </button>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="bg-white rounded-lg p-4 border border-green-200">
          <h4 className="font-medium text-gray-900 mb-2">Voice Input Tips</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Speak clearly and at a moderate pace</li>
            <li>
              • Use punctuation commands: "period", "comma", "question mark"
            </li>
            <li>• Say "new line" or "new paragraph" for formatting</li>
            <li>• For best results, record in a quiet environment</li>
            <li>• You can edit the transcription before applying it</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
