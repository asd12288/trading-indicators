import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteInstrumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instrumentName: string;
  onDelete: () => Promise<void>;
  isDeleting: boolean;
}

export default function DeleteInstrumentDialog({
  open,
  onOpenChange,
  instrumentName,
  onDelete,
  isDeleting,
}: DeleteInstrumentDialogProps) {
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    await onDelete();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border border-slate-700 bg-slate-900 text-slate-200">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-slate-100">
            Delete Instrument
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-400">
            Are you sure you want to delete the instrument{" "}
            <span className="font-semibold text-slate-300">
              {instrumentName}
            </span>
            ? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
              </span>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
