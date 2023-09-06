import redis from "redis";
const { promisify } = require('util');

// this creates a new client
const client = redis.createClient();
// By default, redis.createClient() use 127.0.0.1 and port 6379

// Listen to connect event to determine successful connection
client.on('connect', () => console.log(`Redis client connected to the server`));
// for failed connection event log to error message
client.on('error', err => console.error(`Redis client not connected to the server: ${err}`));

// Use promisify to setup asynchronous operation 
const asyncGet = promisify(client.get).bind(client);

function setNewSchool(schoolName, value) {
  // redis.print prints "Reply: OK" to the console to show the value was saved
  client.set(schoolName, value, redis.print);
}

async function displaySchoolValue(schoolName) {
  console.log(await asyncGet(schoolName));
}


displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
