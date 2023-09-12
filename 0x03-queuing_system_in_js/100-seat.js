import redis from "redis";
import express from "express";
import kue from "kue";
import { promisify } from 'util';


/** Redis client and queue system =========================*/
const client =  redis.createClient();
const queue = kue.createQueue();
const queueName = 'reserve_seat';

const seatKey = 'available_seats';
const asyncGet = promisify(client.get).bind(client);
let reservationEnabled;

// Redis Functions
function reserveSeat(number) {
  client.set(seatKey, number, redis.print)
}

async function getCurrentAvailableSeats() {
  return await asyncGet(seatKey);
};

// Redis CLient connection
client.on('error', err => console.log(`Redis client not connected to the server: ${err}`));
client.on('connect', () => {
  console.log(`Redis client connected to the server`);

  reserveSeat(50);
  reservationEnabled = true;
});

/** Express App ==================================*/
const app = express();
const port  = 1245;

app.get('/available_seats', async (req, res) => {
  res.json(`{ numberOfAvailableSeats: ${await getCurrentAvailableSeats()} }`);
});

app.get('/reserve_seat', (req, res) => {
  if (reservationEnabled === false) {
    res.json({ "status": "Reservation are blocked" });
    return;
  }
  const jobFormat = {};

  const job = queue.create(queueName, jobFormat).save(err => {
    if (err) {
      res.json({ status: 'Reservation failed' });
    } else {
      res.json({ status: 'Reservation in process' });
    }
  });

  job.on('complete', () => {
    console.log(`Seat reservation job ${job.id} completed`);
  });

  job.on('failed', (errorMessage) => {
    console.log(`Seat reservation job ${job.id} failed: ${errorMessage}`);
  });
});

app.get('/process', async (req, res) => {
  queue.process(queueName, async (job, done) => {
    let availableSeats = await getCurrentAvailableSeats();

    if (availableSeats <= 0) {
      done(Error('Not enough seats available'));
    }

    availableSeats = Number(availableSeats) - 1;

    reserveSeat(availableSeats);

    if (availableSeats <= 0) {
      reservationEnabled = false;
    }

    done();
  });
  res.json({ status: 'Queue processing' });
});

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
