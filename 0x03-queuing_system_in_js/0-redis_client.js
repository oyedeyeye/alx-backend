import redis from "redis";

// this creates a new client
const client = redis.createClient();
// By default, redis.createClient() use 127.0.0.1 and port 6379

// Listen to connect event to determine successful connection
client.on('connect', () => console.log(`Redis client connected to the server`));
// for failed connection event log to error message
client.on('error', err => console.error(`Redis client not connected to the server: ${err}`));
