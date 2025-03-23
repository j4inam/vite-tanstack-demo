import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import { Button } from '@/components/ui/button';

const SearchForm = ({ breeds }: { breeds?: string[] }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Filter By Dog Breed</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Select Breeds</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {breeds?.map((breed) => (
            <DropdownMenuItem key={breed}>{breed}</DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SearchForm;
