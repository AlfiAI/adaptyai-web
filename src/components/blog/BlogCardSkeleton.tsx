
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const BlogCardSkeleton = () => {
  return (
    <Card className="overflow-hidden h-full flex flex-col bg-black/30 border-white/10">
      <div className="relative h-48 bg-muted">
        <Skeleton className="h-full w-full" />
      </div>
      
      <div className="p-6 flex-1 space-y-4">
        <Skeleton className="h-6 w-3/4" />
        
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </Card>
  );
};

export default BlogCardSkeleton;
