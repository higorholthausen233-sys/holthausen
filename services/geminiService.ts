import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Bid } from "../types";

// Initialize Gemini Client
const apiKey = process.env.API_KEY || ''; // Fail gracefully if not present in dev, but prompt assumes valid
const ai = new GoogleGenAI({ apiKey });

const MODEL_NAME = 'gemini-2.5-flash';

export const generateProposal = async (bid: Bid, strategy: string, companyInfo: string): Promise<string> => {
  if (!apiKey) return "Erro: Chave de API não configurada.";

  const prompt = `
    Atue como um especialista sênior em licitações públicas e vendas B2G (Business to Government).
    Escreva uma Proposta Técnica preliminar profissional para a seguinte licitação:
    
    TÍTULO: ${bid.title}
    ÓRGÃO: ${bid.agency}
    DESCRIÇÃO: ${bid.description}
    REQUISITOS: ${bid.requirements.join(', ')}

    ESTRATÉGIA DE VENDA DEFINIDA PELO USUÁRIO: ${strategy}
    SOBRE NOSSA EMPRESA: ${companyInfo}

    Estrutura da resposta:
    1. Carta de Apresentação (formal e persuasiva).
    2. Entendimento do Objeto (mostre que entendemos a dor do cliente).
    3. Solução Técnica (detalhada baseada nos requisitos).
    4. Diferenciais Competitivos (por que escolher nossa empresa baseada na estratégia).
    5. Cronograma Macro de Execução.

    Use formatação Markdown clara. O tom deve ser corporativo, seguro e focado em resultados.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text || "Não foi possível gerar a proposta.";
  } catch (error) {
    console.error("Erro ao gerar proposta:", error);
    return "Ocorreu um erro ao comunicar com a IA Holthausen.";
  }
};

export const analyzeBidRisks = async (bid: Bid): Promise<string> => {
  if (!apiKey) return "Erro de API Key";

  const prompt = `
    Analise brevemente os riscos e oportunidades desta licitação:
    ${JSON.stringify(bid)}
    
    Retorne apenas uma lista com bullets:
    - 2 Pontos Fortes (Oportunidades)
    - 2 Riscos Potenciais (Atenção)
    Seja direto e conciso.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text || "Análise indisponível.";
  } catch (error) {
    return "Erro na análise automática.";
  }
};

export const chatStream = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string
) => {
    if (!apiKey) throw new Error("API Key missing");

    const chat = ai.chats.create({
        model: MODEL_NAME,
        history: history,
        config: {
            systemInstruction: "Você é a IA HOLTHAUSEN, um assistente especializado em estratégia de negócios, licitações públicas e análise de contratos. Suas respostas devem ser precisas, profissionais e em português do Brasil."
        }
    });

    return chat.sendMessageStream({ message });
};
