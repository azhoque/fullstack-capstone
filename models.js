const mongoose = require("mongoose");

const ontrackSchema = mongoose.Schema({
  date: { type: Date },
  project: { type: String },
  pm: { type: String },
  release: { type: Date},
  statusHistory: [{ message: { type: String }, date: { type: Date } }],
  recentStatus: { type: String },
  share: { type: String }
});

ontrackSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    date: this.date,
    project: this.project,
    pm: this.pm,
    release: this.release,
    statusHistory: this.statusHistory,
    recentStatus: this.recentStatus,
    share: this.share
  };
};

const OnTrack = mongoose.model("OnTrack", ontrackSchema);

module.exports = { OnTrack };
