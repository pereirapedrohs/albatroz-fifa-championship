import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createDocument, getCollection, updateDocument, deleteDocument } from '../lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Users, Calendar, Settings, Trash2, Edit } from 'lucide-react';
import '../App.css';

const ChampionshipManager = () => {
  const { user } = useAuth();
  const [championships, setChampionships] = useState([]);
  const [newChampionship, setNewChampionship] = useState({
    name: '',
    type: 'liga', // 'liga' ou 'copa'
    description: '',
    maxPlayers: 8,
    status: 'criado' // 'criado', 'em_andamento', 'finalizado'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchChampionships();
  }, []);

  const fetchChampionships = async () => {
    try {
      const querySnapshot = await getCollection('championships', 'createdAt');
      const championshipsList = [];
      querySnapshot.forEach((doc) => {
        championshipsList.push({ id: doc.id, ...doc.data() });
      });
      setChampionships(championshipsList);
    } catch (error) {
      console.error('Erro ao buscar campeonatos:', error);
    }
  };

  const handleCreateChampionship = async (e) => {
    e.preventDefault();
    if (!newChampionship.name) {
      setError('Nome do campeonato é obrigatório.');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await createDocument('championships', {
        ...newChampionship,
        createdBy: user.uid,
        createdAt: new Date(),
        participants: [],
        matches: [],
        standings: []
      });

      setSuccess('Campeonato criado com sucesso!');
      setNewChampionship({
        name: '',
        type: 'liga',
        description: '',
        maxPlayers: 8,
        status: 'criado'
      });
      fetchChampionships();
    } catch (error) {
      setError('Erro ao criar campeonato. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChampionship = async (championshipId) => {
    if (window.confirm('Tem certeza que deseja excluir este campeonato?')) {
      try {
        await deleteDocument('championships', championshipId);
        setSuccess('Campeonato excluído com sucesso!');
        fetchChampionships();
      } catch (error) {
        setError('Erro ao excluir campeonato.');
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'criado': { label: 'Criado', variant: 'secondary' },
      'em_andamento': { label: 'Em Andamento', variant: 'default' },
      'finalizado': { label: 'Finalizado', variant: 'outline' }
    };
    
    const config = statusConfig[status] || statusConfig['criado'];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTypeBadge = (type) => {
    const typeConfig = {
      'liga': { label: 'Liga', variant: 'default' },
      'copa': { label: 'Copa', variant: 'secondary' }
    };
    
    const config = typeConfig[type] || typeConfig['liga'];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">Gerenciar Campeonatos</h1>
          <p className="text-gray-600 text-center">Crie e gerencie campeonatos de FIFA 24</p>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        <Tabs defaultValue="create" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Criar Campeonato</TabsTrigger>
            <TabsTrigger value="manage">Meus Campeonatos</TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Novo Campeonato
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateChampionship} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome do Campeonato</Label>
                      <Input
                        id="name"
                        value={newChampionship.name}
                        onChange={(e) => setNewChampionship({...newChampionship, name: e.target.value})}
                        placeholder="Ex: Copa Albatroz 2024"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Tipo</Label>
                      <Select 
                        value={newChampionship.type} 
                        onValueChange={(value) => setNewChampionship({...newChampionship, type: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="liga">Liga (Pontos Corridos)</SelectItem>
                          <SelectItem value="copa">Copa (Eliminatória)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxPlayers">Máximo de Jogadores</Label>
                      <Select 
                        value={newChampionship.maxPlayers.toString()} 
                        onValueChange={(value) => setNewChampionship({...newChampionship, maxPlayers: parseInt(value)})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="4">4 Jogadores</SelectItem>
                          <SelectItem value="8">8 Jogadores</SelectItem>
                          <SelectItem value="16">16 Jogadores</SelectItem>
                          <SelectItem value="32">32 Jogadores</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição (Opcional)</Label>
                    <Input
                      id="description"
                      value={newChampionship.description}
                      onChange={(e) => setNewChampionship({...newChampionship, description: e.target.value})}
                      placeholder="Descrição do campeonato..."
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Criando...' : 'Criar Campeonato'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage">
            <div className="grid gap-4">
              {championships.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Trophy className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Nenhum campeonato criado ainda.</p>
                  </CardContent>
                </Card>
              ) : (
                championships.map((championship) => (
                  <Card key={championship.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Trophy className="h-5 w-5" />
                            {championship.name}
                          </CardTitle>
                          <div className="flex gap-2 mt-2">
                            {getTypeBadge(championship.type)}
                            {getStatusBadge(championship.status)}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteChampionship(championship.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span>{championship.participants?.length || 0}/{championship.maxPlayers} jogadores</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>{new Date(championship.createdAt?.seconds * 1000).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Settings className="h-4 w-4 text-gray-500" />
                          <span>{championship.matches?.length || 0} jogos</span>
                        </div>
                      </div>
                      {championship.description && (
                        <p className="text-gray-600 mt-2">{championship.description}</p>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ChampionshipManager;

