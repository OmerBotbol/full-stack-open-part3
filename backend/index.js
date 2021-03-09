const express = require("express");
const app = express();
const path = require("path")
const morgan = require("morgan")
require("dotenv").config();
const Person = require("../person");
const cors = require('cors')

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

app.get("/api/persons/:id",((req, res)=>{
    Person.findById(req.params.id).then((person)=>{
        res.json(person.toJSON());
    })
}));

app.get("/info", ((req, res)=>{
    const info = {
        entries: persons.length,
        date: new Date()
    };

    res.send(`Phonebook has info for ${info.entries} people </br> ${info.date}`)
}));

app.delete("/api/persons/:id", ((req, res)=>{
    Person.findByIdAndDelete(req.params.id).then(()=>{
        Person.find({}).then(persons => {
            res.status(204);
            res.json(persons.map(person => person.toJSON()));
        })
    })
}));

app.post("/api/persons", ((req, res)=>{

    function checkDuplicate(personToCheck){
        for (const person of persons) {
            if(person.name === personToCheck.name || person.number === personToCheck.number){
                return true;
            }
        }
        return false;
    }

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
        if(checkDuplicate(newPerson)){
            res.status(400)
            res.send({ error: 'name and number must be unique' });
        }
        else{
            newPerson.save().then((result)=>{
                res.json(result.toJSON())
            })
        }
    }
    else{
        res.status(400);
        res.send({ error: 'missing name or number' });
    }
}))

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);