import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import z from "zod";

const exerciseSchema = z.object({
  name: z.string().min(1, "Required"),
  sets: z.number().positive("Must be > 0"),
  reps: z.number().positive("Must be > 0"),
  weight: z.number().positive("Must be > 0"),
});

const workoutSchema = z.object({
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
  exercises: z.array(exerciseSchema).min(1, "Add at least one exercise"),
});

type WorkoutFormValues = z.infer<typeof workoutSchema>;

const WorkoutForm = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutSchema),
    mode: "onBlur",
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      notes: "",
      exercises: [{ name: "", sets: 0, reps: 0, weight: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "exercises",
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: WorkoutFormValues) =>
      apiFetch("/workouts", {
        method: "POST",
        body: JSON.stringify(values),
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      navigate("/dashboard");
    },
  });

  function onSubmit(values: WorkoutFormValues) {
    mutation.mutate(values);
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Log Workout</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" {...register("date")} />

              {errors.date && (
                <p className="text-sm text-red-500">{errors.date?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input id="notes" {...register("notes")} placeholder="leg day" />
            </div>

            <div className="space-y-3">
              <Label>Exercises</Label>
              {fields.map((field, index) => {
                const rowError =
                  errors.exercises?.[index]?.name ||
                  errors.exercises?.[index]?.sets ||
                  errors.exercises?.[index]?.reps ||
                  errors.exercises?.[index]?.weight;

                return (
                  <div key={field.id} className="space-y-1">
                    <div className="flex gap-2 items-end">
                      <div className="flex-1 space-y-1">
                        <Label className="text-xs text-gray-500">Name</Label>
                        <Input
                          {...register(`exercises.${index}.name`)}
                          placeholder="squat"
                        />
                      </div>
                      <div className="w-16 space-y-1">
                        <Label className="text-xs text-gray-500">Sets</Label>
                        <Input
                          type="number"
                          {...register(`exercises.${index}.sets`, {
                            valueAsNumber: true,
                          })}
                        />
                      </div>
                      <div className="w-16 space-y-1">
                        <Label className="text-xs text-gray-500">Reps</Label>
                        <Input
                          type="number"
                          {...register(`exercises.${index}.reps`, {
                            valueAsNumber: true,
                          })}
                        />
                      </div>
                      <div className="w-16 space-y-1">
                        <Label className="text-xs text-gray-500">Weight</Label>
                        <Input
                          type="number"
                          {...register(`exercises.${index}.weight`, {
                            valueAsNumber: true,
                          })}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => remove(index)}
                      >
                        X
                      </Button>
                    </div>
                    {rowError && (
                      <p className="text-xs text-red-500">{rowError.message}</p>
                    )}
                  </div>
                );
              })}

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  append({ name: "", sets: 0, reps: 0, weight: 0 })
                }
              >
                + Add exercises
              </Button>
            </div>

            <Button type="submit" className="w-full">
              Save Workout
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
export default WorkoutForm;
