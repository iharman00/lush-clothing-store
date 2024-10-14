import { Skeleton } from "@/components/ui/skeleton";

const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-3 aspect-[3/4]">
      <Skeleton className="w-full h-full rounded-md" />
      <div className="flex flex-col gap-2">
        <Skeleton className="w-7/12 h-5 rounded-md" />
        <Skeleton className="w-4/12 h-5 rounded-md" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
