const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9nu6wnq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();

    const craftCollection = client.db('craftDB').collection('craft');
    const subcategoryCollection = client.db('craftDB').collection('craftSubcategories');

    app.get('/addCraftItems', async (req, res) => {
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/myItems/:email', async (req, res) => {
      const result = await craftCollection.find({ userEmail: req.params.email }).toArray();
      res.send(result);
    })

    app.get('/addCraftItems/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await craftCollection.findOne(query);
      res.send(result);
    })

    app.get('/subcategory', async(req, res) => {
      const cursor = subcategoryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/addCraftItems', async (req, res) => {
      const newCraftItems = req.body;
      console.log(newCraftItems);
      const result = await craftCollection.insertOne(newCraftItems);
      res.send(result);
    })

    app.put('/addCraftItems/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedData = req.body;
      const data = {
        $set: {
          itemName: updatedData.itemName,
          subcategory: updatedData.subcategory,
          description: updatedData.description,
          price: updatedData.price,
          rating: updatedData.rating,
          customization: updatedData.customization,
          processTime: updatedData.processTime,
          stock: updatedData.stock,
          userName: updatedData.userName,
          photoURL: updatedData.photoURL
        }
      }
      const result = await craftCollection.updateOne(filter, data, options);
      res.send(result);
    })

    app.delete(`/addCraftItems/:id`, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await craftCollection.deleteOne(query);
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


app.get('/', (req, res) => {
  res.send('Ceramics and Pottery server is running');
})

app.listen(port, () => {
  console.log(`Ceramics and Pottery server is running on PORT: ${port}`)
})

