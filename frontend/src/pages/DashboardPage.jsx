import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Tab,
  Tabs,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { Add as AddIcon, AccountCircle } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';

const categories = ['all', 'work', 'personal', 'shopping', 'health', 'other'];

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [category, setCategory] = useState('all');
  const [openTaskForm, setOpenTaskForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [category]);

  const fetchTasks = async () => {
    try {
      const response = await getTasks(category === 'all' ? '' : category);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await createTask(taskData);
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (id, taskData) => {
    try {
      await updateTask(id, taskData);
      await fetchTasks(); // Make sure we wait for the tasks to be fetched
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleToggleTask = async (id, isDone) => {
    try {
      await updateTask(id, { isDone });
      await fetchTasks(); // Make sure we wait for the tasks to be fetched
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Taskify
          </Typography>
          <IconButton color="inherit" onClick={handleMenuClick}>
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem disabled>{user?.name}</MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4">My Tasks</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenTaskForm(true)}
          >
            Add Task
          </Button>
        </Box>

        <Tabs
          value={category}
          onChange={(e, newValue) => setCategory(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 4 }}
        >
          {categories.map((cat) => (
            <Tab
              key={cat}
              value={cat}
              label={cat.charAt(0).toUpperCase() + cat.slice(1)}
            />
          ))}
        </Tabs>

        <Box>
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onToggle={handleToggleTask}
              onEdit={(task) => {
                setEditTask(task);
                setOpenTaskForm(true);
              }}
              onDelete={handleDeleteTask}
            />
          ))}
          {tasks.length === 0 && (
            <Typography textAlign="center" color="text.secondary">
              No tasks found
            </Typography>
          )}
        </Box>

        <TaskForm
          open={openTaskForm}
          handleClose={() => {
            setOpenTaskForm(false);
            setEditTask(null);
          }}
          onSubmit={editTask ? (data) => handleUpdateTask(editTask._id, data) : handleCreateTask}
          initialValues={editTask}
        />
      </Container>
    </Box>
  );
};

export default DashboardPage;
