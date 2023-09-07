const kue = require('kue');
const createPushNotificationsJobs = require('./8-job');
const expect = require('chai').expect;

const queue = kue.createQueue();

describe('createPushNotificationsJobs', () => {
  beforeEach(() => queue.testMode.enter());
  afterEach(() => queue.testMode.clear());
  after(() => queue.testMode.exit());

  it('Logs error if job is not an array', () => {
    const job = {
      phoneNumber: '4153518780',
      message: 'This is the code 1234 to verify your account'
    };

  expect(() => createPushNotificationsJobs(job, queue)).to.throw(
    Error, 'Jobs is not an array');
  });

  it('creates two new jobs to the queue', () => {
    const jobs = [
      {
        phoneNumber: '4153518780',
        message: 'This is the code 1234 to verify your account'
      },
      {
        phoneNumber: '4153518781',
        message: 'This is the code 4532 to verify your account'
      }
    ];

    createPushNotificationsJobs(jobs, queue);
    expect(queue.testMode.jobs.length).to.equal(2);
    
    expect(queue.testMode.jobs[0].data).to.deep.equal({
      phoneNumber: '4153518780',
      message: 'This is the code 1234 to verify your account'
    });
    expect(queue.testMode.jobs[0].type).to.equal('push_notification_code_3');
    expect(queue.testMode.jobs[1].data).to.deep.equal({
      phoneNumber: '4153518781',
      message: 'This is the code 4532 to verify your account'
    });
    expect(queue.testMode.jobs[1].type).to.equal('push_notification_code_3');
  });
});
