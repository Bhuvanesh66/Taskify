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
  const [loading, setLoading] = useState(true);
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
    setLoading(true);
    try {
      const response = await getTasks(category === 'all' ? '' : category);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
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
      <AppBar 
        position="static" 
        elevation={0}
        sx={{
          backgroundColor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              color: 'primary.main',
              fontWeight: 700,
              fontSize: '1.5rem'
            }}
          >
            Taskify
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: 'text.primary',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Welcome, {user?.name}
            </Typography>
            <IconButton 
              onClick={handleMenuClick}
              sx={{ 
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                p: 1
              }}
            >
              <AccountCircle sx={{ color: 'text.primary' }} />
            </IconButton>
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1,
                boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
              }
            }}
          >
            <MenuItem onClick={logout} sx={{ color: 'error.main' }}>
              Logout
            </MenuItem>
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

        <Box 
          sx={{ 
            backgroundColor: 'background.paper',
            borderRadius: 2,
            p: 2,
            mb: 4,
            boxShadow: '0px 2px 4px rgba(0,0,0,0.05)'
          }}
        >
          <Tabs
            value={category}
            onChange={(e, newValue) => setCategory(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0',
              },
              '& .MuiTab-root': {
                textTransform: 'capitalize',
                minWidth: 100,
                fontWeight: 600,
                '&.Mui-selected': {
                  color: 'primary.main',
                },
              },
            }}
          >
            {categories.map((cat) => (
              <Tab
                key={cat}
                value={cat}
                label={cat.charAt(0).toUpperCase() + cat.slice(1)}
              />
            ))}
          </Tabs>
        </Box>

        <Box>
          {loading ? (
            <Box 
              display="flex" 
              justifyContent="center" 
              alignItems="center" 
              minHeight="200px"
            >
              <Typography color="text.secondary">Loading tasks...</Typography>
            </Box>
          ) : tasks.length === 0 ? (
            <Box 
              display="flex" 
              flexDirection="column" 
              alignItems="center" 
              justifyContent="center" 
              minHeight="200px"
              sx={{
                backgroundColor: 'background.paper',
                borderRadius: 2,
                p: 4,
                textAlign: 'center'
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No tasks found
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                {category === 'all' 
                  ? "You haven't created any tasks yet" 
                  : `You don't have any ${category} tasks`}
              </Typography>
              <Button
                variant="outlined"
                onClick={() => setOpenTaskForm(true)}
                startIcon={<AddIcon />}
              >
                Add your first task
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gap: 2,
                opacity: loading ? 0.5 : 1,
                transition: 'opacity 0.3s ease'
              }}
            >
              {tasks.map((task, index) => (
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
            </Box>
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
