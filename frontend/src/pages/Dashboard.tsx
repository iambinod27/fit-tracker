import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import EditProfileDialog from "@/components/EditProfileDialog";
import DeleteConfirm from "@/components/DeleteConfirm";
import CardSkeleton from "@/components/CardSkeleton";

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

  const { data: user } = useQuery<UserProfile>({
    queryKey: ["me"],
    queryFn: () => apiFetch("/auth/me"),
  });

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex justify-between">
        <div className="flex items-start justify-between flex-col gap-3">
          <div className="text-2xl font-bold">Dashboard</div>
          {user && (
            <div>
              <p className="text-gray-500 capitalize">
                Welcome, {user.first_name} 👋
              </p>
              {(user.weight_kg || user.height_cm || user.age) && (
                <p className="text-sm text-gray-400 mt-1">
                  {user.age && `${user.age} yrs`}
                  {user.age && (user.weight_kg || user.height_cm) && " . "}
                  {user.weight_kg && `${user.weight_kg} kg`}
                  {user.weight_kg && user.height_cm && " . "}
                  {user.height_cm && `${user.height_cm} cm`}
                </p>
              )}
              <div className="mt-3">
                <EditProfileDialog
                  currentValues={{
                    first_name: user.first_name ?? "",
                    last_name: user.last_name ?? "",
                    weight_kg: user.weight_kg ?? undefined,
                    height_cm: user.height_cm ?? undefined,
                    age: user.age ?? undefined,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <Link to="/log">
          <Button variant="outline">Log Entry</Button>
        </Link>
      </div>
      <h2 className="text-xl font-bold mt-4 mb-4">Workouts</h2>
      {isLoading && (
        <p className="space-y-4">
          <CardSkeleton />
          <CardSkeleton />
        </p>
      )}
      {error && <p className="text-red-500">Failed to load workouts</p>}

      <div className="space-y-4">
        {workouts?.map((w) => (
          <Card key={w.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">{w.date}</CardTitle>
              <DeleteConfirm
                onConfirm={() => deletWorkout.mutate(w.id)}
                itemLabel="workout"
              />
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

      {workouts?.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-3">No workouts logged yet.</p>
          <Link to={"/log"}>
            <Button variant={"outline"}>Log your first workout</Button>
          </Link>
        </div>
      )}

      <h2 className="text-xl font-bold mt-4 mb-4">Runs</h2>

      {runsLoading && (
        <p className="space-y-4">
          <CardSkeleton />
          <CardSkeleton />
        </p>
      )}

      <div className="space-y-4">
        {runs?.map((r) => (
          <Card key={r.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">{r.date}</CardTitle>
              <DeleteConfirm
                onConfirm={() => deleteRun.mutate(r.id)}
                itemLabel="workout"
              />
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
        <div className="text-center py-8">
          <p className="text-gray-500 mb-3">No runs logged yet.</p>
          <Link to={"/log"}>
            <Button variant={"outline"}>Log your first run</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
