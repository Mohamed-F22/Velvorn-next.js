"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  IconButton,
} from "@mui/material";
import { ORDER_STATUSES } from "@/lib/constants";
import DatePeriodFilter from "@/app/dashboard/components/DatePeriodFilter";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import {
  DatePeriodValue,
  currentMonthPeriod,
  datePeriodToQuery,
} from "@/lib/datePeriod";
import { OrderDetails } from "./components/order";

type Order = {
  _id: string;
  totalAmount: number;
  status: string;
  shippingFee?: number;
  discountAmount?: number;
  couponCode?: string | null;
  shippingAddress: { fullName: string; email: string; governorate: string };
  createdAt: string;
  orderItems: { productTitle: string; quantity: number }[];
};

export default function DashboardOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<DatePeriodValue>(currentMonthPeriod);
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);

  const toggleOrderDetails = (id: any) => {
    setExpandedOrder((prev) => (prev === id ? null : id));
  };

  const load = useCallback(async () => {
    setLoading(true);
    const params = datePeriodToQuery(period);
    if (status) params.set("status", status);
    if (q.trim()) params.set("q", q.trim());

    const res = await fetch(`/api/admin/orders?${params}`, {
      credentials: "include",
    });
    const data = await res.json();
    setOrders(data.orders || []);
    setLoading(false);
  }, [period, status, q]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const updateStatus = async (id: string, nextStatus: string) => {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    await load();
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Orders
      </Typography>

      <Stack spacing={2} mb={3}>
        <DatePeriodFilter value={period} onChange={setPeriod} allowAll />
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            select
            size="small"
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">All</MenuItem>
            {ORDER_STATUSES.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            size="small"
            label="Search order ID or customer"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            sx={{ flex: 1 }}
          />
        </Stack>
      </Stack>
      {loading ? (
        <CircularProgress sx={{ color: "#222" }} />
      ) : (
        <>
          {/* ================= DESKTOP TABLE ================= */}
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              bgcolor: "#fff",
              border: "1px solid #e5e5e5",
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Order</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Details</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {orders.map((order) => {
                  const isExpanded = expandedOrder === order._id;

                  return (
                    <>
                      {/* ================= ORDER ROW ================= */}
                      <TableRow key={order._id}>
                        {/* Order */}
                        <TableCell
                          sx={{
                            fontFamily: "monospace",
                            fontSize: 12,
                          }}
                        >
                          {order._id.slice(-8)}
                        </TableCell>

                        {/* Customer */}
                        <TableCell>
                          <Typography fontWeight={600}>
                            {order.shippingAddress?.fullName}
                          </Typography>

                          <Typography variant="caption" color="text.secondary">
                            {order.shippingAddress?.email}
                          </Typography>
                        </TableCell>

                        {/* Total */}
                        <TableCell>${order.totalAmount.toFixed(2)}</TableCell>

                        {/* Date */}
                        <TableCell>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <TextField
                            select
                            size="small"
                            value={order.status}
                            onChange={(e) =>
                              updateStatus(order._id, e.target.value)
                            }
                            sx={{
                              minWidth: 105,
                            }}
                          >
                            {ORDER_STATUSES.map((s) => (
                              <MenuItem key={s} value={s}>
                                {s}
                              </MenuItem>
                            ))}
                          </TextField>
                        </TableCell>

                        {/* Details */}
                        <TableCell align="right">
                          <Button
                            size="small"
                            onClick={() => toggleOrderDetails(order._id)}
                            endIcon={
                              isExpanded ? (
                                <ExpandLessIcon />
                              ) : (
                                <ExpandMoreIcon />
                              )
                            }
                            sx={{
                              textTransform: "none",
                              color: "#222",
                            }}
                          >
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>

                      {/* ================= DETAILS ROW ================= */}
                      <TableRow key={`${order._id}-details`}>
                        <TableCell
                          colSpan={6}
                          sx={{
                            p: 0,
                            borderBottom: isExpanded
                              ? "1px solid #e5e5e5"
                              : "none",
                          }}
                        >
                          <Collapse
                            in={isExpanded}
                            timeout="auto"
                            unmountOnExit
                          >
                            <OrderDetails order={order} />
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </>
                  );
                })}

                {!orders.length && (
                  <TableRow>
                    <TableCell colSpan={6}>No orders found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>

          {/* ================= MOBILE CARDS ================= */}
          <Stack
            spacing={1.5}
            sx={{
              display: { xs: "flex", md: "none" },
            }}
          >
            {!orders.length ? (
              <Box
                sx={{
                  bgcolor: "#fff",
                  border: "1px solid #e5e5e5",
                  p: 2,
                  textAlign: "center",
                }}
              >
                <Typography color="text.secondary">No orders found.</Typography>
              </Box>
            ) : (
              orders.map((order) => {
                const isExpanded = expandedOrder === order._id;

                return (
                  <Card
                    key={order._id}
                    elevation={0}
                    sx={{
                      border: "1px solid #e5e5e5",
                      borderRadius: 0,
                    }}
                  >
                    <CardContent sx={{ p: 1.5 }}>
                      {/* Header */}
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                      >
                        <Box>
                          <Typography
                            sx={{
                              fontFamily: "monospace",
                              fontSize: 12,
                              color: "text.secondary",
                            }}
                          >
                            #{order._id.slice(-8)}
                          </Typography>

                          <Typography fontWeight={600} sx={{ mt: 0.3 }}>
                            {order.shippingAddress?.fullName}
                          </Typography>

                          <Typography variant="caption" color="text.secondary">
                            {order.shippingAddress?.email}
                          </Typography>
                        </Box>

                        <Typography fontWeight={600}>
                          ${order.totalAmount.toFixed(2)}
                        </Typography>
                      </Stack>

                      {/* Date + Status */}
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{
                          mt: 1.5,
                          pt: 1.5,
                          borderTop: "1px solid #eee",
                        }}
                      >
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                          >
                            Date
                          </Typography>

                          <Typography variant="body2">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>

                        <TextField
                          select
                          size="small"
                          value={order.status}
                          onChange={(e) =>
                            updateStatus(order._id, e.target.value)
                          }
                          sx={{
                            minWidth: 105,
                          }}
                        >
                          {ORDER_STATUSES.map((s) => (
                            <MenuItem key={s} value={s}>
                              {s}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Stack>

                      {/* Details Button */}
                      <Button
                        fullWidth
                        size="small"
                        onClick={() => toggleOrderDetails(order._id)}
                        endIcon={
                          isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />
                        }
                        sx={{
                          mt: 1.5,
                          textTransform: "none",
                          color: "#222",
                          borderTop: "1px solid #eee",
                          borderRadius: 0,
                          pt: 1.5,
                        }}
                      >
                        {isExpanded ? "Hide Details" : "View Details"}
                      </Button>

                      {/* Mobile Details */}
                      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <OrderDetails order={order} />
                      </Collapse>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </Stack>
        </>
      )}
    </Box>
  );
}
