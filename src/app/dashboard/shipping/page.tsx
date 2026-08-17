"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  IconButton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

type Rate = {
  _id: string;
  governorate: string;
  price: number;
  isActive: boolean;
};

export default function DashboardShippingPage() {
  const [rates, setRates] = useState<Rate[]>([]);
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState<Record<string, number>>({});

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/shipping", { credentials: "include" });
    const data = await res.json();
    const list = data.rates || [];
    setRates(list);
    const map: Record<string, number> = {};
    list.forEach((r: Rate) => {
      map[r._id] = r.price;
    });
    setDrafts(map);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const savePrice = async (rate: Rate) => {
    await fetch(`/api/admin/shipping/${rate._id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price: drafts[rate._id] }),
    });
    await load();
  };

  const toggle = async (rate: Rate) => {
    await fetch(`/api/admin/shipping/${rate._id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !rate.isActive }),
    });
    await load();
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Shipping
      </Typography>
      <Typography sx={{ color: "#666", mb: 3 }}>
        Set shipping price per governorate. Order shipping status is tracked from Orders.
      </Typography>

      {loading ? (
        <CircularProgress sx={{ color: "#222" }} />
      ) : (
        <Box sx={{ overflowX: "auto", bgcolor: "#fff", border: "1px solid #e5e5e5" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Governorate</TableCell>
                <TableCell>Price ($)</TableCell>
                <TableCell>Active</TableCell>
                <TableCell align="right">Save</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rates.map((rate) => (
                <TableRow key={rate._id}>
                  <TableCell>{rate.governorate}</TableCell>
                  <TableCell sx={{ maxWidth: 140 }}>
                    <TextField
                      size="small"
                      type="number"
                      value={drafts[rate._id] ?? rate.price}
                      onChange={(e) =>
                        setDrafts({
                          ...drafts,
                          [rate._id]: Number(e.target.value),
                        })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={rate.isActive}
                      onChange={() => toggle(rate)}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => savePrice(rate)}>
                      <SaveIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Box>
  );
}
