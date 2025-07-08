import React, { useState, useEffect } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function RunningBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Use useEffect to ensure this only runs on the client side
  useEffect(() => {
    setIsMounted(true);

    // Check if banner was dismissed in this session
    const bannerDismissed = sessionStorage.getItem("downtime_banner_dismissed");
    if (bannerDismissed) {
      setIsVisible(false);
    }
  }, []);

  // Handle dismissing the banner
  const dismissBanner = () => {
    setIsVisible(false);
    sessionStorage.setItem("downtime_banner_dismissed", "true");
  };

  // Only render on client-side to avoid hydration issues
  if (!isMounted) {
    return null;
  }

  // Don't render if banner is dismissed
  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white py-2 overflow-hidden shadow-lg">
      <div className="flex items-center justify-center">
        <div className="animate-marquee inline-block">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-amber-100" />
            <span className="font-medium">
              SCHEDULED MAINTENANCE: Our systems will be down for maintenance on
              Saturday and Sunday nights from 11:00 PM to 2:00 AM. We apologize
              for any inconvenience this may cause.
            </span>
            <span className="mx-8 text-amber-200">•</span>
            <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-amber-100" />
            <span className="font-medium">
              SCHEDULED MAINTENANCE: Our systems will be down for maintenance on
              Saturday and Sunday nights from 11:00 PM to 2:00 AM. We apologize
              for any inconvenience this may cause.
            </span>
            <span className="mx-8 text-amber-200">•</span>
          </div>
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={dismissBanner}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-amber-700 hover:bg-amber-800 transition-colors duration-100"
        aria-label="Dismiss banner"
      >
        <XMarkIcon className="h-4 w-4 text-white" />
      </button>
    </div>
  );
}
