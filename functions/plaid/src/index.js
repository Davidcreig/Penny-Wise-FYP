const { Client, Databases } = require('node-appwrite');
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

// Initialize Plaid client
const plaidConfig = new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
            'PLAID-SECRET': process.env.PLAID_SECRET,
            'Plaid-Version': '2020-09-14',
        },
    },
});

const plaidClient = new PlaidApi(plaidConfig);

// UK Shops Categories
const ukShopsCategorized = {
    "Groceries": ["Aldi", "Asda", "Booths", "Budgens", "Co-op Food", "Costco", "Costcutter", "Farmfoods", "Heron Foods", "Iceland", "Lidl", "Londis", "M&S Foodhall", "Morrisons", "Nisa", "Ocado", "Sainsbury's", "SPAR", "Tesco", "Waitrose", "Whole Foods Market"],
    "Transport": ["Transport for London (TfL)", "National Rail", "Stagecoach", "Arriva", "FirstGroup", "Go-Ahead Group", "National Express", "Uber", "Bolt", "Addison Lee", "Zipcar", "Enterprise Car Club", "Europcar", "Hertz", "Sixt"],
    "Rent/Utilities": ["British Gas", "EDF Energy", "E.ON", "ScottishPower", "Octopus Energy", "OVO Energy", "Thames Water", "Severn Trent", "United Utilities", "BT Group", "Virgin Media", "Sky", "TalkTalk", "Openreach", "SSE Energy Services"],
    "Restaurants": ["All Bar One", "Bella Italia", "Café Rouge", "Caffè Nero", "Costa Coffee", "Five Guys", "Frankie & Benny's", "Greggs", "Harry Ramsden's", "KFC", "Las Iguanas", "McDonald's", "Nando's", "PizzaExpress", "Pret A Manger", "Starbucks", "Subway", "Wagamama", "Wildwood Kitchen", "Zizzi"],
    "Entertainment": ["All3Media", "BBC iPlayer", "Disney+", "ITV Hub", "Netflix", "Odeon Cinemas", "Sky TV", "Spotify", "The Guardian", "The Times", "Vue Cinemas"],
    "Shopping": ["Amazon UK", "Argos", "ASOS", "B&M", "Boots", "Clarks", "Currys", "Debenhams", "H&M", "House of Fraser", "John Lewis & Partners", "Marks & Spencer", "New Look", "Next", "Poundland", "Primark", "Sports Direct", "TK Maxx", "WHSmith", "Zara", "C&A"],
    "Services/Subscriptions": ["Adobe Creative Cloud", "Spotify", "Netflix", "Disney+", "Hulu", "YouTube Premium", "Amazon Music", "Apple TV+", "BBC Sounds", "Canva", "Dropbox", "Evernote", "Headspace", "LastPass", "LinkedIn Premium", "Mailchimp", "Notion", "Slack", "Trello", "Twitch", "Udemy", "Zoom", "Amazon Prime", "Apple Music", "BT Sport", "Financial Times", "Google Workspace", "Microsoft 365"]
};

// Function to determine category based on merchant name
function determineCategory(merchantName) {
    if (!merchantName) return "Other";
    
    // Convert merchant name to lowercase for case-insensitive matching
    const merchantLower = merchantName.toLowerCase();
    
    // Check each category
    for (const [category, shops] of Object.entries(ukShopsCategorized)) {
        // Check if any shop name in this category is contained in the merchant name
        if (shops.some(shop => merchantLower.includes(shop.toLowerCase()))) {
            return category;
        }
    }
    
    // If no match found, check Plaid's category
    return "Other";
}

module.exports = async function (req, res) {
    try {
        const { operation, data } = JSON.parse(req.payload);
        
        switch (operation) {
            case 'createLinkToken':
                return await handleCreateLinkToken(data, res);
            case 'exchangePublicToken':
                return await handleExchangePublicToken(data, res);
            case 'syncTransactions':
                return await handleSyncTransactions(data, res);
            default:
                throw new Error('Invalid operation');
        }
    } catch (error) {
        console.error('Plaid function error:', error);
        res.json({
            success: false,
            error: error.message
        }, 500);
    }
};

async function handleCreateLinkToken(data, res) {
    const { userId, budgetId } = data;
    
    const request = {
        user: { client_user_id: userId },
        client_name: 'Penny Wise',
        products: ['transactions'],
        country_codes: ['US'],
        language: 'en',
        webhook: process.env.PLAID_WEBHOOK_URL,
    };

    const response = await plaidClient.linkTokenCreate(request);
    
    // Store the link token in Appwrite
    await databases.createDocument(
        process.env.APPWRITE_DATABASE_ID,
        'plaid_tokens',
        'unique()',
        {
            userId,
            budgetId,
            linkToken: response.data.link_token,
            createdAt: new Date().toISOString()
        }
    );

    res.json({
        success: true,
        link_token: response.data.link_token
    });
}

async function handleExchangePublicToken(data, res) {
    const { publicToken, userId, budgetId } = data;
    
    const response = await plaidClient.itemPublicTokenExchange({
        public_token: publicToken
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // Store the access token in Appwrite
    await databases.createDocument(
        process.env.APPWRITE_DATABASE_ID,
        'plaid_access_tokens',
        'unique()',
        {
            userId,
            budgetId,
            accessToken,
            itemId,
            createdAt: new Date().toISOString()
        }
    );

    res.json({
        success: true,
        access_token: accessToken,
        item_id: itemId
    });
}

async function handleSyncTransactions(data, res) {
    const { userId, budgetId } = data;
    
    // Get the access token from Appwrite
    const accessTokenDoc = await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        'plaid_access_tokens',
        [
            databases.queries.equal('userId', userId),
            databases.queries.equal('budgetId', budgetId)
        ]
    );

    if (!accessTokenDoc.documents.length) {
        throw new Error('No access token found');
    }

    const accessToken = accessTokenDoc.documents[0].accessToken;

    // Get transactions from Plaid
    const response = await plaidClient.transactionsSync({
        access_token: accessToken,
        options: {
            include_personal_finance_category: true
        }
    });

    const transactions = response.data.added;
    
    // Store transactions in Appwrite
    for (const transaction of transactions) {
        const merchantName = transaction.merchant_name || transaction.name;
        const category = determineCategory(merchantName);
        
        await databases.createDocument(
            process.env.APPWRITE_DATABASE_ID,
            'expenses',
            'unique()',
            {
                shop: merchantName,
                amount: Math.abs(transaction.amount),
                budgetData: budgetId,
                type: category,
                date: transaction.date,
                plaidTransactionId: transaction.transaction_id
            }
        );
    }

    res.json({
        success: true,
        transactions_synced: transactions.length
    });
} 