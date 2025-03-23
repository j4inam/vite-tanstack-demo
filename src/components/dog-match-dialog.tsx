import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { Dog } from "@/hooks/Dogs";
import DogCard from "./dog-card";

const DogMatchDialog = ({ dog, open, onOpenChange }: { dog?: Dog | null | undefined, open: boolean, onOpenChange: (open: boolean) => void }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>We found a match for you!</DialogTitle>
          <DialogDescription>
            {dog && <DogCard dog={dog} showActions={false} isFavorite={false} onToggleFavorites={() => {}} />}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DogMatchDialog;
