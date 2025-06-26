import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Zap,
  Sun,
  Moon,
  Coffee,
  Briefcase,
} from "lucide-react";

interface SmartSchedulerProps {
  onSchedule: (date: Date) => void;
}

interface TimeSlot {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  getTime: () => Date;
  color: string;
}

export const SmartScheduler: React.FC<SmartSchedulerProps> = ({
  onSchedule,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [customDateTime, setCustomDateTime] = useState<string>("");

  const smartTimeSlots: TimeSlot[] = [
    {
      id: "morning-coffee",
      label: "Morning Coffee Time",
      description: "Best for business emails (9:00 AM)",
      icon: Coffee,
      getTime: () => {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        date.setHours(9, 0, 0, 0);
        return date;
      },
      color: "amber",
    },
    {
      id: "lunch-break",
      label: "Lunch Break",
      description: "Good for casual follow-ups (12:30 PM)",
      icon: Sun,
      getTime: () => {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        date.setHours(12, 30, 0, 0);
        return date;
      },
      color: "orange",
    },
    {
      id: "afternoon-peak",
      label: "Afternoon Peak",
      description: "High engagement time (2:00 PM)",
      icon: Briefcase,
      getTime: () => {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        date.setHours(14, 0, 0, 0);
        return date;
      },
      color: "blue",
    },
    {
      id: "evening-wind-down",
      label: "Evening Wind-down",
      description: "Personal emails (6:00 PM)",
      icon: Moon,
      getTime: () => {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        date.setHours(18, 0, 0, 0);
        return date;
      },
      color: "purple",
    },
  ];

  const quickDateOptions = [
    { label: "Tomorrow", value: "tomorrow" },
    { label: "Next Monday", value: "next-monday" },
    { label: "Next Week", value: "next-week" },
    { label: "Custom Date", value: "custom" },
  ];

  const getQuickDate = (option: string): Date => {
    const date = new Date();
    switch (option) {
      case "tomorrow":
        date.setDate(date.getDate() + 1);
        break;
      case "next-monday":
        const daysUntilMonday = (8 - date.getDay()) % 7 || 7;
        date.setDate(date.getDate() + daysUntilMonday);
        break;
      case "next-week":
        date.setDate(date.getDate() + 7);
        break;
      default:
        return date;
    }
    return date;
  };

  const handleSmartSlotSelect = (slot: TimeSlot) => {
    const scheduledTime = slot.getTime();
    onSchedule(scheduledTime);
  };

  const handleCustomSchedule = () => {
    if (customDateTime) {
      const scheduledTime = new Date(customDateTime);
      onSchedule(scheduledTime);
    } else if (selectedDate && selectedTime) {
      const [hours, minutes] = selectedTime.split(":");
      const scheduledTime = getQuickDate(selectedDate);
      scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      onSchedule(scheduledTime);
    }
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      amber: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200",
      orange:
        "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200",
      blue: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200",
      purple:
        "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200",
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const formatDateTime = (date: Date): string => {
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="p-4 lg:p-6 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="flex items-center space-x-2 mb-4">
        <Calendar className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Smart Email Scheduler
        </h3>
      </div>

      <div className="space-y-6">
        {/* Smart Time Slots */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Optimal Sending Times
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {smartTimeSlots.map((slot) => {
              const IconComponent = slot.icon;
              const scheduledTime = slot.getTime();

              return (
                <button
                  key={slot.id}
                  onClick={() => handleSmartSlotSelect(slot)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${getColorClasses(
                    slot.color
                  )}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-sm">{slot.label}</h5>
                      <p className="text-xs opacity-75 mb-1">
                        {slot.description}
                      </p>
                      <p className="text-xs font-medium">
                        {formatDateTime(scheduledTime)}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Scheduling */}
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Custom Schedule
          </h4>

          <div className="space-y-4">
            {/* Quick Date Selection */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Select Date
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {quickDateOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedDate(option.value)}
                    className={`px-3 py-2 text-xs rounded-lg border transition-colors ${
                      selectedDate === option.value
                        ? "bg-purple-500 text-white border-purple-500"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && selectedDate !== "custom" && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Select Time
                </label>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
              </div>
            )}

            {/* Custom DateTime */}
            {selectedDate === "custom" && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Custom Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={customDateTime}
                  onChange={(e) => setCustomDateTime(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
              </div>
            )}

            {/* Schedule Button */}
            {((selectedDate && selectedDate !== "custom" && selectedTime) ||
              (selectedDate === "custom" && customDateTime)) && (
              <button
                onClick={handleCustomSchedule}
                className="w-full flex items-center justify-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition-colors text-sm"
              >
                <Clock className="w-4 h-4" />
                <span>Schedule Email</span>
              </button>
            )}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white rounded-lg p-4 border border-purple-200">
          <div className="flex items-start space-x-2">
            <Zap className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-1">
                Smart Scheduling Tips
              </h5>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>
                  • Business emails perform best between 9-11 AM and 2-4 PM
                </li>
                <li>
                  • Avoid sending emails late at night or very early morning
                </li>
                <li>
                  • Tuesday through Thursday typically have higher open rates
                </li>
                <li>
                  • Consider your recipient's time zone for optimal delivery
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
