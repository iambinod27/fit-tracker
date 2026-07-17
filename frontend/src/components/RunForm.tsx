import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";

const runSchema = z.object({
  date: z.string().min(1, "Date is required"),
  distance_km: z.number().positive("Distance must be greater than 0"),
  duration_min: z.number().positive("Duration must be greater than 0"),
  notes: z.string().optional(),
});

type RunFormValues = z.infer<typeof runSchema>;

const RunForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm<RunFormValues>({
    resolver: zodResolver(runSchema),
    mode: "onChange",
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      distance_km: 0,
      duration_min: 0,
      notes: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: RunFormValues) =>
      apiFetch("/runs", {
        method: "POST",
        body: JSON.stringify(values),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["runs"] });
      navigate("/dashboard");
    },
  });

  function onSubmit(values: RunFormValues) {
    mutation.mutate(values);
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Log Run</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <div className="relative">
                <Input id="date" type="date" {...register("date")} />
                {errors.date && (
                  <p className="text-sm text-red-500">{errors.date?.message}</p>
                )}
                {dirtyFields.date && !errors.date && (
                  <Check className="absolute right-9 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="distance">Distance (km)</Label>
              <div className="relative">
                <Input
                  id="distance"
                  type="number"
                  step="0.01"
                  {...register("distance_km", { valueAsNumber: true })}
                />
                {dirtyFields.distance_km && !errors.distance_km && (
                  <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                )}
              </div>
              {errors.distance_km && (
                <p className="text-sm text-red-500">
                  {errors.distance_km?.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="distance">Duration (min)</Label>
              <div className="relative">
                <Input
                  id="duration"
                  type="number"
                  {...register("duration_min", { valueAsNumber: true })}
                />
                {dirtyFields.duration_min && !errors.duration_min && (
                  <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                )}
              </div>
              {errors.duration_min && (
                <p className="text-sm text-red-500">
                  {errors.duration_min?.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                {...register("notes")}
                placeholder="easy pace"
              />
            </div>

            <Button
              type="submit"
              className={"w-full"}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Saving..." : "Save Run"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
export default RunForm;
