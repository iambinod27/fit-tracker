import { apiFetch } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useMemo } from "react";

function getIntensityClass(count: number): string {
  if (count === 0) return "bg-muted";
  if (count === 1) return "bg-primary/30";
  if (count === 2) return "bg-primary/60";
  return "bg-primary";
}

function generateDateGrid(): string[][] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysToShow = 365;
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - daysToShow);

  const startDay = startDate.getDay();
  startDate.setDate(startDate.getDate() - startDay);

  const weeks: string[][] = [];
  let currentWeek: string[] = [];
  const cursor = new Date(startDate);

  while (cursor <= today) {
    currentWeek.push(cursor.toISOString().split("T")[0]);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  if (currentWeek.length > 0) weeks.push(currentWeek);

  return weeks;
}

const ActivityHeatmap = () => {
  const { data: counts } = useQuery<Record<string, number>>({
    queryKey: ["heatmap"],
    queryFn: () => apiFetch("/stats/heatmap"),
  });

  const weeks = useMemo(() => generateDateGrid(), []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Activity [stay consistent]</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: "repeat(36, minmax(0,1fr))" }}
        >
          {weeks.map((week, i) => (
            <div key={i} className="flex flex-col gap-1">
              {week.map((date) => {
                const count = counts?.[date] ?? 0;
                return (
                  <div
                    key={date}
                    title={`${date}: ${count} ${count === 1 ? "activity" : "activities"}`}
                    className={`w-3 h-3 rounded-sm ${getIntensityClass(count)}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
export default ActivityHeatmap;
