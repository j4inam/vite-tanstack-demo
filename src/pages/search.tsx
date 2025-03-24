import { Card, CardContent } from '@/components/ui/card';
import {
  DogSearchParams,
  dogsKeys,
  useGetBreeds,
  useGetDogDetails,
  useSearchDogs
} from '@/hooks/Dogs';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList
} from '@/components/ui/navigation-menu';
import { useCurrentUser, useGetUserFavorites, useToggleUserFavorites } from '@/hooks/Users';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import DogCard from '@/components/dog-card';
import DogMatchTrigger from '@/components/dog-match-trigger';
import { Link } from '@tanstack/react-router';
import MultiSelectDropdown from '@/components/multi-select-dropdown';
import { PawPrint } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import SkeletonCard from '@/components/skeleton-card';
import { parseSearchParams } from '@/utils';
import { useQueryClient } from '@tanstack/react-query';

const SearchPage = () => {
  const [filters, setFilters] = useState<DogSearchParams>({ breeds: [] });
  const [checkedBreeds, setCheckedBreeds] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const handleCheckedBreedsChange = (breed: string) => {
    if (checkedBreeds.includes(breed)) {
      setCheckedBreeds(checkedBreeds.filter((b) => b !== breed));
    } else {
      setCheckedBreeds([...checkedBreeds, breed]);
    }
  };
  const { data: breeds, isLoading: isBreedsLoading, error: breedsError } = useGetBreeds();
  const {
    data: dogsSearchResponse,
    isLoading: isDogsLoading,
    error: dogsError
  } = useSearchDogs(filters);
  const {
    mutate: getDogsDetails,
    isPending: isGetDogDetailsPending,
    isError: isGetDogDetailsError,
    data: dogsDetails
  } = useGetDogDetails();

  const { data: user } = useCurrentUser();
  const { mutate: toggleUserFavorites } = useToggleUserFavorites();
  const { data: favorites, isLoading: isFavoritesLoading } = useGetUserFavorites(user?.email);

  const handleToggleUserFavorites = (dogId: string) => {
    toggleUserFavorites({ dogId, email: user?.email });
  };

  const handlePreviousClick = () => {
    if (dogsSearchResponse?.prev) {
      const nextFilters: DogSearchParams = parseSearchParams(dogsSearchResponse.prev);
      setFilters({ ...nextFilters });
    }
  };

  const handleNextClick = () => {
    const nextFilters: DogSearchParams = parseSearchParams(dogsSearchResponse?.next);
    setFilters({ ...nextFilters });
  };

  useEffect(() => {
    if (dogsSearchResponse?.resultIds) {
      getDogsDetails(dogsSearchResponse.resultIds);
    }
  }, [dogsSearchResponse]);

  useEffect(() => {
    if (checkedBreeds.length > 0) {
      setFilters({ ...filters, breeds: checkedBreeds });
      queryClient.invalidateQueries({ queryKey: dogsKeys.searchFilters(filters) });
    }
  }, [checkedBreeds]);

  if (breedsError || dogsError || isGetDogDetailsError)
    return (
      <div>
        Error: {JSON.stringify(breedsError) || JSON.stringify(dogsError) || isGetDogDetailsError}
      </div>
    );

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <a href="#" className="flex items-center gap-4 font-bold text-xl md:text-2xl lg:text-3xl">
          <div className="flex h-8 w-8 md:h-12 md:w-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <PawPrint className="size-6 md:size-8" />
          </div>
          Hey {user?.name}, Find Your Perfect Furry Friend
        </a>
        <div className="flex gap-4">
          <NavigationMenu>
            <NavigationMenuList>
              <Link to="/favorites">
                <NavigationMenuItem>View Favorites</NavigationMenuItem>
              </Link>
            </NavigationMenuList>
          </NavigationMenu>
          <DogMatchTrigger />
        </div>
      </div>
      <div className="flex flex-1 items-center">
        <Card className="w-full">
          <CardContent>
            <MultiSelectDropdown
              label="Filter By Breeds"
              values={breeds || []}
              checkedValues={checkedBreeds}
              onCheckedValueChange={handleCheckedBreedsChange}
            />
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-1 items-center px-6">
        <div className="flex justify-between w-full">
          {isDogsLoading ? (
            <Skeleton className="h-4 w-full max-w-sm" />
          ) : (
            <h4 className="text-xl font-bold">
              {dogsSearchResponse?.total} {dogsSearchResponse?.total === 1 ? 'dog' : 'dogs'} found.
            </h4>
          )}
          {isFavoritesLoading ? (
            <Skeleton className="h-4 w-full max-w-sm" />
          ) : (
            <h3 className="flex items-center gap-2 font-bold text-2xl">
              You loved {favorites?.length} {favorites?.length === 1 ? 'dog' : 'dogs'}!
            </h3>
          )}
        </div>
      </div>
      <div className="flex md:hidden justify-between">
        {dogsSearchResponse?.prev && (
          <Button variant="outline" onClick={handlePreviousClick}>
            Previous
          </Button>
        )}
        {dogsSearchResponse?.next && (
          <Button variant="outline" onClick={handleNextClick}>
            Next
          </Button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {isBreedsLoading || isDogsLoading || isGetDogDetailsPending
          ? Array.from({ length: 25 }).map((_, index) => <SkeletonCard key={index} />)
          : dogsDetails?.map((dog) => (
              <DogCard
                key={dog.id}
                dog={dog}
                isFavorite={!!favorites?.includes(dog.id)}
                onToggleFavorites={handleToggleUserFavorites}
              />
            ))}
      </div>
      <div className="flex justify-between">
        {dogsSearchResponse?.prev && (
          <Button variant="outline" onClick={handlePreviousClick}>
            Previous
          </Button>
        )}
        {dogsSearchResponse?.next && (
          <Button variant="outline" onClick={handleNextClick} className="ml-auto">
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
