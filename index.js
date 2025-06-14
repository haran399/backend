const express=require('express')
require('dotenv').config()

const Person = require('./models/person')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors =require('cors')
const app = express()

let phonenumbers=[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(express.json())
morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : '';
});

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.use(cors())
app.get('/api/phonenumbers',(request,response)=>{
    Person.find({}).then(persons=>response.json(persons))
})

app.use(express.static('dist'))

app.get('/api/phonenumbers/:id',(request,response)=>{
    Person.findById(request.params.id).then((person) => {
        response.json(person)
      })
    
})

app.get('/info',(request,response)=>{
    const datenow=() =>{
    const timestamp = Date.now();
    const currentDate = new Date(timestamp);
    const formattedDate = currentDate.toLocaleString();
    return formattedDate

}
let date=datenow()
    response.send(`Phonebook has info for ${phonenumbers.length} people ${date}`)
})

app.delete('/api/phonenumbers/:id',(request,response)=>{
    const id= request.params.id
    phonenumbers=phonenumbers.filter(n=>n.id !== id)
    response.status(204).end()
})

app.post('/api/phonenumbers', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({ 
            error: 'content missing' 
        });
    }

    const findname = phonenumbers.find(person => person.name === body.name);
    if (findname) {
        return response.status(400).json({
            error: 'name must be unique'
        });
    }

    const newPerson = new Person({
        
        name: body.name,
        number: body.number
    })
    newPerson.save().then((savedPerson) => {
    response.json(savedPerson)
  })
});

const PORT = process.env.PORT||3008
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})