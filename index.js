const express = require("express")
const mongoose = require("mongoose") // new
var bodyParser = require('body-parser')
const morgan = require('morgan');
var cors = require('cors')
const port = 5000
const hostname = "localhost"
const pass = "123456789R@ju"
const dbName = "Bank"
const mongoAtlasUri =
    `mongodb+srv://Raju:${pass}@cluster0.ahs9o.mongodb.net/${dbName}?retryWrites=true&w=majority`;
const Customers = require("./Customers")
try {
    // Connect to the MongoDB cluster
    mongoose.connect(
        mongoAtlasUri,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        () => console.log("Mongoose is connected"),
    );
} catch (e) {
    console.log("could not connect");
}



const dbConnection = mongoose.connection;
dbConnection.on("error", (err) => console.log(`Connection error ${err}`));
dbConnection.once("open", () => console.log("Connected to DB!"));

const app = express()
app.use(cors())
app.use(morgan('tiny'));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.get("/", (req, res) => {
    Customers.find((err, results) => {
        if (err) {
            console.log(err)
        }
        // console.log(results)
        res.json(results);
    })
})
app.post("/",(req,res)=>{
    const fromAcc=req.body.fromAccount;
    const Amounts=parseInt(req.body.Amount);  
    const toAcc=req.body.toAccount;
    const lessAmount=parseInt(fromAcc.balance)-Amounts
    const moreAmount=parseInt(toAcc.balance)+Amounts
    Customers.findByIdAndUpdate(fromAcc._id 
        ,{ $set: { balance: lessAmount } },{new: true, passRawResult: true}
        ,(err,results)=>{
        if (err) {
            return res.status(400).json({error:'Something error'})
        }
        // console.log(results,"from")
        if(!results){
            return res.status(400).json({error:'Not Found'})
        }
        // res.json(results);
        if(results){
            Customers.findByIdAndUpdate(toAcc._id,{ $set: { balance: moreAmount } },{new: true, passRawResult: true},(err,doc)=>{
                if (err) {
                    return res.status(400).json({error:'Something error'})
                }
                // console.log(results,"from")
                if(!results){
                    return res.status(400).json({error:'Not Found'})
                }
                // res.json(results);
                if(doc){
                    Customers.find((err, docs) => {
                        if (err) return next(err);
                        // console.log(results,"results")
                        res.json(docs);
                    })
                }   
            })
        }
    })
})


app.listen(port, () => {
    console.log(`Server started at http://${hostname}:${port}`)
})