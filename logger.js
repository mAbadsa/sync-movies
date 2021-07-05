const { createLogger, format, transports } = require('winston');

const { combine, timestamp, label, printf } = format;

const myFormat = printf(
  ({ level, message, label, timestamp }) =>
    `${timestamp} [${label}] ${level}: ${message}`,
);

const logger = createLogger({
  format: combine(label({ label: 'Socket Error' }), timestamp(), myFormat),
  transports: [new transports.File({ filename: 'error.log', level: 'error' })],
});

module.exports = logger;
