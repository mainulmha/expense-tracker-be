const express = require("express");
const router = express.Router();
const controller = require("../controllers/expenseController");
const { protect } = require("../middleware/auth");

const {
  addExpense,
  getBalance,
  dailyReport,
  categoryReport,
  dayWiseReport,
  monthlyTrendReport,
  getAllTransactions,
} = require("../controllers/expenseController");

// সব রাউটে protect middleware আছে কিনা চেক করুন
router.post("/add", protect, addExpense);
router.get("/balance", protect, getBalance);
router.get("/daily-report", protect, dailyReport);
router.get("/chart/category", protect, categoryReport);
router.get("/report/day-wise-report", protect, dayWiseReport);
router.get("/report/monthly-trend", protect, monthlyTrendReport);
router.get("/report/all", protect, getAllTransactions);

module.exports = router;
