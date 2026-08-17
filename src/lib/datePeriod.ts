export type DatePeriodMode = "day" | "month" | "year" | "all";

export type DatePeriodValue = {
  mode: DatePeriodMode;
  date?: string; // YYYY-MM-DD
  month?: number; // 1-12
  year?: number;
};

export function buildCreatedAtFilter(period: DatePeriodValue) {
  if (period.mode === "all") return null;

  if (period.mode === "day" && period.date) {
    const start = new Date(`${period.date}T00:00:00`);
    const end = new Date(`${period.date}T23:59:59.999`);
    if (Number.isNaN(start.getTime())) return null;
    return { $gte: start, $lte: end };
  }

  if (period.mode === "month" && period.year && period.month) {
    const start = new Date(period.year, period.month - 1, 1, 0, 0, 0, 0);
    const end = new Date(period.year, period.month, 0, 23, 59, 59, 999);
    return { $gte: start, $lte: end };
  }

  if (period.mode === "year" && period.year) {
    const start = new Date(period.year, 0, 1, 0, 0, 0, 0);
    const end = new Date(period.year, 11, 31, 23, 59, 59, 999);
    return { $gte: start, $lte: end };
  }

  return null;
}

export function parseDatePeriodFromSearchParams(
  searchParams: URLSearchParams,
): DatePeriodValue {
  const mode = (searchParams.get("mode") || "month") as DatePeriodMode;
  const date = searchParams.get("date") || undefined;
  const month = searchParams.get("month")
    ? Number(searchParams.get("month"))
    : undefined;
  const year = searchParams.get("year")
    ? Number(searchParams.get("year"))
    : undefined;

  return {
    mode: ["day", "month", "year", "all"].includes(mode) ? mode : "month",
    date,
    month: Number.isFinite(month) ? month : undefined,
    year: Number.isFinite(year) ? year : undefined,
  };
}

export function datePeriodToQuery(period: DatePeriodValue) {
  const params = new URLSearchParams();
  params.set("mode", period.mode);
  if (period.mode === "day" && period.date) params.set("date", period.date);
  if (period.mode === "month") {
    if (period.year) params.set("year", String(period.year));
    if (period.month) params.set("month", String(period.month));
  }
  if (period.mode === "year" && period.year) {
    params.set("year", String(period.year));
  }
  return params;
}

export function currentMonthPeriod(): DatePeriodValue {
  const now = new Date();
  return {
    mode: "month",
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  };
}

export function todayPeriod(): DatePeriodValue {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  return { mode: "day", date };
}

export const MONTH_OPTIONS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];
