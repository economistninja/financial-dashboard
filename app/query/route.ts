import postgres from 'postgres';

// 1. Connection: Uses the POSTGRES_URL variable from your .env file 
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function listInvoices() {
	const data = await sql`
    SELECT invoices.amount, customers.name
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE invoices.amount = 666;
  `;

	return data;
}

export async function GET() {
  try {
  	// 2. Execution: Calls the function to query the database
  	return Response.json(await listInvoices());
  } catch (error) {
    // 3. Error Handling: Returns a 500 status on failure
    console.error('Database Query Error:', error);
  	return Response.json({ error: 'Failed to fetch data from database. Check connection details and ensure the database is running.' }, { status: 500 });
  }
}