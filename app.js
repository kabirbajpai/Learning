if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
    
}





console.log(process.env.ATLASDB_URL);
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const review = require("./models/review.js");
const { resourceUsage } = require("process");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require('connect-mongo').default;


const flash = require("connect-flash");
const user = require("./models/user.js");
const passport = require("passport");
const localStrategy = require("passport-local");
const { register } = require("module");

app.engine("ejs", ejsMate);


// const store = MongoStore.create({
//     mongoUrl:"mongodb+srv://bajpaikabir364_db_user:4QUUoHPXVqD2oFCA@cluster0.qvajfyf.mongodb.net/?appName=Cluster0",
//     crypto:{
//         secret:"mysupersecretcode",

//     },
//     touchAfter:24*3600,
    
// })

// store.on("error",(err)=>{
//     console.log("error in mongo session store",err);
// });

const dbUrl=process.env.ATLASDB_URL;


const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto:{
        secret:process.env.SECRET,

    },
    touchAfter:24*3600,
})

store.on("error",(err)=>{
    console.log("Error in mongo session store",err);
})

const sessionOptions = {
    store:store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },


};









app.listen(8080, () => {
    console.log("server started")
})
app.use(cookieParser());
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

main().then(() => {
    console.log("connected to db")

}).catch((err) => {
    console.log("error" + err)

})

async function main() {
    await mongoose.connect(dbUrl);

}
app.use((req, res, next) => {




    res.locals.success = req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    // res.locals.added = req.session.added;
    // res.locals.updated = req.session.updated;
    // res.locals.deletedCount = req.session.deletedCount;
    // res.locals.addReview = req.session.addReview;
    // res.locals.reviewDeleted = req.session.reviewDeleted;



    next();

})
app.get("/getCookies", (req, res) => {
    res.cookie("konnichiwa", "kabir");
    res.cookie("hajimemashite", "welcome to japan kabir");
    res.cookie("name", "kabir");
    res.send("cookies added");
})



// app.get("/demoUser", async (req, res) => {
//     let newUser1 = new user({
//         username: "ankushkabir2",
//         email: "kabir@gmail.com",

//     })

//     let registeredUser = await user.register(newUser1, "helloWorld");
//     console.log(registeredUser);
//     res.send(registeredUser);

// })

app.get("/signUp", (req, res) => {
    res.render("users/signUp");
})

app.post("/signUp", async (req, res,next) => {

    try {
        let username = req.body.username;
        let email = req.body.email;
        let password = req.body.password;

        let newUser2 = new user({
            email: email,
            username: username,

        })

        let registeredUser2 = await user.register(newUser2, password);
        console.log(registeredUser2);
        req.login(registeredUser2,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","logged in");
             res.redirect("/listings");

        })

       

    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signUp");
    }





})

app.get("/login",(req,res)=>{
    res.render("users/login");
})

app.post("/login",
    savedUrl,
    passport.authenticate("local",
    {failureRedirect:"/login",failureFlash:true})
,   async (req,res)=>{
    req.flash("success","log in successfull");
    let destination=res.locals.redirectUrl || "/listings";
    delete req.session.returnTo;
    res.redirect(destination);


})

app.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","logged out");
        res.redirect("/listings");
    })
})



app.get("/listings", async (req, res, next) => {
    try {
        let allListing = await listing.find({});
        res.render("listings/index", { allListing });

    } catch (err) {
        next(err);
    }




})

function isLoggedIn(req,res,next){
    console.log(req.user);
    if(!req.isAuthenticated()){
        if(req.method==="GET"){
            req.session.returnTo=req.originalUrl;

        }
        
        req.flash("error","please login first");
        return res.redirect("/login");

    }
    next();
}

function savedUrl(req,res,next){
    if(req.session.returnTo){
        res.locals.redirectUrl=req.session.returnTo;
    }
    next();
};
app.get("/listings/new",isLoggedIn, (req, res) => {
    res.render("listings/new");

    
})

app.post("/listings",isLoggedIn, async (req, res, next) => {


    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return next(new expressError(400, "please send the request body"));
        }
        if (!req.body.title) {
            throw new expressError(400, "title is  required");
        }
        if (!req.body.description) {
            throw new expressError(400, "description is required");
        }
        if (!req.body.price) {
            throw new expressError(400, "price is required ");
        }
        if (!req.body.location) {
            throw new expressError(400, "field location is required");
        }
        if (!req.body.country) {
            throw new expressError(400, "field country is required");
        }

        let title = req.body.title;
        let description = req.body.description;
        let image = req.body.image.url;
        let price = req.body.price;
        let location = req.body.location;
        let country = req.body.country;
        let newlisting = new listing({
            title: title,
            description: description,
            image: image,
            price: price,
            location: location,
            country: country,
            owner:req.user._id
        })
        await newlisting.save()
        
        if (!req.session.added) {
            req.session.added = 0;
        }

        req.session.added += 1;
        console.log(req.body);
        req.flash("success", `${req.session.added} listing${req.session.added > 1 ? "s" : ""} added successfully!`);
        res.redirect("/listings");

    } catch (err) {
        next(err);

    }

})

app.get("/listings/:id", async (req, res, next) => {
    try {
        let id = req.params.id;
        let list = await listing.findById(id).populate({path:"reviews",populate:{
            path:"author",
        }}).populate("owner");
        if(!list){
            req.flash("error"," listing does not exist !");
            return res.redirect("/listings");
        }
        console.log(list);
        res.render("listings/show", { list });

    } catch (err) {
        next(err);
    }



})

