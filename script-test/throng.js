const throng = require('throng');

// Define the number of workers you want to create
const numWorkers = 4;

/**
 * Function to start a worker
 * @param {number} id - The id of the worker
 */

function startWorker(id) {
  console.log(`Worker ${id} started`);

  // Place your worker logic here
  console.log(`Worker ${id} finished`);
}

// Start the workers
throng({
  workers: numWorkers,
  start: startWorker,
});


