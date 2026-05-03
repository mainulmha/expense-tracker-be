const Expense = require("../models/Expense");

// Category mappings based on type
const categoryMapping = {
  expense: [
    "food",
    "rent",
    "travel",
    "transport",
    "shopping",
    "medicine",
    "gold",
    "recharge",
    "internet bill",
    "dish bill",
    "other",
  ],
  income: ["salary", "investment", "other"],
  investment: ["investment", "gold", "fdr", "dps", "share", "other"],
};

// Helper function to validate category
const validateCategory = (type, category) => {
  const allowedCategories = categoryMapping[type] || categoryMapping.expense;
  const normalizedCategory = category.toLowerCase().trim();
  return allowedCategories.includes(normalizedCategory);
};

// @desc    Add new transaction
// @route   POST /api/expense/add
// @access  Private
exports.addExpense = async (req, res) => {
  try {
    const { amount, category, type, description, date } = req.body;

    // ✅ ইউজার চেক
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // ✅ 1. Amount validation
    if (!amount && amount !== 0) {
      return res.status(400).json({
        success: false,
        message: "Amount is required",
      });
    }

    // ✅ 2. Amount number check
    if (isNaN(amount)) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a number",
      });
    }

    // ✅ 3. Amount positive check
    if (Number(amount) < 0) {
      return res.status(400).json({
        success: false,
        message: "Amount cannot be negative",
      });
    }

    // ✅ 4. Type validation
    const allowedTypes = ["income", "expense", "investment"];
    if (!type || !allowedTypes.includes(type.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid type. Allowed types: ${allowedTypes.join(", ")}`,
      });
    }

    // ✅ 5. Description validation
    // if (!description || description.trim() === "") {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Description is required",
    //   });
    // }

    // ✅ 6. Category validation
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    const isValidCategory = validateCategory(type, category);
    if (!isValidCategory) {
      const allowedCategories =
        categoryMapping[type] || categoryMapping.expense;
      return res.status(400).json({
        success: false,
        message: `Invalid category for ${type}. Allowed categories: ${allowedCategories.join(", ")}`,
      });
    }

    // ✅ 7. Date validation
    let transactionDate = date ? new Date(date) : new Date();
    if (isNaN(transactionDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format",
      });
    }

    // ✅ 8. Create transaction with userId
    const newExpense = await Expense.create({
      description: description.trim(),
      amount: Number(amount),
      category: category.toLowerCase().trim(),
      type: type.toLowerCase(),
      date: transactionDate,
      userId: req.user._id,
    });

    console.log("✅ Transaction created:", {
      id: newExpense._id,
      type: newExpense.type,
      description: newExpense.description,
      category: newExpense.category,
      amount: newExpense.amount,
      date: newExpense.date,
      userId: newExpense.userId,
    });

    res.status(201).json({
      success: true,
      message: "Transaction added successfully",
      data: newExpense,
    });
  } catch (error) {
    console.error("❌ Error in addExpense:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// @desc    Get Balance
// @route   GET /api/expense/balance
// @access  Private
exports.getBalance = async (req, res) => {
  try {
    // ✅ শুধু লগইন ইউজারের ডাটা
    const data = await Expense.find({ userId: req.user._id });

    let income = 0;
    let expense = 0;
    let investment = 0;

    data.forEach((item) => {
      if (item.type === "income") {
        income += item.amount;
      } else if (item.type === "expense") {
        expense += item.amount;
      } else if (item.type === "investment") {
        investment += item.amount;
      }
    });

    const balance = income - expense - investment;

    res.json({
      success: true,
      income,
      expense,
      investment,
      balance,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Daily Report
// @route   GET /api/expense/daily-report
// @access  Private
exports.dailyReport = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // ✅ শুধু লগইন ইউজারের ডাটা
    const data = await Expense.find({
      userId: req.user._id,
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    let income = 0;
    let expense = 0;
    let investment = 0;

    data.forEach((item) => {
      if (item.type === "income") income += item.amount;
      else if (item.type === "expense") expense += item.amount;
      else if (item.type === "investment") investment += item.amount;
    });

    res.json({
      success: true,
      income,
      expense,
      investment,
      balance: income - expense - investment,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Category Report
// @route   GET /api/expense/chart/category
// @access  Private
exports.categoryReport = async (req, res) => {
  try {
    const { type } = req.query;

    let matchStage = { userId: req.user._id }; // 👈 ইউজার ফিল্টার যোগ করুন

    if (type && ["expense", "income", "investment"].includes(type)) {
      matchStage.type = type;
    } else {
      matchStage.type = "expense";
    }

    const data = await Expense.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.json({
      success: true,
      data,
      type: type || "expense",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Day-wise Report
// @route   GET /api/expense/report/day-wise-report
// @access  Private
exports.dayWiseReport = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const type = req.query.type;

    // ✅ ইউজার ফিল্টার যোগ করুন
    const matchStage = { userId: req.user._id };
    if (type && ["expense", "income", "investment"].includes(type)) {
      matchStage.type = type;
    }

    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$date" },
            month: { $month: "$date" },
            year: { $year: "$date" },
          },
          items: { $push: "$$ROOT" },
          totalExpense: {
            $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] },
          },
          totalIncome: {
            $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] },
          },
          totalInvestment: {
            $sum: { $cond: [{ $eq: ["$type", "investment"] }, "$amount", 0] },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1, "_id.day": -1 } },
    ];

    const totalResult = await Expense.aggregate([
      ...pipeline,
      { $count: "total" },
    ]);
    const totalGroups = totalResult[0]?.total || 0;
    const totalPages = Math.ceil(totalGroups / limit);

    const data = await Expense.aggregate([
      ...pipeline,
      { $skip: skip },
      { $limit: limit },
    ]);

    res.json({
      success: true,
      data,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalGroups: totalGroups,
        limit: limit,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Monthly Trend Report
// @route   GET /api/expense/report/monthly-trend
// @access  Private
exports.monthlyTrendReport = async (req, res) => {
  try {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    // ✅ শুধু লগইন ইউজারের ডাটা
    const data = await Expense.aggregate([
      {
        $match: {
          userId: req.user._id,
          date: { $gte: twelveMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          income: {
            $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] },
          },
          expense: {
            $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] },
          },
          investment: {
            $sum: { $cond: [{ $eq: ["$type", "investment"] }, "$amount", 0] },
          },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get All Transactions (Pagination)
// @route   GET /api/expense/report/all
// @access  Private
exports.getAllTransactions = async (req, res) => {
  try {
    const {
      type,
      category,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    // ✅ শুধু লগইন ইউজারের ডাটা
    let filter = { userId: req.user._id };

    if (type && type !== "all") {
      filter.type = type;
    }

    if (category && category !== "all") {
      filter.category = category;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const totalItems = await Expense.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limitNum);

    const transactions = await Expense.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      data: transactions,
      pagination: {
        currentPage: pageNum,
        totalPages: totalPages,
        totalItems: totalItems,
        limit: limitNum,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching all transactions:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
