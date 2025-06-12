import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  // Formulaire nouvelle tâche
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: ''
  });

  useEffect(() => {
    loadTasks();
  }, [filter]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const filterParam = filter === 'all' ? '' : filter;
      const data = await api.getTasks(filterParam);
      setTasks(data);
    } catch (error) {
      alert('Erreur lors du chargement des tâches');
    } finally {
      setLoading(false);
    }
  };

  // ✅ CRÉER UNE TÂCHE
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      alert('Le titre est obligatoire');
      return;
    }

    try {
      const createdTask = await api.createTask(newTask);
      setTasks([createdTask, ...tasks]);
      setNewTask({ title: '', description: '', dueDate: '' });
      setShowCreateForm(false);
      alert('✅ Tâche créée avec succès!');
    } catch (error) {
      alert('❌ Erreur lors de la création');
    }
  };

  // ✅ MODIFIER UNE TÂCHE  
  const handleUpdateTask = async (e) => {
    e.preventDefault();
    if (!editingTask.title.trim()) {
      alert('Le titre est obligatoire');
      return;
    }

    try {
      const updatedTask = await api.updateTask(editingTask.id, editingTask);
      setTasks(tasks.map(task => 
        task.id === editingTask.id ? updatedTask : task
      ));
      setEditingTask(null);
      alert('✅ Tâche modifiée avec succès!');
    } catch (error) {
      alert('❌ Erreur lors de la modification');
    }
  };

  // ✅ SUPPRIMER UNE TÂCHE
  const handleDeleteTask = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette tâche?')) return;

    try {
      await api.deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
      alert('✅ Tâche supprimée!');
    } catch (error) {
      alert('❌ Erreur lors de la suppression');
    }
  };

  // ✅ BONUS: Marquer comme complète
  const handleToggleComplete = async (task) => {
    try {
      const updatedTask = await api.toggleComplete(task.id);
      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
    } catch (error) {
      alert('❌ Erreur lors du changement de statut');
    }
  };

  if (loading) return <div>⏳ Chargement...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h1>📋 Gestionnaire de Tâches</h1>

      {/* CONTROLS */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button 
          onClick={() => setShowCreateForm(true)}
          style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          ➕ Nouvelle Tâche
        </button>
        
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: '8px' }}
        >
          <option value="all">🔍 Toutes les tâches</option>
          <option value="pending">⏳ En cours</option>
          <option value="completed">✅ Terminées</option>
        </select>

        <span>📊 Total: {tasks.length}</span>
      </div>

      {/* FORMULAIRE CRÉATION */}
      {showCreateForm && (
        <form onSubmit={handleCreateTask} style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '20px' 
        }}>
          <h3>➕ Nouvelle Tâche</h3>
          <div style={{ marginBottom: '15px' }}>
            <input
              type="text"
              placeholder="Titre de la tâche*"
              value={newTask.title}
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <textarea
              placeholder="Description (optionnel)"
              value={newTask.description}
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              style={{ width: '100%', padding: '10px', height: '80px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>📅 Date d'échéance:</label>
            <input
              type="datetime-local"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
              style={{ padding: '8px', marginLeft: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
          <div>
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', marginRight: '10px' }}>
              ✅ Créer
            </button>
            <button type="button" onClick={() => setShowCreateForm(false)} style={{ padding: '10px 20px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px' }}>
              ❌ Annuler
            </button>
          </div>
        </form>
      )}

      {/* LISTE DES TÂCHES */}
      <div>
        {tasks.length === 0 ? (
          <p>📭 Aucune tâche trouvée</p>
        ) : (
          tasks.map(task => (
            <div key={task.id} style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px',
              padding: '15px', 
              marginBottom: '15px',
              backgroundColor: task.completed ? '#e8f5e8' : 'white'
            }}>
              {editingTask && editingTask.id === task.id ? (
                // FORMULAIRE MODIFICATION
                <form onSubmit={handleUpdateTask}>
                  <input
                    type="text"
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                    style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                  <textarea
                    value={editingTask.description || ''}
                    onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                    style={{ width: '100%', padding: '8px', height: '60px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                  <input
                    type="datetime-local"
                    value={editingTask.dueDate ? new Date(editingTask.dueDate).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setEditingTask({...editingTask, dueDate: e.target.value})}
                    style={{ padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                  <div>
                    <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', marginRight: '10px' }}>
                      ✅ Sauvegarder
                    </button>
                    <button type="button" onClick={() => setEditingTask(null)} style={{ padding: '8px 15px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}>
                      ❌ Annuler
                    </button>
                  </div>
                </form>
              ) : (
                // AFFICHAGE TÂCHE
                <div>
                  <h3 style={{ 
                    margin: '0 0 10px 0',
                    textDecoration: task.completed ? 'line-through' : 'none',
                    color: task.completed ? '#666' : '#000'
                  }}>
                    {task.completed ? '✅' : '⏳'} {task.title}
                  </h3>
                  
                  {task.description && (
                    <p style={{ margin: '5px 0', color: '#666' }}>{task.description}</p>
                  )}
                  
                  {task.dueDate && (
                    <p style={{ margin: '5px 0', fontSize: '0.9em' }}>
                      📅 <strong>Échéance:</strong> {new Date(task.dueDate).toLocaleString('fr-FR')}
                    </p>
                  )}
                  
                  <p style={{ margin: '5px 0', fontSize: '0.9em' }}>
                    <strong>Statut:</strong> {task.completed ? '✅ Terminée' : '⏳ En cours'}
                  </p>
                  
                  <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => handleToggleComplete(task)}
                      style={{ 
                        padding: '8px 12px', 
                        backgroundColor: task.completed ? '#ff9800' : '#4CAF50', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px' 
                      }}
                    >
                      {task.completed ? '↩️ Remettre en cours' : '✅ Marquer terminée'}
                    </button>
                    
                    <button 
                      onClick={() => setEditingTask(task)}
                      style={{ padding: '8px 12px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px' }}
                    >
                      ✏️ Modifier
                    </button>
                    
                    <button 
                      onClick={() => handleDeleteTask(task.id)}
                      style={{ padding: '8px 12px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskManager;