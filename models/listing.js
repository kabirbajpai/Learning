const mongoose=require("mongoose");
const review = require("./review.js");

const Schema=mongoose.Schema;
const listingSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        filename:String,
        url:{
            type:String,
            default:"https://images.unsplash.com/photo-1768205250679-37ce763e98c4?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            set:(v)=>v===""?"https://images.unsplash.com/photo-1768205250679-37ce763e98c4?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v
           
        }

        
        

    },
 
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
            

        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"user"
    }

        

});

listingSchema.post("findOneAndDelete",async(data)=>{
    if(data){
        await review.deleteMany({_id:{$in:data.reviews}});
        
    }
    
})
let listing=mongoose.model("listing",listingSchema);
module.exports=listing;