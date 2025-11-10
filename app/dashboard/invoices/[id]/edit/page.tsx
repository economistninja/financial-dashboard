import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
import { notFound } from 'next/navigation';

// This is the correct and only component declaration for the page.
export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ]);
   // The original error was here, missing the closing brace of the previous function block
  if (!invoice) {
    notFound();
  }
  
  return ( // This 'return' should be inside the async function Page(props) { ... }
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} />
    </main>
  );
} 
// The parser error was likely pointing to line 30 column 2 because the code
// below was being read as if it were outside a function block that hadn't been closed.
// The second function declaration 'export default async function Page() { ... }' was removed.