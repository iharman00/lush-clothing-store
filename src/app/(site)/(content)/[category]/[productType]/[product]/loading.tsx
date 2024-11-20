import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container lg:h-[70vh] flex flex-col lg:grid grid-cols-2 xl:grid-cols-[minmax(0,_2fr)_minmax(0,_1fr)] gap-16 lg:gap-4 md:mt-20 md:mb-32 justify-items-center items-center px-4 md:px-12 mb-12">
      {/* Product Images */}
      <div className="hidden size-full xl:flex gap-8 px-8">
        {Array.from({ length: 2 }).map((_, index) => (
          <Skeleton key={index} className="w-full h-full" />
        ))}
      </div>
      <div className="size-full flex items-center xl:hidden gap-8 px-8">
        <Skeleton className="w-full h-[420px]" />
      </div>

      {/* Product Details */}
      <div className="w-full lg:max-w-lg flex flex-col gap-10">
        <div className="flex justify-between">
          <div className="size-full flex flex-col gap-4">
            <Skeleton className="w-52 h-8" />
            <Skeleton className="w-32 h-6" />
          </div>
          <Skeleton className="w-10 h-10" />
        </div>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <Skeleton className="w-16 h-6" />
            <div className="flex gap-4 flex-wrap">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="size-7 p-0 rounded-full" />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Skeleton className="w-16 h-6" />
            <div className="grid grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="w-full h-10" />
              ))}
            </div>
          </div>
          <Skeleton className="size-full h-10" />
        </div>
        <div className="flex flex-col gap-8">
          <Skeleton className="w-36 h-6" />
          <Skeleton className="w-36 h-6" />
        </div>
      </div>
    </div>
  );
}

// return (
//     <section className="container my-5 lg:my-14 px-0">
//       <Skeleton className="max-w-28 h-10 rounded-md mx-[1rem] md:mx-[2rem]" />
//       <div className="mt-8 mb-6 px-[1rem] md:px-[2rem] flex gap-4 overflow-clip">
//         {Array.from({ length: 4 }).map((_, index) => (
//           <Skeleton key={index} className="w-28 h-10 rounded-md" />
//         ))}
//       </div>
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-8 md:gap-y-16 mt-14">
//         {Array.from({ length: 8 }).map((_, index) => (
//         ))}
//       </div>
//     </section>
//   );
