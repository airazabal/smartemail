var fs = require( 'fs' )
var Envelope = require( 'envelope' )
var data = require('./data.json')

var closings = ['Thanks', 'Thank you', 'Regards', 'Best Wishes', 'Have a great day']

const findClosing = (text) => {
  // We want to find a LINE of text that contains one of the closings...
  // but it should be at the Beginning of the line...
  /*
  text.split('\r\n').forEach((line, index) => {
    closings.forEach((closing) => {
      let result = regex.exec(line)
      if (result) {
        console.log('Found this: ', result)
        console.log('On Line!: ', index)
      }
    })
  })
  */

  let pattern = '^'+closings.join('|^')
  let regex = new RegExp(pattern, 'i')
  return text.split('\r\n').findIndex((element) => {
    return (regex.exec(element) !== null)
  })
}

const getBody = (text) => {
  let remainderStart = findClosing(text)
  let body = text.split('\r\n').slice(0,remainderStart).join('\r\n')
  let remainder = text.split('\r\n').slice(remainderStart).join('\r\n')
  return [body, remainder]
}

data.forEach((d) => {
//  console.log(d.source_email.body)
  var modified = d.source_email.body.toString().replace(/\n/g, '\r\n')
  var email = new Envelope( modified)
  console.log('BODY! ', getBody(email['0'])[0])
  //console.log( email )
})
// Read email into a buffer
//
// Construct envelope
