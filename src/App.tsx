import React, { useState } from "react";
import { useGmailAuth } from "./hooks/useGmailAuth";
import { Header } from "./components/Header";
import { AuthCard } from "./components/AuthCard";
import { Dashboard } from "./components/Dashboard";
import { SecurityPolicy } from "./components/SecurityPolicy";
import { PrivacyPolicy } from "./components/PrivacyPolicy";

type ViewType = "auth" | "dashboard" | "security" | "privacy";

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

  const handleShowSecurity = () => setCurrentView("security");
  const handleShowPrivacy = () => setCurrentView("privacy");
  const handleBackToAuth = () => setCurrentView("auth");
  const handleBackToDashboard = () => setCurrentView("dashboard");

  // If authenticated, show dashboard
  if (isAuthenticated) {
    return (
      <>
        <Header
          userProfile={userProfile}
          isAuthenticated={isAuthenticated}
          onSignOut={signOut}
        />
        <Dashboard />
      </>
    );
  }

  // Show policy pages when requested
  if (currentView === "security") {
    return (
      <>
        <Header
          userProfile={null}
          isAuthenticated={false}
          onSignOut={signOut}
        />
        <SecurityPolicy onBack={handleBackToAuth} />
      </>
    );
  }

  if (currentView === "privacy") {
    return (
      <>
        <Header
          userProfile={null}
          isAuthenticated={false}
          onSignOut={signOut}
        />
        <PrivacyPolicy onBack={handleBackToAuth} />
      </>
    );
  }

  // Show authentication page
  return (
    <>
      <Header userProfile={null} isAuthenticated={false} onSignOut={signOut} />
      <AuthCard
        onSignIn={signIn}
        isLoading={isLoading}
        error={error}
        isReady={isReady}
        onShowSecurity={handleShowSecurity}
        onShowPrivacy={handleShowPrivacy}
      />
    </>
  );
}

export default App;
