const express = require('express');
const app = express();
const cors = require("cors")
const jwt = require('jsonwebtoken');
require('dotenv').config();
const port  = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())

const verifyJWT =(req,res,next)=>{
  const authorization = req.headers.authorization;
  if(!authorization){
    return res.status(401).send({error:true,message:"unauthorization access"})
  }
  const token = authorization.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_KEY,(err,decoded)=>{
    if(err){
      return res.status(401).send({error:true,message:"unauthorization access"})
    }
    req.decoded = decoded;
    next();
  })
}

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASSWORD_DB}@cluster0.v2v9b72.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();

    const travelGalleryCollection = client.db("travel-agency-BD").collection("travel_gallery");
    const travelPlaceCollection = client.db("travel-agency-BD").collection("travel_places");
    const reviewsCollection = client.db("travel-agency-BD").collection("reviews");
    const blogsCollection = client.db("travel-agency-BD").collection("blogs");
    const usersCollection = client.db("travel-agency-BD").collection("users");
    const bookingCollection = client.db("travel-agency-BD").collection("booking");

    // 
    app.post("/jwt",(req,res)=>{
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_KEY,{expiresIn:"1h"});
      res.send({token})
    })

    // users get apis from database
    app.get("/users",async(req,res)=>{
      const result = await usersCollection.find().toArray();
      res.send(result)
    })

    // user data send database
    app.post("/users",async(req,res)=>{
      const body = req.body;
      const result = await usersCollection.insertOne(body);
      res.send(result)
    })

    // travel places get apis from database
    app.get("/places",async(req,res)=>{
      const result  = await travelPlaceCollection.find().toArray();
      res.send(result)
    })

    // specific travel place find
    app.get("/places/:id", async(req,res)=>{
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)}
      const result = await travelPlaceCollection.findOne(filter)
      res.send(result)
    })

    // travel Gallery get apis from database
    app.get("/travelGallery",async(req,res)=>{
      const result  = await travelGalleryCollection.find().toArray();
      res.send(result)
    })

    // users review get apis from database
    app.get("/reviews",async(req,res)=>{
      const result  = await reviewsCollection.find().toArray();
      res.send(result)
    })

    // users review get apis from database
    app.get("/blogs",async(req,res)=>{
      const result  = await blogsCollection.find().toArray();
      res.send(result)
    })

    // specific blog place find
    app.get("/blogs/:id",async(req,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const result = await blogsCollection.findOne(filter);
      res.send(result)
    })


    // booking request send data
    app.post("/booking",async(req,res)=>{
      const body = req.body;
      const result = await bookingCollection.insertOne(body);
      res.send(result)
    })

  // 
    app.get("/my-booking",async(req,res)=>{
      let query = {};
      if(req.query?.email){
        query = { email: req.query.email};
      }
      const result = await bookingCollection.find(query).toArray();
      res.send(result);
    })












    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/",(req,res)=>{
    res.send("travel agency is running")
})
app.listen(port,()=>{
    console.log("travel agency is running")
})