async function isOwner(req,res,next){
    let id = req.params.id;
    let foundlisting = await listing.findById(id);

    if(!foundlisting || !foundlisting.owner.equals(req.user._id)){
        req.flash("error","access denied , only owner have permission to make changes "); // for admin login change isOwner function req.user.role!==admin
        return res.redirect("/listings/" + id);
    }
    next();


    
}


app.get("/listings/:id/edit", isLoggedIn,isOwner,async (req, res, next) => {
    try {
        let id = req.params.id;
        let user = await listing.findById(id);
        res.render("listings/edit", { user });

    } catch (err) {
        next(err);
    }



})

app.put("/listings/:id",isLoggedIn, isOwner,async (req, res, next) => {



    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return next(new expressError(400, "please send the request body"))
        }
        if (!req.body.title) {
            throw new expressError(400, "title is  required");
        }
        if (!req.body.description) {
            throw new expressError(400, "description is required");
        }
        if (!req.body.price) {
            throw new expressError(400, "price is required ");
        }
        if (!req.body.location) {
            throw new expressError(400, "field location is required");
        }
        if (!req.body.country) {
            throw new expressError(400, "field country is required");
        }
        let id = req.params.id;
        let title = req.body.title;
        let description = req.body.description;
        let image = req.body.image;
        let price = req.body.price;
        let location = req.body.location;
        let country = req.body.country;
        await listing.findByIdAndUpdate(
            id,
            {
                title: title,
                description: description,
                image: image,
                price: price,
                location: location,
                country: country

            },
            { new: true }

        );
        if (!req.session.updated) {
            req.session.updated = 0;
        }

        req.session.updated += 1;
        req.flash("success", `${req.session.updated} listing${req.session.updated > 1 ? "s" : ""} updated !`);

        res.redirect("/listings/" + id);


    } catch (err) {
        next(err);
    }





})
app.delete("/listings/:id",isLoggedIn, isOwner,async (req, res, next) => {
    try {
        let id = req.params.id;
        if (!req.session.deletedCount) {
            req.session.deletedCount = 0;

        }


        let deleted = await listing.findByIdAndDelete(id);
        if (!req.session.deletedCount) {
            req.session.deletedCount = 0;

        }
        if (deleted) {
            req.session.deletedCount += 1;
        }
        console.log(deleted);
        req.flash("success", `${req.session.deletedCount} Listing${req.session.deletedCount > 1 ? "s" : ""} deleted!`)
        res.redirect("/listings");

    } catch (err) {
        next(err);
    }

})

app.post("/listings/:id/reviews",isLoggedIn, async (req, res, next) => {



    try {
        if (!req.body || Object.keys(req.body).length == 0) {
            throw new expressError(400, "please fill the required fields")

        }

        if (!req.body.rating || req.body.rating === undefined || req.body.rating === "") {
            throw new expressError(400, " field rating is required")
        }
        if (!req.body.comment) {
            throw new expressError(400, "field comment is required");
        }
        let id = req.params.id;
        let Listing = await listing.findById(id);
        let newReview = new review({
            rating: Number(req.body.rating),
            comment: req.body.comment,
            author:req.user._id,


        })

        Listing.reviews.push(newReview._id);
        await newReview.save();
        await Listing.save();
        if (!req.session.addReview) {
            req.session.addReview = 0;
        }

        req.session.addReview += 1;
        req.flash("success", `${req.session.addReview} review${req.session.addReview > 1 ? "s" : ""} added !`)
        res.redirect(`/listings/${id}`);

    } catch (err) {
        next(err);
    }






}

)

async function isAuthor(req,res,next){
    let reviewId = req.params.reviewId;
    let id=req.params.id;
    let user = await review.findById(reviewId);
    if(!user || !user.author.equals(req.user._id)){
        req.flash("error","access denied, only author can delete their review");
        return res.redirect(`/listings/${id}`);
        


    }
    next();

}

app.delete("/listings/:id/reviews/:reviewId",isLoggedIn,isAuthor, async (req, res) => {
    let id = req.params.id;
    let reviewId = req.params.reviewId;
    // for(let i=0;i<listing.reviews.length;i++){
    //     if(listing.reviews[i].toString()===reviewId){
    //         listing.reviews.splice(1,i);
    //         break;

    //     }
    // }
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });



    await review.findByIdAndDelete(reviewId);
    if (!req.session.reviewDeleted) {
        req.session.reviewDeleted = 0;
    }

    req.session.reviewDeleted += 1;
    req.flash("success", `${req.session.reviewDeleted} review${req.session.reviewDeleted > 1 ? "s" : ""} deleted !`);
    res.redirect(`/listings/${id}`);
})

app.all(/.*/, (req, res, next) => {
    next(new expressError(404, "page not found"))
});
app.use((err, req, res, next) => {

    if(res.headersSent){
        return next(err);
    }
    let status = err.status || 500;
    let message = err.message || "something went wrong";
    res.status(status).render("./listings/error.ejs", { err });


})



//server side validation
//  const requiredFields = ["title", "description", "price", "location", "country"];
// for(let field of requiresFields){
// if(!req.body[field]){
// return next(new expressError(400,"please enter the required fields"))}};


