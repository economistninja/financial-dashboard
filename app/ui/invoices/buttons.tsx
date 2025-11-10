'use client'; // This is now a client component

import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
// Import useFormState and deleteInvoice
import { useFormState } from 'react-dom';
import { deleteInvoice } from '@/app/lib/actions';

// Define the initial state with the correct structure
const initialState = {
  message: '',
};

export function CreateInvoice() {
  return (
    <Link
      href="/dashboard/invoices/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Invoice</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateInvoice({ id }: { id: string }) {
  // This remains a simple Link as the form action is handled in edit-form.tsx
  return (
    <Link
      href={`/dashboard/invoices/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

// ----------------------------------------------------
// Updated DeleteInvoice to use useFormState
// ----------------------------------------------------
export function DeleteInvoice({ id }: { id: string }) {
  const deleteInvoiceWithId = deleteInvoice.bind(null, id);
  
  // Use useFormState to capture the message returned by deleteInvoice on error
  const [state, dispatch] = useFormState(deleteInvoiceWithId, initialState);

  return (
    // We use the dispatch function as the form action
    <form action={dispatch}>
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-4" />
      </button>
      
      {/* Display the error message if state.message exists */}
      <div aria-live="polite" className="sr-only">
        {state?.message && <p>{state.message}</p>}
      </div>
    </form>
  );
}