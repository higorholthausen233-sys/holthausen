import React, { useState, useEffect } from 'react';
import { Bid } from '../types';
import { FORMAT_CURRENCY } from '../constants';
import { ArrowLeft, BrainCircuit, Loader2, Save, Download, FileText, Check, AlertTriangle, CheckCircle2, Settings } from 'lucide-react';
import { generateProposal, analyzeBidRisks } from '../services/geminiService';

interface BidDetailProps {
  bid: Bid;
  onBack: () => void;
}

export const BidDetail: React.FC<BidDetailProps> = ({ bid, onBack }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'ai-composer'>('details');
  
  // AI State
  const [strategy, setStrategy] = useState("Foco em qualidade técnica superior e suporte local.");
  const [companyInfo, setCompanyInfo] = useState("Somos a Holthausen Tech, líderes em implementação de soluções governamentais com 15 anos de mercado.");
  const [generatedText, setGeneratedText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [riskAnalysis, setRiskAnalysis] = useState<string | null>(null);

  // Auto-run risk analysis on mount
  useEffect(() => {
    let mounted = true;
    analyzeBidRisks(bid).then(analysis => {
      if (mounted) setRiskAnalysis(analysis);
    });
    return () => { mounted = false; };
  }, [bid]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    const text = await generateProposal(bid, strategy, companyInfo);
    setGeneratedText(text);
    setIsGenerating(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 animate-fade-in">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={18} /> Voltar para lista
      </button>

      {/* Header */}
      <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 mb-6 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <div className="text-blue-400 font-semibold tracking-wide text-sm mb-2">{bid.agency.toUpperCase()}</div>
            <h1 className="text-3xl font-bold text-white mb-4">{bid.title}</h1>
            <div className="flex flex-wrap gap-3">
              <span className="bg-slate-900 text-slate-300 px-3 py-1 rounded text-sm border border-slate-700">
                {bid.category}
              </span>
              <span className="bg-slate-900 text-slate-300 px-3 py-1 rounded text-sm border border-slate-700">
                Prazo: {new Date(bid.deadline).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
          <div className="text-right bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
            <div className="text-slate-400 text-sm">Valor do Edital</div>
            <div className="text-3xl font-bold text-green-400">{FORMAT_CURRENCY(bid.value)}</div>
          </div>
        </div>

        {/* AI Quick Analysis */}
        <div className="mt-8 bg-blue-900/20 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-300 font-semibold mb-2">
            <BrainCircuit size={18} />
            Análise Rápida Holthausen AI
          </div>
          {riskAnalysis ? (
            <div className="text-slate-300 text-sm whitespace-pre-line leading-relaxed">
              {riskAnalysis}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Loader2 size={14} className="animate-spin" /> Analisando edital...
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-slate-800 mb-6">
        <button 
          onClick={() => setActiveTab('details')}
          className={`pb-3 px-1 font-medium text-sm transition-all ${activeTab === 'details' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-white'}`}
        >
          Detalhes do Edital
        </button>
        <button 
          onClick={() => setActiveTab('ai-composer')}
          className={`pb-3 px-1 font-medium text-sm transition-all flex items-center gap-2 ${activeTab === 'ai-composer' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-slate-400 hover:text-white'}`}
        >
          <BrainCircuit size={16} /> Compositor IA
        </button>
      </div>

      {activeTab === 'details' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <section>
              <h3 className="text-lg font-semibold text-white mb-3">Objeto da Licitação</h3>
              <p className="text-slate-300 leading-relaxed bg-slate-800/50 p-4 rounded-lg border border-slate-800">
                {bid.description}
              </p>
            </section>
            <section>
              <h3 className="text-lg font-semibold text-white mb-3">Requisitos Técnicos</h3>
              <ul className="space-y-2">
                {bid.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-300 bg-slate-800/30 p-3 rounded border border-slate-800/50">
                    <CheckCircle2 size={18} className="text-green-500 mt-1 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
          <div className="space-y-6">
            <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
              <h3 className="font-semibold text-white mb-4">Arquivos do Edital</h3>
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-700/30 rounded hover:bg-slate-700/50 cursor-pointer transition-colors group">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-slate-400 group-hover:text-blue-400" />
                      <span className="text-sm text-slate-300">Anexo_0{i}.pdf</span>
                    </div>
                    <Download size={16} className="text-slate-500 group-hover:text-white" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
          {/* Controls */}
          <div className="flex flex-col gap-6 h-full overflow-y-auto pr-2">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Settings size={18} className="text-purple-400" /> Configuração da Proposta
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-slate-500 mb-2">Estratégia de Venda</label>
                  <textarea 
                    value={strategy}
                    onChange={(e) => setStrategy(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 text-sm focus:outline-none focus:border-purple-500 transition-colors h-24 resize-none"
                    placeholder="Ex: Focar no menor preço, destacar qualidade técnica..."
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-slate-500 mb-2">Sobre Nossa Empresa (Contexto)</label>
                  <textarea 
                    value={companyInfo}
                    onChange={(e) => setCompanyInfo(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 text-sm focus:outline-none focus:border-purple-500 transition-colors h-24 resize-none"
                  />
                </div>

                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? <><Loader2 className="animate-spin" /> Gerando Proposta...</> : <><BrainCircuit /> Gerar Proposta com IA</>}
                </button>
              </div>
            </div>
            
            <div className="bg-yellow-900/20 border border-yellow-700/30 p-4 rounded-lg flex gap-3">
              <AlertTriangle className="text-yellow-500 shrink-0" />
              <p className="text-xs text-yellow-200/80">
                A IA Holthausen gera rascunhos baseados em padrões de sucesso. Sempre revise os valores e especificações técnicas antes de enviar.
              </p>
            </div>
          </div>

          {/* Output */}
          <div className="bg-slate-900 rounded-xl border border-slate-700 flex flex-col h-full overflow-hidden relative">
            <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Editor de Proposta</span>
              <div className="flex gap-2">
                 {generatedText && (
                   <button className="text-xs flex items-center gap-1 bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded transition-colors">
                     <Save size={14} /> Salvar
                   </button>
                 )}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {generatedText ? (
                <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap font-serif">
                  {generatedText}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600">
                  <FileText size={48} className="mb-4 opacity-20" />
                  <p>Configure a estratégia ao lado e clique em Gerar.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};