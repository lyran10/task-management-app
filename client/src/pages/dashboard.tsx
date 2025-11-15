import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { TaskDialog } from "../components/taskDialog";
import { useAuth } from "../context/authContext";
import { useToast } from "../context/toastContext";
import { useNavigate } from "react-router";
import { Loader } from "../common/loader";

const API_BASE = import.meta.env.VITE_API_URL;

export const DashboardPage = () => {
  const { user, signout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate()
  const [tasks, setTasks] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [loading, setLoading] = useState(false)

  const pageSize = 5;

  useEffect(() => {
    if(!user) navigate("/")
  },[])

  const fetchTasks = async (pageNum = 1) => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_BASE}/tasks`, {
        params: { page: pageNum, limit: pageSize },
      });

      setTasks(res.data.tasks);
      setTotalPages(res.data.totalPages);
    } catch (err: any) {
      console.error("Error loading tasks:", err);
      if (err.response?.status === 401) {
        showToast("Session expired, login again", "error");
        signout()
        navigate("/")
        return;
      }
      showToast("Failed to fetch tasks", "error");
    }finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await axios.delete(`${API_BASE}/tasks/${id}`);
      showToast("Task deleted successfully!", "success");
      fetchTasks(page);
    } catch (err: any) {
      console.error(err);

      if (err.response?.status === 401) {
        showToast("Session expired, login again", "error");
        signout()
        navigate("/")
        return;
      }

      showToast("Failed to delete task", "error");
    }
  };

  useEffect(() => {
    if(user) fetchTasks(page);
  }, [page, user]);

  return (
    <Box sx={{ padding: "20px", height: "85%", width: "100%" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="h5" fontWeight="bold">
          Tasks
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          Add Task
        </Button>
      </Stack>

      <Paper elevation={3} sx={{ p: 2, height: "90%", overflow: "auto" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Created</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>

           <TableBody>

              {/* ⏳ Loader while fetching */}
              {loading && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Loader/>
                  </TableCell>
                </TableRow>
              )}

              {/* 🔍 No data found */}
              {!loading && tasks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography>No data found</Typography>
                  </TableCell>
                </TableRow>
              )}

              {/* ✅ Show actual data */}
              {!loading &&
                tasks.length > 0 &&
                tasks.map((t) => (
                  <TableRow key={t._id} hover>
                    <TableCell>{t.title}</TableCell>
                    <TableCell>{t.description}</TableCell>
                    <TableCell>{t.status}</TableCell>
                    <TableCell>{new Date(t.createdAt).toLocaleString()}</TableCell>

                    <TableCell align="right">
                      <IconButton
                        onClick={() => {
                          setEditing(t);
                          setDialogOpen(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>

                      {user?.role === "admin" && (
                        <IconButton onClick={() => handleDelete(t._id)}>
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}

            </TableBody>

          </Table>
        </TableContainer>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>

      <TaskDialog
        open={dialogOpen}
        handleClose={() => {
          setDialogOpen(false);
          fetchTasks(1);
        }}
        editing={editing}
      />
    </Box>
  );
};