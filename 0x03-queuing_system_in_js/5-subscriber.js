import redis from "redis";

// this creates a new subscriber client that duplicate() client
const subscriber = redis.createClient();
// By default, redis.createClient() use 127.0.0.1 and port 6379

// Listen to connect event to determine successful connection
subscriber.on('connect', () => console.log(`Redis client connected to the server`));
// for failed connection event log to error message
subscriber.on('error', err => console.error(`Redis client not connected to the server: ${err}`));

subscriber.subscribe('holberton school channel');

subscriber.on('message', (channel, message) => {
  if (channel === 'holberton school channel') console.log(message);
  if (message === 'KILL_SERVER') {
    subscriber.unsubscribe();
    subscriber.quit();
  }
});
