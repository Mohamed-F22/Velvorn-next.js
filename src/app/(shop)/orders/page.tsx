"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
  Pagination,
} from "@mui/material";

type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

interface OrderItem {
  _id: string;
  productTitle: string;
  productImage: string;
  unitPrice: number;
  offerPrice?: number;
  quantity: number;
  size: "xs" | "sm" | "md" | "lg" | "xl";
}

interface Order {
  _id: string;
  orderItems: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

const STATUS_STEPS: Exclude<OrderStatus, "cancelled">[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
];

const PAGE_SIZE = 4;

function getStatusColor(status: OrderStatus) {
  if (status === "pending") return "warning";
  if (status === "processing") return "info";
  if (status === "shipped") return "secondary";
  if (status === "delivered") return "success";
  return "default";
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelingOrderId, setCancelingOrderId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/orders", { method: "GET" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch orders");
      }

      setOrders(data.orders || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return orders.slice(start, start + PAGE_SIZE);
  }, [orders, page]);

  const handleCancelOrder = async (orderId: string) => {
    try {
      setCancelingOrderId(orderId);
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel order");
      }

      setOrders((prev) => prev.filter((order) => order._id !== orderId));
    } catch (err: any) {
      setError(err.message || "Failed to cancel order");
    } finally {
      setCancelingOrderId(null);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 10, md: 12 } }}>
      <Stack spacing={3}>
        <Typography variant="h4" fontWeight={700}>
          My Orders
        </Typography>

        {error ? <Alert severity="error">{error}</Alert> : null}

        {loading ? (
          <Box
            sx={{
              minHeight: 280,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : orders.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              border: "1px solid #ececec",
              borderRadius: 2,
              p: 4,
              textAlign: "center",
            }}
          >
            <Typography variant="h6" mb={1}>
              No orders found
            </Typography>
            <Typography color="text.secondary">
              You have no active orders yet.
            </Typography>
          </Paper>
        ) : (
          <>
            <Stack spacing={2.5}>
              {paginatedOrders.map((order) => {
                const statusStepIndex = STATUS_STEPS.indexOf(
                  order.status as Exclude<OrderStatus, "cancelled">,
                );
                const createdDate = new Date(
                  order.createdAt,
                ).toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                });

                return (
                  <Paper
                    key={order._id}
                    elevation={0}
                    sx={{
                      border: "1px solid #e8e8e8",
                      borderRadius: 2,
                      p: { xs: 2, md: 2.5 },
                    }}
                  >
                    <Stack spacing={2}>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        gap={1}
                      >
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography fontWeight={700}>
                            Order #{order._id.slice(-6).toUpperCase()}
                          </Typography>
                          <Chip
                            size="small"
                            label={order.status}
                            color={getStatusColor(order.status)}
                            sx={{ textTransform: "capitalize" }}
                          />
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {createdDate}
                        </Typography>
                      </Stack>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "100%",
                        }}
                      >
                        {STATUS_STEPS.map((step, index) => {
                          const isActive = index <= statusStepIndex;
                          const isLast = index === STATUS_STEPS.length - 1;

                          return (
                            <Stack
                              key={step}
                              direction="row"
                              alignItems="center"
                              sx={{ flex: isLast ? "none" : 1 }}
                            >
                              <Box
                                sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: "50%",
                                  bgcolor: isActive ? "#43a047" : "#cfcfcf",
                                  flexShrink: 0,
                                }}
                              />

                              {!isLast && (
                                <Box
                                  sx={{
                                    height: 2,
                                    bgcolor:
                                      index < statusStepIndex
                                        ? "#43a047"
                                        : "#e0e0e0",
                                    width: "100%",
                                  }}
                                />
                              )}
                            </Stack>
                          );
                        })}
                      </Box>

                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        mt={1}
                        sx={{ fontSize: 12, color: "text.secondary" }}
                      >
                        <span>Ordered</span>
                        <span>Processing</span>
                        <span>Shipped</span>
                        <span>Delivered</span>
                      </Stack>

                      <Divider />

                      <Stack spacing={1.25}>
                        {order.orderItems.map((item) => {
                          const itemTotal =
                            (item.offerPrice ?? item.unitPrice) * item.quantity;

                          return (
                            <Stack
                              key={item._id}
                              direction={{ xs: "column", sm: "row" }}
                              alignItems={{ xs: "flex-start", sm: "center" }}
                              justifyContent="space-between"
                              gap={1.5}
                            >
                              <Stack
                                direction="row"
                                spacing={1.5}
                                alignItems="center"
                              >
                                <Box
                                  component="img"
                                  src={item.productImage}
                                  alt={item.productTitle}
                                  sx={{
                                    width: 84,
                                    height: 84,
                                    objectFit: "cover",
                                    borderRadius: 1,
                                    border: "1px solid #eee",
                                  }}
                                />
                                <Box>
                                  <Typography fontWeight={600}>
                                    {item.productTitle}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ textTransform: "uppercase" }}
                                  >
                                    Size: {item.size} - Quantity:{" "}
                                    {item.quantity}
                                  </Typography>
                                  <Typography sx={{display: {xs: "block", sm: "none"}}} fontWeight={600}>
                                    {itemTotal.toFixed(2)} $
                                  </Typography>
                                </Box>
                              </Stack>
                              <Typography sx={{display: { xs: "none", sm: "block" }}} fontWeight={600}>
                                {itemTotal.toFixed(2)} $
                              </Typography>
                            </Stack>
                          );
                        })}
                      </Stack>

                      <Divider />

                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "stretch", sm: "center" }}
                        gap={1.5}
                      >
                        <Typography fontWeight={700}>
                          Total: {order.totalAmount.toFixed(2)} $
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <Button variant="outlined">Track Order</Button>
                          {order.status === "pending" ? (
                            <Button
                              variant="outlined"
                              color="error"
                              disabled={cancelingOrderId === order._id}
                              onClick={() => handleCancelOrder(order._id)}
                            >
                              {cancelingOrderId === order._id
                                ? "Cancelling..."
                                : "Cancel Order"}
                            </Button>
                          ) : null}
                        </Stack>
                      </Stack>
                    </Stack>
                  </Paper>
                );
              })}
            </Stack>

            {orders.length > PAGE_SIZE ? (
              <Stack alignItems="center" pt={1}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  shape="rounded"
                />
              </Stack>
            ) : null}
          </>
        )}
      </Stack>
    </Container>
  );
}
