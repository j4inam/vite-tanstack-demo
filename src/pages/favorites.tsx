import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Menu, PawPrint } from 'lucide-react';
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

import { Button } from '@/components/ui/button';
import DogCard from '@/components/dog-card';
import DogMatchTrigger from '@/components/dog-match-trigger';
import { Link } from '@tanstack/react-router';
import { Skeleton } from '@/components/ui/skeleton';
import SkeletonCard from '@/components/skeleton-card';
import { useEffect } from 'react';
import { useGetDogDetails } from '@/hooks/Dogs';

const FavoritesPage = () => {
  const { data: user } = useCurrentUser();
  const { mutate: toggleUserFavorites } = useToggleUserFavorites();
  const { data: favorites, isLoading: isFavoritesLoading } = useGetUserFavorites(user?.email);
  const {
    mutate: getDogDetails,
    isPending: isGetDogDetailsPending,
    data: dogsDetails
  } = useGetDogDetails();

  const { mutate: logoutUser } = useLogoutUser();

  useEffect(() => {
    if (favorites) {
      getDogDetails(favorites);
    }
  }, [favorites]);

  const handleToggleUserFavorites = (dogId: string) => {
    toggleUserFavorites({ dogId, email: user?.email });
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex flex-row justify-between gap-4">
        <a
          href="/search"
          className="flex items-center gap-4 font-bold text-xl md:text-2xl lg:text-3xl">
          <div className="flex h-8 w-8 md:h-12 md:w-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <PawPrint className="size-6 md:size-8" />
          </div>
          Hey {user?.name}, Meet Your Favorites
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
                <Link to="/search">Search Furries</Link>
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
                <Link to="/search">
                  <NavigationMenuItem>Search Furries</NavigationMenuItem>
                </Link>
                <NavigationMenuItem onClick={logoutUser} className='cursor-pointer'>Logout</NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <DogMatchTrigger />
          </div>
        </div>
      </div>
      <div className="flex justify-between w-full">
        {isFavoritesLoading ? (
          <Skeleton className="h-4 w-full max-w-sm" />
        ) : favorites && favorites.length > 0 ? (
          <h3 className="flex items-center gap-2 font-bold text-2xl">
            You loved {favorites.length} {favorites.length === 1 ? 'dog' : 'dogs'}!
          </h3>
        ) : (
          <div className="flex flex-col min-h-[80vh] h-full w-full justify-center items-center gap-4">
            <h2 className="text-3xl font-bold">Hmm, Did you leave the door open?</h2>
            <h3 className="text-xl">We couldn't find any of your favorite furries.</h3>
            <p className="text-lg text-muted-foreground">
              Add some dogs to your favorites to see them here.
            </p>
            <Button size="lg">
              <Link to="/search">Search Furries</Link>
            </Button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {isFavoritesLoading || isGetDogDetailsPending
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
    </div>
  );
};

export default FavoritesPage;
