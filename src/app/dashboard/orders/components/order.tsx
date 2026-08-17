"use client";

import { Box, Stack, Typography, Chip, Grid } from "@mui/material";

export const OrderDetails = ({ order }: any) => {
  const address = order.shippingAddress;

  return (
    <Box
      sx={{
        mt: 1.5,
        pt: 2,
        px: 2,
        borderTop: "1px solid #eee",
      }}
    >
      {/* ================= ITEMS ================= */}
      <Typography fontWeight={600} sx={{ mb: 1 }}>
        Order Items
      </Typography>

      <Grid
        container
        sx={{
          bgcolor: "#fafafa",
          p: 1.5,
        }}
        spacing={3}
      >
        {order.orderItems?.map((item: any) => (
          <Grid
            key={item._id}
            sx={{
              py: 1,
              borderBottom: "1px solid #f0f0f0",
            }}
            size={{ xs: 12, sm: 6, lg: 4 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {item.productImage && (
                <img
                  src={item.productImage}
                  alt=""
                  width={45}
                  height={55}
                  style={{
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                />
              )}

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography fontWeight={600} fontSize={14}>
                  {item.productTitle}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  Size: {item.size?.toUpperCase()} · Qty: {item.quantity}
                </Typography>
              </Box>

              <Box sx={{ textAlign: "right" }}>
                {item.offerPrice != null && item.offerPrice < item.unitPrice ? (
                  <>
                    <Typography fontWeight={600}>
                      ${(item.offerPrice * item.quantity).toFixed(2)}
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{
                        textDecoration: "line-through",
                        color: "#999",
                      }}
                    >
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </Typography>
                  </>
                ) : (
                  <Typography fontWeight={600}>
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* ================= SHIPPING ================= */}
      <Typography fontWeight={600} sx={{ mt: 2, mb: 1 }}>
        Shipping Information
      </Typography>

      <Box
        sx={{
          bgcolor: "#fafafa",
          p: 1.5,
        }}
      >
        <Grid container>
          <Grid size={{ xs: 12 }}>
            <Typography fontWeight={600}>{address?.fullName}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Typography>{address?.phone}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Typography>{address?.email}</Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Typography sx={{ mt: 0.5 }}>
              {address?.governorate}, {address?.city}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Typography>{address?.addressDetails}</Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography sx={{fontWeight:"bold"}}>Notes: {order?.notes}</Typography>
          </Grid>
        </Grid>
      </Box>

      {/* ================= SUMMARY ================= */}
      <Typography fontWeight={600} sx={{ mt: 2, mb: 1 }}>
        Order Summary
      </Typography>

      <Stack sx={{ bgcolor: "#fafafa", p: 1.5 }} spacing={0.7}>
        <Stack direction="row" justifyContent="space-between">
          <Typography color="text.secondary">Shipping</Typography>

          <Typography>${order.shippingFee?.toFixed(2)}</Typography>
        </Stack>

        {order.discountAmount > 0 && (
          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary">Discount</Typography>

            <Typography>-${order.discountAmount.toFixed(2)}</Typography>
          </Stack>
        )}

        {order.couponCode && (
          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary">Coupon</Typography>

            <Chip
              size="small"
              label={order.couponCode}
              sx={{ borderRadius: 0 }}
            />
          </Stack>
        )}

        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{
            pt: 1,
            mt: 0.5,
            borderTop: "1px solid #ddd",
          }}
        >
          <Typography fontWeight={600}>Total</Typography>

          <Typography fontWeight={600}>
            ${order.totalAmount.toFixed(2)}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};
