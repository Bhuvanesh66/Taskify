import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Checkbox,
  Box,
  Chip,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

const TaskCard = ({ task, onToggle, onEdit, onDelete }) => {
  const [loading, setLoading] = useState(false);

  const handleToggle = async (e) => {
    e.preventDefault(); // Prevent any default behavior
    setLoading(true);
    try {
      await onToggle(task._id, !task.isDone);
    } catch (error) {
      console.error('Error toggling task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 2, opacity: task.isDone ? 0.7 : 1 }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" flex={1}>
            <Checkbox
              checked={task.isDone}
              onChange={handleToggle}
              disabled={loading}
            />
            <Box>
              <Typography
                variant="h6"
                sx={{
                  textDecoration: task.isDone ? 'line-through' : 'none',
                }}
              >
                {task.title}
              </Typography>
              {task.description && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    textDecoration: task.isDone ? 'line-through' : 'none',
                  }}
                >
                  {task.description}
                </Typography>
              )}
              <Chip
                label={task.category}
                size="small"
                sx={{ mt: 1 }}
                color="primary"
                variant="outlined"
              />
            </Box>
          </Box>
          <Box>
            <IconButton onClick={() => onEdit(task)} size="small">
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => onDelete(task._id)} size="small" color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
