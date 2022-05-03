const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Running');
});

const uri = `mongodb+srv://${process.env.USER_ID}:${process.env.USER_PASS}@cluster0.hw2ul.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try {
    await client.connect();
    const itemsCollection = client.db("motorcycle").collection("items");

    app.get('/items', async (req, res) => {
      const query = {};
      const cursor = itemsCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get('/inventory/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await itemsCollection.findOne(query);
      res.send(service);
    });

    app.delete('/inventory/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await itemsCollection.deleteOne(query);
      res.send(result);
    });


    app.post('/items', async (req, res) => {
      const newService = req.body;
      const result = await itemsCollection.insertOne(newService);
      res.send(result);
    });


    app.put('/inventory/:id', async(req, res) =>{
      const id = req.params.id;
      const updatedItem = req.body;
      console.log(updatedItem);
      const filter = {_id: ObjectId(id)};
      const options = { upsert: true };
      const updatedDoc = {
          $set: {
              quantity: updatedItem.quantity
          }
      };
      const result = await itemsCollection.updateOne(filter, updatedDoc, options);
      res.send(result);

  })


  app.get('/inventory', async (req, res) => {
    // const decodedEmail = req.decoded.email;
    const email = req.query.email;
    // if (email === decodedEmail) {
    //     const query = { email: email };
    //     const cursor = orderCollection.find(query);
    //     const orders = await cursor.toArray();
    //     res.send(orders);
    // }
      const query = { email: email };
      const cursor = itemsCollection.find(query);
      const orders = await cursor.toArray();
      res.send(orders);
  
})



  } finally {

  }
}
run().catch(console.dir);



app.listen(port, () => {
  console.log('Listening', port)
})

