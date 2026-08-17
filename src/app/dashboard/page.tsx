"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";
import Link from "next/link";

type ReportSummary = {
  totalSales: number;
  orderCount: number;
  averageOrderValue: number;
  returnsRate: number;
};

export default function DashboardHomePage() {
  const [data, setData] = useState<ReportSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const now = new Date();
    const params = new URLSearchParams({
      mode: "month",
      year: String(now.getFullYear()),
      month: String(now.getMonth() + 1),
    });
    fetch(`/api/admin/reports?${params}`, { credentials: "include" })
      .then((r) => r.json())
      .then((json) => setData(json))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress sx={{ color: "#222" }} />
      </Box>
    );
  }

  const cards = [
    { label: "Sales (month)", value: `$${(data?.totalSales || 0).toFixed(2)}` },
    { label: "Orders (month)", value: String(data?.orderCount || 0) },
    {
      label: "Avg order value",
      value: `$${(data?.averageOrderValue || 0).toFixed(2)}`,
    },
    {
      label: "Returns rate",
      value: `${(data?.returnsRate || 0).toFixed(1)}%`,
    },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Overview
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {cards.map((card) => (
          <Grid key={card.label} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card elevation={0} sx={{ border: "1px solid #e5e5e5", borderRadius: 0 }}>
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
      <Button
        component={Link}
        href="/dashboard/reports"
        variant="outlined"
        sx={{ borderRadius: 0, color: "#222", borderColor: "#ccc" }}
      >
        View full reports
      </Button>
    </Box>
  );
}
