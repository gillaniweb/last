import { Skeleton } from "@/components/ui/skeleton";

const SkeletonLoading = () => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
      <Skeleton className="h-48 w-full" />
      <div className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-3" />
        <div className="flex justify-between">
          <Skeleton className="h-3 w-20" />
          <div className="flex space-x-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-5 w-5 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoading;
