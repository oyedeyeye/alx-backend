const kue = require('kue');

const queue = kue.createQueue();

const blackListed = ['4153518780', '4153518781'];

function sendNotification(phoneNumber, message, job, done) {
  const total = 100;

  job.progress(0, total);

  if (blackListed.includes(phoneNumber)) {
    done(Error(`Phone number ${phoneNumber} is blacklisted`));
    return;
  }

  job.progress(50, 100);
  console.log(
    `Sending notification to ${phoneNumber}, with message: ${message}`
  );
  done();
}

const queueName = 'push_notification_code_2';

queue.process(queueName, 2, (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message, job, done);
});
