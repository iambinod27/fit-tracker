import RunForm from "@/components/RunForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WorkoutForm from "@/components/WorkoutForm";
import { Dumbbell, Footprints } from "lucide-react";

const LogEntry = () => {
  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Log Entry</h1>
        <p className="text-sm text-muted-foreground">
          Track a workout or a run
        </p>
      </div>

      <Tabs defaultValue="workout">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="workout" className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4" />
            Workout
          </TabsTrigger>
          <TabsTrigger value="run" className="flex items-center gap-2">
            <Footprints className="h-4 w-4" />
            Run
          </TabsTrigger>
        </TabsList>
        <TabsContent value="workout" className="mt-4">
          <WorkoutForm />
        </TabsContent>
        <TabsContent value="run" className="mt-4">
          <RunForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default LogEntry;