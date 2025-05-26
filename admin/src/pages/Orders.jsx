import React from 'react'
import { useEffect,useState } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import assets from '../assets/assets';

const Orders = ({token}) => {
  const currency = "₹"; // Assuming currency is ₹, you can change it as needed
  const [orders , setOrders] = React.useState([]);

  const fetchAllOrders = async () => {
    if(!token) {
      return null;
    }
   

    try{
      const responce  = await axios.post(backendUrl+"/api/order/list",{}, {headers:{token}});

      if(responce.data.success){
        setOrders(responce.data.orders);
      }else{
        toast.error(responce.data.meassage);
      }
    }catch(err){
      console.log("Error fetching orders: ", err);
      toast.error("Error fetching orders");
    }

  }

  const statusHandler = async(event,orderId)=>{
     try{
      const responce = await axios.post(backendUrl+"/api/order/status",{orderId ,status:event.target.value},{headers:{token}});
      if(responce.data.success){
       await fetchAllOrders(); 
      }
    
     }catch(err){
      console.log("Error updating order status: ", err);
      toast.error(responce.data.meassage);
     }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [token])
  return (
    <div>
       <h3>Order Page</h3>
       <div>
        {
          orders.map((order, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr]   lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8  my-3 md:my-4 text-xs sm:text-md  text-gray-700 ">
              <img src={assets.parcel_icon} alt="" className="w-12  object-cover" />
              <div>

              <div>
                {order.items.map((item,index)=>{
                    if(index==order.items.length-1){
                      return <p  className='py-0.5' key ={index}> { item.name } X {item.quantity} <span>{item.size}</span> </p>
                    }else{
                      return <p  className='py-0.5' key ={index}> { item.name } X {item.quantity} <span>{item.size}</span> , </p>
                    }
                })}
              </div>
              <p className='mt-3 mb-2 font-medium'>{order.address.firstName+" "+order.address.lastName} </p>
              <div>
                 <p>{order.address.street+","}</p>
                  <p>{order.address.city+","+ order.address.state +", " +order.address.country+", "+order.address.zipcode}</p>
              </div>
              <p>{order.address.phone}</p>
            </div>
             <div>
                <p className='text-sm sm:text-[15px]' >Items : {order.items.length}</p>
                <p className='mt-3 ' >Method: {order.paymentMethod}</p>
                <p>Payment: { order.payment?'Done':'Pending'}</p>
                <p>Date: {new Date(order.date).toLocaleDateString()}</p>
             </div>   
              <p className='text-sm sm:text-[15px]'  >{currency}{order.amount}</p>
              <select onChange={(event)=>statusHandler(event,order._id)} value={order.status} className ='p-2 font-semibold' >
                <option value="OrderPlaced">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
          </div>   
          ))
        }
       </div>
    </div>
  )
}

export default Orders