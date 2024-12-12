const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  email: { type: String, required: true },
  mob: { type: String, required: true },
  avatar: { type: String, default: "" },
});

// Virtual property to generate avatar initials
employeeSchema.virtual("initials").get(function () {
  const names = this.name.split(" ");
  const initials = names.map((name) => name.charAt(0).toUpperCase()).join("");
  return initials;
});

// Pre-save middleware to set the avatar field
employeeSchema.pre("save", function (next) {
  if (!this.avatar) {
    this.avatar = this.initials;
  }
  next();
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
