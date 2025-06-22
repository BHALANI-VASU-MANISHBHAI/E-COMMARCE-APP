
import express from 'express';
import { getTotalRevenue, getTotalOrders,getTotalCustomers ,MostSellerToday,getTotalRevenueByRange,getProfitByRange,getCostByRange,getOrdersByRange} from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/totalRevenue', getTotalRevenue);
router.get('/totalOrders', getTotalOrders);
router.get('/totalCustomers', getTotalCustomers);
router.get('/mostSellerToday', MostSellerToday);
router.get('/totalRevenueByRange', getTotalRevenueByRange);
router.get('/getProfitByRange', getProfitByRange);
router.get('/getCostByRange', getCostByRange);
router.get('/getOrdersByRange', getOrdersByRange);
export default router;

