#!/usr/bin/env node
const path = require('path')
const { isValid, parseISO, isAfter, differenceInDays } = require('date-fns')
const locales = require('date-fns/locale')
const parseArgs = require('yargs-parser')

const { mkdirDate } = require('./mkdir-date')
const { error } = require('./print')

const { _: [,, ...argsList], ...options } = parseArgs(process.argv)

const errorCodes = {
  invalidInput: 4,
  unexpected: 9,
}

const printUsage = () => {
  console.info(`Usage:`)
  console.info(`  mkdir-date [from] [to] [target]`)
}

const dateFormat = 'YYYY-MM-DD'

const defaultOptions = {
  pattern: 'yyyy/LL/dd',
  locale: 'enUS',
  skipDay: [],
}

if (options.help) {
  printUsage()
  console.info()
  console.info(`Example: create a directory for each day for a year quarter`)
  console.info(`  mkdir-date 2020-01-01 2020-03-31 ./period/q1`)
  console.info()
  console.info(`Arguments:`)
  console.info(`  from         The starting date period in ISO format (${dateFormat}).`)
  console.info(`  to           The starting date period in ISO format (${dateFormat}).`)
  console.info(`  target       The target directory where directories will be created.`)
  console.info()
  console.info(`Options:`)
  console.info(`  --skip-day   Indicates a day in a week to skip. Starting on Sunday as 0 and Saturday as 6.`)
  console.info(`               It can be used more than once.`)
  console.info(`               Example: skip weekend`)
  console.info(`                 --skip-day=0 --skip-day=6`)
  console.info(`  --pattern    The pattern to use when creating directories.`)
  console.info(`               Default: ${defaultOptions.pattern}`)
  console.info(`               See https://date-fns.org/v2.16.1/docs/format for more information.`)
  console.info(`  --locale     The local to use when applying the pattern when creating directories`)
  console.info(`               Default: ${defaultOptions.locale}`)
  console.info(`               See https://date-fns.org/v2.16.1/docs/I18n for more information.`)
  process.exit(0)
}

// Validate arguments.

if (argsList.length !== 3) {
  error('Only 3 arguments should be specified.')
  printUsage()
  process.exit(errorCodes.invalidInput)  
}

const args = {
  from: parseISO(argsList[0]),
  to: parseISO(argsList[1]),
  target: path.resolve(process.cwd(), argsList[2]),
}

if (!isValid(args.from)) {
  error(`Invalid date [from] specified. Expected format: ${dateFormat}.`)
  process.exit(errorCodes.invalidInput)
}

if (!isValid(args.to)) {
  error(`Invalid date [to] specified. Expected format: ${dateFormat}.`)
  process.exit(errorCodes.invalidInput)
}

if (isAfter(args.from, args.to)) {
  error(`The date [from] should not be after the date [to].`)
  process.exit(errorCodes.invalidInput)
}

if (differenceInDays(args.to, args.from) < 1) {
  error(`The difference in days between date [from] and date [to] should be greater than one.`)
  process.exit(errorCodes.invalidInput)
}

// Validate options.
if (!options.pattern) {
  options.pattern = defaultOptions.pattern
}

if (!options.locale) {
  options.locale = defaultOptions.locale
} else {
  if (!(options.locale in locales)) {
    error(`Invalid --locale. Valid locales are: ${Object.keys(locales).sort()}.`)
    process.exit(errorCodes.invalidInput)
  }
}

if (!options.skipDay) {
  options.skipDay = defaultOptions.skipDay
} else {
  options.skipDay = Array.isArray(options.skipDay) ? options.skipDay : `${options.skipDay}`.split(',')
  options.skipDay = options.skipDay.map(day => parseInt(day, 10))

  const validSkipDay = [0,1,2,3,4,5,6]
  options.skipDay.forEach(day => {
    if (!validSkipDay.includes(day)) {
      error(`Invalid --skip-day. Valid days are: ${validSkipDay}.`)
      process.exit(errorCodes.invalidInput)
    }
  })
}

try {
  mkdirDate(args.from, args.to, args.target, options)
} catch (err) {
  error('Unexpected error:', err)
  process.exit(errorCodes.unexpected)
}