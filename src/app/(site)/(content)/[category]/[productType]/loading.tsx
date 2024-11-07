import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <section className="container my-5 lg:my-14 px-0">
      <Skeleton className="max-w-28 h-10 rounded-md mx-[1rem] md:mx-[2rem]" />
      <div className="mt-8 mb-6 px-[1rem] md:px-[2rem] flex gap-4 overflow-clip">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="w-28 h-10 rounded-md" />
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-8 md:gap-y-16 mt-14">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}
