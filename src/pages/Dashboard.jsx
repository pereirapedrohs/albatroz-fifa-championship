import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getCollection, getDocument } from '../lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, Target, Calendar, Plus, Settings, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../App.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [playerData, setPlayerData] = useState(null);
  const [championships, setChampionships] = useState([]);
  const [myChampionships, setMyChampionships] = useState([]);
  const [stats, setStats] = useState({
    totalChampionships: 0,
    activeChampionships: 0,
    myParticipations: 0,
    totalPlayers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Buscar dados do jogador
      const playerDoc = await getDocument('players', user.uid);
      if (playerDoc.exists()) {
        setPlayerData(playerDoc.data());
      }

      // Buscar campeonatos
      const championshipsSnapshot = await getCollection('championships', 'createdAt');
      const championshipsList = [];
      championshipsSnapshot.forEach((doc) => {
        championshipsList.push({ id: doc.id, ...doc.data() });
      });
      
      setChampionships(championshipsList);
      
      // Filtrar meus campeonatos (criados por mim ou que participo)
      const myChamps = championshipsList.filter(champ => 
        champ.createdBy === user.uid || 
        champ.participants?.some(p => p.id === user.uid)
      );
      setMyChampionships(myChamps);

      // Calcular estatísticas
      const totalPlayers = await getCollection('players');
      let playerCount = 0;
      totalPlayers.forEach(() => playerCount++);

      setStats({
        totalChampionships: championshipsList.length,
        activeChampionships: championshipsList.filter(c => c.status === 'em_andamento').length,
        myParticipations: myChamps.length,
        totalPlayers: playerCount
      });

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Bem-vindo, {playerData?.name || user.email}!
          </h1>
          <p className="text-gray-600">
            Gerencie seus campeonatos de FIFA 24 do grupo Albatroz
          </p>
        </div>

        {/* Aviso se não completou cadastro */}
        {!playerData && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-500 p-2 rounded-full">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-yellow-800">Complete seu cadastro</h3>
                  <p className="text-sm text-yellow-700">
                    Para participar dos campeonatos, você precisa completar seu cadastro de jogador.
                  </p>
                </div>
                <Link to="/player-registration">
                  <Button variant="outline" className="border-yellow-500 text-yellow-700 hover:bg-yellow-100">
                    Completar Cadastro
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-500 p-3 rounded-full">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total de Campeonatos</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalChampionships}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-500 p-3 rounded-full">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Em Andamento</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.activeChampionships}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-purple-500 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Minhas Participações</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.myParticipations}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-orange-500 p-3 rounded-full">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Jogadores Cadastrados</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalPlayers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/championships">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="bg-green-500 p-4 rounded-full w-16 h-16 mx-auto mb-4">
                  <Plus className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Criar Campeonato</h3>
                <p className="text-gray-600 text-sm">
                  Crie um novo campeonato de liga ou copa
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/rules">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="bg-blue-500 p-4 rounded-full w-16 h-16 mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Gerenciar Regras</h3>
                <p className="text-gray-600 text-sm">
                  Configure regras para seus campeonatos
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/player-registration">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="bg-purple-500 p-4 rounded-full w-16 h-16 mx-auto mb-4">
                  <Settings className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Meu Perfil</h3>
                <p className="text-gray-600 text-sm">
                  Atualize seus dados e time
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Meus Campeonatos */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Meus Campeonatos
              </CardTitle>
              <Link to="/championships">
                <Button variant="outline" size="sm">
                  Ver Todos
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {myChampionships.length === 0 ? (
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 mb-4">
                  Você ainda não participa de nenhum campeonato.
                </p>
                <Link to="/championships">
                  <Button>Criar Primeiro Campeonato</Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {myChampionships.slice(0, 3).map((championship) => (
                  <Link key={championship.id} to={`/championship/${championship.id}`}>
                    <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-lg">{championship.name}</h3>
                          <div className="flex gap-2 mt-1">
                            {getTypeBadge(championship.type)}
                            {getStatusBadge(championship.status)}
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <p>{championship.participants?.length || 0}/{championship.maxPlayers} jogadores</p>
                          <p>{new Date(championship.createdAt?.seconds * 1000).toLocaleDateString()}</p>
                        </div>
                      </div>
                      {championship.description && (
                        <p className="text-gray-600 text-sm">{championship.description}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

{/* Campeonatos Disponíveis para Entrar */}
<Card className="mt-8">
  <CardHeader>
    <div className="flex justify-between items-center">
      <CardTitle className="flex items-center gap-2">
        <Trophy className="h-5 w-5" />
        Campeonatos Disponíveis
      </CardTitle>
    </div>
  </CardHeader>
  <CardContent>
    {championships.filter(c => !myChampionships.some(mc => mc.id === c.id) && c.status === 'criado').length === 0 ? (
      <p className="text-center text-gray-500 py-8">Nenhum campeonato disponível no momento.</p>
    ) : (
      <div className="grid gap-4">
        {championships
          .filter(c => !myChampionships.some(mc => mc.id === c.id) && c.status === 'criado')
          .map((championship) => (
          <Link key={championship.id} to={`/championship/${championship.id}`}>
            <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-lg">{championship.name}</h3>
                  <div className="flex gap-2 mt-1">
                    {getTypeBadge(championship.type)}
                    {getStatusBadge(championship.status)}
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>{championship.participants?.length || 0}/{championship.maxPlayers} jogadores</p>
                  <p>{new Date(championship.createdAt?.seconds * 1000).toLocaleDateString()}</p>
                </div>
              </div>
              {championship.description && (
                <p className="text-gray-600 text-sm">{championship.description}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    )}
  </CardContent>
</Card>


export default Dashboard;

