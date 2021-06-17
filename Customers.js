const mongoose = require("mongoose")

const CustSchema = mongoose.Schema({
    accountNo: String,
    name: String,
    email: String,
    mobile: String,
    balance: Number
})

module.exports = mongoose.model("Customers", CustSchema)