"use client";

import { MenuItem, Stack, TextField } from "@mui/material";
import {
  DatePeriodValue,
  MONTH_OPTIONS,
} from "@/lib/datePeriod";

type Props = {
  value: DatePeriodValue;
  onChange: (value: DatePeriodValue) => void;
  allowAll?: boolean;
};

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 8 }, (_, i) => currentYear - i);

export default function DatePeriodFilter({
  value,
  onChange,
  allowAll = false,
}: Props) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} flexWrap="wrap" useFlexGap>
      <TextField
        select
        size="small"
        label="Filter by"
        value={value.mode}
        onChange={(e) => {
          const mode = e.target.value as DatePeriodValue["mode"];
          if (mode === "day") {
            onChange({
              mode,
              date: value.date || new Date().toISOString().slice(0, 10),
            });
          } else if (mode === "month") {
            onChange({
              mode,
              year: value.year || currentYear,
              month: value.month || new Date().getMonth() + 1,
            });
          } else if (mode === "year") {
            onChange({ mode, year: value.year || currentYear });
          } else {
            onChange({ mode: "all" });
          }
        }}
        sx={{ minWidth: 140 }}
      >
        <MenuItem value="day">Day</MenuItem>
        <MenuItem value="month">Month</MenuItem>
        <MenuItem value="year">Year</MenuItem>
        {allowAll && <MenuItem value="all">All time</MenuItem>}
      </TextField>

      {value.mode === "day" && (
        <TextField
          size="small"
          type="date"
          label="Date"
          InputLabelProps={{ shrink: true }}
          value={value.date || ""}
          onChange={(e) => onChange({ mode: "day", date: e.target.value })}
          sx={{ minWidth: 180 }}
        />
      )}

      {value.mode === "month" && (
        <>
          <TextField
            select
            size="small"
            label="Month"
            value={value.month || ""}
            onChange={(e) =>
              onChange({
                mode: "month",
                year: value.year || currentYear,
                month: Number(e.target.value),
              })
            }
            sx={{ minWidth: 160 }}
          >
            {MONTH_OPTIONS.map((m) => (
              <MenuItem key={m.value} value={m.value}>
                {m.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            label="Year"
            value={value.year || ""}
            onChange={(e) =>
              onChange({
                mode: "month",
                year: Number(e.target.value),
                month: value.month || new Date().getMonth() + 1,
              })
            }
            sx={{ minWidth: 120 }}
          >
            {YEARS.map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </TextField>
        </>
      )}

      {value.mode === "year" && (
        <TextField
          select
          size="small"
          label="Year"
          value={value.year || ""}
          onChange={(e) =>
            onChange({ mode: "year", year: Number(e.target.value) })
          }
          sx={{ minWidth: 120 }}
        >
          {YEARS.map((y) => (
            <MenuItem key={y} value={y}>
              {y}
            </MenuItem>
          ))}
        </TextField>
      )}
    </Stack>
  );
}
