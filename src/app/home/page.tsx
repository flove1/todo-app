"use client";
import React, { useState, useEffect, useRef, useMemo } from "react"; // Import useMemo
import { useRouter } from "next/navigation";
import isEqual from "lodash/isEqual";
import {
  Container,
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
  Box,
  Checkbox,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Typography,
  IconButton, // Added IconButton import
  SelectChangeEvent // Import SelectChangeEvent
} from "@mui/material";
import { Delete, AddCircle } from "@mui/icons-material";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "../page.css";

interface Todo {
  id: number;
  task: string;
  category: string;
  completed: boolean;
  userId: number;
  createdAt?: number; // Add createdAt for sorting by date (use Date.now() when adding)
}

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newCategory, setNewCategory] = useState("Personal");
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("createdAt"); // Default sort by creation time
  const [sortOrder, setSortOrder] = useState("desc"); // Default sort descending (newest first)
  const [user, setUser] = useState<{ id: number; username: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const prevTodosRef = useRef<Todo[]>();

  // Fetch user from local storage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (storedUser) {
      setUser(storedUser);
    } else {
      router.push("/auth/login"); // Redirect if no user
    }
  }, [router]);

  // Fetch todos when user is set
  useEffect(() => {
    if (user) {
      fetchTodos(user.id);
    }
  }, [user]);

  // Store previous todos for comparison
  useEffect(() => {
    prevTodosRef.current = todos;
  });

  const fetchTodos = async (userId: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/todos?userId=${userId}`);
      if (response.ok) {
        let data = await response.json();
        // Ensure createdAt exists for sorting (might need backend adjustment or default here)
        data = data.map((todo: any) => ({ ...todo, createdAt: todo.id })); // Use id as proxy if no createdAt
        if (!isEqual(data, prevTodosRef.current)) {
          setTodos(data);
        }
      } else {
        console.error("Failed to fetch todos");
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTodo = async () => {
    if (!newTask.trim() || !user) return;

    const newTodoData = {
      userId: user.id,
      task: newTask,
      category: newCategory,
      completed: false,
      createdAt: Date.now(), // Add creation timestamp
    };

    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send createdAt if backend supports it, otherwise it's just client-side
        body: JSON.stringify({
          userId: newTodoData.userId,
          task: newTodoData.task,
          category: newTodoData.category,
          completed: newTodoData.completed,
        }),
      });

      if (response.ok) {
        // Use the timestamp as the ID if backend confirms this pattern
        const addedTodo = { ...newTodoData, id: newTodoData.createdAt };
        setTodos([...todos, addedTodo]);
        setNewTask("");
        setNewCategory("Personal");
      } else {
        console.error("Failed to add todo");
      }
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const toggleTodo = async (id: number) => {
    if (!user) return;

    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const updatedCompleted = !todo.completed;

    try {
      const response = await fetch(`/api/todos`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, todoId: id, completed: updatedCompleted }),
      });

      if (response.ok) {
        setTodos(todos.map((t) => (t.id === id ? { ...t, completed: updatedCompleted } : t)));
      } else {
        console.error("Failed to update todo");
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const deleteTodo = async (id: number) => {
    if (!user) return;

    try {
      const response = await fetch(`/api/todos`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, todoId: id }),
      });

      if (response.ok) {
        setTodos(todos.filter((t) => t.id !== id));
      } else {
        console.error("Failed to delete todo");
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // Memoize sorted todos to avoid re-sorting on every render
  const sortedAndFilteredTodos = useMemo(() => {
    let filtered = todos.filter((todo) => {
      if (filter === "All") return true;
      if (filter === "Completed") return todo.completed;
      if (filter === "Pending") return !todo.completed;
      return todo.category === filter;
    });

    filtered.sort((a, b) => {
      let valA: string | number | boolean = '';
      let valB: string | number | boolean = '';

      // Handle different sortable properties
      if (sortBy === 'task') {
        valA = a.task.toLowerCase();
        valB = b.task.toLowerCase();
      } else if (sortBy === 'category') {
        valA = a.category.toLowerCase();
        valB = b.category.toLowerCase();
      } else if (sortBy === 'completed') {
        valA = a.completed; // boolean comparison works directly
        valB = b.completed;
      } else { // Default to createdAt (or id as proxy)
        valA = a.createdAt || a.id;
        valB = b.createdAt || b.id;
      }

      if (valA < valB) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (valA > valB) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [todos, filter, sortBy, sortOrder]); // Dependencies for memoization

  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom align="center">
          My ToDo List
        </Typography>

        {/* Add Todo Form */}
        <Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "center" }}>
          <TextField
            label="New Task"
            variant="outlined"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTodo()}
            fullWidth
            size="small"
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              label="Category"
            >
              <MenuItem value="Personal">Personal</MenuItem>
              <MenuItem value="Work">Work</MenuItem>
              <MenuItem value="Study">Study</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={addTodo}
            startIcon={<AddCircle />}
            sx={{ height: '40px' }} // Match TextField size
          >
            Add
          </Button>
        </Box>

        {/* Filter and Sort Controls */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          {/* Filter Select */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Filter By</InputLabel>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              label="Filter By"
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Personal">Personal</MenuItem>
              <MenuItem value="Work">Work</MenuItem>
              <MenuItem value="Study">Study</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>

          {/* Sort By Select */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              onChange={(e: SelectChangeEvent<string>) => setSortBy(e.target.value)}
              label="Sort By"
            >
              <MenuItem value="createdAt">Date Added</MenuItem>
              <MenuItem value="task">Task</MenuItem>
              <MenuItem value="category">Category</MenuItem>
              <MenuItem value="completed">Status</MenuItem>
            </Select>
          </FormControl>

          {/* Sort Order Select */}
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Order</InputLabel>
            <Select
              value={sortOrder}
              onChange={(e: SelectChangeEvent<string>) => setSortOrder(e.target.value)}
              label="Order"
            >
              <MenuItem value="asc">Asc</MenuItem>
              <MenuItem value="desc">Desc</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Todo List */}
        <List>
          <TransitionGroup>
            {sortedAndFilteredTodos.map((todo) => (
              <CSSTransition key={todo.id} timeout={300} classNames="todo-item">
                <ListItem
                  disablePadding
                  sx={{
                    mb: 1,
                    borderRadius: 1,
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                    '&:hover': {
                      boxShadow: 3,
                    }
                  }}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => deleteTodo(todo.id)}>
                      <Delete color="error" />
                    </IconButton>
                  }
                >
                  <ListItemButton onClick={() => toggleTodo(todo.id)} dense>
                    <Checkbox
                      edge="start"
                      checked={todo.completed}
                      tabIndex={-1}
                      disableRipple
                    />
                    <ListItemText
                      primary={todo.task}
                      secondary={todo.category}
                      sx={{ textDecoration: todo.completed ? "line-through" : "none" }}
                    />
                  </ListItemButton>
                </ListItem>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </List>
        {sortedAndFilteredTodos.length === 0 && (
          <Typography align="center" color="text.secondary">
            No todos found for the selected filter.
          </Typography>
        )}
      </Paper>
    </Container>
  );
}
