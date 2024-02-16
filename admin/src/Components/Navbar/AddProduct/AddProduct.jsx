import React, { useState } from 'react'
import './AddProduct.css'
import upload_area from '../../../Assets/upload_area.svg'
const AddProduct = () => {
    const [image, setimage] = useState(false);
    const [productDetails, setproductDetails] = useState({
        name: "",
        image: "",
        category: "women",
        new_price: "",
        old_price: "",
    });

    const imageHandler = (e) => {
        setimage(e.target.files[0]);
    };

    const changeHandler = (e) => {
        setproductDetails({ ...productDetails, [e.target.name]: e.target.value });
    };

    const Add_Product = async () => {
        // try {
        //     const formData = new FormData();
        //     formData.append('product', image);
    
        //     const response = await fetch('http://localhost:4000/upload', {
        //         method: 'post',
        //         body: formData,
        //     });

        //     const responseData = await response.json();

        //     // console.log(typeof responseData.sucess)
    
        //     if (responseData.sucess) {
        //         setproductDetails({ ...productDetails, image: responseData.image_url });
        //     } else {
        //         console.error("Image upload failed:", responseData.error_message);
        //     }
    
        //     // console.log(productDetails);
        // } catch (error) {
        //     console.error("Error during image upload:", error.message);
        // }}
    let responsedata
    let product=productDetails;
    let formData = new FormData();  // to send the data of form to backend or database 
    formData.append('product', image);

    await fetch('http://localhost:4000/upload', {
        method: 'post',
        headers: {
            Accept: 'application/json',
        },
        body: formData,
    })
    .then((resp) => 
    resp.json())
    .then((data) => {responsedata = data})

   
    if (responsedata.sucess) {
        // Use the setproductDetails function to update the state
        setproductDetails({ ...productDetails, image: responsedata.image_url });  
        product.image=responsedata.image_url;
        await fetch('http://localhost:4000/addproduct',{
            method:'post',
            headers:{
                Accept:'application/json',
                'Content-Type':'application/json',
            },
            body:JSON.stringify(product),
        }).then((resp)=>resp.json()).then((data)=>{
            data.success?alert("Product Added"):alert("Failed")
        })

    }
    console.log(productDetails);
    }
    
    console.log(image);
    return (
    <div className='add-product'>

       

        <div className="addproduct-itemfield">
            <p>Product title</p>
            <input type="text" value={productDetails.name} onChange={changeHandler} name='name' placeholder='Type here' />
        </div>
        <div className="addproduct-price">
            <div className="addproduct-itemfield">
                <p>Price</p>
                <input type="text" value={productDetails.old_price} onChange={changeHandler} name="old_price" placeholder='Type here'/>
            </div>
            <div className="addproduct-itemfield">
                <p>Offer Price</p>
                <input type="text" value={productDetails.new_price} onChange={changeHandler} name="new_price" placeholder='Type here'/>
            </div>
        </div>

        <div className="addproduct-itemfield">
            <p>Product Category</p>
            <select value={productDetails.category} onChange={changeHandler} name="" className='add-product-selector'>
                <option value="women">Women</option>
                <option value="women">Men</option>
                <option value="women">Kids</option>
            </select>
        </div>
        <div className="addproduct-itemfield">
            <label htmlFor="file-input">
                <img src={image?URL.createObjectURL(image):upload_area} className='addproduct-thumbnail-img' alt="" />
            </label>
            <input onChange={imageHandler} type="file" name='image' id='file-input' hidden/>
        </div>
        <button onClick={()=>{Add_Product()}} className='addproduct-btn'>ADD</button>
    </div>
  )
}
//6.51.47
export default AddProduct


