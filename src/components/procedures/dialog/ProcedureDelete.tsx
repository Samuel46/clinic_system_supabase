import { Button } from "@/components/button";
import {
  Dialog,
  DialogActions,
  DialogDescription,
  DialogTitle,
} from "@/components/dialog";
import { Icons } from "@ui/icons";

import { Dispatch, SetStateAction } from "react";

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  pending: boolean;
  handleDelete: () => void;
};
export default function ProcedureDelete({
  isOpen,
  setIsOpen,
  pending,
  handleDelete,
}: Props) {
  return (
    <>
      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Delete procedure</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete your procedure? All of your data will be
          permanently removed from our servers forever. This action cannot be undone
        </DialogDescription>

        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="rose">
            {pending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
