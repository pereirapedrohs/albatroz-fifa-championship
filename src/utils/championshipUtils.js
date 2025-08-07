// Função para embaralhar array (Fisher-Yates shuffle)
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Gerar jogos para campeonato tipo liga (todos contra todos)
export const generateLeagueMatches = (participants) => {
  const matches = [];
  const players = [...participants];
  
  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      matches.push({
        id: `${players[i].id}-vs-${players[j].id}`,
        player1: players[i],
        player2: players[j],
        status: 'pendente', // 'pendente', 'em_andamento', 'finalizado'
        result: null, // { player1Score: 0, player2Score: 0, winner: null }
        round: 1 // Para ligas simples, todos os jogos são da rodada 1
      });
    }
  }
  
  return shuffleArray(matches);
};

// Gerar chaves para campeonato tipo copa (eliminatória)
export const generateCupBracket = (participants) => {
  const shuffledParticipants = shuffleArray([...participants]);
  const rounds = [];
  let currentRound = shuffledParticipants;
  let roundNumber = 1;
  
  while (currentRound.length > 1) {
    const matches = [];
    const nextRound = [];
    
    // Criar jogos para a rodada atual
    for (let i = 0; i < currentRound.length; i += 2) {
      if (i + 1 < currentRound.length) {
        const matchId = `round${roundNumber}-match${Math.floor(i/2) + 1}`;
        matches.push({
          id: matchId,
          player1: currentRound[i],
          player2: currentRound[i + 1],
          status: roundNumber === 1 ? 'pendente' : 'aguardando', // Primeira rodada pendente, outras aguardando
          result: null,
          round: roundNumber,
          nextMatchId: roundNumber < Math.ceil(Math.log2(shuffledParticipants.length)) ? 
            `round${roundNumber + 1}-match${Math.floor(Math.floor(i/2) / 2) + 1}` : null
        });
        
        // Placeholder para o vencedor na próxima rodada
        nextRound.push({ id: `winner-${matchId}`, name: 'Vencedor', isPlaceholder: true });
      } else {
        // Jogador passa direto (bye)
        nextRound.push(currentRound[i]);
      }
    }
    
    rounds.push({
      roundNumber,
      roundName: getRoundName(roundNumber, shuffledParticipants.length),
      matches
    });
    
    currentRound = nextRound;
    roundNumber++;
  }
  
  return rounds;
};

// Obter nome da rodada baseado no número de participantes
const getRoundName = (roundNumber, totalParticipants) => {
  const totalRounds = Math.ceil(Math.log2(totalParticipants));
  const remainingRounds = totalRounds - roundNumber + 1;
  
  switch (remainingRounds) {
    case 1: return 'Final';
    case 2: return 'Semifinal';
    case 3: return 'Quartas de Final';
    case 4: return 'Oitavas de Final';
    default: return `${roundNumber}ª Rodada`;
  }
};

// Calcular tabela de classificação para liga
export const calculateLeagueStandings = (participants, matches) => {
  const standings = participants.map(participant => ({
    ...participant,
    points: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    matchesPlayed: 0
  }));
  
  // Processar resultados dos jogos finalizados
  matches.filter(match => match.status === 'finalizado' && match.result).forEach(match => {
    const player1Standing = standings.find(s => s.id === match.player1.id);
    const player2Standing = standings.find(s => s.id === match.player2.id);
    
    if (player1Standing && player2Standing) {
      const { player1Score, player2Score } = match.result;
      
      // Atualizar estatísticas
      player1Standing.goalsFor += player1Score;
      player1Standing.goalsAgainst += player2Score;
      player1Standing.matchesPlayed++;
      
      player2Standing.goalsFor += player2Score;
      player2Standing.goalsAgainst += player1Score;
      player2Standing.matchesPlayed++;
      
      // Determinar resultado
      if (player1Score > player2Score) {
        player1Standing.wins++;
        player1Standing.points += 3;
        player2Standing.losses++;
      } else if (player2Score > player1Score) {
        player2Standing.wins++;
        player2Standing.points += 3;
        player1Standing.losses++;
      } else {
        player1Standing.draws++;
        player1Standing.points += 1;
        player2Standing.draws++;
        player2Standing.points += 1;
      }
      
      // Calcular saldo de gols
      player1Standing.goalDifference = player1Standing.goalsFor - player1Standing.goalsAgainst;
      player2Standing.goalDifference = player2Standing.goalsFor - player2Standing.goalsAgainst;
    }
  });
  
  // Ordenar por pontos, saldo de gols, gols marcados
  return standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.name.localeCompare(b.name);
  });
};

// Atualizar chaves da copa após resultado
export const updateCupBracket = (rounds, matchId, result) => {
  const updatedRounds = [...rounds];
  
  // Encontrar e atualizar o jogo
  for (let round of updatedRounds) {
    const match = round.matches.find(m => m.id === matchId);
    if (match) {
      match.result = result;
      match.status = 'finalizado';
      
      // Determinar vencedor
      const winner = result.player1Score > result.player2Score ? match.player1 : match.player2;
      
      // Atualizar próxima rodada se existir
      if (match.nextMatchId) {
        const nextRound = updatedRounds.find(r => 
          r.matches.some(m => m.id === match.nextMatchId)
        );
        
        if (nextRound) {
          const nextMatch = nextRound.matches.find(m => m.id === match.nextMatchId);
          if (nextMatch) {
            // Substituir placeholder pelo vencedor
            if (nextMatch.player1.isPlaceholder && nextMatch.player1.id === `winner-${matchId}`) {
              nextMatch.player1 = winner;
            } else if (nextMatch.player2.isPlaceholder && nextMatch.player2.id === `winner-${matchId}`) {
              nextMatch.player2 = winner;
            }
            
            // Se ambos os jogadores estão definidos, o jogo fica pendente
            if (!nextMatch.player1.isPlaceholder && !nextMatch.player2.isPlaceholder) {
              nextMatch.status = 'pendente';
            }
          }
        }
      }
      
      break;
    }
  }
  
  return updatedRounds;
};

// Verificar se um jogador pode ser adicionado ao campeonato (regra de não repetir times)
export const canAddPlayerToChampionship = (newPlayer, existingParticipants, allowSameTeam = false) => {
  if (allowSameTeam) return true;
  
  return !existingParticipants.some(participant => participant.team === newPlayer.team);
};

