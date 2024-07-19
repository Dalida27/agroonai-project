'use client';

import React from 'react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <img className='sm:w-[40%] mx-auto my-auto' src="/loading.gif" alt="Loading..." />
    </div>
  );
}

export default Loading;
