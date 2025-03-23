import { Loader2, PawPrint } from 'lucide-react';
import { useCurrentUser, useGetUserFavorites, useToggleUserFavorites } from '@/hooks/Users';
import { useEffect, useState } from 'react';
import { useFindDogMatch, useGetBreeds, useGetDogDetails, useSearchDogs } from '@/hooks/Dogs';

import { Button } from '@/components/ui/button';
import DogCard from '@/components/dog-card';
import DogMatchDialog from '@/components/dog-match-dialog';
import SearchForm from '@/components/forms/search-form';

const SearchPage = () => {
  const [open, setOpen] = useState(false);
  const { data: breeds, isLoading: isBreedsLoading, error: breedsError } = useGetBreeds();
  const {
    data: dogsSearchResponse,
    isLoading: isDogsLoading,
    error: dogsError
  } = useSearchDogs({ breeds: ['Pekinese'] });
  const {
    mutate: getDogsDetails,
    isPending: isGetDogDetailsPending,
    isError: isGetDogDetailsError,
    data: dogsDetails
  } = useGetDogDetails();

  const { data: user } = useCurrentUser();
  const { mutate: toggleUserFavorites } = useToggleUserFavorites();
  const { data: favorites } = useGetUserFavorites(user?.email);
  const {
    mutate: findDogMatch,
    isPending: isFindDogMatchPending,
    isSuccess: isFindDogMatchSuccess,
    data: dogMatch
  } = useFindDogMatch();

  const handleToggleUserFavorites = (dogId: string) => {
    toggleUserFavorites({ dogId, email: user?.email });
  };

  const handleFindFurryMatch = () => {
    if (!favorites || favorites.length === 0) return;
    findDogMatch(user?.email);
  };

  useEffect(() => {
    if (isFindDogMatchSuccess) {
      setOpen(true);
    }
  }, [isFindDogMatchSuccess]);

  useEffect(() => {
    if (dogsSearchResponse?.resultIds) {
      getDogsDetails(dogsSearchResponse.resultIds);
    }
  }, [dogsSearchResponse]);
  if (isBreedsLoading || isDogsLoading || isGetDogDetailsPending) return <div>Loading...</div>;
  if (breedsError || dogsError || isGetDogDetailsError)
    return (
      <div>
        Error: {JSON.stringify(breedsError) || JSON.stringify(dogsError) || isGetDogDetailsError}
      </div>
    );

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex justify-between gap-4">
        <a href="#" className="flex items-center gap-2 font-bold text-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <PawPrint className="size-6" />
          </div>
          Hey {user?.name}, Find Your Perfect Furry Friend
        </a>
        {favorites && favorites?.length > 0 && (
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
        )}
      </div>
      <div className="flex flex-1 items-center">
        <div className="w-full max-w-xs">
          <SearchForm breeds={breeds} />
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {dogsDetails?.map((dog) => (
            <DogCard
              key={dog.id}
              dog={dog}
              isFavorite={!!favorites?.includes(dog.id)}
              onToggleFavorites={handleToggleUserFavorites}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
