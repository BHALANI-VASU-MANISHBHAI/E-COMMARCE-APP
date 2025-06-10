import React, { useEffect, useState } from "react";
import { backendUrl } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true); // Shimmer loading state
  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      const url = backendUrl + "/api/product/list";
      const responce = await axios.get(url);

      if (responce.data.success) {
        setList(responce.data.products);
      } else {
        toast.error(responce.data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false); // Stop loading in all cases
    }
  };

  const removeProduct = async (id) => {
    try {
      const url = backendUrl + "/api/product/remove/";
      const responce = await axios.post(url, { id }, {
        headers: { token }
      });

      if (responce.data.success) {
        toast.success(responce.data.message);
        await fetchList();
      } else {
        toast.error(responce.data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const shimmerLoader = () => {
    return (
      Array(10).fill(0).map((_, index) => (
        <div key={index} className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] gap-2 py-1 px-2 border text-sm items-center animate-pulse">
          <div className="w-20 h-16 bg-gray-300 rounded-md"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4 hidden md:block"></div>
          <div className="h-6 bg-gray-300 rounded md:mx-auto sm:ml-auto md:col-start-5 sm:w-[35%] md:w-[100%] w-[50%]"></div>
          <div className="h-6 bg-gray-300 rounded  md:mx-auto sm:ml-auto md:col-start-5 sm:w-[100%] w-[100%] md:hidden"></div>
        </div>
      ))
    );
  };

  return (
    <>
      <p className="mb-2">All Products List</p>
      <div className="flex flex-col gap-2">
        {/* Header */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] bg-gray-100 items-center py-1 px-2 border text-sm ">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>

        {/* Shimmer while loading */}
        {loading ? shimmerLoader() : list.map((item, index) => (
          <div className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] gap-2 py-1 px-2 border text-sm items-center " key={index}>
            <img className="w-20" src={item.image[0]} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p> ₹{item.price}</p>
            <p className="text-right md:text-center cursor-pointer text-lg hidden md:block" onClick={() => removeProduct(item._id)}>X</p>

            {/* Edit Button */}
            <p
              onClick={() => navigate(`/edit/${item._id}`)}
              className="bg-gray-500 text-white px-1 py-1 rounded-md text-center md:mx-auto sm:ml-auto md:col-start-5 sm:w-[35%] md:w-[100%] w-[50%] cursor-pointer hover:bg-gray-700"
            >
              Edit
            </p>

            {/* Remove Button for Small Screen */}
            <p
              onClick={() => removeProduct(item._id)}
              className="bg-gray-500 text-white px-1 py-1 rounded-md text-center md:mx-auto sm:ml-auto md:col-start-5 sm:w-[100%] w-[100%] cursor-pointer hover:bg-gray-700 md:hidden"
            >
              Remove
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default List;
