import { Client, Databases } from 'node-appwrite';

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || '')
  .setProject(process.env.APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);

const PLAID_ENDPOINT = 'https://sandbox.plaid.com';
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;

export default async function(req: any, res: any) {
  try {
    const { action, data } = JSON.parse(req.payload);

    switch (action) {
      case 'createLinkToken':
        return await createLinkToken(data);
      case 'exchangePublicToken':
        return await exchangePublicToken(data);
      case 'getTransactions':
        return await getTransactions(data);
      case 'refreshTransactions':
        return await refreshTransactions(data);
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Plaid function error:', error);
    return res.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }, 500);
  }
}

async function createLinkToken(data: { userId: string }) {
  const response = await fetch(`${PLAID_ENDPOINT}/link/token/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: PLAID_CLIENT_ID,
      secret: PLAID_SECRET,
      client_name: 'Penny Wise',
      country_codes: ['US'],
      language: 'en',
      user: {
        client_user_id: data.userId,
      },
      products: ['transactions'],
      webhook: 'https://your-webhook-url.com/plaid-webhook', // Add your webhook URL
      android_package_name: 'com.pennywise.app', // Add your Android package name
    }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error_message || 'Failed to create link token');
  }

  return res.json({
    success: true,
    link_token: result.link_token,
  });
}

async function exchangePublicToken(data: { publicToken: string; userId: string }) {
  const response = await fetch(`${PLAID_ENDPOINT}/item/public_token/exchange`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: PLAID_CLIENT_ID,
      secret: PLAID_SECRET,
      public_token: data.publicToken,
    }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error_message || 'Failed to exchange public token');
  }

  // Store the access token in Appwrite
  await databases.createDocument(
    process.env.APPWRITE_DATABASE_ID || '',
    'plaid_tokens',
    result.access_token,
    {
      userId: data.userId,
      accessToken: result.access_token,
      createdAt: new Date().toISOString(),
    }
  );

  return res.json({
    success: true,
    access_token: result.access_token,
    item_id: result.item_id,
  });
}

async function getTransactions(data: { accessToken: string; startDate: string; endDate: string }) {
  const response = await fetch(`${PLAID_ENDPOINT}/transactions/get`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: PLAID_CLIENT_ID,
      secret: PLAID_SECRET,
      access_token: data.accessToken,
      start_date: data.startDate,
      end_date: data.endDate,
      options: {
        include_personal_finance_category: true,
      },
    }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error_message || 'Failed to get transactions');
  }

  return res.json({
    success: true,
    transactions: result.transactions,
  });
}

async function refreshTransactions(data: { accessToken: string }) {
  const response = await fetch(`${PLAID_ENDPOINT}/transactions/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: PLAID_CLIENT_ID,
      secret: PLAID_SECRET,
      access_token: data.accessToken,
    }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error_message || 'Failed to refresh transactions');
  }

  return res.json({
    success: true,
  });
} 