// imports
require('dotenv').config()
const Discord = require('discord.js')
const strats = require('./strats.json') // strings

// variables
var map, side
const valMaps = ["split", "haven", "bind", "icebox"]
const valSides = ["attack", "defense"]

const client = new Discord.Client() // create client
client.on('ready', () => {
  console.log('Ready')
  client.user.setPresence({ // set presence
    activity: { type: process.env.ACT_TYPE, name: process.env.ACT_NAME },
    status: process.env.STATUS
  })
})
client.login(process.env.TOKEN) // login

client.on('message', message => {
  const prefix = process.enve.PREFIX // set prefix
  if (!message.author.bot && message.content.startsWith(prefix)) { // check if sent by self & check for prefix
    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();
    var response
    // run appropiate command
    if (command === 'map') { // set map
      if (valMaps.includes(args[0])) {
        map = args[0]
        response = `Map set to ${map}`
      } else { response = "Invalid Map"
      }
    } else if (command === 'side') { // atk or def
        if (valSides.includes(args[0])) {
            side = args[0]
            response = `Side set to ${side}`
        } else { response = "Invalid Side"
        }
    } else if (command === 'strat') { // get new strat
        response = {embed: generateStrat()}
    } else if (command === 'help') { //
        response = 'commands: map/side/strat/clean'
    } else { response = {embed: generateStrat()}
    }
    message.channel.send(response)
}})

function generateStrat() {
    const newStrat = randomize(getStrat(map, side))
    var stratEmbed = new Discord.MessageEmbed()
    stratEmbed.fields = [
        {name: 'Map', value: `${map}`, inline: true},
        {name: 'Side', value: `${side}`, inline: true},
        {name: `${newStrat[0]}`, value: `${newStrat[1]}`}]
    return stratEmbed
}

function getStrat(map, side) {
    const fetchString = `${map}_${side}`
    return {...strats.universal, ...strats[side], ...strats[map], ...strats[fetchString]}
}

function randomize(arr) {
    var keys = Object.keys(arr);
    const select = keys[keys.length * Math.random() << 0] 
    return [select, arr[select]];
}
