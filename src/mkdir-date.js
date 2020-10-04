const { addDays, format, getDay, isBefore } = require('date-fns')
const locales = require('date-fns/locale')
const fs = require('fs')
const path = require('path')

const { debug, log, success } = require('./print')

module.exports.mkdirDate = (fromDate, toDate, target, options) => {
  if (!fs.existsSync(target)) {
    debug(`Path created: ${target}`)
    fs.mkdirSync(target)
  }
  
  let currentDateObject = new Date(fromDate.getTime())


  let count = 0
  while(isBefore(currentDateObject, toDate)) {
    if (!options.skipDay.includes(getDay(currentDateObject))) {
      const datePath = path.resolve(target, format(currentDateObject, options.pattern, { locale: locales[options.locale] }))
      fs.mkdirSync(datePath, { recursive: true })
      log(`Created: ${path.relative(target, datePath)}`)
      ++count
    }
    currentDateObject = addDays(currentDateObject, 1)
  }

  success(`total ${count} files were created.`)
  success(`Finished!`)
}
