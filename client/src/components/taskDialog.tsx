import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useToast } from "../context/toastContext";
import { useNavigate } from "react-router-dom";
import { Loader } from "../common/loader";
import { useAuth } from "../context/authContext";

const API_BASE = import.meta.env.VITE_API_URL;

export interface Task {
  _id?: string;
  title: string;
  description: string;
  status: "Pending" | "Completed";
  createdAt?: string;
}

interface Props {
  open: boolean;
  handleClose: () => void;
  editing: Task | null;
}

export const TaskDialog = ({open, handleClose, editing }: Props) => {
  const isEdit = Boolean(editing);
  const { showToast } = useToast();
  const { signout } = useAuth()
  const navigate = useNavigate();
  const [title, setTitle] = useState(editing?.title || "");
  const [description, setDescription] = useState(editing?.description || "");
  const [status, setStatus] = useState<Task["status"]>(
    editing?.status || "Pending"
  );
  const [loading,setLoading] = useState(false);

  useEffect(() => {
    if (editing) {
      setTitle(editing.title);
      setDescription(editing.description);
      setStatus(editing.status);
    } else {
      setTitle("");
      setDescription("");
      setStatus("Pending");
    }
  }, [editing, open]);

 const handleSubmit = async () => {

  if (!title.trim()) {
    showToast("Title is required", "error");
    return;
  }

  if (title.length < 3) {
    showToast("Title must be at least 3 characters", "error");
    return;
  }

  if (!description.trim()) {
    showToast("Description is required", "error");
    return;
  }

  if (description.length < 10) {
    showToast("Description must be at least 10 characters", "error");
    return;
  }

  if (!status) {
    showToast("Please select a status", "error");
    return;
  }

  try {
    setLoading(true);
    if (isEdit) {
      await axios.put(`${API_BASE}/tasks/${editing?._id}`, {
        title,
        description,
        status,
      });
      showToast("Task updated successfully!", "success");
    } else {
      await axios.post(`${API_BASE}/tasks`, {
        title,
        description,
        status,
      });
      showToast("Task created successfully!", "success");
    }

    handleClose();
  } catch (err: any) {
    console.error("Failed to save task:", err);

    if (err.response?.status === 401) {
      showToast("Session expired, login again", "error");
      signout()
      navigate("/");
      return;
    }

    const message =
      err.response?.data?.message ||
      "Something went wrong while saving the task.";

      showToast(message, "error");
  }finally {
    setLoading(false);
  }
};

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>{isEdit ? "Edit Task" : "Add Task"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          sx={{ mt: 1 }}
          required
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          minRows={3}
          sx={{ mt: 2 }}
          required
        />
        <TextField
          select
          SelectProps={{ native: true }}
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as Task["status"])}
          fullWidth
          sx={{ mt: 2 }}
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </TextField>
       </DialogContent>
       <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          disabled={loading}
          variant="contained" 
          onClick={handleSubmit}
          >
          {loading ? <Loader size={22} /> : isEdit ? "Save" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
