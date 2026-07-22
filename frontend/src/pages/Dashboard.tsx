import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import EditProfileDialog from "@/components/EditProfileDialog";
import DeleteConfirm from "@/components/DeleteConfirm";
import CardSkeleton from "@/components/CardSkeleton";
import { toast } from "sonner";
import ActivityHeatmap from "@/components/ActivityHeatmap";
import { Dumbbell, Footprints, Plus } from "lucide-react";

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

interface UserProfile {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  weight_kg: number | null;
  height_cm: number | null;
  age: number | null;
}

export default function Dashboard() {
  const queryClient = useQueryClient();

  const { data: workouts, isLoading, error } = useQuery<Workout[]>({
    queryKey: ["workouts"],
    queryFn: () => apiFetch("/workouts"),
  });

  const { data: runs, isLoading: runsLoading } = useQuery<Run[]>({
    queryKey: ["runs"],
    queryFn: () => apiFetch("/runs"),
  });

  const deletWorkout = useMutation({
    mutationFn: (id: number) => apiFetch(`/workouts/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      toast.success("Deleted Workout!");
    },
  });

  const deleteRun = useMutation({
    mutationFn: (id: number) => apiFetch(`/runs/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["runs"] });
      toast.success("Deleted Run!");
    },
  });

  const { data: user } = useQuery<UserProfile>({
    queryKey: ["me"],
    queryFn: () => apiFetch("/auth/me"),
  });

  const { data: streakData } = useQuery<{ streak: number }>({
    queryKey: ["streak"],
    queryFn: () => apiFetch("/stats/streak"),
  });

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Profile / welcome card */}
      {user && (
        <Card>
          <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-6">
            <div>
              <p className="text-2xl font-bold capitalize flex items-center gap-2">
                Welcome, {user.first_name}
                {streakData && streakData.streak > 0 && (
                  <span className="text-sm font-medium text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full">
                    🔥 {streakData.streak} day streak
                  </span>
                )}
              </p>
              {(user.weight_kg || user.height_cm || user.age) && (
                <p className="text-sm text-muted-foreground mt-1">
                  {[
                    user.age && `${user.age} yrs`,
                    user.weight_kg && `${user.weight_kg} kg`,
                    user.height_cm && `${user.height_cm} cm`,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <EditProfileDialog
                currentValues={{
                  first_name: user.first_name ?? "",
                  last_name: user.last_name ?? "",
                  weight_kg: user.weight_kg ?? undefined,
                  height_cm: user.height_cm ?? undefined,
                  age: user.age ?? undefined,
                }}
              />
              <Link to="/log">
                <Button>
                  <Plus className="h-4 w-4 mr-1" />
                  Log Entry
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity heatmap */}
      <ActivityHeatmap />

      {/* Workouts + Runs side by side */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-primary" />
            Workouts
          </h2>

          {isLoading && (
            <div className="space-y-3">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          )}
          {error && <p className="text-red-500 text-sm">Failed to load workouts</p>}

          <div className="space-y-3">
            {workouts?.map((w) => (
              <Card key={w.id} className="border-l-4 border-l-primary">
                <CardHeader className="flex flex-row items-center justify-between py-3">
                  <CardTitle className="text-sm font-medium">{w.date}</CardTitle>
                  <DeleteConfirm onConfirm={() => deletWorkout.mutate(w.id)} itemLabel="workout" />
                </CardHeader>
                <CardContent className="pt-0">
                  {w.notes && <p className="text-xs text-muted-foreground mb-2">{w.notes}</p>}
                  <ul className="space-y-1">
                    {w.exercises?.map((ex) => (
                      <li key={ex.id} className="text-sm">
                        {ex.name}: {ex.sets}×{ex.reps} @ {ex.weight}kg
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {workouts?.length === 0 && (
            <div className="text-center py-8 border border-dashed rounded-lg">
              <p className="text-sm text-muted-foreground mb-3">No workouts logged yet.</p>
              <Link to="/log">
                <Button variant="outline" size="sm">Log your first workout</Button>
              </Link>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Footprints className="h-5 w-5 text-orange-500" />
            Runs
          </h2>

          {runsLoading && (
            <div className="space-y-3">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          )}

          <div className="space-y-3">
            {runs?.map((r) => (
              <Card key={r.id} className="border-l-4 border-l-orange-500">
                <CardHeader className="flex flex-row items-center justify-between py-3">
                  <CardTitle className="text-sm font-medium">{r.date}</CardTitle>
                  <DeleteConfirm onConfirm={() => deleteRun.mutate(r.id)} itemLabel="run" />
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm">
                    {r.distance_km} km in {r.duration_min} min
                    {" "}({(r.duration_min / r.distance_km).toFixed(2)} min/km)
                  </p>
                  {r.notes && <p className="text-xs text-muted-foreground mt-1">{r.notes}</p>}
                </CardContent>
              </Card>
            ))}
          </div>

          {runs?.length === 0 && (
            <div className="text-center py-8 border border-dashed rounded-lg">
              <p className="text-sm text-muted-foreground mb-3">No runs logged yet.</p>
              <Link to="/log">
                <Button variant="outline" size="sm">Log your first run</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}