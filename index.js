const express = require('express');
const cors = require("cors")
require('dotenv').config()
const app = express();
const port  = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())

console.log()

const { MongoClient, ServerApiVersion } = require('mongodb');
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

    const travelPlaceCollection = client.db("travel-agency-BD").collection("travel_places");
    const reviewsCollection = client.db("travel-agency-BD").collection("reviews");
    const blogsCollection = client.db("travel-agency-BD").collection("blogs");

    // travel places get apis from database
    app.get("/places",async(req,res)=>{
      const result  = await travelPlaceCollection.find().toArray();
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
