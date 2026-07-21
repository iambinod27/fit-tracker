import { Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Button } from "./ui/button";

interface Props {
  onConfirm: () => void;
  itemLabel: string;
}

const DeleteConfirm = ({ onConfirm, itemLabel} : Props) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>Delete {itemLabel}?</AlertDialogTitle>
            <AlertDialogDescription>
                This can't be undone. This will permanently delete this {itemLabel}.
            </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm} className="bg-red-500 hover:bg-red-600">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default DeleteConfirm;
