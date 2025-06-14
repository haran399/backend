const mongoose = require('mongoose')

if (process.argv[2].length < 3) {
  console.log('give password as argument')
  process.exit(1)
}
const url = process.env.MONGODB_URI
const password = process.argv[2]
const name=process.argv[3]
const number= process.argv[4]
const cmlpassword = encodeURIComponent(password);

//const url = `mongodb+srv://haran399:${cmlpassword}@cluster0.zs0brxo.mongodb.net/noteapp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
const Person = mongoose.model('Person', personSchema)

if(number && name)
{
const person = new Person({
  name: name,
  number: number,
})
person.save().then(result => {
  console.log(`added ${name} ${number} to phonebook`)
  mongoose.connection.close()
})
}




Person.find({}).then(result => {
  result.forEach(person =>  console.log(person))
  mongoose.connection.close()
})

module.exports = mongoose.model('Person', personSchema)
