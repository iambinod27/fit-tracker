import CardSkeleton from "@/components/CardSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { apiFetch } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { LineChart, Line, XAxis, CartesianGrid } from "recharts";

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
  const [selectedExercise, setSelectedExercise] = useState<String | null>(null);

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
    <div className="p-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Personal Records</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <p className="space-y-4">
              <CardSkeleton />
              <CardSkeleton />
            </p>
          )}
          <ul className="space-y-2">
            {prs?.map((pr) => (
              <li
                key={pr.name}
                onClick={() => setSelectedExercise(pr.name)}
                className="flex-justify-between border-b pt-2 pb-2 cursor-pointer hover:bg-accent px-2 rounded"
              >
                <span className="capitalize">{pr.name}</span>
                <span className="font-bold"> {pr.max_weight} kg</span>
              </li>
            ))}
          </ul>
          {prs?.length === 0 && (
            <p className="text-gray-500">No PRs yet - log a workout first.</p>
          )}
        </CardContent>
      </Card>

      {selectedExercise && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="capitalize">
              {selectedExercise} progress
            </CardTitle>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <LineChart data={progress}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey={"date"} tickLine={false} axisLine={false} />
                  <Line
                    type={"monotone"}
                    dataKey={"weight"}
                    stroke="var(--color-weight)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-weight)" }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};
export default Stats;
