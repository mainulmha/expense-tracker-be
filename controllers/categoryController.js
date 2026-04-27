const Category = require("../models/Category");

// প্রি-ডিফাইন্ড ক্যাটাগরি লিস্ট
const defaultCategories = {
  expense: [
    { name: "food", icon: "food", color: "#EF4444" },
    { name: "travel", icon: "travel", color: "#FFC053" },
    { name: "transport", icon: "transport", color: "#F59E0B" },
    { name: "shopping", icon: "shopping", color: "#EC4899" },
    { name: "entertainment", icon: "entertainment", color: "#8B5CF6" },
    { name: "health", icon: "health", color: "#DC2626" },
    { name: "rent", icon: "rent", color: "#6B7280" },
    { name: "education", icon: "study", color: "#3B82F6" },
    { name: "other", icon: "other", color: "#6B7280" },
  ],
  income: [
    { name: "salary", icon: "money", color: "#22C55E" },
    { name: "investment", icon: "investment", color: "#10B981" },
    { name: "other", icon: "other", color: "#6B7280" },
  ],
  investment: [
    { name: "dps", icon: "dps", color: "#10B981" },
    { name: "fdr", icon: "dps", color: "#10B981" },
    { name: "share", icon: "investment", color: "#10B981" },
    { name: "gold", icon: "gold", color: "#FBBF24" },
    { name: "other", icon: "other", color: "#6B7280" },
  ],
};

// সব ক্যাটাগরি পাওয়া
exports.getCategories = async (req, res) => {
  try {
    const { type } = req.query;
    let filter = { isActive: true };
    if (type) filter.type = type;

    let categories = await Category.find(filter).sort("name");

    // যদি ক্যাটাগরি না থাকে, ডিফল্ট তৈরি করুন
    if (categories.length === 0) {
      await seedCategories();
      categories = await Category.find(filter).sort("name");
    }

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// নতুন ক্যাটাগরি যোগ করা
exports.addCategory = async (req, res) => {
  try {
    const { name, type, icon, color } = req.body;

    const existingCategory = await Category.findOne({
      name: name.toLowerCase(),
      type,
    });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name: name.toLowerCase(),
      type,
      icon: icon || "other",
      color: color || "#6B7280",
    });

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ডিফল্ট ক্যাটাগরি সিড করা
const seedCategories = async () => {
  try {
    await Category.deleteMany({});

    const allCategories = [];
    for (const [type, categories] of Object.entries(defaultCategories)) {
      for (const cat of categories) {
        allCategories.push({
          ...cat,
          type,
        });
      }
    }

    await Category.insertMany(allCategories);
    console.log("✅ Categories seeded successfully");
  } catch (error) {
    console.error("Error seeding categories:", error);
  }
};
