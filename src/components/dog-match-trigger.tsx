import { useCurrentUser, useGetUserFavorites } from '@/hooks/Users';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import DogMatchDialog from '@/components/dog-match-dialog';
import { Loader2 } from 'lucide-react';
import { useFindDogMatch } from '@/hooks/Dogs';

const DogMatchTrigger = () => {
  const [open, setOpen] = useState(false);
  const { data: user } = useCurrentUser();
  const { data: favorites } = useGetUserFavorites(user?.email);
  const {
    mutate: findDogMatch,
    isPending: isFindDogMatchPending,
    isSuccess: isFindDogMatchSuccess,
    data: dogMatch
  } = useFindDogMatch();
  const handleFindFurryMatch = () => {
    if (!favorites || favorites.length === 0) return;
    findDogMatch(user?.email);
  };
  useEffect(() => {
    if (isFindDogMatchSuccess) {
      setOpen(true);
    }
  }, [isFindDogMatchSuccess]);
  return (
    favorites &&
    favorites?.length > 0 && (
      <>
        <div className="flex flex-1 items-center justify-end gap-4">
          <p className="flex items-center gap-2 font-bold text-xl">
            You loved {favorites?.length} {favorites?.length === 1 ? 'dog' : 'dogs'}!
          </p>
          {!isFindDogMatchPending && (
            <Button size="lg" onClick={handleFindFurryMatch}>
              Find Furry Match
            </Button>
          )}
          {isFindDogMatchPending && (
            <Button disabled>
              <Loader2 className="animate-spin" />
              Finding your match...
            </Button>
          )}
        </div>
        <DogMatchDialog dog={dogMatch} open={open} onOpenChange={setOpen} />
      </>
    )
  );
};

export default DogMatchTrigger;
