import React from "react";

function SkeletonCard() {
  return (
    <div class="relative overflow-hidden font-urbanist bg-gray-200 w-[22rem] h-full flex flex-col  p-0 rounded-xl shadow-black shadow-lg animate-pulse ">
      <div class="flex w-full transition-transform  duration-300 ease-in-out gap-0">
        <div class="w-full flex-shrink-0 h-full p-2 ">
          <div class="w-full h-72 bg-[#A4DCAA] rounded-t-xl"></div>
        </div>
        <div class="w-full flex-shrink-0 h-full p-2">
          <div class="w-full h-72 bg-[#222822] rounded-t-xl"></div>
        </div>
      </div>
      <div class="flex flex-row justify-between  items-center w-full overflow-hidden px-2 py-5">
        <div class="h-6 bg-gray-900 rounded w-1/2"></div>
        <div class="h-12 bg-gray-900 rounded w-1/4"></div>
      </div>
    </div>
  );
}

export default SkeletonCard;
