import CategoriesCardSkeleton from "@/components/CategoriesCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

const loading = () => {
  return (
    <>
      <section className="container my-5 lg:my-20">
        <Skeleton className="w-20 h-10" />
        <div className="flex flex-col gap-16 mt-10">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-6">
              <Skeleton className="w-32 h-8" />
              <div className="flex gap-3 overflow-hidden">
                {Array.from({ length: 8 }).map((_, index) => (
                  <CategoriesCardSkeleton key={index} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default loading;
