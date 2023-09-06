import redis from "redis";

// this creates a new client
const publisher = redis.createClient();
// By default, redis.createClient() use 127.0.0.1 and port 6379

// Listen to connect event to determine successful connection
publisher.on('connect', () => console.log(`Redis client connected to the server`));
// for failed connection event log to error message
publisher.on('error', err => console.error(`Redis client not connected to the server: ${err}`));

function publishMessage(message, time) {
  setTimeout(() => {
    console.log(`About to send ${message}`);
    publisher.publish('holberton school channel', message);
  }, time);
}

publishMessage("Holberton Student #1 starts course", 100);
publishMessage("Holberton Student #2 starts course", 200);
publishMessage("KILL_SERVER", 300);
publishMessage("Holberton Student #3 starts course", 400);
