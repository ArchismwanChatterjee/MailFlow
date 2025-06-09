import React, { useState } from "react";
import { useGmailAuth } from "./hooks/useGmailAuth";
import { Header } from "./components/Header";
import { AuthCard } from "./components/AuthCard";
import { Dashboard } from "./components/Dashboard";
import { SecurityPolicy } from "./components/SecurityPolicy";
import { PrivacyPolicy } from "./components/PrivacyPolicy";
import { TermsOfService } from "./components/TermsOfService";

type ViewType = "auth" | "dashboard" | "security" | "privacy" | "terms";

function App() {
  const {
    isAuthenticated,
    isLoading,
    error,
    userProfile,
    signIn,
    signOut,
    isReady,
  } = useGmailAuth();
  const [currentView, setCurrentView] = useState<ViewType>("auth");
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Check URL for direct policy access
  React.useEffect(() => {
    const path = window.location.pathname;
    if (path === "/privacy-policy") {
      setCurrentView("privacy");
    } else if (path === "/security-policy") {
      setCurrentView("security");
    } else if (path === "/terms-of-service") {
      setCurrentView("terms");
    }
  }, []);

  const handleViewChange = (newView: ViewType) => {
    if (newView === currentView) return;

    setIsTransitioning(true);

    // Update URL for policy pages
    if (newView === "privacy") {
      window.history.pushState({}, "", "/privacy-policy");
    } else if (newView === "security") {
      window.history.pushState({}, "", "/security-policy");
    } else if (newView === "terms") {
      window.history.pushState({}, "", "/terms-of-service");
    } else {
      window.history.pushState({}, "", "/");
    }

    setTimeout(() => {
      setCurrentView(newView);
      setIsTransitioning(false);
    }, 150);
  };

  const handleShowSecurity = () => handleViewChange("security");
  const handleShowPrivacy = () => handleViewChange("privacy");
  const handleShowTerms = () => handleViewChange("terms");
  const handleBackToAuth = () => handleViewChange("auth");
  const handleBackToDashboard = () => handleViewChange("dashboard");

  // If authenticated, show dashboard
  if (
    isAuthenticated &&
    currentView !== "security" &&
    currentView !== "privacy" &&
    currentView !== "terms"
  ) {
    return (
      <div
        className={`transition-all duration-300 ${
          isTransitioning ? "opacity-0 blur-sm" : "opacity-100 blur-0"
        }`}
      >
        <Header
          userProfile={userProfile}
          isAuthenticated={isAuthenticated}
          onSignOut={signOut}
        />
        <Dashboard />
      </div>
    );
  }

  // Show policy pages when requested
  if (currentView === "security") {
    return (
      <div
        className={`transition-all duration-300 ${
          isTransitioning
            ? "opacity-0 blur-sm scale-95"
            : "opacity-100 blur-0 scale-100"
        }`}
      >
        <Header
          userProfile={null}
          isAuthenticated={false}
          onSignOut={signOut}
        />
        <SecurityPolicy onBack={handleBackToAuth} />
      </div>
    );
  }

  if (currentView === "privacy") {
    return (
      <div
        className={`transition-all duration-300 ${
          isTransitioning
            ? "opacity-0 blur-sm scale-95"
            : "opacity-100 blur-0 scale-100"
        }`}
      >
        <Header
          userProfile={null}
          isAuthenticated={false}
          onSignOut={signOut}
        />
        <PrivacyPolicy onBack={handleBackToAuth} />
      </div>
    );
  }

  if (currentView === "terms") {
    return (
      <div
        className={`transition-all duration-300 ${
          isTransitioning
            ? "opacity-0 blur-sm scale-95"
            : "opacity-100 blur-0 scale-100"
        }`}
      >
        <Header
          userProfile={null}
          isAuthenticated={false}
          onSignOut={signOut}
        />
        <TermsOfService onBack={handleBackToAuth} />
      </div>
    );
  }

  // Show authentication page (homepage)
  return (
    <div
      className={`transition-all duration-300 ${
        isTransitioning
          ? "opacity-0 blur-sm scale-95"
          : "opacity-100 blur-0 scale-100"
      }`}
    >
      <Header userProfile={null} isAuthenticated={false} onSignOut={signOut} />
      <AuthCard
        onSignIn={signIn}
        isLoading={isLoading}
        error={error}
        isReady={isReady}
        onShowSecurity={handleShowSecurity}
        onShowPrivacy={handleShowPrivacy}
        onShowTerms={handleShowTerms}
      />
    </div>
  );
}

export default App;
