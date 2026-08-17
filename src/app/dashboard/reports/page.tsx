"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import DatePeriodFilter from "@/app/dashboard/components/DatePeriodFilter";
import {
  DatePeriodValue,
  currentMonthPeriod,
  datePeriodToQuery,
} from "@/lib/datePeriod";

type Report = {
  totalSales: number;
  orderCount: number;
  averageOrderValue: number;
  returnsRate: number;
  topProducts: { title: string; quantity: number; revenue: number }[];
  bottomProducts: { title: string; quantity: number; revenue: number }[];
};

export default function DashboardReportsPage() {
  const [period, setPeriod] = useState<DatePeriodValue>(currentMonthPeriod);
  const [data, setData] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const query = datePeriodToQuery(period).toString();
    fetch(`/api/admin/reports?${query}`, { credentials: "include" })
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [period]);

  const cards = [
    { label: "Total sales", value: `$${(data?.totalSales || 0).toFixed(2)}` },
    { label: "Orders", value: String(data?.orderCount || 0) },
    {
      label: "Average order value",
      value: `$${(data?.averageOrderValue || 0).toFixed(2)}`,
    },
    {
      label: "Returns rate",
      value: `${(data?.returnsRate || 0).toFixed(1)}%`,
    },
  ];

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ sm: "flex-start" }}
        mb={3}
        gap={2}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Reports
        </Typography>
        <DatePeriodFilter value={period} onChange={setPeriod} />
      </Stack>

      {loading ? (
        <CircularProgress sx={{ color: "#222" }} />
      ) : (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {cards.map((card) => (
              <Grid key={card.label} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card
                  elevation={0}
                  sx={{ border: "1px solid #e5e5e5", borderRadius: 0 }}
                >
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {card.label}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
                      {card.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

            <Box >
              <Typography variant="h6" mb={1}>
                Top selling products
              </Typography>
              <Box sx={{ bgcolor: "#fff", border: "1px solid #e5e5e5" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Qty</TableCell>
                      <TableCell>Revenue</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(data?.topProducts || []).map((p) => (
                      <TableRow key={p.title}>
                        <TableCell>{p.title}</TableCell>
                        <TableCell>{p.quantity}</TableCell>
                        <TableCell>${p.revenue.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    {!data?.topProducts?.length && (
                      <TableRow>
                        <TableCell colSpan={2}>No data</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>
            </Box>
        </>
      )}
    </Box>
  );
}
