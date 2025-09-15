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
  const [isHovered, setIsHovered] = useState(false);

  const handleToggle = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onToggle(task._id, !task.isDone);
    } catch (error) {
      console.error('Error toggling task:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      work: '#ff9800',
      personal: '#2196f3',
      shopping: '#4caf50',
      health: '#e91e63',
      other: '#9c27b0'
    };
    return colors[category] || colors.other;
  };

  return (
    <Card
      sx={{
        mb: 2,
        opacity: task.isDone ? 0.7 : 1,
        transform: isHovered ? 'translateY(-2px)' : 'none',
        transition: 'all 0.3s ease',
        position: 'relative',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.01)',
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between">
          <Box display="flex" alignItems="flex-start" flex={1} gap={1}>
            <Checkbox
              checked={task.isDone}
              onChange={handleToggle}
              disabled={loading}
              sx={{
                '&.Mui-checked': {
                  color: 'success.main',
                },
                mt: 0.5
              }}
            />
            <Box>
              <Typography
                variant="h6"
                sx={{
                  textDecoration: task.isDone ? 'line-through' : 'none',
                  fontSize: '1.1rem',
                  color: task.isDone ? 'text.secondary' : 'text.primary',
                  transition: 'all 0.3s ease',
                  mb: 0.5
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
                    mb: 1,
                    display: '-webkit-box',
                    '-webkit-line-clamp': '2',
                    '-webkit-box-orient': 'vertical',
                    overflow: 'hidden',
                    height: task.description ? 'auto' : 0
                  }}
                >
                  {task.description}
                </Typography>
              )}
              <Chip
                label={task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                size="small"
                sx={{
                  backgroundColor: `${getCategoryColor(task.category)}15`,
                  color: getCategoryColor(task.category),
                  fontWeight: 500,
                  '& .MuiChip-label': {
                    px: 1,
                  }
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  ml: 2,
                  color: 'text.secondary',
                  display: 'inline-flex',
                  alignItems: 'center'
                }}
              >
                {new Date(task.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.2s ease',
              display: 'flex',
              gap: 0.5
            }}
          >
            <IconButton 
              onClick={() => onEdit(task)} 
              size="small"
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.08)',
                }
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton 
              onClick={() => onDelete(task._id)} 
              size="small" 
              color="error"
              sx={{
                backgroundColor: 'rgba(244, 67, 54, 0.04)',
                '&:hover': {
                  backgroundColor: 'rgba(244, 67, 54, 0.08)',
                }
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
