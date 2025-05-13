const { Client, Databases, Query } = require('node-appwrite');

module.exports = async function (req, res) {
  try {
    // Initialize Appwrite client
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT)
      .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
      .setKey(process.env.APPWRITE_FUNCTION_API_KEY);

    const databases = new Databases(client);

    // Get the expense data from the request
    const { expenseAmount, budgetId } = JSON.parse(req.payload);

    // Get the current budget data
    const budgetData = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_BUDGET_COLLECTION_ID,
      [Query.equal('$id', budgetId)]
    );

    if (!budgetData.documents.length) {
      throw new Error('Budget not found');
    }

    const budget = budgetData.documents[0];
    const currentSpent = parseFloat(budget.amountSpent || 0) + parseFloat(expenseAmount);
    const totalBudget = parseFloat(budget.budgetAmount);

    // Calculate percentage
    const percentage = (currentSpent / totalBudget) * 100;

    // Check if we need to send a notification
    const thresholds = [70, 85, 90, 95, 100];
    const shouldNotify = thresholds.some(threshold => 
      percentage >= threshold && percentage < threshold + 1
    );

    if (shouldNotify) {
      // Here you would typically send a push notification
      // For now, we'll just return the notification data
      return res.json({
        success: true,
        notification: {
          title: 'Budget Alert',
          body: `You have reached ${Math.floor(percentage)}% of your budget!`,
          percentage: percentage
        }
      });
    }

    return res.json({
      success: true,
      message: 'No notification needed'
    });

  } catch (error) {
    console.error('Error in budget notification function:', error);
    return res.json({
      success: false,
      error: error.message
    }, 500);
  }
}; 