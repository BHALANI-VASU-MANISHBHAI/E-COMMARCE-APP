import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import assets from '../assets/assets';

const Orders = ({ token }) => {
  const currency = "₹";

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);

  const [category, setCategory] = useState('All');
  const [subCategory, setSubCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [paymentStatus, setPaymentStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [openCategory, setOpenCategory] = useState(false);
  const [openSubCategory, setOpenSubCategory] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [openPaymentStatus, setOpenPaymentStatus] = useState(false);

  const fetchAllOrders = async () => {
    if (!token) return;

    try {
      const response = await axios.post(backendUrl + "/api/order/list", { k: "L" }, { headers: { token } });
      if (response.data.success) {
        setOrders(response.data.orders);
        setFilteredOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.log("Error fetching orders: ", err);
      toast.error("Error fetching orders");
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(backendUrl + "/api/order/status", { orderId, status: event.target.value }, { headers: { token } });
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (err) {
      console.log("Error updating order status: ", err);
      toast.error("Error updating order status");
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    if (category !== 'All') {
      filtered = filtered.filter(order =>
        order.items.some(item => item.category === category)
      );
    }

    if (subCategory !== 'All') {
      filtered = filtered.filter(order =>
        order.items.some(item => item.subCategory === subCategory)
      );
    }

    if (status !== 'All') {
      filtered = filtered.filter(order => order.status === status);
    }

    if (paymentStatus !== 'All') {
      filtered = filtered.filter(order =>
        (paymentStatus === 'pending' && !order.payment) ||
        (paymentStatus === 'success' && order.payment) ||
        (paymentStatus === 'failed' && false) // Assuming no failed payments unless you track it
      );
    }

    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(order =>
        order.items.some(item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    setFilteredOrders(filtered);
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  useEffect(() => {
    filterOrders();
  }, [category, subCategory, status, paymentStatus, searchQuery, orders]);

  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-4">Orders Page</h3>

      {/* Filters */}
      <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-gray-200 bg-gray-100 rounded-b-md">

        {/* Category Selector */}
        <div className="flex items-center gap-3">
          <p>Category</p>
          <div className="flex items-center gap-2 relative">
            <b>{category}</b>
            <img
              onClick={() => setOpenCategory(!openCategory)}
              src={assets.dropdown_icon}
              className={`h-3 w-2 cursor-pointer transform transition-transform duration-300 ${openCategory ? "rotate-90" : "rotate-0"}`}
              alt=""
            />
            {openCategory && (
              <div className="absolute top-6 left-4 bg-white shadow-lg rounded-md p-2 z-10 w-24">
                {["All", "Men", "Women", "Kids"].map(cat => (
                  <p
                    key={cat}
                    onClick={() => { setCategory(cat); setOpenCategory(false); }}
                    className="hover:bg-gray-300 hover:text-gray-800 cursor-pointer p-1 rounded-md"
                  >
                    {cat}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SubCategory Selector */}
        <div className="flex items-center gap-3">
          <p>SubCategory</p>
          <div className="flex items-center gap-2 relative">
            <b>{subCategory}</b>
            <img
              onClick={() => setOpenSubCategory(!openSubCategory)}
              src={assets.dropdown_icon}
              className={`h-3 w-2 cursor-pointer transform transition-transform duration-300 ${openSubCategory ? "rotate-90" : "rotate-0"}`}
              alt=""
            />
            {openSubCategory && (
              <div className="absolute top-6 left-4 bg-white shadow-lg rounded-md p-2 z-10 w-28">
                {["All", "Bottomwear", "Topwear", "Winterwear"].map(sub => (
                  <p
                    key={sub}
                    onClick={() => { setSubCategory(sub); setOpenSubCategory(false); }}
                    className="hover:bg-gray-300 hover:text-gray-800 cursor-pointer p-1 rounded-md"
                  >
                    {sub}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Status Selector */}
        <div className="flex items-center gap-3">
          <p>Status</p>
          <div className="flex items-center gap-2 relative">
            <b>{status}</b>
            <img
              onClick={() => setOpenStatus(!openStatus)}
              src={assets.dropdown_icon}
              className={`h-3 w-2 cursor-pointer transform transition-transform duration-300 ${openStatus ? "rotate-90" : "rotate-0"}`}
              alt=""
            />
            {openStatus && (
              <div className="absolute top-6 left-4 bg-white shadow-lg rounded-md p-2 z-10 w-32">
                {["All", "OrderPlaced", "Packing", "Shipped", "Out for delivery", "Delivered"].map(stat => (
  <p key={stat} onClick={() => { setStatus(stat); setOpenStatus(false); }}
    className="hover:bg-gray-300 hover:text-gray-800 cursor-pointer p-1 rounded-md">
    {stat}
  </p>
))}

              </div>
            )}
          </div>
        </div>

        {/* Payment Status Selector */}
        <div className="flex items-center gap-3">
          <p>Payment</p>
          <div className="flex items-center gap-2 relative">
            <b>{paymentStatus}</b>
            <img
              onClick={() => setOpenPaymentStatus(!openPaymentStatus)}
              src={assets.dropdown_icon}
              className={`h-3 w-2 cursor-pointer transform transition-transform duration-300 ${openPaymentStatus ? "rotate-90" : "rotate-0"}`}
              alt=""
            />
            {openPaymentStatus && (
              <div className="absolute top-6 left-4 bg-white shadow-lg rounded-md p-2 z-10 w-24">
                {["All", "pending", "success", "failed"].map(pay => (
                  <p
                    key={pay}
                    onClick={() => { setPaymentStatus(pay); setOpenPaymentStatus(false); }}
                    className="hover:bg-gray-300 hover:text-gray-800 cursor-pointer p-1 rounded-md"
                  >
                    {pay}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-2 flex gap-3 items-center relative sm:p-0 md:p-4">
          <img
            className="absolute w-4 left-6 top-1/2 transform -translate-y-1/2"
            src={assets.search_icon}
            alt="Search"
          />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border pl-10 pr-2 py-1 rounded-md md:w-64  sm:w-50" 
          />
        </div>

      </div>

      {/* Orders Display */}
      <div>
        {filteredOrders.map((order, index) => (
          <div key={index} className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-md text-gray-700">
            <img src={assets.parcel_icon} alt="" className="w-12 object-cover" />
            <div>
              <div>
                {order.items.map((item, idx) => (
                  <p className='py-0.5' key={idx}>
                    {item.name} X {item.quantity} <span>{item.size}</span>{idx !== order.items.length - 1 && ','}
                  </p>
                ))}
              </div>
              <p className='mt-3 mb-2 font-medium'>{order.address.firstName + " " + order.address.lastName}</p>
              <div>
                <p>{order.address.street + ","}</p>
                <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
              </div>
              <p>{order.address.phone}</p>
            </div>

            <div>
              <p className='text-sm sm:text-[15px]'>Items: {order.items.length}</p>
              <p className='mt-3'>Method: {order.paymentMethod}</p>
              <p>Payment: {order.payment ? 'Done' : 'Pending'}</p>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            </div>

            <p className='text-sm sm:text-[15px]'>{currency}{order.amount}</p>

            <select onChange={(event) => statusHandler(event, order._id)} value={order.status} className='p-2 font-semibold'>
              <option value="OrderPlaced">Order Placed</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
