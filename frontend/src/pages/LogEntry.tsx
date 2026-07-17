import RunForm from "@/components/RunForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WorkoutForm from "@/components/WorkoutForm";

const LogEntry = () => {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Tabs defaultValue="workout">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="workout">Log Workout</TabsTrigger>
          <TabsTrigger value="run">Log Run</TabsTrigger>
        </TabsList>
        <TabsContent value="workout">
          <WorkoutForm />
        </TabsContent>
        <TabsContent value="run">
          <RunForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default LogEntry;
