const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
// const upload = multer({dest:'./uploads/images'})
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());

// Database connection with MongoDB
mongoose.connect("mongodb+srv://amipkr7:prashant123@cluster0.f4f6ygm.mongodb.net/ecommerce");

// API creation
app.get("/", (req, res) => {
    res.send("Express app is running");
});

app.listen(port, (err) => {
    if (!err) {
        console.log("Server running on port " + port);
    } else {
        console.log("There is an error: " + err);
    }
});

//image store engine

const storage=multer.diskStorage({
    destination:'./upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload=multer({storage:storage})

//creating upload endpoint for images
app.use('images',express.static('upload/images'))
app.post("/upload",upload.single('product'),(req,res,next)=>{
      res.json({
        sucess:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
      })
})

//Schema for creating products...

const Product=mongoose.model("Product",{
    id:{
        type:Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:String,
        required:true,
    },
    date:{
        type:String,
        default:Date.now,
    },
    available:{
        type:Boolean,
        default:true,
    } 
    
})


//to add a product in database...
app.post("/addproduct",async(req,res)=>{
    let products=await Product.find({});
    let id;
    if(products.length>0)
    {
        let last_product_array=products.slice(-1);
        let last_product=last_product_array[0];
        id=last_product.id+1;
    }
    else{
        id=1;
    }
    const product=new Product({
        id:id+1,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
        date:req.body.date,
        available:req.body.available
    });
    console.log(product);
    await product.save();
    console.log("saved");
    res.json({
        success:true,
        name:req.body.name,
    })
})

//creating api for deleting products...

app.post('/removeproduct',async(req,res)=>{
 await Product.findOneAndDelete({id:req.body.id});
 console.log("Removed");
 res.json({
    success:true,
    name:req.body.name
 })
})

//Creating api for getting all products...

app.get('/allproducts',async(req,res)=>{
    let products=await Product.find({})
    console.log("All products fetched");
    res.send(products);
})

const Users=mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,

    },
    date:{
        type:Date,
        default:Date.now,
    }

})

app.post('/signup',async(req,res)=>{


    let check=await Users.findOne({email:req.body.email});
    if(check)
    {
        return res.status(400).json({success:false,errors:"existing user found with same address"});
    }
    let cart={};
    for(let i=0;i<300;i++)
    {
        cart[i]=0;
    }

    const user=new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })
    await user.save();

    const data={
        user:{
            id:user.id
        }
    }

    const token=jwt.sign(data,'secret_ecom');
    res.json({success:true,token})
})

//creating endpoint for user login

app.post('/login',async (req,res)=>{
    let user = await Users.findOne({email:req.body.email});
    if(user)
    {
        const passCompare=req.body.password===user.password;

        if(passCompare)
        {
            const data={
                user:{
                    id:user.id
                   }
            }
            const token=jwt.sign(data,'secret_ecom');
            res.json({success:true,token});
        }
        else
        {
            res.json({success:false, errors:"Wrong Password"});
        }
    }
    else
    {
        res.json({success:false,errors:"Wrong email Id" })
    }
})