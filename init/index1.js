const mongoose=require("mongoose");
const initData=require("./data.js");
const listing=require("../models/listing");
main().then(()=>{
    console.log("connected to db")

}).catch((err)=>{
    console.log("error"+err)

})
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderLust");

}
async function initDb(){
    await listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"698d978fabdc865a8c294f42"}));
    await listing.insertMany(initData.data);
}


initDb();

