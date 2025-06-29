import { JacViz } from './jacviz.js'

setInterval(() => {
  JacViz.logValues(Math.sin(Date.now() / 1000), Math.cos(Date.now() / 1000)) // Logged as keyless value - index 0
  JacViz.logObject({ temperature: 23.5, humidity: 60.2 }) // Example of logging an object
  JacViz.logKeyValue('altitude', 1000) // Example of logging a single key-value pair
  JacViz.logRaw(`  MyCustomLog  :  ${Math.random()} `) // Example of logging a raw line
}, 1000)
