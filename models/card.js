const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // обязательное поле для заполнения
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: ObjectId,
    default: [], // зачение по умолчанию
    ref: 'user',
  }],
  createAt: {
    type: Date,
    default: Date.now, // значение по умолчанию
  },
});

module.exports = mongoose.model('card', cardSchema);
