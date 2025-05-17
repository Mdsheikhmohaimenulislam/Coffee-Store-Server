const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sltbrlg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server
    // await client.connect();

    const coffeesCollection = client.db("coffeeDB").collection("coffees");
    const usersCollection = client.db("coffeeDB").collection("Users");

    // Find a Document and All data call
    app.get("/coffees", async (req, res) => {
      // const cursor = coffeesCollection.find()
      // const result = await cursor.toArray()


      const result = await coffeesCollection.find().toArray();
      res.send(result);
    });

    // Details section or FindOne a Document
    app.get("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const require = { _id: new ObjectId(id) };
      const result = await coffeesCollection.findOne(require);
      res.send(result);
    });

    // Send Coffee data to the DB / Insert Documents in Mongodb
    app.post("/coffees", async (req, res) => {
      const newCoffee = req.body;
      const result = await coffeesCollection.insertOne(newCoffee);
      res.send(result);
    });

    // Update Coffee Data
    app.put("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCoffee = req.body;
      const updateDoc = {
        $set: updatedCoffee,
      };
      const result = await coffeesCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    // Delete Section
    app.delete("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeesCollection.deleteOne(query);
      res.send(result);
    });

    // User Related APIS

    // display data
    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      console.log(result);
      res.send(result);
    });

    // add data
    app.post("/users", async (req, res) => {
      const userInfo = req.body;
      console.log("db", userInfo);
      const result = await usersCollection.insertOne(userInfo);
      res.send(result);
    });


    // update last sign in to the db
    app.patch("/users",async (req,res) => {
     const {email,lastSignInTime} = req.body;
     const filter = {email: email}
     const updateDoc = {
      $set:{
        lastSignInTime: lastSignInTime
      }
     }
     const result = await usersCollection.updateOne(filter,updateDoc);
     res.send(result);
    })  




    // Delete data
    app.delete("/users/:id", async (req,res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Coffee server is running");
});

app.listen(port, () => {
  console.log(`Coffee server is running on port ${port}`);
});
