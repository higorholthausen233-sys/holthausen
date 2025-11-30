import React from 'react';
import { Bid, ViewState } from '../types';
import { MOCK_BIDS, FORMAT_CURRENCY } from '../constants';
import { Briefcase, Calendar, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';

interface BidListProps {
  onSelectBid: (bid: Bid) => void;
}

export const BidList: React.FC<BidListProps> = ({ onSelectBid }) => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Oportunidades em Aberto</h1>
        <p className="text-slate-400">Gerencie e analise os editais disponíveis para sua empresa.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <div className="text-slate-400 text-sm mb-1">Valor Total em Pipeline</div>
          <div className="text-2xl font-bold text-white">R$ 6.870.000,00</div>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <div className="text-slate-400 text-sm mb-1">Propostas em Análise</div>
          <div className="text-2xl font-bold text-blue-400">3</div>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <div className="text-slate-400 text-sm mb-1">Taxa de Conversão (IA)</div>
          <div className="text-2xl font-bold text-green-400">24%</div>
        </div>
      </div>

      <div className="space-y-4">
        {MOCK_BIDS.map((bid) => (
          <div 
            key={bid.id}
            onClick={() => onSelectBid(bid)}
            className="group bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-blue-500/50 rounded-xl p-6 transition-all cursor-pointer shadow-sm hover:shadow-xl hover:shadow-blue-900/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2 py-1 rounded text-xs font-semibold uppercase tracking-wide
                  ${bid.status === 'open' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                    bid.status === 'review' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                    'bg-slate-700 text-slate-300'
                  }
                `}>
                  {bid.status === 'open' ? 'Em Aberto' : bid.status === 'review' ? 'Em Análise' : 'Submetido'}
                </span>
                <span className="text-xs text-slate-500 font-mono">ID: {bid.id.padStart(4, '0')}</span>
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors mb-1">{bid.title}</h3>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-1">
                  <Briefcase size={14} />
                  {bid.agency}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  Prazo: {new Date(bid.deadline).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-700 pt-4 md:pt-0 md:pl-6">
              <div className="text-right">
                <div className="text-xs text-slate-500">Valor Estimado</div>
                <div className="text-xl font-bold text-white">{FORMAT_CURRENCY(bid.value)}</div>
              </div>
              <div className="bg-slate-700 p-2 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <ChevronRight size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
