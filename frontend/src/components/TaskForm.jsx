/**
 * TaskForm Component
 * A modal form for creating and editing tasks
 * Features:
 * - Form validation using Formik and Yup
 * - Title, description, and category fields
 * - Loading state handling
 * - Reusable for both create and edit operations
 */

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const categories = ['work', 'personal', 'shopping', 'health', 'other'];

const TaskForm = ({ open, handleClose, onSubmit, initialValues }) => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: initialValues || {
      title: '',
      description: '',
      category: 'other',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      description: Yup.string(),
      category: Yup.string().required('Category is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await onSubmit(values);
        handleClose();
      } catch (error) {
        console.error('Error submitting task:', error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>{initialValues ? 'Edit Task' : 'New Task'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Title"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            name="description"
            multiline
            rows={4}
            value={formik.values.description}
            onChange={formik.handleChange}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Category"
            name="category"
            select
            value={formik.values.category}
            onChange={formik.handleChange}
            error={formik.touched.category && Boolean(formik.errors.category)}
            helperText={formik.touched.category && formik.errors.category}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskForm;
