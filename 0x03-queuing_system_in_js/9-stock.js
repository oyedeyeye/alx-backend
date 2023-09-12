import express from 'express';
import redis from "redis";
const { promisify } = require('util');


/** Express App ============================================== */
const app = express();
const port = 1245;

/** Redis client connection ======================================*/
const client = redis.createClient();
// By default, redis.createClient() use 127.0.0.1 and port 6379
const asyncGet = promisify(client.get).bind(client);

client.on('connect', () => console.log(`Redis client connected to the server`));
client.on('error', err => console.error(`Redis client not connected to the server: ${err}`));

/** Redis Functions ======================================= */
function reserveStockById(itemId, stock) {
  // redis.print prints "Reply: OK" to the console to show the value was saved
  client.set(`item.${itemId}`, stock, redis.print);
}

async function getCurrentReservedStockById(itemId) {
  return await asyncGet(`item.${itemId}`);
}

/** Utils ===============================================*/
const notFound = { status: 'Product not found' };
const listProducts = [
  {
    itemId: 1,
    itemName: 'Suitcase 250',
    price: 50,
    initialAvailableQuantity: 4
  },
  {
    itemId: 2,
    itemName: 'Suitcase 450',
    price: 100,
    initialAvailableQuantity: 10
  },
  {
    itemId: 3,
    itemName: 'Suitcase 650',
    price: 350,
    initialAvailableQuantity: 2
  },
  {
    itemId: 4,
    itemName: 'Suitcase 1050',
    price: 550,
    initialAvailableQuantity: 5
  }
];

function getItemById(id) {
  if (typeof id === 'number'){
    return listProducts.filter(product => product.itemId === id)[0];
  }
}


/** Routes ===============================================*/
app.get('/list_products', (req, res) => {
  res.json(listProducts);
});

app.get('/list_products/:itemId', async (req, res) => {
  const itemId = Number(req.params.itemId);
  const item = getItemById(itemId);

  if (!item) {
    res.json(notFound);
    return;
  }

  const currentStock = await getCurrentReservedStockById(itemId);
  if (!currentStock) {
    await reserveStockById(itemId, item.initialAvailableQuantity);
    item.currentQuantity = item.initialAvailableQuantity;
  } else {
    item.currentQuantity = currentStock;
  }
  res.json(item);
});

app.get('/reserve_product/:itemId', async (req, res) => {
const itemId = Number(req.params.itemId);
const item = getItemById(itemId);
const noStock = { status: 'Not enough stock available', itemId };
const reservationConfirmed = { status: 'Reservation confirmed', itemId };

if (!item) {
  res.json(notFound);
  return;
}

let currentStock = await getCurrentReservedStockById(itemId);
if (currentStock === null) currentStock = item.initialAvailableQuantity;

if (currentStock <= 1) {
  res.json(noStock);
  return;
}
if (currentStock === 1) {
  res.json(notEnough);
  return;
}

reserveStockById(itemId, Number(currentStock) - 1);

res.json(reservationConfirmed);

});


app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
