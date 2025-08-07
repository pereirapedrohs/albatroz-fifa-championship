export const fifaTeams = [
  // Premier League
  { id: 'arsenal', name: 'Arsenal', league: 'Premier League', country: 'Inglaterra' },
  { id: 'chelsea', name: 'Chelsea', league: 'Premier League', country: 'Inglaterra' },
  { id: 'liverpool', name: 'Liverpool', league: 'Premier League', country: 'Inglaterra' },
  { id: 'manchester-city', name: 'Manchester City', league: 'Premier League', country: 'Inglaterra' },
  { id: 'manchester-united', name: 'Manchester United', league: 'Premier League', country: 'Inglaterra' },
  { id: 'tottenham', name: 'Tottenham', league: 'Premier League', country: 'Inglaterra' },
  
  // La Liga
  { id: 'real-madrid', name: 'Real Madrid', league: 'La Liga', country: 'Espanha' },
  { id: 'barcelona', name: 'Barcelona', league: 'La Liga', country: 'Espanha' },
  { id: 'atletico-madrid', name: 'Atlético Madrid', league: 'La Liga', country: 'Espanha' },
  { id: 'sevilla', name: 'Sevilla', league: 'La Liga', country: 'Espanha' },
  { id: 'valencia', name: 'Valencia', league: 'La Liga', country: 'Espanha' },
  { id: 'villarreal', name: 'Villarreal', league: 'La Liga', country: 'Espanha' },
  
  // Serie A
  { id: 'juventus', name: 'Juventus', league: 'Serie A', country: 'Itália' },
  { id: 'ac-milan', name: 'AC Milan', league: 'Serie A', country: 'Itália' },
  { id: 'inter-milan', name: 'Inter Milan', league: 'Serie A', country: 'Itália' },
  { id: 'napoli', name: 'Napoli', league: 'Serie A', country: 'Itália' },
  { id: 'roma', name: 'AS Roma', league: 'Serie A', country: 'Itália' },
  { id: 'lazio', name: 'Lazio', league: 'Serie A', country: 'Itália' },
  
  // Bundesliga
  { id: 'bayern-munich', name: 'Bayern Munich', league: 'Bundesliga', country: 'Alemanha' },
  { id: 'borussia-dortmund', name: 'Borussia Dortmund', league: 'Bundesliga', country: 'Alemanha' },
  { id: 'rb-leipzig', name: 'RB Leipzig', league: 'Bundesliga', country: 'Alemanha' },
  { id: 'bayer-leverkusen', name: 'Bayer Leverkusen', league: 'Bundesliga', country: 'Alemanha' },
  
  // Ligue 1
  { id: 'psg', name: 'Paris Saint-Germain', league: 'Ligue 1', country: 'França' },
  { id: 'marseille', name: 'Olympique Marseille', league: 'Ligue 1', country: 'França' },
  { id: 'lyon', name: 'Olympique Lyon', league: 'Ligue 1', country: 'França' },
  { id: 'monaco', name: 'AS Monaco', league: 'Ligue 1', country: 'França' },
  
  // Brasileirão
  { id: 'flamengo', name: 'Flamengo', league: 'Brasileirão', country: 'Brasil' },
  { id: 'palmeiras', name: 'Palmeiras', league: 'Brasileirão', country: 'Brasil' },
  { id: 'corinthians', name: 'Corinthians', league: 'Brasileirão', country: 'Brasil' },
  { id: 'sao-paulo', name: 'São Paulo', league: 'Brasileirão', country: 'Brasil' },
  { id: 'santos', name: 'Santos', league: 'Brasileirão', country: 'Brasil' },
  { id: 'gremio', name: 'Grêmio', league: 'Brasileirão', country: 'Brasil' },
  { id: 'internacional', name: 'Internacional', league: 'Brasileirão', country: 'Brasil' },
  { id: 'atletico-mg', name: 'Atlético Mineiro', league: 'Brasileirão', country: 'Brasil' },
  { id: 'cruzeiro', name: 'Cruzeiro', league: 'Brasileirão', country: 'Brasil' },
  { id: 'botafogo', name: 'Botafogo', league: 'Brasileirão', country: 'Brasil' },
  { id: 'vasco', name: 'Vasco da Gama', league: 'Brasileirão', country: 'Brasil' },
  { id: 'fluminense', name: 'Fluminense', league: 'Brasileirão', country: 'Brasil' },
  
  // Seleções
  { id: 'brasil', name: 'Brasil', league: 'Seleções', country: 'Brasil' },
  { id: 'argentina', name: 'Argentina', league: 'Seleções', country: 'Argentina' },
  { id: 'franca', name: 'França', league: 'Seleções', country: 'França' },
  { id: 'alemanha', name: 'Alemanha', league: 'Seleções', country: 'Alemanha' },
  { id: 'espanha', name: 'Espanha', league: 'Seleções', country: 'Espanha' },
  { id: 'italia', name: 'Itália', league: 'Seleções', country: 'Itália' },
  { id: 'portugal', name: 'Portugal', league: 'Seleções', country: 'Portugal' },
  { id: 'holanda', name: 'Holanda', league: 'Seleções', country: 'Holanda' },
  { id: 'belgica', name: 'Bélgica', league: 'Seleções', country: 'Bélgica' },
  { id: 'inglaterra', name: 'Inglaterra', league: 'Seleções', country: 'Inglaterra' },
  { id: 'croacia', name: 'Croácia', league: 'Seleções', country: 'Croácia' },
  { id: 'uruguai', name: 'Uruguai', league: 'Seleções', country: 'Uruguai' }
];

export const getTeamsByLeague = (league) => {
  return fifaTeams.filter(team => team.league === league);
};

export const getAllLeagues = () => {
  return [...new Set(fifaTeams.map(team => team.league))];
};

