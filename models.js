const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
const userSchema = mongoose.Schema({
  username:{type:String, required:true, unique:true},
  email:{type:String, required:true, unique:true},
  password:{type:String, required:true, unique:true}
});
userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};
userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};
const OnTrack = mongoose.model("OnTrack", ontrackSchema);
const User = mongoose.model("User", userSchema);
module.exports = { OnTrack, User};



