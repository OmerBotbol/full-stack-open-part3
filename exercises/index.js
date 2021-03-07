const express = require("express");
const app = express();

const persons = [
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

app.get("/api/persons",((req, res)=>{
    res.send(persons);
}));

app.get("/api/persons/:id",((req, res)=>{
    const id = Number(req.params.id);
    const selectedPerson = persons.find(person => person.id === id);
    if(selectedPerson){
        res.send(selectedPerson);
    }
    else{
        res.status(404).end()
    }
}));

app.get("/info", ((req, res)=>{
    const info = {
        entries: persons.length,
        date: new Date()
    };

    res.send(`Phonebook has info for ${info.entries} people </br> ${info.date}`)
}));

app.delete("/api/persons/:id", ((req, res)=>{
    const id = Number(req.params.id);
    const personFilterd = persons.filter(person => person.id !== id);

    res.send(personFilterd);
    res.status(204);
}))

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);