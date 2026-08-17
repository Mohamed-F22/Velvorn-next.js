"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

type Coupon = {
  _id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  isActive: boolean;
  expiresAt?: string | null;
  usageLimit?: number | null;
  usedCount: number;
};

export default function DashboardCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    code: "",
    type: "percent" as "percent" | "fixed",
    value: 10,
    isActive: true,
    expiresAt: "",
    usageLimit: "",
  });

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/coupons", { credentials: "include" });
    const data = await res.json();
    setCoupons(data.coupons || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        expiresAt: form.expiresAt || null,
        usageLimit: form.usageLimit === "" ? null : Number(form.usageLimit),
      }),
    });
    if (res.ok) {
      setOpen(false);
      setForm({
        code: "",
        type: "percent",
        value: 10,
        isActive: true,
        expiresAt: "",
        usageLimit: "",
      });
      await load();
    } else {
      const data = await res.json();
      alert(data.message || "Failed");
    }
  };

  const toggleActive = async (coupon: Coupon) => {
    await fetch(`/api/admin/coupons/${coupon._id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !coupon.isActive }),
    });
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete coupon?")) return;
    await fetch(`/api/admin/coupons/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
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
          Coupons
        </Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => setOpen(true)}
          sx={{ bgcolor: "#222", borderRadius: 0, "&:hover": { bgcolor: "#444" } }}
        >
          Create coupon
        </Button>
      </Stack>

      {loading ? (
        <CircularProgress sx={{ color: "#222" }} />
      ) : (
        <Box sx={{ overflowX: "auto", bgcolor: "#fff", border: "1px solid #e5e5e5" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Used</TableCell>
                <TableCell>Active</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {coupons.map((c) => (
                <TableRow key={c._id}>
                  <TableCell>{c.code}</TableCell>
                  <TableCell>{c.type}</TableCell>
                  <TableCell>
                    {c.type === "percent" ? `${c.value}%` : `$${c.value}`}
                  </TableCell>
                  <TableCell>
                    {c.usedCount}
                    {c.usageLimit != null ? ` / ${c.usageLimit}` : ""}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={c.isActive}
                      onChange={() => toggleActive(c)}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => remove(c._id)}>
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
        <DialogTitle>Create coupon</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Code"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                select
                fullWidth
                label="Type"
                value={form.type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    type: e.target.value as "percent" | "fixed",
                  })
                }
              >
                <MenuItem value="percent">Percent</MenuItem>
                <MenuItem value="fixed">Fixed</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Value"
                value={form.value}
                onChange={(e) =>
                  setForm({ ...form, value: Number(e.target.value) })
                }
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                type="date"
                label="Expires at"
                InputLabelProps={{ shrink: true }}
                value={form.expiresAt}
                onChange={(e) =>
                  setForm({ ...form, expiresAt: e.target.value })
                }
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Usage limit"
                value={form.usageLimit}
                onChange={(e) =>
                  setForm({ ...form, usageLimit: e.target.value })
                }
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.isActive}
                    onChange={(e) =>
                      setForm({ ...form, isActive: e.target.checked })
                    }
                  />
                }
                label="Active"
              />
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
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
