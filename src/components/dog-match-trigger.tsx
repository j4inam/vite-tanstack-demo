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
    <>
      <div className="flex items-center justify-end gap-4">
        {!isFindDogMatchPending && (
          <Button onClick={handleFindFurryMatch} disabled={!favorites || favorites.length === 0}>
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
  );
};

export default DogMatchTrigger;
