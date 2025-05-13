const { Client, Databases, Query } = require('node-appwrite');

module.exports = async function (req, res) {
  try {
    // Initialize Appwrite client
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT)
      .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
      .setKey(process.env.APPWRITE_FUNCTION_API_KEY);

    const databases = new Databases(client);

    // Parse the request payload
    const payload = JSON.parse(req.payload);
    const { expenseAmount, budgetId } = payload;

    if (!expenseAmount || !budgetId) {
      throw new Error('Missing required parameters: expenseAmount and budgetId');
    }

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

    if (isNaN(currentSpent) || isNaN(totalBudget)) {
      throw new Error('Invalid budget or expense amount');
    }

    // Calculate percentage
    const percentage = (currentSpent / totalBudget) * 100;

    // Define notification thresholds and messages
    const thresholds = [
      { value: 100, message: 'You have reached 100% of your budget!' },
      { value: 95, message: 'You have reached 95% of your budget!' },
      { value: 90, message: 'You have reached 90% of your budget!' },
      { value: 85, message: 'You have reached 85% of your budget!' },
      { value: 70, message: 'You have reached 70% of your budget!' }
    ];

    // Find the highest threshold that has been crossed
    const crossedThreshold = thresholds.find(threshold => 
      percentage >= threshold.value && percentage < threshold.value + 1
    );

    if (crossedThreshold) {
      // Update the budget's amountSpent
      await databases.updateDocument(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_BUDGET_COLLECTION_ID,
        budgetId,
        {
          amountSpent: currentSpent
        }
      );

      // Return notification data
      return res.json({
        success: true,
        notification: {
          title: 'Budget Alert',
          body: crossedThreshold.message,
          data: {
            percentage: Math.floor(percentage),
            currentSpent: currentSpent,
            totalBudget: totalBudget,
            threshold: crossedThreshold.value
          }
        }
      });
    }

    // If no threshold was crossed, just update the amount spent
    await databases.updateDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_BUDGET_COLLECTION_ID,
      budgetId,
      {
        amountSpent: currentSpent
      }
    );

    return res.json({
      success: true,
      message: 'Budget updated successfully',
      data: {
        currentSpent: currentSpent,
        totalBudget: totalBudget,
        percentage: Math.floor(percentage)
      }
    });

  } catch (error) {
    console.error('Error in budget notification function:', error);
    return res.json({
      success: false,
      error: error.message
    }, 500);
  }
}; 