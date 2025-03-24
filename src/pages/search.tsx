import { ArrowDown01, ArrowDownAZ, ArrowUp01, ArrowUpAZ, Menu, PawPrint } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  DogSearchParams,
  dogsKeys,
  useGetBreeds,
  useGetDogDetails,
  useSearchDogs
} from '@/hooks/Dogs';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList
} from '@/components/ui/navigation-menu';
import {
  useCurrentUser,
  useGetUserFavorites,
  useLogoutUser,
  useToggleUserFavorites
} from '@/hooks/Users';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import DogCard from '@/components/dog-card';
import DogMatchTrigger from '@/components/dog-match-trigger';
import { Link } from '@tanstack/react-router';
import MultiSelectDropdown from '@/components/multi-select-dropdown';
import { Skeleton } from '@/components/ui/skeleton';
import SkeletonCard from '@/components/skeleton-card';
import { parseSearchParams } from '@/utils';
import { useQueryClient } from '@tanstack/react-query';

const SORT_BY_OPTIONS = [
  { label: 'Breed Asc', value: 'breed:asc', icon: <ArrowDownAZ /> },
  { label: 'Breed Desc', value: 'breed:desc', icon: <ArrowUpAZ /> },
  { label: 'Name Asc', value: 'name:asc', icon: <ArrowDownAZ /> },
  { label: 'Name Desc', value: 'name:desc', icon: <ArrowUpAZ /> },
  { label: 'Age Asc', value: 'age:asc', icon: <ArrowDown01 /> },
  { label: 'Age Desc', value: 'age:desc', icon: <ArrowUp01 /> }
];

const SearchPage = () => {
  const [filters, setFilters] = useState<DogSearchParams>({ breeds: [], sort: 'breed:asc' });
  const [checkedBreeds, setCheckedBreeds] = useState<string[]>([]);
  const queryClient = useQueryClient();
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

  const { mutate: logoutUser } = useLogoutUser();

  const handleToggleUserFavorites = (dogId: string) => {
    toggleUserFavorites({ dogId, email: user?.email });
  };

  const handleCheckedBreedsChange = (breed: string) => {
    if (checkedBreeds.includes(breed)) {
      setCheckedBreeds(checkedBreeds.filter((b) => b !== breed));
    } else {
      setCheckedBreeds([...checkedBreeds, breed]);
    }
  };

  const handleSortByChange = (sortBy: string) => {
    setFilters({ ...filters, sort: sortBy });
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
      <div className="flex flex-row justify-between gap-4">
        <a href="#" className="flex items-center gap-4 font-bold text-xl md:text-2xl lg:text-3xl">
          <div className="flex h-8 w-8 md:h-12 md:w-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <PawPrint className="size-6 md:size-8" />
          </div>
          Hey {user?.name}, Find Your Perfect Furry Friend
        </a>
        <div className="flex gap-2 md:hidden">
          <DogMatchTrigger />
          <DropdownMenu>
            <DropdownMenuTrigger asChild className='cursor-pointer'>
              <Button variant="outline" size="icon">
                <Menu />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-4">
              <DropdownMenuItem>
                <Link to="/favorites">View Favorites</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logoutUser} className='cursor-pointer'>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="hidden md:block">
          <div className="flex gap-4">
            <NavigationMenu>
              <NavigationMenuList className="flex gap-2">
                <Link to="/favorites">
                  <NavigationMenuItem>View Favorites</NavigationMenuItem>
                </Link>
                <NavigationMenuItem onClick={logoutUser} className='cursor-pointer'>Logout</NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <DogMatchTrigger />
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center">
        <Card className="w-full">
          <CardContent>
            <div className="flex justify-between">
              <MultiSelectDropdown
                label="Filter By Breeds"
                values={breeds || []}
                checkedValues={checkedBreeds}
                onCheckedValueChange={handleCheckedBreedsChange}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Sort By</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 mr-8">
                  {SORT_BY_OPTIONS.map((sortOption) => (
                    <DropdownMenuCheckboxItem
                      key={sortOption.value}
                      checked={filters.sort === sortOption.value}
                      onCheckedChange={() => handleSortByChange(sortOption.value)}>
                      {sortOption.label} {sortOption.icon}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
          ) : favorites && favorites.length > 0 ? (
            <h3 className="flex items-center gap-2 font-bold text-2xl">
              You loved {favorites.length} {favorites.length === 1 ? 'dog' : 'dogs'}!
            </h3>
          ) : null}
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
