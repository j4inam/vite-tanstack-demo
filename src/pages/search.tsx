import { useGetBreeds, useGetDogDetails, useSearchDogs } from '@/hooks/Dogs';

import DogCard from '@/components/dog-card';
import { PawPrint } from 'lucide-react';
import SearchForm from '@/components/forms/search-form';
import { useEffect } from 'react';

const SearchPage = () => {
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

  useEffect(() => {
    if (dogsSearchResponse?.resultIds) {
      getDogsDetails(dogsSearchResponse.resultIds);
    }
  }, [dogsSearchResponse]);
  if (isBreedsLoading || isDogsLoading || isGetDogDetailsPending) return <div>Loading...</div>;
  if (breedsError || dogsError || isGetDogDetailsError)
    return <div>Error: {breedsError?.message || dogsError?.message}</div>;

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex justify-start gap-4">
        <a href="#" className="flex items-center gap-2 font-bold text-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <PawPrint className="size-6" />
          </div>
          Find Your Perfect Furry Friend
        </a>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-xs">
          <SearchForm breeds={breeds} />
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {dogsDetails?.map((dog) => <DogCard key={dog.id} dog={dog} />)}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
