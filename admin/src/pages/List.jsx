import React, { use } from "react";
import { useEffect, useState } from "react";
import { backendUrl } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
const List = () => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const url = backendUrl + "/api/product/list";
      const responce = await axios.get(url);
      console.log(responce);

      if (responce.data.success) {
        setList(responce.data.products);
        console.log(responce.data.products);
        console.log("Product list fetched successfully");

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

    return (
      <>
        <p className="mb-2">All Products List</p>
        <div className="flex flex-col gap-2">
          {/* List of products */}
          <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr]  bg-gray-100 items-center py-1 px-2 border  text-sm ">
            <b>Image</b>
            <b>Name</b>
            <b>Category</b>
            <b>Price</b>
            <b className="text-center">Action</b>
          </div>

          {
            list.map((item,index)=>{
              console.log(item);
              return (
              <div   className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr ]"  key={index}>
                <img src={item.image[0]} alt="" />
                <p>{item.name}</p>
                <p>{item.category}</p>
                <p >$ {item.price}</p>
                <p className="text-right md:text-center cursor-pointer text-lg">X</p>
              </div>
              )
            })
          }
        </div>
      </>
    );
  
};

export default List;
