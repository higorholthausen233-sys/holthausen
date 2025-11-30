import { Bid } from './types';

export const MOCK_BIDS: Bid[] = [
  {
    id: '1',
    title: 'Modernização de Infraestrutura de TI',
    agency: 'Ministério da Tecnologia',
    value: 4500000.00,
    deadline: '2024-12-15',
    status: 'open',
    category: 'Tecnologia',
    description: 'Contratação de empresa especializada para fornecimento e instalação de equipamentos de rede, servidores e licenciamento de software para modernização do datacenter central.',
    requirements: [
      'Certificação ISO 27001',
      'Parceria Gold com fornecedores de hardware',
      'Equipe técnica com certificação CCNA/CCNP',
      'Prazo de execução de 90 dias'
    ]
  },
  {
    id: '2',
    title: 'Fornecimento de Mobiliário Escolar',
    agency: 'Secretaria de Educação do Estado',
    value: 850000.00,
    deadline: '2024-11-20',
    status: 'review',
    category: 'Mobiliário',
    description: 'Aquisição de conjuntos escolares (carteiras e cadeiras), mesas para professores e armários de aço para 50 escolas estaduais.',
    requirements: [
      'Laudo ergonômico dos produtos',
      'Garantia mínima de 5 anos',
      'Amostras prévias para aprovação',
      'Capacidade de entrega em 30 dias'
    ]
  },
  {
    id: '3',
    title: 'Serviços de Limpeza e Conservação',
    agency: 'Tribunal de Justiça',
    value: 1200000.00,
    deadline: '2024-11-30',
    status: 'open',
    category: 'Serviços Gerais',
    description: 'Prestação de serviços contínuos de limpeza, asseio e conservação predial, com fornecimento de mão de obra, saneantes domissanitários, materiais e equipamentos.',
    requirements: [
      'Atestado de capacidade técnica',
      'Balanço patrimonial auditado',
      'Cumprimento de normas trabalhistas',
      'Plano de gestão de resíduos'
    ]
  },
  {
    id: '4',
    title: 'Desenvolvimento de Portal Corporativo',
    agency: 'Agência Nacional de Águas',
    value: 320000.00,
    deadline: '2024-12-05',
    status: 'submitted',
    category: 'Software',
    description: 'Desenvolvimento, implantação e manutenção de portal corporativo baseado em CMS, com foco em acessibilidade e transparência pública.',
    requirements: [
      'Experiência com WCAG 2.1',
      'Portfólio de projetos governamentais',
      'Stack tecnológico open source'
    ]
  }
];

export const FORMAT_CURRENCY = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};
