/* eslint-disable no-unused-vars */
/* global Nlp, training, callback */
var trainingSet = training.data
const model = new Nlp({ languages: ['en'] })

var users = {
  idmap: {},

  addUser: function (token, name) {
    this.idmap[token] = name
  },

  get: function (token) {
    return this.idmap[token]
  }
}

function train () {
  trainingSet.intents.map((query) => {
    model.addDocument(trainingSet.lang, query.question, query.intent)
  })
  trainingSet.answers.map((query) => {
    model.addAnswer(trainingSet.lang, query.intent, query.answer)
  })
  model.train().then(() => { training.state = true })
}

async function process (query, token) {
  if (users.get(token)) {
    var response = await model.process(trainingSet.lang, query)
    return callback(JSON.stringify({ action: 'response', message: response.answer }))
  } else {
    return callback(JSON.stringify({ action: 'unrecognized', message: 'user does not exist' }))
  }
}

function currentUser (token) {
  return users.get(token)
}

/* eslint-enable no-unused-vars */
