import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Heart, MapPinned } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dog } from '@/hooks/Dogs';
import { cn } from '@/lib/utils';

const DogCard = ({
  dog,
  isFavorite = false,
  showActions = true,
  onToggleFavorites = () => {}
}: {
  dog: Dog;
  isFavorite?: boolean;
  onToggleFavorites?: (dogId: string) => void;
  showActions?: boolean;
}) => {
  return (
    <Card className="overflow-hidden pt-0 h-full">
      <div className="h-64 relative">
        <img
          src={dog.img}
          alt={dog.name}
          className="object-cover absolute inset-0 w-full h-full"
          loading="lazy"
        />
      </div>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-2xl">
          {dog.name}
          <Badge variant="secondary">{dog.breed}</Badge>
        </CardTitle>
        <CardDescription className="text-lg">
          Age: {dog.age} {dog.age == 1 ? 'year' : 'years'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="flex items-center gap-2 text-md text-muted-foreground">
          <MapPinned className="size-6" />
          {dog.zip_code}
        </p>
      </CardContent>
      {showActions && (
        <CardFooter className="flex justify-end">
          <Button variant="outline" size="icon" onClick={() => onToggleFavorites(dog.id)}>
            <Heart className={cn('size-4', isFavorite && 'fill-red-500 text-red-500')} />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default DogCard;
