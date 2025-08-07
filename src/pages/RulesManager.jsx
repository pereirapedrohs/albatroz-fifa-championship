import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createDocument, getCollection, updateDocument, deleteDocument } from '../lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { defaultRules, getRulesByCategory } from '../data/defaultRules';
import { Settings, Plus, Edit, Trash2, BookOpen, Star } from 'lucide-react';
import '../App.css';

const RulesManager = () => {
  const { user } = useAuth();
  const [customRules, setCustomRules] = useState([]);
  const [championshipRules, setChampionshipRules] = useState({});
  const [newRule, setNewRule] = useState({
    title: '',
    description: '',
    category: 'Jogo',
    value: '',
    required: false
  });
  const [selectedChampionship, setSelectedChampionship] = useState('');
  const [championships, setChampionships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const ruleCategories = getRulesByCategory();

  useEffect(() => {
    fetchCustomRules();
    fetchChampionships();
  }, []);

  const fetchCustomRules = async () => {
    try {
      const querySnapshot = await getCollection('customRules');
      const rulesList = [];
      querySnapshot.forEach((doc) => {
        rulesList.push({ id: doc.id, ...doc.data() });
      });
      setCustomRules(rulesList);
    } catch (error) {
      console.error('Erro ao buscar regras customizadas:', error);
    }
  };

  const fetchChampionships = async () => {
    try {
      const querySnapshot = await getCollection('championships');
      const championshipsList = [];
      querySnapshot.forEach((doc) => {
        championshipsList.push({ id: doc.id, ...doc.data() });
      });
      setChampionships(championshipsList);
    } catch (error) {
      console.error('Erro ao buscar campeonatos:', error);
    }
  };

  const handleCreateCustomRule = async (e) => {
    e.preventDefault();
    if (!newRule.title || !newRule.description) {
      setError('Título e descrição são obrigatórios.');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await createDocument('customRules', {
        ...newRule,
        createdBy: user.uid,
        createdAt: new Date()
      });

      setSuccess('Regra customizada criada com sucesso!');
      setNewRule({
        title: '',
        description: '',
        category: 'Jogo',
        value: '',
        required: false
      });
      fetchCustomRules();
    } catch (error) {
      setError('Erro ao criar regra. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomRule = async (ruleId) => {
    if (window.confirm('Tem certeza que deseja excluir esta regra?')) {
      try {
        await deleteDocument('customRules', ruleId);
        setSuccess('Regra excluída com sucesso!');
        fetchCustomRules();
      } catch (error) {
        setError('Erro ao excluir regra.');
      }
    }
  };

  const handleSaveChampionshipRules = async () => {
    if (!selectedChampionship) {
      setError('Selecione um campeonato.');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await updateDocument('championships', selectedChampionship, {
        rules: championshipRules
      });
      setSuccess('Regras do campeonato salvas com sucesso!');
    } catch (error) {
      setError('Erro ao salvar regras do campeonato.');
    } finally {
      setLoading(false);
    }
  };

  const updateChampionshipRule = (ruleId, value) => {
    setChampionshipRules(prev => ({
      ...prev,
      [ruleId]: value
    }));
  };

  const renderDefaultRules = () => (
    <div className="space-y-6">
      {Object.entries(ruleCategories).map(([category, rules]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {category}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rules.map((rule) => (
                <div key={rule.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        {rule.title}
                        {rule.required && <Star className="h-4 w-4 text-yellow-500" />}
                      </h4>
                      <p className="text-sm text-gray-600">{rule.description}</p>
                    </div>
                    <Badge variant={rule.required ? 'default' : 'secondary'}>
                      {rule.required ? 'Obrigatória' : 'Opcional'}
                    </Badge>
                  </div>
                  
                  <div className="mt-3">
                    <Label className="text-sm">Valor padrão:</Label>
                    <p className="text-sm font-medium text-blue-600">{rule.defaultValue}</p>
                  </div>
                  
                  {rule.options && (
                    <div className="mt-3">
                      <Label className="text-sm">Opções disponíveis:</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {rule.options.map((option, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {option}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderCustomRules = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Nova Regra Customizada
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateCustomRule} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título da Regra</Label>
                <Input
                  id="title"
                  value={newRule.title}
                  onChange={(e) => setNewRule({...newRule, title: e.target.value})}
                  placeholder="Ex: Tempo de reflexão"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select 
                  value={newRule.category} 
                  onValueChange={(value) => setNewRule({...newRule, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Jogo">Jogo</SelectItem>
                    <SelectItem value="Times">Times</SelectItem>
                    <SelectItem value="Copa">Copa</SelectItem>
                    <SelectItem value="Comportamento">Comportamento</SelectItem>
                    <SelectItem value="Personalizada">Personalizada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={newRule.description}
                onChange={(e) => setNewRule({...newRule, description: e.target.value})}
                placeholder="Descreva a regra em detalhes..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">Valor/Configuração</Label>
              <Input
                id="value"
                value={newRule.value}
                onChange={(e) => setNewRule({...newRule, value: e.target.value})}
                placeholder="Ex: 30 segundos máximo"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="required"
                checked={newRule.required}
                onChange={(e) => setNewRule({...newRule, required: e.target.checked})}
                className="rounded"
              />
              <Label htmlFor="required">Regra obrigatória</Label>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Regra'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {customRules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Minhas Regras Customizadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customRules.map((rule) => (
                <div key={rule.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        {rule.title}
                        <Badge variant="outline">{rule.category}</Badge>
                        {rule.required && <Star className="h-4 w-4 text-yellow-500" />}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">{rule.description}</p>
                      {rule.value && (
                        <p className="text-sm font-medium text-blue-600 mt-2">{rule.value}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteCustomRule(rule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderChampionshipRules = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurar Regras do Campeonato</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Selecionar Campeonato</Label>
              <Select value={selectedChampionship} onValueChange={setSelectedChampionship}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um campeonato" />
                </SelectTrigger>
                <SelectContent>
                  {championships.map((championship) => (
                    <SelectItem key={championship.id} value={championship.id}>
                      {championship.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedChampionship && (
              <div className="space-y-4">
                <Accordion type="single" collapsible>
                  {Object.entries(ruleCategories).map(([category, rules]) => (
                    <AccordionItem key={category} value={category}>
                      <AccordionTrigger>{category}</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          {rules.map((rule) => (
                            <div key={rule.id} className="space-y-2">
                              <Label className="flex items-center gap-2">
                                {rule.title}
                                {rule.required && <Star className="h-4 w-4 text-yellow-500" />}
                              </Label>
                              <p className="text-sm text-gray-600">{rule.description}</p>
                              {rule.options ? (
                                <Select 
                                  value={championshipRules[rule.id] || rule.defaultValue}
                                  onValueChange={(value) => updateChampionshipRule(rule.id, value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {rule.options.map((option) => (
                                      <SelectItem key={option} value={option}>
                                        {option}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Input
                                  value={championshipRules[rule.id] || rule.defaultValue}
                                  onChange={(e) => updateChampionshipRule(rule.id, e.target.value)}
                                  placeholder={rule.defaultValue}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                <Button onClick={handleSaveChampionshipRules} disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar Regras do Campeonato'}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">Gerenciar Regras</h1>
          <p className="text-gray-600 text-center">Configure regras padrão e personalizadas para seus campeonatos</p>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        <Tabs defaultValue="default" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="default" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Regras Padrão
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Regras Customizadas
            </TabsTrigger>
            <TabsTrigger value="championship" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurar Campeonato
            </TabsTrigger>
          </TabsList>

          <TabsContent value="default">
            {renderDefaultRules()}
          </TabsContent>

          <TabsContent value="custom">
            {renderCustomRules()}
          </TabsContent>

          <TabsContent value="championship">
            {renderChampionshipRules()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RulesManager;

