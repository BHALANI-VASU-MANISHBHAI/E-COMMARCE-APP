    import React, { useEffect } from "react";
    import assets from "../assets/assets.js";
    import axios from "axios";
    import { backendUrl } from "../App.jsx";
    import { toast } from "react-toastify";
    import { NavLink, useParams } from "react-router-dom";
    import { useNavigate } from "react-router-dom";
    const Edit = ({ token }) => {
    const { id } = useParams();
    const [image1, setImage1] = React.useState(null);
    const [image2, setImage2] = React.useState(null);
    const [image3, setImage3] = React.useState(null);
    const [image4, setImage4] = React.useState(null);

    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [price, setPrice] = React.useState("");
    const [category, setCategory] = React.useState("Men");
    const [subcategory, setSubcategory] = React.useState("Topwear");
    const [bestseller, setBestseller] = React.useState(false);
    const [sizes, setSizes] = React.useState([]);
    const [updating, setUpdating] = React.useState(false);
    const [success, setSuccess] = React.useState(false);


    const Navigate = useNavigate();
     const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if(updating) return;
      
      // Check if at least one image exists (either new or existing)
      const hasImages = [image1, image2, image3, image4].some(
        img => img !== null && img !== undefined
      );
      
      if(!hasImages) {
        toast.error("Please upload at least one image");
        return;
      }

      setUpdating(true);
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subcategory);
      formData.append("bestseller", bestseller ? 'true' : 'false');
      formData.append("sizes", JSON.stringify(sizes));

      // Compress and append new images, or keep existing ones
      const compressedImages = await Promise.all([
        image1 && typeof image1 !== "string" ? compressImage(image1) : null,
        image2 && typeof image2 !== "string" ? compressImage(image2) : null,
        image3 && typeof image3 !== "string" ? compressImage(image3) : null,
        image4 && typeof image4 !== "string" ? compressImage(image4) : null
      ]);

      // Handle image1
      if (compressedImages[0]) {
        formData.append("image1", compressedImages[0]);
      } else if (typeof image1 === "string") {
        formData.append("imageUrl1", image1);
      }

      // Handle image2
      if (compressedImages[1]) {
        formData.append("image2", compressedImages[1]);
      } else if (typeof image2 === "string") {
        formData.append("imageUrl2", image2);
      }

      // Handle image3
      if (compressedImages[2]) {
        formData.append("image3", compressedImages[2]);
      } else if (typeof image3 === "string") {
        formData.append("imageUrl3", image3);
      }

      // Handle image4
      if (compressedImages[3]) {
        formData.append("image4", compressedImages[3]);
      } else if (typeof image4 === "string") {
        formData.append("imageUrl4", image4);
      }

      const response = await axios.post(
        backendUrl + "/api/product/update/" + id,
        formData,
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        setUpdating(false);  
        setSuccess(true);
        toast.success(response.data.message);
        setTimeout(() => {
          Navigate("/list");
        }, 1000);
      } else {
        setUpdating(false);
        toast.error(response.data.message);
      }
    } catch (err) {
      setUpdating(false);
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  const setProductDatafun = (productData) => {
    // set images
    if (productData.image && productData.image.length > 0) {
      if (productData.image[0]) setImage1(productData.image[0]);
      if (productData.image[1]) setImage2(productData.image[1]);
      if (productData.image[2]) setImage3(productData.image[2]);
      if (productData.image[3]) setImage4(productData.image[3]);
    }

    // set other data
    setName(productData.name);
    setDescription(productData.description);
    setPrice(productData.price);
    setCategory(productData.category);
    setSubcategory(productData.subCategory);
    setBestseller(productData.bestseller);
    setSizes(productData.sizes || []);
  };

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        backendUrl + "/api/product/single/" + id,
        {}
      );

      if (response.data.success) {
        setProductDatafun(response.data.product);
      } else {
        console.log(response.data.message);
        toast.error(response.data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong while fetching product data");
    }
  };


    useEffect(() => {
        fetchProduct();
    }, [id]);

    return (
        <>

        <form
            onSubmit={onSubmitHandler}
            className="flex flex-col w-full items-start  gap-3"
        >
            <div>
            <p className="mb-2">Upload Image</p>
            <div className="flex gap-2">
                {/* htmlFor  should match with id*/}
                {/* When you click the label (or anything inside it), it focuses or activates the associated input. */}
                <label htmlFor="image1">
                <img
                    className="w-20"
                    src={
                    !image1
                        ? assets.upload_area
                        : typeof image1 === "string"
                        ? image1
                        : URL.createObjectURL(image1)
                    }
                    alt=""
                />

                <input
                    onChange={(e) => setImage1(e.target.files[0])}
                    type="file"
                    id="image1"
                    hidden
                />
                </label>

                <label htmlFor="image2">
                <img
                    className="w-20"
                    src={
                    !image2
                        ? assets.upload_area
                        : typeof image2 === "string"
                        ? image2
                        : URL.createObjectURL(image2)
                    }
                    alt=""
                />
                <input
                    onChange={(e) => setImage2(e.target.files[0])}
                    type="file"
                    id="image2"
                    hidden
                />
                </label>

                <label htmlFor="image3">
                <img
                    className="w-20"
                    src={
                    !image3
                        ? assets.upload_area
                        : typeof image3 === "string"
                        ? image3
                        : URL.createObjectURL(image3)
                    }
                    alt=""
                />
                <input
                    onChange={(e) => setImage3(e.target.files[0])}
                    type="file"
                    id="image3"
                    hidden
                />
                </label>

                <label htmlFor="image4">
                <img
                    className="w-20"
                    src={
                    !image4
                        ? assets.upload_area
                        : typeof image4 === "string"
                        ? image4
                        : URL.createObjectURL(image4)
                    }
                    alt=""
                />
                <input
                    onChange={(e) => setImage4(e.target.files[0])}
                    type="file"
                    id="image4"
                    hidden
                />
                </label>
            </div>
            </div>

            <div className="w-full ">
            <p className="mb-2">Product Name</p>
            <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="w-full max-w-[500px] px-3 py-2"
                type="text"
                placeholder="Type here "
                required
            />
            </div>
            <div className="w-full ">
            <p className="mb-2">Product description</p>
            <input
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                className="w-full max-w-[500px] px-3 py-2"
                type="text"
                placeholder="Write Content here"
                required
            />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8 ">
            <div>
                <p className="mb-2">Product category</p>
                <select
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 "
                name="categery"
                id=""
                >
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
                </select>
            </div>

            <div>
                <p className="mb-2 ">Sub category</p>
                <select
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full px-3 py-2 "
                name="subCategory"
                id=""
                >
                <option value="Topwear">Topwear</option>
                <option value="Bottomwear">Bottomwear</option>
                <option value="Winterwear">Winterwear</option>
                </select>
            </div>

            <div>
                <p className="mb-2 ">Product Price</p>
                <input
                onChange={(e) => setPrice(e.target.value)}
                value={price}
                className="w-full px-3 py-1 sm:w-[120px]"
                type="number"
                placeholder="25"
                />
            </div>
            </div>

            <div>
            <p className="mb-2">Product Sizes</p>
            <div className="flex gap-3">
                <div
                onClick={() =>
                    setSizes((prev) =>
                    prev.includes("S")
                        ? prev.filter((sizess) => sizess !== "S")
                        : [...prev, "S"]
                    )
                }
                >
                <p
                    className={`px-3 py-1 cursor-pointer  rounded   ${
                    sizes.includes("S")
                        ? "bg-pink-500  text-white"
                        : "bg-slate-200 text-black"
                    } `}
                >
                    S
                </p>
                </div>

                <div
                onClick={() =>
                    setSizes((prev) =>
                    prev.includes("M")
                        ? prev.filter((sizess) => sizess !== "M")
                        : [...prev, "M"]
                    )
                }
                >
                <p
                    className={`px-3 py-1 cursor-pointer  rounded   ${
                    sizes.includes("M")
                        ? "bg-pink-500 text-white"
                        : "bg-slate-200 text-black"
                    } `}
                >
                    M
                </p>
                </div>

                <div
                onClick={() =>
                    setSizes((prev) =>
                    prev.includes("L")
                        ? prev.filter((sizess) => sizess !== "L")
                        : [...prev, "L"]
                    )
                }
                >
                <p
                    className={`px-3 py-1 cursor-pointer  rounded   ${
                    sizes.includes("L")
                        ? "bg-pink-500  text-white "
                        : "bg-slate-200 text-black"
                    } `}
                >
                    L
                </p>
                </div>

                <div
                onClick={() =>
                    setSizes((prev) =>
                    prev.includes("XL")
                        ? prev.filter((sizess) => sizess !== "XL")
                        : [...prev, "XL"]
                    )
                }
                >
                <p
                    className={`px-3 py-1 cursor-pointer  rounded   ${
                    sizes.includes("XL")
                        ? "bg-pink-500 text-white"
                        : "bg-slate-200 text-black"
                    } `}
                >
                    XL
                </p>
                </div>
                <div
                onClick={() =>
                    setSizes((prev) =>
                    prev.includes("XXL")
                        ? prev.filter((sizess) => sizess !== "XXL")
                        : [...prev, "XXL"]
                    )
                }
                >
                <p
                    className={`px-3 py-1 cursor-pointer  rounded   ${
                    sizes.includes("XXL")
                        ? "bg-pink-500 text-white"
                        : "bg-slate-200 text-black"
                    } `}
                >
                    XXL
                </p>
                </div>
            </div>
            </div>

            <div className="flex gap-2 mt-2">
            {/* checked useful for UI rendering */}
            <input
                onChange={() => setBestseller((prev) => !prev)}
                type="checkbox"
                id="bestseller"
                checked={bestseller}
                
            />
            <label className="cursor-pointer" htmlFor="bestseller">
                Add to bestseller
            </label>
            </div>

            <button 
    type="submit" 
    className={`w-28 py-3 mt-4 ${updating ? 'bg-gray-400 cursor-not-allowed' : 'bg-black'} text-white`} 
    disabled={updating}
    >
    {updating ? "Updating..." : "Update Product"}
    </button>

        </form>
        </>
    );
    };

    export default Edit;
