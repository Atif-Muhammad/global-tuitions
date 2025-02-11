import React from 'react'

function DetailCourseSkeleton() {
  return (
    <div>
    {/* Banner Section Skeleton */}
    <div className="bg-[#a4dcaa] py-8 font-readex">
      <div className="px-6 md:px-8 lg:px-10 xl:px-20 2xl:px-28">
        <div className="flex flex-col lg:flex-row gap-8 lg:justify-between justify-center items-center">
          {/* Title Skeleton */}
          <div className="lg:w-[45%] md:w-[80%] w-[90%] flex flex-col gap-6">
            <div className="h-[80px] md:h-[100px] lg:h-[120px] xl:h-[140px] 2xl:h-[160px] bg-gray-300 animate-pulse rounded w-full"></div>
            <div className="h-[20px] md:h-[25px] lg:h-[30px] xl:h-[35px] 2xl:h-[40px] bg-gray-300 animate-pulse rounded w-3/4"></div>
            <div className="absolute top-16 xl:top-28 -rotate-12 xl:right-[570px] right-[500px] hidden lg:flex">
              <div className="w-[50px] h-[50px] bg-gray-300 animate-pulse rounded-full"></div>
            </div>
          </div>

          {/* Course Detail Card Skeleton */}
          <div className="lg:w-[55%] w-full flex justify-center lg:justify-end">
            <div className="max-w-[470px] w-full bg-[#90c896] p-6 border-[2px] border-black border-b-4 border-r-4 shadow-lg rounded-lg">
              <div className="flex flex-col gap-5">
                {/* Title */}
                <div className="h-[40px] bg-gray-300 animate-pulse rounded"></div>
                <div className="w-full h-[2px] bg-gray-300 opacity-50 animate-pulse"></div>
                <div className="flex flex-col gap-3">
                  <div className="h-[25px] bg-gray-300 animate-pulse rounded"></div>
                  <div className="h-[25px] bg-gray-300 animate-pulse rounded"></div>
                  <div className="h-[25px] bg-gray-300 animate-pulse rounded"></div>
                  <div className="h-[25px] bg-gray-300 animate-pulse rounded"></div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-row gap-2 justify-between mt-4">
                  {Array(4)
                    .fill(0)
                    .map((_, index) => (
                      <div
                        key={index}
                        className="btnbutton bg-gray-300 animate-pulse rounded h-[40px] w-[80px]"
                      ></div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* What You Will Learn Section Skeleton */}
    <div className="w-full font-urbanist h-auto bg-gray-50 py-10">
      <div className="max-w-[1700px] mx-auto px-5 lg:px-10">
        <div className="flex flex-col gap-10">
          <div className="h-[50px] bg-gray-300 animate-pulse rounded w-2/3 mx-auto"></div>
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="flex flex-col shadow-lg rounded-md p-5 bg-gray-300 animate-pulse"
              >
                <div className="h-[30px] bg-gray-400 rounded mb-3"></div>
                <div className="h-[20px] bg-gray-400 rounded"></div>
              </div>
            ))}
        </div>
      </div>
    </div>

    {/* Skills You Get Section Skeleton */}
    <div className="w-full h-auto bg-gray-100 py-10">
      <div className="max-w-[1700px] font-urbanist mx-auto px-5 lg:px-10">
        <div className="mb-6">
          <div className="h-[40px] bg-gray-300 animate-pulse rounded w-1/3"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-center items-center">
          {Array(10)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="bg-gray-300 animate-pulse rounded-lg h-[50px] w-full"
              ></div>
            ))}
        </div>
      </div>
    </div>
  </div>
  )
}

export default DetailCourseSkeleton