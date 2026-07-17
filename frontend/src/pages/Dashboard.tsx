import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";

interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

interface Workout {
  id: number;
  date: string;
  notes: string | null;
  exercises: Exercise[];
}

interface Run {
  id: number;
  date: string;
  distance_km: number;
  duration_min: number;
  notes: string | null;
}

export default function Dashboard() {
  const queryClient = useQueryClient();

  const {
    data: workouts,
    isLoading,
    error,
  } = useQuery<Workout[]>({
    queryKey: ["workouts"],
    queryFn: () => apiFetch("/workouts"),
  });

  const { data: runs, isLoading: runsLoading } = useQuery<Run[]>({
    queryKey: ["runs"],
    queryFn: () => apiFetch("/runs"),
  });

  const deletWorkout = useMutation({
    mutationFn: (id: number) =>
      apiFetch(`/workouts/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["workouts"] }),
  });

  const deleteRun = useMutation({
    mutationFn: (id: number) => apiFetch(`/runs/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["runs"] }),
  });

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="text-2xl font-bold">Dashboard</div>
        <p className="text-gray-500">Welcome back - logged in!</p>
      </div>

      <Link to="/log">
        <Button variant="outline">Log Entry</Button>
      </Link>
      {isLoading && <p className="text-gray-500">Loading workouts...</p>}
      {error && <p className="text-red-500">Failed to load workouts</p>}

      <div className="space-y-4">
        {workouts?.map((w) => (
          <Card key={w.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">{w.date}</CardTitle>
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() => deletWorkout.mutate(w.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </CardHeader>
            <CardContent>
              {w.notes && (
                <p className="text-sm text-gray-500 mb2">{w.notes}</p>
              )}

              <ul className="space-y-1">
                {w.exercises?.map((ex) => (
                  <li key={ex.id} className="text-sm">
                    {ex.name}: {ex.sets}*{ex.reps} @ {ex.weight}kg
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
      <h2 className="text-xl font-bold mt-8 mb-4">Runs</h2>

      {runsLoading && <p className="text-gray-500">Loading runs...</p>}

      <div className="space-y-4">
        {runs?.map((r) => (
          <Card key={r.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">{r.date}</CardTitle>
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() => deleteRun.mutate(r.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                {r.distance_km} km in {r.duration_min} min
                {""}({(r.duration_min / r.distance_km).toFixed(2)} min/km)
              </p>
              {r.notes && <p className="text-sm text-gray-500">{r.notes}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {runs?.length === 0 && (
        <p className="text-gray-500">No runs logged yet.</p>
      )}

      {workouts?.length === 0 && (
        <p className="text-gray-500">No workouts logged yet.</p>
      )}
    </div>
  );
}
