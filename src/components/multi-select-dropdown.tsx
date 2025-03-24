import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { Button } from '@/components/ui/button';

const MultiSelectDropdown = ({
  label,
  values,
  checkedValues,
  onCheckedValueChange
}: {
  label: string;
  values: string[];
  checkedValues: string[];
  onCheckedValueChange: (value: string) => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {label} {checkedValues.length > 0 ? `(${checkedValues.length})` : ''}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 ml-8">
        <DropdownMenuLabel>Select one or more breeds</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {values &&
          values.map((value) => (
            <DropdownMenuCheckboxItem
              key={value}
              checked={checkedValues.includes(value)}
              onCheckedChange={() => onCheckedValueChange(value)}>
              {value}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MultiSelectDropdown;
