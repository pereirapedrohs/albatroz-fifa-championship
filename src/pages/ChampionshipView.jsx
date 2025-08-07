import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getDocument, getCollection, updateDocument } from '../lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { generateLeagueMatches, generateCupBracket, calculateLeagueStandings, updateCupBracket, canAddPlayerToChampionship } from '../utils/championshipUtils';
import { Trophy, Users, Calendar, Target, Medal, Crown } from 'lucide-react';
import '../App.css';

const ChampionshipView = ({ championshipId }) => {
  const { user } = useAuth();
  const [championship, setChampionship] = useState(null);
  const [players, setPlayers] = useState([]);
  const [standings, setStandings] = useState([]);
  const [matches, setMatches] = useState([]);
  const [cupRounds, setCupRounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (championshipId) {
      fetchChampionshipData();
      fetchPlayers();
    }
  }, [championshipId]);

  const fetchChampionshipData = async () => {
    try {
      const doc = await getDocument('championships', championshipId);
      if (doc.exists()) {
        const data = doc.data();
        setChampionship({ id: doc.id, ...data });
        setMatches(data.matches || []);
        
        if (data.type === 'liga') {
          const calculatedStandings = calculateLeagueStandings(data.participants || [], data.matches || []);
          setStandings(calculatedStandings);
        } else if (data.type === 'copa') {
          setCupRounds(data.cupRounds || []);
        }
      }
    } catch (error) {
      setError('Erro ao carregar campeonato.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlayers = async () => {
    try {
      const querySnapshot = await getCollection('players');
      const playersList = [];
      querySnapshot.forEach((doc) => {
        playersList.push({ id: doc.id, ...doc.data() });
      });
      setPlayers(playersList);
    } catch (error) {
      console.error('Erro ao buscar jogadores:', error);
    }
  };

  const handleJoinChampionship = async () => {
    if (!championship || !user) return;

    const currentPlayer = players.find(p => p.id === user.uid);
    if (!currentPlayer) {
      setError('Você precisa completar seu cadastro de jogador primeiro.');
      return;
    }

    // Verificar se já está participando
    if (championship.participants?.some(p => p.id === user.uid)) {
      setError('Você já está participando deste campeonato.');
      return;
    }

    // Verificar limite de jogadores
    if (championship.participants?.length >= championship.maxPlayers) {
      setError('Campeonato já está lotado.');
      return;
    }

    // Verificar regra de times (se aplicável)
    if (!canAddPlayerToChampionship(currentPlayer, championship.participants || [], false)) {
      setError('Já existe um jogador com este time no campeonato.');
      return;
    }

    try {
      const updatedParticipants = [...(championship.participants || []), currentPlayer];
      await updateDocument('championships', championshipId, {
        participants: updatedParticipants
      });
      
      setChampionship(prev => ({
        ...prev,
        participants: updatedParticipants
      }));
    } catch (error) {
      setError('Erro ao entrar no campeonato.');
    }
  };

  const handleStartChampionship = async () => {
    if (!championship || championship.participants?.length < 2) {
      setError('É necessário pelo menos 2 jogadores para iniciar o campeonato.');
      return;
    }

    try {
      let updatedData = {
        status: 'em_andamento'
      };

      if (championship.type === 'liga') {
        const generatedMatches = generateLeagueMatches(championship.participants);
        updatedData.matches = generatedMatches;
        setMatches(generatedMatches);
      } else if (championship.type === 'copa') {
        const generatedRounds = generateCupBracket(championship.participants);
        updatedData.cupRounds = generatedRounds;
        setCupRounds(generatedRounds);
      }

      await updateDocument('championships', championshipId, updatedData);
      setChampionship(prev => ({ ...prev, ...updatedData }));
    } catch (error) {
      setError('Erro ao iniciar campeonato.');
    }
  };

  const renderLeagueStandings = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Classificação
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Pos</TableHead>
              <TableHead>Jogador</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="text-center">J</TableHead>
              <TableHead className="text-center">V</TableHead>
              <TableHead className="text-center">E</TableHead>
              <TableHead className="text-center">D</TableHead>
              <TableHead className="text-center">GP</TableHead>
              <TableHead className="text-center">GC</TableHead>
              <TableHead className="text-center">SG</TableHead>
              <TableHead className="text-center">Pts</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {standings.map((player, index) => (
              <TableRow key={player.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {index + 1}
                    {index === 0 && <Crown className="h-4 w-4 text-yellow-500" />}
                    {index === 1 && <Medal className="h-4 w-4 text-gray-400" />}
                    {index === 2 && <Medal className="h-4 w-4 text-amber-600" />}
                  </div>
                </TableCell>
                <TableCell>{player.name}</TableCell>
                <TableCell>{player.team}</TableCell>
                <TableCell className="text-center">{player.matchesPlayed}</TableCell>
                <TableCell className="text-center">{player.wins}</TableCell>
                <TableCell className="text-center">{player.draws}</TableCell>
                <TableCell className="text-center">{player.losses}</TableCell>
                <TableCell className="text-center">{player.goalsFor}</TableCell>
                <TableCell className="text-center">{player.goalsAgainst}</TableCell>
                <TableCell className="text-center">{player.goalDifference > 0 ? '+' : ''}{player.goalDifference}</TableCell>
                <TableCell className="text-center font-bold">{player.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const renderMatches = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Jogos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {matches.map((match) => (
            <div key={match.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-medium">{match.player1.name}</p>
                  <p className="text-sm text-gray-500">{match.player1.team}</p>
                </div>
                <div className="text-center">
                  {match.result ? (
                    <div className="text-lg font-bold">
                      {match.result.player1Score} - {match.result.player2Score}
                    </div>
                  ) : (
                    <div className="text-gray-400">vs</div>
                  )}
                </div>
                <div className="text-left">
                  <p className="font-medium">{match.player2.name}</p>
                  <p className="text-sm text-gray-500">{match.player2.team}</p>
                </div>
              </div>
              <Badge variant={match.status === 'finalizado' ? 'default' : 'secondary'}>
                {match.status === 'finalizado' ? 'Finalizado' : 'Pendente'}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderCupBracket = () => (
    <div className="space-y-6">
      {cupRounds.map((round) => (
        <Card key={round.roundNumber}>
          <CardHeader>
            <CardTitle>{round.roundName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {round.matches.map((match) => (
                <div key={match.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">{match.player1.name}</p>
                      <p className="text-sm text-gray-500">{match.player1.team}</p>
                    </div>
                    <div className="text-center">
                      {match.result ? (
                        <div className="text-lg font-bold">
                          {match.result.player1Score} - {match.result.player2Score}
                        </div>
                      ) : (
                        <div className="text-gray-400">vs</div>
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{match.player2.name}</p>
                      <p className="text-sm text-gray-500">{match.player2.team}</p>
                    </div>
                  </div>
                  <Badge variant={
                    match.status === 'finalizado' ? 'default' : 
                    match.status === 'pendente' ? 'secondary' : 'outline'
                  }>
                    {match.status === 'finalizado' ? 'Finalizado' : 
                     match.status === 'pendente' ? 'Pendente' : 'Aguardando'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (loading) return <div className="text-center p-8">Carregando...</div>;
  if (!championship) return <div className="text-center p-8">Campeonato não encontrado.</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{championship.name}</h1>
              <div className="flex gap-2">
                <Badge variant={championship.type === 'liga' ? 'default' : 'secondary'}>
                  {championship.type === 'liga' ? 'Liga' : 'Copa'}
                </Badge>
                <Badge variant={championship.status === 'em_andamento' ? 'default' : 'outline'}>
                  {championship.status === 'criado' ? 'Criado' : 
                   championship.status === 'em_andamento' ? 'Em Andamento' : 'Finalizado'}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              {championship.status === 'criado' && (
                <>
                  <Button onClick={handleJoinChampionship} variant="outline">
                    Participar
                  </Button>
                  {championship.createdBy === user?.uid && (
                    <Button onClick={handleStartChampionship}>
                      Iniciar Campeonato
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Participantes</p>
                  <p className="text-2xl font-bold">{championship.participants?.length || 0}/{championship.maxPlayers}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <Target className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-gray-500">Jogos</p>
                  <p className="text-2xl font-bold">{matches.length || cupRounds.reduce((acc, round) => acc + round.matches.length, 0)}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <Calendar className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-500">Criado em</p>
                  <p className="text-lg font-bold">
                    {new Date(championship.createdAt?.seconds * 1000).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {championship.status === 'em_andamento' && (
          <Tabs defaultValue={championship.type === 'liga' ? 'standings' : 'bracket'} className="space-y-6">
            <TabsList>
              {championship.type === 'liga' && <TabsTrigger value="standings">Classificação</TabsTrigger>}
              {championship.type === 'copa' && <TabsTrigger value="bracket">Chaves</TabsTrigger>}
              <TabsTrigger value="matches">Jogos</TabsTrigger>
              <TabsTrigger value="participants">Participantes</TabsTrigger>
            </TabsList>

            {championship.type === 'liga' && (
              <TabsContent value="standings">
                {renderLeagueStandings()}
              </TabsContent>
            )}

            {championship.type === 'copa' && (
              <TabsContent value="bracket">
                {renderCupBracket()}
              </TabsContent>
            )}

            <TabsContent value="matches">
              {renderMatches()}
            </TabsContent>

            <TabsContent value="participants">
              <Card>
                <CardHeader>
                  <CardTitle>Participantes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {championship.participants?.map((participant) => (
                      <div key={participant.id} className="p-4 border rounded-lg">
                        <p className="font-medium">{participant.name}</p>
                        <p className="text-sm text-gray-500">{participant.team}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {championship.status === 'criado' && (
          <Card>
            <CardHeader>
              <CardTitle>Participantes ({championship.participants?.length || 0}/{championship.maxPlayers})</CardTitle>
            </CardHeader>
            <CardContent>
              {championship.participants?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {championship.participants.map((participant) => (
                    <div key={participant.id} className="p-4 border rounded-lg">
                      <p className="font-medium">{participant.name}</p>
                      <p className="text-sm text-gray-500">{participant.team}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Nenhum participante ainda. Seja o primeiro a se inscrever!</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ChampionshipView;

