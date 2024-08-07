const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const sportSchema = new Schema(
  {
    sportTitle: { type: String },
    leagues: {
    },
    active: { type: Boolean, default: false },
    prevStatus: { type: Boolean, default: false },
    statusChange: { type: Boolean },
    dateStatusChange: { type: Date },
    dateReset: { type: Number },
    date: { type: Date, default: Date.now }
  }
);

const Sport = mongoose.model("Sport", sportSchema);

module.exports = Sport;
