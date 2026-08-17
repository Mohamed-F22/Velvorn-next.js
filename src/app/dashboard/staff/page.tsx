"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useAdminAuthStore } from "@/Stores/AdminAuthStore";

type Staff = {
  _id: string;
  fullName: string;
  email: string;
  role: "admin" | "staff";
};

export default function DashboardStaffPage() {
  const current = useAdminAuthStore((s) => s.user);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "staff" as "admin" | "staff",
  });

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/staff", { credentials: "include" });
    const data = await res.json();
    setStaff(data.staff || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    const res = await fetch("/api/admin/staff", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "Failed");
      return;
    }
    setOpen(false);
    setForm({ fullName: "", email: "", password: "", role: "staff" });
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this account?")) return;
    const res = await fetch(`/api/admin/staff/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "Failed");
      return;
    }
    await load();
  };

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Staff & Admins
        </Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => setOpen(true)}
          sx={{ bgcolor: "#222", borderRadius: 0, "&:hover": { bgcolor: "#444" } }}
        >
          Add account
        </Button>
      </Stack>

      {loading ? (
        <CircularProgress sx={{ color: "#222" }} />
      ) : (
        <Box sx={{ overflowX: "auto", bgcolor: "#fff", border: "1px solid #e5e5e5" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {staff.map((s) => (
                <TableRow key={s._id}>
                  <TableCell>{s.fullName}</TableCell>
                  <TableCell>{s.email}</TableCell>
                  <TableCell>{s.role}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      disabled={s._id === current?.id}
                      onClick={() => remove(s._id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add admin / staff</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Full name"
                value={form.fullName}
                onChange={(e) =>
                  setForm({ ...form, fullName: e.target.value })
                }
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                type="password"
                label="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                select
                fullWidth
                label="Role"
                value={form.role}
                onChange={(e) =>
                  setForm({
                    ...form,
                    role: e.target.value as "admin" | "staff",
                  })
                }
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="staff">Staff</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={save}
            sx={{ bgcolor: "#222", borderRadius: 0 }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
