import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getDocument, updateDocument } from '../lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { calculateLeagueStandings, updateCupBracket } from '../utils/championshipUtils';
import { Target, Trophy, Clock } from 'lucide-react';
import '../App.css';

const MatchResult = ({ championshipId, matchId, onResultSaved }) => {
  const { user } = useAuth();
  const [championship, setChampionship] = useState(null);
  const [match, setMatch] = useState(null);
  const [player1Score, setPlayer1Score] = useState('');
  const [player2Score, setPlayer2Score] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (championshipId && matchId) {
      fetchMatchData();
    }
  }, [championshipId, matchId]);

  const fetchMatchData = async () => {
    try {
      const doc = await getDocument('championships', championshipId);
      if (doc.exists()) {
        const championshipData = doc.data();
        setChampionship({ id: doc.id, ...championshipData });

        // Encontrar o jogo específico
        let foundMatch = null;
        
        if (championshipData.type === 'liga') {
          foundMatch = championshipData.matches?.find(m => m.id === matchId);
        } else if (championshipData.type === 'copa') {
          for (const round of championshipData.cupRounds || []) {
            const roundMatch = round.matches.find(m => m.id === matchId);
            if (roundMatch) {
              foundMatch = roundMatch;
              break;
            }
          }
        }

        if (foundMatch) {
          setMatch(foundMatch);
          if (foundMatch.result) {
            setPlayer1Score(foundMatch.result.player1Score.toString());
            setPlayer2Score(foundMatch.result.player2Score.toString());
          }
        }
      }
    } catch (error) {
      setError('Erro ao carregar dados do jogo.');
    }
  };

  const handleSubmitResult = async (e) => {
    e.preventDefault();
    
    if (!player1Score || !player2Score) {
      setError('Por favor, preencha ambos os placares.');
      return;
    }

    const score1 = parseInt(player1Score);
    const score2 = parseInt(player2Score);

    if (isNaN(score1) || isNaN(score2) || score1 < 0 || score2 < 0) {
      setError('Placares devem ser números válidos e não negativos.');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const result = {
        player1Score: score1,
        player2Score: score2,
        winner: score1 > score2 ? match.player1.id : score2 > score1 ? match.player2.id : null,
        recordedBy: user.uid,
        recordedAt: new Date()
      };

      let updatedData = {};

      if (championship.type === 'liga') {
        // Atualizar resultado do jogo na liga
        const updatedMatches = championship.matches.map(m => 
          m.id === matchId 
            ? { ...m, result, status: 'finalizado' }
            : m
        );
        
        // Recalcular classificação
        const updatedStandings = calculateLeagueStandings(championship.participants, updatedMatches);
        
        updatedData = {
          matches: updatedMatches,
          standings: updatedStandings
        };
      } else if (championship.type === 'copa') {
        // Atualizar chaves da copa
        const updatedRounds = updateCupBracket(championship.cupRounds, matchId, result);
        updatedData = {
          cupRounds: updatedRounds
        };
      }

      await updateDocument('championships', championshipId, updatedData);
      
      setSuccess('Resultado salvo com sucesso!');
      
      if (onResultSaved) {
        onResultSaved();
      }
      
      // Atualizar dados locais
      fetchMatchData();
      
    } catch (error) {
      setError('Erro ao salvar resultado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!match) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">Carregando dados do jogo...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Registrar Resultado
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        {/* Informações do jogo */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Detalhes do Jogo</h3>
            <Badge variant={match.status === 'finalizado' ? 'default' : 'secondary'}>
              {match.status === 'finalizado' ? 'Finalizado' : 'Pendente'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <p className="font-medium text-lg">{match.player1.name}</p>
              <p className="text-sm text-gray-500">{match.player1.team}</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400">VS</div>
              {championship.type === 'copa' && match.round && (
                <p className="text-xs text-gray-500 mt-1">
                  Rodada {match.round}
                </p>
              )}
            </div>
            
            <div className="text-center">
              <p className="font-medium text-lg">{match.player2.name}</p>
              <p className="text-sm text-gray-500">{match.player2.team}</p>
            </div>
          </div>

          {match.result && (
            <div className="text-center mt-4 p-3 bg-white rounded border">
              <div className="flex items-center justify-center gap-4">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className="text-xl font-bold">
                  {match.result.player1Score} - {match.result.player2Score}
                </span>
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Resultado já registrado
              </p>
            </div>
          )}
        </div>

        {/* Formulário de resultado */}
        <form onSubmit={handleSubmitResult} className="space-y-6">
          <div className="grid grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="player1Score">
                Gols - {match.player1.name}
              </Label>
              <Input
                id="player1Score"
                type="number"
                min="0"
                value={player1Score}
                onChange={(e) => setPlayer1Score(e.target.value)}
                placeholder="0"
                className="text-center text-lg font-bold"
                required
              />
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400 mb-2">X</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="player2Score">
                Gols - {match.player2.name}
              </Label>
              <Input
                id="player2Score"
                type="number"
                min="0"
                value={player2Score}
                onChange={(e) => setPlayer2Score(e.target.value)}
                placeholder="0"
                className="text-center text-lg font-bold"
                required
              />
            </div>
          </div>

          {/* Preview do resultado */}
          {player1Score && player2Score && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2">Preview do Resultado:</h4>
              <div className="text-center">
                <span className="text-lg font-bold">
                  {match.player1.name} {player1Score} - {player2Score} {match.player2.name}
                </span>
                {parseInt(player1Score) !== parseInt(player2Score) && (
                  <p className="text-sm text-green-600 mt-1">
                    Vencedor: {parseInt(player1Score) > parseInt(player2Score) ? match.player1.name : match.player2.name}
                  </p>
                )}
                {parseInt(player1Score) === parseInt(player2Score) && (
                  <p className="text-sm text-yellow-600 mt-1">
                    Empate
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Button 
              type="submit" 
              className="flex-1"
              disabled={loading || !player1Score || !player2Score}
            >
              {loading ? 'Salvando...' : 'Salvar Resultado'}
            </Button>
            
            {match.result && (
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  setPlayer1Score('');
                  setPlayer2Score('');
                  setError('');
                  setSuccess('');
                }}
              >
                Limpar
              </Button>
            )}
          </div>
        </form>

        {/* Informações adicionais */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Informações:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• O resultado será salvo automaticamente após confirmação</li>
            <li>• {championship.type === 'liga' ? 'A classificação será atualizada automaticamente' : 'As chaves serão atualizadas automaticamente'}</li>
            <li>• Você pode editar o resultado posteriormente se necessário</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchResult;

