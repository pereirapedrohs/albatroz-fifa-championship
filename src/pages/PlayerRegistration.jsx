import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, setDocument, getDocument } from '../lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fifaTeams, getAllLeagues } from '../data/teams';
import { User, Shield } from 'lucide-react';
import '../App.css';

const PlayerRegistration = () => {
  const { user } = useAuth();
  const [playerName, setPlayerName] = useState('');
  const [selectedLeague, setSelectedLeague] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [leagues, setLeagues] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setLeagues(getAllLeagues());
    if (user) {
      const fetchPlayerData = async () => {
        const playerDoc = await getDocument('players', user.uid);
        if (playerDoc.exists()) {
          const playerData = playerDoc.data();
          setPlayerName(playerData.name);
          setSelectedTeam(playerData.team);
        }
      };
      fetchPlayerData();
    }
  }, [user]);

  useEffect(() => {
    if (selectedLeague) {
      setTeams(fifaTeams.filter(team => team.league === selectedLeague));
    } else {
      setTeams([]);
    }
    setSelectedTeam('');
  }, [selectedLeague]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!playerName || !selectedTeam) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await setDocument('players', user.uid, {
        name: playerName,
        team: selectedTeam,
        email: user.email
      });
      setSuccess('Cadastro realizado com sucesso!');
    } catch (error) {
      setError('Erro ao salvar os dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Cadastro de Jogador</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {success && <p className="text-green-500 text-center mb-4">{success}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="playerName" className="flex items-center gap-2"><User className="h-4 w-4" />Nome do Jogador</Label>
              <Input
                id="playerName"
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Seu nome ou apelido"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="league" className="flex items-center gap-2"><Shield className="h-4 w-4" />Liga</Label>
              <Select onValueChange={setSelectedLeague}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a liga" />
                </SelectTrigger>
                <SelectContent>
                  {leagues.map(league => (
                    <SelectItem key={league} value={league}>{league}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedLeague && (
              <div className="space-y-2">
                <Label htmlFor="team" className="flex items-center gap-2"><Shield className="h-4 w-4" />Time</Label>
                <Select onValueChange={setSelectedTeam} value={selectedTeam}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o time" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map(team => (
                      <SelectItem key={team.id} value={team.name}>{team.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Cadastro'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerRegistration;

