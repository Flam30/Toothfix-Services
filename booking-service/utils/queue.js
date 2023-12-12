const Queue = require('bull');
const redisConfig = {
  redis: {
    password: 'qtN6Ok1gmRDmPe0UP5sFQCmNhJEg5JPv',
    host: 'redis-15929.c250.eu-central-1-1.ec2.cloud.redislabs.com',
    port: 15929,
  },
};

const myQueue = new Queue('myQueue', redisConfig);

// Add a job to the queue
myQueue.add({
  data: {
    message: 'Hello, Queue!',
  },
});

// Process jobs from the queue
myQueue.process((job) => {
  console.log('Processing job:', job.data.data.message);
  // Add your job processing logic here
  // ...
  return Promise.resolve(); // Resolve the promise when the job processing is complete
});

// Event listener for completed jobs
myQueue.on('completed', (job, result) => {
  console.log(`Job ID ${job.id} completed with result:`, result);
});

// Event listener for failed jobs
myQueue.on('failed', (job, err) => {
  console.error(`Job ID ${job.id} failed with error:`, err);
});