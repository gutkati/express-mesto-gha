const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,   //обязательное поле для заполнения
    minlength: 2,
    maxlength: 30
  },
  link: {
    type: String,
    require: true,
  },
  owner: {
    type: ObjectId,
    ref: 'user',
    require: true,
  },
  likes: [{
    type: ObjectId,
    default: []  // зачение по умолчанию
  }],
  createAt: {
    type: Date,
    default: Date.now, // значение по умолчанию
  }
})

module.exports = mongoose.model('card', cardSchema)