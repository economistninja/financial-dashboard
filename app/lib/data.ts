import postgres from 'postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';

// Add this helper function
function shouldSkipDatabase() {
  return process.env.NEXT_PHASE === 'phase-build' || 
         !process.env.POSTGRES_URL ||
         process.env.VERCEL === '1';
}

export async function fetchRevenue() {
  if (shouldSkipDatabase()) {
    return [];
  }

  try {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
    
    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue[]>`SELECT * FROM revenue`;
    await sql.end(); // Close connection

    console.log('Data fetch completed after 3 seconds.');
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

export async function fetchLatestInvoices() {
  if (shouldSkipDatabase()) {
    return [];
  }

  try {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
    
    const data = await sql<LatestInvoiceRaw[]>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    await sql.end(); // Close connection

    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

export async function fetchCardData() {
  if (shouldSkipDatabase()) {
    return {
      numberOfInvoices: 0,
      numberOfCustomers: 0,
      totalPaidInvoices: formatCurrency(0),
      totalPendingInvoices: formatCurrency(0),
    };
  }

  try {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
    
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    await sql.end(); // Close connection

    const numberOfInvoices = Number(data[0][0].count ?? '0');
    const numberOfCustomers = Number(data[1][0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2][0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2][0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      numberOfInvoices: 0,
      numberOfCustomers: 0,
      totalPaidInvoices: formatCurrency(0),
      totalPendingInvoices: formatCurrency(0),
    };
  }
}

// Continue this pattern for ALL other functions in the file...