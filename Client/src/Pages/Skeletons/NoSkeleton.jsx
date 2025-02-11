import React from 'react'

function NoSkeleton({message}) {
  return (
    <div className='w-full h-full flex flex-col items-center justify-center py-10'>
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ban"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>
        <div className='w-full h-full text-2xl pt-2'>{message}</div>
    </div>
  )
}

export default NoSkeleton