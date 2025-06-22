import { useContext, useEffect, useState, useCallback } from "react";
import assets from "../assets/assets.js";
import RoundedChart from "../components/RoundedChart.jsx";
import { ProductContext } from "../contexts/ProductContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App.jsx";
import socket from "../services/socket.jsx";

const Dashboard = ({ token }) => {
  const { products } = useContext(ProductContext);
  const navigate = useNavigate();

  const [mostSellerToday, setmostSellerToday] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [outOfStock, setOutOfStock] = useState([]);
  const [selectedStockType, setSelectedStockType] = useState("out");

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);

  const [RoundedChartData, setRoundedChartData] = useState([]);

  const [StartDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [EndDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);

  const getLowStocksProduct = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/getLowStock`, { headers: { token } });
      if (response.data.success) {
        const allLowStocks = response.data.products;
        const outOfStockProducts = allLowStocks.filter((pro) => pro.stock.some((s) => s.quantity === 0));
        const lowStockProducts = allLowStocks.filter((pro) => pro.stock.some((s) => s.quantity > 0 && s.quantity <= 5));
        setOutOfStock(outOfStockProducts);
        setLowStock(lowStockProducts);
      } else {
        toast.error("Failed to fetch low stock products");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const getMostSellerToday = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/mostSellerToday`, { headers: { token } });
      if (response.data.success) {
        setmostSellerToday(response.data.mostSellingProducts);
      } else {
        toast.error("Failed to fetch most seller products");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const TotalRevenue = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/dashboard/totalRevenue`, { headers: { token } });
      if (response.data.success) {
        setTotalRevenue(response.data.totalRevenue);
      } else {
        toast.error("Failed to fetch total revenue");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };



  const TotalCustomers = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/dashboard/totalCustomers`, { headers: { token } });
      if (response.data.success) {
        setTotalCustomers(response.data.totalCustomers);
      } else {
        toast.error("Failed to fetch total customers");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };
  const TotalRevenueByRange = async () => {
    try {

      const response = await axios.get(`${backendUrl}/api/dashboard/totalRevenueByRange?startDate=${StartDate}&endDate=${EndDate}`, { headers: { token } });
      if (response.data.success) {
        setTotalRevenue(response.data.totalRevenue);
      } else {
        toast.error("Failed to fetch total revenue by range");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };
  
  const TotalOrderByRange  = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/dashboard/getOrdersByRange?startDate=${StartDate}&endDate=${EndDate}`, { headers: { token } });
      if (response.data.success) {
        console.log("Ordersss"  ,response.data);
        setTotalOrders(response.data.totalOrders);
      } else {
        toast.error("Failed to fetch total orders by range");
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };


  const getChartData = useCallback(async () => {
    try {
      setRoundedChartData([]);
      const profitResponse = await axios.get(`${backendUrl}/api/dashboard/getProfitByRange?startDate=${StartDate}&endDate=${EndDate}`, { headers: { token } });
      const costResponse = await axios.get(`${backendUrl}/api/dashboard/getCostByRange?startDate=${StartDate}&endDate=${EndDate}`, { headers: { token } });

      if (profitResponse.data.success && costResponse.data.success) {
        setRoundedChartData([
          { name: "Profit", value: profitResponse.data.totalProfit, color: "#4CAF50" },
          { name: "Cost", value: costResponse.data.totalCost, color: "#FF9800" },
        ]);
      } else {
        toast.error("Failed to fetch profit or cost");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  }, [StartDate, EndDate, token]);
const fetchAllDashboardData = useCallback(async () => {
  await Promise.all([
    TotalRevenueByRange(),
    TotalOrderByRange(),
    getChartData()
  ]);
}, [StartDate, EndDate, token]);
useEffect(() => {
  fetchAllDashboardData();
}, [StartDate, EndDate]);

  useEffect(() => {
    getLowStocksProduct();
    getMostSellerToday();
    TotalCustomers();
  }, [token]);
useEffect(() => {
  const handleOrderPlaced = (data) => {
    console.log("New order placed:", data);
    TotalRevenueByRange();
    TotalOrderByRange();
    getMostSellerToday();
  };

  const handleOrderCancelled = (data) => {
    console.log("Order cancelled:", data);
    TotalOrderByRange();
    TotalRevenueByRange();
    getMostSellerToday();
  };

  const handleCustomerAdded = (data) => {
    console.log("New customer added:", data);
    TotalCustomers();
  };

  socket.on("orderPlaced", handleOrderPlaced);
  socket.on("orderCancelled", handleOrderCancelled);
  socket.on("customerAdded", handleCustomerAdded);

  return () => {
    socket.off("orderPlaced", handleOrderPlaced);
    socket.off("orderCancelled", handleOrderCancelled);
    socket.off("customerAdded", handleCustomerAdded);
  };
}, [token, TotalRevenueByRange, TotalOrderByRange, getMostSellerToday, TotalCustomers]);


  const displayedProducts = selectedStockType === "out" ? outOfStock : lowStock;

  return (
    <div className="p-5">
      {/* Date Range Inputs */}
      <div className="flex items-start mb-5  px-4 py-2 bg-gray-200 rounded-lg flex-col md:flex-row md:justify-between md:items-center gap-4"> 
        <div className="flex gap-3 items-center ">
          <p>Start Date</p>
          <input
            type="date"
            value={StartDate}
            min={new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split("T")[0]}
            max={EndDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          />
        </div>
        <div className="flex gap-4 items-center">
          <p>End Date</p>
          <input
            type="date"
            value={EndDate}
            min={StartDate}
            max ={new Date().toISOString().split("T")[0]}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          />
        </div>
      </div>

      {/* Cards Section */}
      <div className="flex flex-row gap-7 ">
        <div className="flex md:gap-10 sm:gap-3 w-full flex-col md:flex-row gap-8">
          <DashboardCard title="Total Revenue" value={`₹${totalRevenue.toFixed(2)}`} />
          <DashboardCard title="Total Orders" value={`${totalOrders} Orders`} />
          <DashboardCard title="Total Customers" value={`${totalCustomers} Customers`} />
        </div>
      </div>

      {/* Charts Section */}
      <div className="flex flex-col lg:flex-row justify-between gap-5 w-full mt-10 md:flex-col">
        <div className="w-full lg:w-[60%] md:w-full">
          <RoundedChart data={RoundedChartData} />
        </div>

        <div className="w-full lg:w-[35%] mt-10 md:mt-0 bg-white p-5 rounded-lg shadow-md">
          <h1 className="text-lg font-bold mb-4">Popular Products</h1>
          {mostSellerToday && mostSellerToday.length > 0 ? (
            mostSellerToday.map((item, index) => (
              <PopularProductCard key={index} item={item} />
            ))
          ) : (
            <p className="text-gray-500">No Popular Product Found</p>
          )}
        </div>
      </div>

      {/* Stock Section */}
      <div className="mt-10">
        <div className="flex gap-10 bg-gray-300 h-12 justify-between items-center px-4">
          <p className="text-[10px] sm:text-md md:text-xl font-bold">
            {selectedStockType === "out" ? "Out of Stock Alerts" : "Low Stock Alerts"}
          </p>
          <select
            name="STOCK"
            id="STOCK"
            className="text-sm px-2 py-1 bg-gray-100"
            onChange={(e) => setSelectedStockType(e.target.value)}
            value={selectedStockType}
          >
            <option value="out">Out of Stock</option>
            <option value="low">Low Stock</option>
          </select>
        </div>

        {displayedProducts.length > 0 ? (
          <div className="flex flex-col gap-2 mt-3">
            <StockHeader />
            {displayedProducts.map((item, index) => (
              <StockItem key={index} item={item} selectedStockType={selectedStockType} navigate={navigate} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mt-2">
            No {selectedStockType === "out" ? "Out of Stock" : "Low Stock"} Products
          </p>
        )}
      </div>
    </div>
  );
};

// 🔥 Components for Reusability
const DashboardCard = ({ title, value }) => (
  <div className="flex flex-col gap-3 bg-white p-5 rounded-lg shadow-md w-full sm:w-[90%] md:w-[30%]">
    <div className="flex gap-5 items-center justify-between">
      <div className="flex flex-col gap-2">
        <p className="text-gray-700 font-medium text-sm sm:text-base">{title}</p>
      </div>
      <img src={assets.add_icon} className="w-4 h-4 sm:w-5 sm:h-5" alt="" />
    </div>
    <p className="text-lg sm:text-xl font-bold">{value}</p>
  </div>
);

const PopularProductCard = ({ item }) => (
  <div className="flex items-center gap-4 border-b pb-3 mb-3">
    <img src={item.image[0] || assets.add_icon} alt={item.name} className="w-16 h-16 object-cover rounded" />
    <div>
      <p className="font-medium">{item.name}</p>
      <p className="text-sm text-gray-500">{item.category}</p>
      <p className="text-sm text-gray-500">Sold: {item.quantity}</p>
    </div>
  </div>
);

const StockHeader = () => (
  <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] bg-gray-100 items-center py-1 px-2 border text-sm">
    <b>Image</b>
    <b>Name</b>
    <b>Category (SubCategory)</b>
    <b className="ml-5">Stock</b>
    <b className="text-center">Action</b>
  </div>
);

const StockItem = ({ item, selectedStockType, navigate }) => (
  <div className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] gap-2 py-1 px-2 border text-sm items-center">
    <img className="w-20" src={item.image[0]} alt="" />
    <p>{item.name}</p>
    <p>{item.category} ({item.subCategory})</p>
    <p className={`rounded-x w-3/4 text-center ${selectedStockType === "out" ? "text-red-600" : "text-orange-500"}`}>
      {selectedStockType === "out" ? "Out of Stock" : "Low Stock"}
    </p>
    <p
      onClick={() => navigate(`/edit/${item._id}`)}
      className="bg-gray-500 text-white px-1 py-1 rounded-md text-center md:mx-auto sm:ml-auto md:col-start-5 sm:w-[35%] md:w-[100%] w-[50%] cursor-pointer hover:bg-gray-700"
    >
      Edit
    </p>
  </div>
);

export default Dashboard;
