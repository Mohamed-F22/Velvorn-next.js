"use client";

import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

type Customer = {
  _id: string;
  fullName: string;
  email: string;
  orderCount: number;
  totalSpent: number;
};

export default function DashboardCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/customers", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setCustomers(data.customers || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Customers
      </Typography>
      <Typography sx={{ color: "#666", mb: 3 }}>
        Sorted by total purchases (top spenders first).
      </Typography>

      {loading ? (
        <CircularProgress sx={{ color: "#222" }} />
      ) : (
        <Box sx={{ overflowX: "auto", bgcolor: "#fff", border: "1px solid #e5e5e5" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Orders</TableCell>
                <TableCell>Total spent</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((c, index) => (
                <TableRow key={c._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{c.fullName}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.orderCount}</TableCell>
                  <TableCell>${c.totalSpent.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              {!customers.length && (
                <TableRow>
                  <TableCell colSpan={5}>No customers yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      )}
    </Box>
  );
}
