import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import PlayerRegistration from './pages/PlayerRegistration';
import ChampionshipManager from './pages/ChampionshipManager';
import ChampionshipView from './pages/ChampionshipView';
import MatchResult from './pages/MatchResult';
import RulesManager from './pages/RulesManager';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import './App.css';

// Componente para proteger rotas que precisam de autenticação
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

// Componente principal da aplicação
const AppContent = () => {
  const { user } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {user && <Navbar />}
        
        <Routes>
          {/* Rota pública - Login */}
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" /> : <Login />} 
          />
          
          {/* Rotas protegidas */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/player-registration" 
            element={
              <ProtectedRoute>
                <PlayerRegistration />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/championships" 
            element={
              <ProtectedRoute>
                <ChampionshipManager />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/championship/:id" 
            element={
              <ProtectedRoute>
                <ChampionshipViewWrapper />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/match/:championshipId/:matchId" 
            element={
              <ProtectedRoute>
                <MatchResultWrapper />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/rules" 
            element={
              <ProtectedRoute>
                <RulesManager />
              </ProtectedRoute>
            } 
          />
          
          {/* Rota padrão */}
          <Route 
            path="/" 
            element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
          />
          
          {/* Rota 404 */}
          <Route 
            path="*" 
            element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                  <p className="text-gray-600 mb-4">Página não encontrada</p>
                  <a href="/" className="text-green-600 hover:text-green-700">
                    Voltar ao início
                  </a>
                </div>
              </div>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

// Wrapper para ChampionshipView com parâmetros da URL
const ChampionshipViewWrapper = () => {
  const { id } = useParams();
  return <ChampionshipView championshipId={id} />;
};

// Wrapper para MatchResult com parâmetros da URL
const MatchResultWrapper = () => {
  const { championshipId, matchId } = useParams();
  return <MatchResult championshipId={championshipId} matchId={matchId} />;
};

// Componente principal da aplicação
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

