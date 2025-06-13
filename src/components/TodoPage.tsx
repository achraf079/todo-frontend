import { Check, Delete } from '@mui/icons-material';
import { Box, Button, Container, IconButton, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch.ts'; // Assure-toi que ce hook est fonctionnel
import { Task } from '../index';

const TodoPage = () => {
  const api = useFetch();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedName, setEditedName] = useState<string>('');
  const [newTaskName, setNewTaskName] = useState<string>('');

  const handleFetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      if (Array.isArray(response)) {
        setTasks(response);
      } else if (response && Array.isArray(response.data)) {
        setTasks(response.data);
      } else {
        setTasks([]);
        console.error('Format inattendu des tâches', response);
      }
    } catch (err) {
      console.error('Erreur fetch tasks', err);
      setTasks([]);
    }
  };

  useEffect(() => {
    handleFetchTasks();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/tasks/${id}`);
      await handleFetchTasks();
    } catch (err) {
      console.error('Erreur suppression tâche', err);
    }
  };

  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditedName(task.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedName('');
  };

  const handleSave = async (task: Task) => {
    if (!editedName.trim() || editedName === task.name) {
      cancelEditing();
      return;
    }
    try {
      await api.patch(`/tasks/${task.id}`, { name: editedName });
      cancelEditing();
      await handleFetchTasks();
    } catch (err) {
      console.error('Erreur sauvegarde tâche', err);
    }
  };

  const handleAddTask = async () => {
    if (!newTaskName.trim()) {
      alert('Le nom de la tâche ne peut pas être vide');
      return;
    }
    try {
      await api.post('/tasks', { name: newTaskName });
      setNewTaskName('');
      await handleFetchTasks();
    } catch (err) {
      console.error('Erreur ajout tâche', err);
    }
  };

  return (
    <Container>
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="h2">HDM Todo List</Typography>
      </Box>

      <Box
        mt={5}
        display="flex"
        flexDirection="column"
        alignItems="center" // Centre horizontalement les enfants
        gap={2} // Espace entre les lignes
      >
        {tasks.map((task) => (
          <Box
            key={task.id}
            display="flex"
            justifyContent="center"
            alignItems="center" // Centre verticalement l’input + boutons
            gap={1}
            width="100%"
            maxWidth={400}
          >
            {editingId === task.id ? (
              <>
                <TextField
                  size="small"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  fullWidth
                />
                <Button
                  variant="text"
                  onClick={() => handleSave(task)}
                  disabled={editedName.trim() === '' || editedName === task.name}
                >
                  <Check />
                  Enregistrer
                </Button>
                <Button variant="text" onClick={cancelEditing}>
                  Annuler
                </Button>
              </>
            ) : (
              <>
                <Typography sx={{ flexGrow: 1 }}>{task.name}</Typography>
                <Button variant="text" onClick={() => startEditing(task)}>
                  Modifier
                </Button>
                <IconButton color="error" onClick={() => handleDelete(task.id)}>
                  <Delete />
                </IconButton>
              </>
            )}
          </Box>
        ))}

        <Box
          display="flex"
          justifyContent="center"
          alignItems="center" // Centre verticalement le champ + bouton
          gap={1}
          maxWidth={400}
          width="100%"
        >
          <TextField
            size="small"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            placeholder="Nouvelle tâche"
            fullWidth
          />
          <Button variant="outlined" onClick={handleAddTask}>
            Ajouter
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default TodoPage;
