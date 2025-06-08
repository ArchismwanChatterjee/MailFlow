import React from 'react';
import { useGmailAuth } from './hooks/useGmailAuth';
import { Header } from './components/Header';
import { AuthCard } from './components/AuthCard';
import { Dashboard } from './components/Dashboard';

function App() {
  const { isAuthenticated, isLoading, error, userProfile, signIn, signOut, isReady } = useGmailAuth();

  if (!isAuthenticated) {
    return (
      <>
        <Header userProfile={null} isAuthenticated={false} onSignOut={signOut} />
        <AuthCard 
          onSignIn={signIn} 
          isLoading={isLoading} 
          error={error} 
          isReady={isReady}
        />
      </>
    );
  }

  return (
    <>
      <Header userProfile={userProfile} isAuthenticated={isAuthenticated} onSignOut={signOut} />
      <Dashboard />
    </>
  );
}

export default App;