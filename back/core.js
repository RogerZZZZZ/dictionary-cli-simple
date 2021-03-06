const inquirer = require('inquirer')
const { query } = require('./lib/crawler')
const { painting } = require('./lib/painter')
const { suggest } = require('./lib/typo')
const { detectIfChinese, returnProperCode } = require('./lib/detect')
const { themeList, changeTheme } = require('./lib/config')
const { addThemeQ } = require('./questions/addTheme')
const { writeFile } = require('./lib/theme')

const search = (word, opt) => {
  if (detectIfChinese(word)) {
    word = returnProperCode(word)
  } else {
    let suggestions = suggest(word)
    if (suggestions.length >= 1) {
      const question = {
        type: 'list',
        name: 'word',
        message: 'Choose one word you may want to query.',
        choices: suggestions,
      }
      inquirer
        .prompt(question)
        .then(answer => query(answer.word, opt, painting))
      return;
    }
  }
  query(word, opt, painting)
}

const theme = () => {
  const question = {
    type: 'list',
    name: 'theme',
    message: 'Choose one theme',
    choices: themeList()
  }

  inquirer
    .prompt(question)
    .then(answer => changeTheme(answer.theme))
}

const addTheme = () => {
  inquirer
    .prompt(addThemeQ)
    .then(answer => writeFile(answer))
}

module.exports = {
  search,
  theme,
  addTheme,
}
