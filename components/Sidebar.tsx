import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, FileText, MessageSquare, Settings, Award } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const navItemClass = (view: ViewState | null) =>
    `flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
      view === currentView
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`;

  return (
    <div className="w-64 h-screen bg-slate-900 border-r border-slate-800 flex flex-col fixed left-0 top-0 z-10">
      <div className="p-6 flex items-center gap-2 border-b border-slate-800">
        <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/30">H</div>
        <span className="text-xl font-bold tracking-wider text-slate-100">HOLTHAUSEN</span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <div 
          className={navItemClass(ViewState.DASHBOARD)}
          onClick={() => onChangeView(ViewState.DASHBOARD)}
        >
          <LayoutDashboard size={20} />
          <span className="font-medium">Dashboard</span>
        </div>
        
        <div 
          className={navItemClass(null)} // Placeholder for "My Bids" if implemented
        >
          <Award size={20} />
          <span className="font-medium">Minhas Propostas</span>
        </div>

        <div 
          className={navItemClass(ViewState.AI_CHAT)}
          onClick={() => onChangeView(ViewState.AI_CHAT)}
        >
          <MessageSquare size={20} />
          <span className="font-medium">IA Holthausen</span>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className={navItemClass(null)}>
          <Settings size={20} />
          <span className="font-medium">Configurações</span>
        </div>
        <div className="mt-4 px-3">
          <div className="text-xs text-slate-500 uppercase font-semibold mb-2">Status da API</div>
          <div className="flex items-center gap-2 text-xs text-green-400">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Gemini 2.5 Flash Online
          </div>
        </div>
      </div>
    </div>
  );
};
