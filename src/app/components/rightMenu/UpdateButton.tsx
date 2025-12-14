'use client';

import { useFormStatus } from "react-dom";

export const UpdateButton = () => {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className='bg-blue-500 p-2 mt-2 rounded-md text-white disabled:bg-opacity-50 disabled:cursor-not-allowed text-center w-full cursor-pointer'>
      {pending ? 'Updating...' : 'Update'}
    </button>

  );
}
