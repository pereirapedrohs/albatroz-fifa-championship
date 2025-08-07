export const defaultRules = [
  {
    id: 'match-duration',
    category: 'Jogo',
    title: 'Duração da Partida',
    description: 'Tempo de jogo padrão para cada partida',
    defaultValue: '6 minutos (3 min cada tempo)',
    options: [
      '4 minutos (2 min cada tempo)',
      '6 minutos (3 min cada tempo)',
      '8 minutos (4 min cada tempo)',
      '10 minutos (5 min cada tempo)',
      '12 minutos (6 min cada tempo)'
    ],
    required: true
  },
  {
    id: 'difficulty',
    category: 'Jogo',
    title: 'Dificuldade',
    description: 'Nível de dificuldade do jogo',
    defaultValue: 'Profissional',
    options: [
      'Amador',
      'Semi-Profissional',
      'Profissional',
      'Mundial',
      'Lenda'
    ],
    required: true
  },
  {
    id: 'team-restriction',
    category: 'Times',
    title: 'Restrição de Times',
    description: 'Regra sobre repetição de times entre jogadores',
    defaultValue: 'Não pode repetir times',
    options: [
      'Pode repetir times',
      'Não pode repetir times',
      'Máximo 2 jogadores por time'
    ],
    required: true
  },
  {
    id: 'team-rating',
    category: 'Times',
    title: 'Classificação dos Times',
    description: 'Restrição baseada na classificação dos times',
    defaultValue: 'Sem restrição',
    options: [
      'Sem restrição',
      'Apenas times 5 estrelas',
      'Apenas times 4+ estrelas',
      'Máximo 4.5 estrelas',
      'Balanceamento automático'
    ],
    required: false
  },
  {
    id: 'substitutions',
    category: 'Jogo',
    title: 'Substituições',
    description: 'Regras sobre substituições durante a partida',
    defaultValue: 'Permitidas (máximo 3)',
    options: [
      'Não permitidas',
      'Permitidas (máximo 3)',
      'Permitidas (máximo 5)',
      'Ilimitadas'
    ],
    required: false
  },
  {
    id: 'pause-limit',
    category: 'Jogo',
    title: 'Pausas',
    description: 'Limite de pausas durante a partida',
    defaultValue: 'Máximo 2 pausas por jogador',
    options: [
      'Não permitidas',
      'Máximo 1 pausa por jogador',
      'Máximo 2 pausas por jogador',
      'Máximo 3 pausas por jogador',
      'Sem limite'
    ],
    required: false
  },
  {
    id: 'overtime',
    category: 'Copa',
    title: 'Prorrogação (Copa)',
    description: 'Regra para jogos empatados na copa',
    defaultValue: 'Pênaltis direto',
    options: [
      'Pênaltis direto',
      'Prorrogação + Pênaltis',
      'Gol de ouro',
      'Replay da partida'
    ],
    required: false
  },
  {
    id: 'weather',
    category: 'Jogo',
    title: 'Clima',
    description: 'Condições climáticas das partidas',
    defaultValue: 'Aleatório',
    options: [
      'Sempre ensolarado',
      'Aleatório',
      'Sem chuva',
      'Todas as condições'
    ],
    required: false
  },
  {
    id: 'stadium',
    category: 'Jogo',
    title: 'Estádio',
    description: 'Escolha do estádio para as partidas',
    defaultValue: 'Escolha do mandante',
    options: [
      'Escolha do mandante',
      'Aleatório',
      'Estádio neutro fixo',
      'Apenas estádios licenciados'
    ],
    required: false
  },
  {
    id: 'fair-play',
    category: 'Comportamento',
    title: 'Fair Play',
    description: 'Regras de comportamento durante as partidas',
    defaultValue: 'Respeito mútuo obrigatório',
    options: [
      'Respeito mútuo obrigatório',
      'Provocações leves permitidas',
      'Sem restrições'
    ],
    required: true
  }
];

export const getRulesByCategory = () => {
  const categories = {};
  defaultRules.forEach(rule => {
    if (!categories[rule.category]) {
      categories[rule.category] = [];
    }
    categories[rule.category].push(rule);
  });
  return categories;
};

export const getRequiredRules = () => {
  return defaultRules.filter(rule => rule.required);
};

export const getOptionalRules = () => {
  return defaultRules.filter(rule => !rule.required);
};

