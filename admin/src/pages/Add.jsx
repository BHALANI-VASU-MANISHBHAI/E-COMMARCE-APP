import React, { useEffect } from "react";
import assets from "../assets/assets.js";
import axios from "axios";
import { backendUrl } from "../App.jsx";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";

const Add = ({token}) => {

  const [image1, setImage1] = React.useState(null);
  const [image2, setImage2] = React.useState(null);
  const [image3, setImage3] = React.useState(null);
  const [image4, setImage4] = React.useState(null);


  const [name , setName] = React.useState("");
  const [description , setDescription] = React.useState("");
  const [price , setPrice] = React.useState("");
  const [category , setCategory] = React.useState("Men");
  const [subcategory , setSubcategory] = React.useState("Topwear");
  const [bestseller, setBestseller] = React.useState(false);
  const [sizes , setSizes] = React.useState([]);


  const onSubmitHandler = async (e) => {

    e.preventDefault();
    try {
      
      // FormData is a built-in JavaScript object that allows you to easily construct a set of key/value pairs representing form fields and their values.
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subcategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      image1  && formData.append("image1", image1);
      image2 &&formData.append("image2", image2);
      image3 &&formData.append("image3", image3);
      image4 &&formData.append("image4", image4);
   
     

      const url = backendUrl + "/api/product/add";

      const responce  = await axios.post(backendUrl +"/api/product/add", formData,{
        headers:{token}
      });


      if(responce.data.success){
        toast.success(responce.data.message);

        setImage1(null);
        setImage2(null);
        setImage3(null);
        setImage4(null);
        setName("");
        setDescription("");
        setPrice("");
        setCategory("Men");
        setSubcategory("Topwear");
        setBestseller(false);
        setSizes([]);
      }else{
        toast.error(responce.data.message);
      }
      
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };



  return (
<>
    <div className=" md:hidden flex  gap-2 mb-4 flex-col">
      <NavLink to="/add" className="flex gap-2 items-center border  py-2 px-2 max-w-100">
       <div className=" flex gap-2 items-center   ">   
        <img  className="w-5" src={assets.add_icon} alt="" />
        <h1 className="text-md font-bold">Add Item</h1>
       </div>
       </NavLink>
        <NavLink to="/list" className="flex gap-2 items-center border  py-2 px-2 max-w-100">
       <div className="  flex gap-2 items-center   ">   
        <img  className="w-5" src={assets.order_icon} alt="" />
        <h1 className="text-md font-bold">List Item</h1>
       </div>
       </NavLink><NavLink to="/order" className="flex gap-2 items-center border  py-2 px-2 max-w-100">
       <div className=" flex gap-2 items-center   ">   
        <img  className="w-5" src={assets.order_icon} alt="" />
        <h1 className="text-md font-bold"> Order Item</h1>
       </div>
       </NavLink>
      
    </div>

    <form onSubmit={onSubmitHandler}   className="flex flex-col w-full items-start  gap-3">
      <div>
        <p className="mb-2">Upload Image</p>
        <div className="flex gap-2">
          {/* htmlFor  should match with id*/}
          {/* When you click the label (or anything inside it), it focuses or activates the associated input. */}
            <label htmlFor="image1">
              <img className="w-20"  src={!image1?assets.upload_area:URL.createObjectURL(image1)  } alt="" />
              <input onChange={(e)=>setImage1(e.target.files[0])} type="file" id="image1" hidden />
            </label>

          <label htmlFor="image2">
            <img className="w-20"  src={!image2?assets.upload_area:URL.createObjectURL(image2) } alt="" />
            <input onChange={(e)=>setImage2(e.target.files[0])} type="file" id="image2" hidden />
          </label>

          <label htmlFor="image3">
            <img className="w-20"  src={!image3?assets.upload_area:URL.createObjectURL(image3) } alt="" />
            <input  onChange={(e)=>setImage3(e.target.files[0])}type="file" id="image3" hidden />
          </label>

          <label htmlFor="image4">
            <img className="w-20"  src={!image4?assets.upload_area:URL.createObjectURL(image4) } alt="" />
            <input onChange={(e)=>setImage4(e.target.files[0])} type="file" id="image4" hidden />
          </label>
        </div>
      </div>

      <div className="w-full "> 
        <p className="mb-2">Product Name</p>
        <input onChange={(e)=>setName(e.target.value)}  value={name} className="w-full max-w-[500px] px-3 py-2"  type="text"  placeholder="Type here "  required/>
      </div>
      <div className="w-full "> 
        <p className="mb-2">Product description</p>
        <input  onChange={(e)=>setDescription(e.target.value)} value={description}  className="w-full max-w-[500px] px-3 py-2"  type="text"  placeholder="Write Content here"  required/>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8 ">
           <div>
             <p className="mb-2">Product category</p>
             <select  onChange={(e)=>setCategory(e.target.value)}   className="w-full px-3 py-2 " name="categery" id="">
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
             </select>
           </div>

           <div>
             <p className="mb-2 ">Sub category</p>
             <select  onChange={(e)=>setSubcategory(e.target.value)}  className="w-full px-3 py-2 " name="subCategory" id="">
                <option value="Topwear">Topwear</option>
                <option value="Bottomwear">Bottomwear</option>
                <option value="Winterwear">Winterwear</option>
             </select>
           </div>

           <div>
             <p className="mb-2 ">Product Price</p>
             <input onChange={(e)=>setPrice(e.target.value)}  className="w-full px-3 py-1 sm:w-[120px]"   type="number" placeholder="25"/>
           </div>
      </div>

      <div> 
          <p className="mb-2">Product Sizes</p>
          <div className="flex gap-3">
            <div onClick ={()=> setSizes(  (prev) => prev.includes("S") ?  prev.filter((sizess)=>sizess!=="S" ) :  [...prev,"S"] ) }   >
               <p  className={`px-3 py-1 cursor-pointer  rounded   ${sizes.includes("S") ? 'bg-pink-500  text-white'  : 'bg-slate-200 text-black'} `}>S</p>
            </div>

            <div onClick ={()=> setSizes(  (prev) => prev.includes("M") ?  prev.filter((sizess)=>sizess!=="M") :  [...prev,"M"] ) }>
               <p  className={`px-3 py-1 cursor-pointer  rounded   ${sizes.includes("M") ? 'bg-pink-500 text-white'  : 'bg-slate-200 text-black'} `}>M</p>
            </div>

            <div onClick ={()=> setSizes(  (prev) => prev.includes("L") ?  prev.filter((sizess)=>sizess!=="L") :  [...prev,"L"] ) }>
               <p  className={`px-3 py-1 cursor-pointer  rounded   ${sizes.includes("L") ? 'bg-pink-500  text-white ' : 'bg-slate-200 text-black'} `}>L</p>
            </div>

            <div onClick ={()=> setSizes(  (prev) => prev.includes("XL") ?  prev.filter((sizess)=>sizess!=="XL") :  [...prev,"XL"] ) }>
               <p  className={`px-3 py-1 cursor-pointer  rounded   ${sizes.includes("XL") ? 'bg-pink-500 text-white'  : 'bg-slate-200 text-black'} `}>XL</p>
            </div>
            <div onClick ={()=> setSizes(  (prev) => prev.includes("XXL") ?  prev.filter((sizess)=>sizess!=="XXL") :  [...prev,"XXL"] )  }   >
               <p  className={`px-3 py-1 cursor-pointer  rounded   ${sizes.includes("XXL") ? 'bg-pink-500 text-white'  : 'bg-slate-200 text-black'} `}>XXL</p>
            </div>
          </div>
      </div>

      <div   className="flex gap-2 mt-2">
        {/* checked useful for UI rendering */}
        <input   onChange={() => setBestseller(prev => !prev)}  type="checkbox" id='bestseller' checked ={bestseller} />
        <label className="cursor-pointer" htmlFor="bestseller">Add to bestseller</label>
      </div>

      <button type="submit" className="w-28 py-3 mt-4 bg-black text-white ">ADD</button>

    </form>
    </>
  );
};

export default Add;