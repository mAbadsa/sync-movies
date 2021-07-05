const logger = require('./logger');

function terminate(server, options = { coredump: false, timeout: 500 }) {
  // Exit function
  const exit = (code) =>
    options.coredump ? process.abort() : process.exit(code);

  return (code, reason) => (err, promise) => {
    if (err && err instanceof Error) {
      // Log error information, use a proper logging library here :)
      logger.log({
        level: 'error',
        message: err.message,
      });
    }

    // Attempt a graceful shutdown
    server.close(exit);
    setTimeout(exit, options.timeout).unref();
  };
}

module.exports = terminate;

// setTimeout(() => process.exit(0), 10000);

// process.on('exit', (code) => {
//   // Only synchronous calls
//   console.log(`Process exited with code: ${code}`);
// });

// process.on('beforeExit', (code) => {
//   // Can make asynchronous calls
//   setTimeout(() => {
//     console.log(`Process will exit with code: ${code}`);
//     process.exit(code);
//   }, 0);
// });

// process.on('SIGTERM', (signal) => {
//   console.log(`Process ${process.pid} received a SIGTERM signal`);
//   process.exit(0);
// });

// process.on('SIGINT', (signal) => {
//   console.log(`Process ${process.pid} has been interrupted`);
//   process.exit(0);
// });

// process.on('uncaughtException', (err) => {
//   console.log(`Uncaught Exception: ${err.message}`);
//   process.exit(1);
// });

// process.on('unhandledRejection', (reason, promise) => {
//   console.log('Unhandled rejection at ', promise, `reason: ${reason.message}`);
//   process.exit(1);
// });

// process.on('<signal or error event>', (_) => {
//   server.close(() => {
//     process.exit(0);
//   });
//   // If server hasn't finished in 1000ms, shut down process
//   setTimeout(() => {
//     process.exit(0);
//   }, 1000).unref(); // Prevents the timeout from registering on event loop
// });
