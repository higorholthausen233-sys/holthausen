import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { BidList } from './components/BidList';
import { BidDetail } from './components/BidDetail';
import { AIChat } from './components/AIChat';
import { Bid, ViewState } from './types';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);

  const handleSelectBid = (bid: Bid) => {
    setSelectedBid(bid);
    setCurrentView(ViewState.BID_DETAIL);
  };

  const handleNavigate = (view: ViewState) => {
    setCurrentView(view);
    if (view !== ViewState.BID_DETAIL) {
      setSelectedBid(null);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <BidList onSelectBid={handleSelectBid} />;
      case ViewState.BID_DETAIL:
        return selectedBid ? (
          <BidDetail 
            bid={selectedBid} 
            onBack={() => handleNavigate(ViewState.DASHBOARD)} 
          />
        ) : (
          <BidList onSelectBid={handleSelectBid} />
        );
      case ViewState.AI_CHAT:
        return <AIChat />;
      default:
        return <BidList onSelectBid={handleSelectBid} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-blue-500/30">
      <Sidebar 
        currentView={currentView} 
        onChangeView={handleNavigate} 
      />
      
      <main className="flex-1 ml-64 relative">
        {/* Background Gradients for Aesthetics */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none z-0" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-slate-800/20 to-transparent pointer-events-none z-0" />
        
        <div className="relative z-1">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
