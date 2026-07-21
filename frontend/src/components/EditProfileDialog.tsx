import { apiFetch } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

const profileSchema = z.object({
  first_name: z.string().min(1, "Required"),
  last_name: z.string().min(1, "Required"),
  weight_kg: z.number().positive("Must be > 0").optional(),
  height_cm: z.number().positive("Must be > 0").optional(),
  age: z.number().positive("Must be > 0").optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface Props {
  currentValues: ProfileFormValues;
}

const EditProfileDialog = ({ currentValues }: Props) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: currentValues,
  });

  const mutation = useMutation({
    mutationFn: (values: ProfileFormValues) =>
      apiFetch("/auth/me", {
        method: "PATCH",
        body: JSON.stringify(values),
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  function onSubmit(values: ProfileFormValues) {
    mutation.mutate(values);
  }

  return (
    <Dialog >
      <DialogTrigger>
          Edit Profile
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-3">
            <div className="space-y-2 flex-1">
              <Label htmlFor="first_name">First name</Label>
              <Input id="first_name" {...register("first_name")} />
              {errors.first_name && (
                <p className="text-sm text-red-500">
                  {errors.first_name.message}
                </p>
              )}
            </div>
            <div className="space-y-2 flex-1">
              <Label htmlFor="first_name">Last name</Label>
              <Input id="last_name" {...register("last_name")} />
              {errors.last_name && (
                <p className="text-sm text-red-500">
                  {errors.last_name.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3 flex-col">
            <div className="space-y-2 flex-1">
              <Label htmlFor="weight_kg">Weight (kg)</Label>
              <Input
                id="weight_kg"
                type="number"
                {...(register("weight_kg", { valueAsNumber: true }))}
              />
              {errors.weight_kg && (
                <p className="text-sm text-red-500">
                  {errors.weight_kg.message}
                </p>
              )}
            </div>
            <div className="space-y-2 flex-1">
              <Label htmlFor="first_name">Height (cm)</Label>
              <Input
                id="height_cm"
                type="number"
                {...(register("height_cm", { valueAsNumber: true }))}
              />
              {errors.height_cm && (
                <p className="text-sm text-red-500">
                  {errors.height_cm.message}
                </p>
              )}
            </div>
            <div className="space-y-2 flex-1">
              <Label htmlFor="first_name">Age</Label>
              <Input
                id="age"
                type="number"
                {...(register("age", { valueAsNumber: true }))}
              />
              {errors.age && (
                <p className="text-sm text-red-500">{errors.age.message}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className={"w-full"}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default EditProfileDialog;
