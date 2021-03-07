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

app.get("/info", ((req, res)=>{
    const info = {
        entries: persons.length,
        date: new Date()
    };

    res.send(`Phonebook has info for ${info.entries} people </br> ${info.date}`)
}))

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);