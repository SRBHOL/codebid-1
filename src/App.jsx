import React from 'react';
import { AuctionProvider, useAuction } from './context/AuctionContext';

// Components
import LoginView from './views/LoginView';
import AuctionView from './views/AuctionView';
import CodingView from './views/CodingView';
// DashboardView import removed

// Placeholder components for now
const LoginReview = () => <div className="p-10 text-center"><h1>Login Screen</h1></div>;

function AppContent() {
  const { state } = useAuction();

  // Simple Router based on appStatus
  const renderView = () => {
    switch (state.appStatus) {
      case 'WAITING':
        return <LoginView />;
      case 'READY':
        return <div className="flex-center" style={{ height: '100vh' }}><h1>Auction Starting Soon...</h1></div>;
      case 'AUCTION':
        return <AuctionView />;
      case 'COMPLETED':
        return <div className="flex-center" style={{ height: '100vh', flexDirection: 'column' }}>
          <h1>Auction Complete!</h1>
          <p>Prepare for Coding Phase...</p>
        </div>;
      case 'CODING':
        return <CodingView />;
      default:
        return <LoginView />;
    }
  };

  return (
    <div className="app-container">
      {renderView()}
    </div>
  );
}

function App() {
  return (
    <AuctionProvider>
      <AppContent />
    </AuctionProvider>
  );
}

export default App;
