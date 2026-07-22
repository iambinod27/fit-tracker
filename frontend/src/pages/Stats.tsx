import CardSkeleton from "@/components/CardSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { apiFetch } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { LineChart, Line, XAxis, CartesianGrid } from "recharts";
import { Trophy, TrendingUp } from "lucide-react";

interface PR {
  name: string;
  max_weight: number;
}

interface ExerciseProgress {
  date: string;
  weight: number;
  sets: number;
  reps: number;
}

const chartConfig = {
  weight: {
    label: "Weight (kg)",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const Stats = () => {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

  const { data: progress } = useQuery<ExerciseProgress[]>({
    queryKey: ["exercise-progress", selectedExercise],
    queryFn: () => apiFetch(`/stats/exercise/${selectedExercise}`),
    enabled: !!selectedExercise,
  });

  const { data: prs, isLoading } = useQuery<PR[]>({
    queryKey: ["prs"],
    queryFn: () => apiFetch("/stats/prs"),
  });

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Stats</h1>
        <p className="text-sm text-muted-foreground">
          Your personal records and progress over time
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Trophy className="h-5 w-5 text-primary" />
            Personal Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="space-y-3">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          )}
          <ul className="space-y-1">
            {prs?.map((pr) => (
              <li
                key={pr.name}
                onClick={() => setSelectedExercise(pr.name)}
                className={`flex justify-between items-center border-b py-2 px-2 rounded cursor-pointer hover:bg-accent transition-colors ${
                  selectedExercise === pr.name ? "bg-accent" : ""
                }`}
              >
                <span className="capitalize">{pr.name}</span>
                <span className="font-bold text-primary">{pr.max_weight} kg</span>
              </li>
            ))}
          </ul>
          {prs?.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No PRs yet — log a workout first.
            </p>
          )}
        </CardContent>
      </Card>

      {selectedExercise && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base capitalize">
              <TrendingUp className="h-5 w-5 text-primary" />
              {selectedExercise} progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <LineChart data={progress}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="var(--color-weight)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-weight)" }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
export default Stats;