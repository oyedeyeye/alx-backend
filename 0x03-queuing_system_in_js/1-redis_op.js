import redis from "redis";

// this creates a new client
const client = redis.createClient();
// By default, redis.createClient() use 127.0.0.1 and port 6379

// Listen to connect event to determine successful connection
client.on('connect', () => console.log(`Redis client connected to the server`));
// for failed connection event log to error message
client.on('error', err => console.error(`Redis client not connected to the server: ${err}`));


function setNewSchool(schoolName, value) {
  // redis.print prints "Reply: OK" to the console to show the value was saved
  client.set(schoolName, value, redis.print);
}

function displaySchoolValue(schoolName) {
  client.get(schoolName, (err, result) => {
    if(err) {
      console.log(err);
    }
    else {
      console.log(result);
    }
  });
}


displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
