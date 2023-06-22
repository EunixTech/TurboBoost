var appRoot = require('app-root-path');
const winston = require('winston');
var path = require('path');
var PROJECT_ROOT = path.join(__dirname, '..');
const { format } = require('winston');
const moment = require('moment');
require('dotenv').config();

const { combine, timestamp, label, printf } = format;

const myFormat = printf((info) => {
  return `${moment().format('DD.MM.YYYY HH:mm:ss')} [${info.label}] ${info.level}: ${
    typeof info.message == 'object' ? JSON.stringify(info.message, null, '\t') : info.message
  }`;
});

// { error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6 }

const options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
    format: combine(label({ label: 'debug' }), timestamp(), myFormat)
  },
  debugFile: {
    level: 'debug',
    filename: `${appRoot}/logs/debug.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
    format: combine(label({ label: 'debug' }), timestamp(), myFormat)
  },
  errorFile: {
    level: 'error',
    filename: `${appRoot}/logs/error.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
    format: combine(label({ label: 'err' }), timestamp(), myFormat)
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
    format:
      process.env.NODE_ENV !== 'production'
        ? combine(label({ label: 'logging' }), timestamp(), myFormat)
        : winston.format.simple()
  }
};
/**
 * method for write log information about application work on logs folder, using Winston
 */
const logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.File(options.debugFile),
    new winston.transports.Console(options.console),
    new winston.transports.File(options.errorFile)
  ],
  exitOnError: false // do not exit on handled exceptions
});

logger.stream = {
  write: function (message) {
    logger.info(message);
  }
};

module.exports.debug = module.exports.log = function () {
  logger.debug.apply(logger, formatLogArguments(arguments));
};

module.exports.info = function () {
  logger.info.apply(logger, formatLogArguments(arguments));
};

module.exports.warn = function () {
  logger.warn.apply(logger, formatLogArguments(arguments));
};

module.exports.error = function () {
  logger.error.apply(logger, formatLogArguments(arguments));
};

module.exports.stream = logger.stream;

/**
 * Attempts to add file and line number info to the given log arguments.
 */
function formatLogArguments(args) {
  args = Array.prototype.slice.call(args);

  var stackInfo = getStackInfo(1);

  if (stackInfo) {
    // get file path relative to project root
    var calleeStr = '(' + stackInfo.relativePath + ':' + stackInfo.line + ')';

    if (typeof args[0] === 'string') {
      args[0] = calleeStr + ' ' + args[0];
    } else {
      args[0] = calleeStr + '\n' + JSON.stringify(args[0], null, '\t');
    }
  }

  return args;
}

/**
 * Parses and returns info about the call stack at the given index.
 */
function getStackInfo(stackIndex) {
  // get call stack, and analyze it
  // get all file, method, and line numbers

  var stacklist = new Error().stack.split('\n').slice(3);

  // stack trace format:
  // http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
  // do not remove the regex expresses to outside of this method (due to a BUG in node.js)
  var stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi;
  var stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi;

  var s = stacklist[stackIndex] || stacklist[0];
  var sp = stackReg.exec(s) || stackReg2.exec(s);

  if (sp && sp.length === 5) {
    return {
      method: sp[1],
      relativePath: path.relative(PROJECT_ROOT, sp[2]),
      line: sp[3],
      pos: sp[4],
      file: path.basename(sp[2]),
      stack: stacklist.join('\n')
    };
  }
}
