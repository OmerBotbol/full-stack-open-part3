const express = require("express");
const app = express();
const path = require("path")
const morgan = require("morgan")
require("dotenv").config();
const Person = require("../person");
const cors = require('cors');

app.use(cors())
app.use(express.json());
morgan.token("request-body", ((req, res)=>{return JSON.stringify(req.body)}))
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :request-body"));

app.use(express.static(path.join(__dirname,"..","frontend", "build")));

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dav Avramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,"..","frontend", "build", "index.html"));
  });

app.get("/api/persons",((req, res)=>{
    Person.find({}).then(persons => {
        res.json(persons.map(person => person.toJSON()));
    })
}));

app.get("/api/persons/:id",((req, res, next)=>{
    Person.findById(req.params.id).then((person)=>{
        if(person){
            res.json(person.toJSON());
        }
        else{
            response.status(404).end()
        }
    }).catch((err)=>{
        next(err);
    })
}));

app.get("/info", ((req, res)=>{
    const info = {
        entries: persons.length,
        date: new Date()
    };

    res.send(`Phonebook has info for ${info.entries} people </br> ${info.date}`)
}));

app.delete("/api/persons/:id", ((req, res, next)=>{
    Person.findByIdAndDelete(req.params.id).then(()=>{
        res.status(204).end();
    }).catch((err)=>{
        next(err);
    })
}));

app.post("/api/persons", ((req, res)=>{

    function checkProperties(personToCheck){
        if(personToCheck.name === undefined || personToCheck.number === undefined){
            return false;
        }
        return true;
    }

    const body = req.body;
    const newPerson = new Person({
        name: body.name,
        number: body.number
    })

    if(checkProperties(newPerson)){
        newPerson.save().then((result)=>{
            res.json(result.toJSON())
        })
    }
    else{
        res.status(400);
        res.send({ error: 'missing name or number' });
    }
}))

app.put("/api/persons/:id", (req, res, next)=>{
    const body = req.body;
     const person = {
         name: body.name,
         number: body.number
     }

     Person.findByIdAndUpdate(req.params.id, person, {new : true}).then((updatedPerson)=>{
        res.json(updatedPerson);
     }).catch((err)=>{
         next(err)
     })
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
}
  
app.use(errorHandler)

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);