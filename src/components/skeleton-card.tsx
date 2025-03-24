import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import { Skeleton } from '@/components/ui/skeleton';

const SkeletonCard = () => {
  return (
    <Card className="overflow-hidden pt-0 h-full">
      <div className="h-64 relative">
        <Skeleton className="rounded-xl" />
      </div>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-2xl">
          <Skeleton className="h-4 w-full" />
        </CardTitle>
        <CardDescription>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default SkeletonCard;
