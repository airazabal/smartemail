var fs = require('fs');
var parse = require('csv-parse');
var generate = require('csv-generate');
var Transform = require('stream').Transform;
var Envelope = require( 'envelope' )
var utf8 = require( 'utf8' )

var inFile = process.argv[2]
console.log('Processing file: ', inFile)
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
  let body = text.split('\r\n').slice(0,remainderStart).join('\r\n').replace(/\r?\n|\r/g, ' ')
  let remainder = text.split('\r\n').slice(remainderStart).join('\r\n')
  return [body, remainder]
}

const transformEmail = (emailtext) => {
  //console.log('transformEmail', emailtext)
  // Sometimes you have to change these...
  var modified = emailtext.toString().replace(/\r/g, '\n')
  var email = new Envelope( modified)
//  console.log('email>>>>', email)
  var body = getBody(email['0'])[0]

  return utf8.encode(['Subject: '+email.header.subject, body ].join('\r\n'))
}

var output = [];
var parser = parse({delimiter: ',', rowDelimiter:'\n'}, function(err, data) {
//  console.log('DATA!',data)
  data.forEach((line) => {
 //   console.log('line>>>>>>', line)
    console.log(`\"${line[0]}\",\"${transformEmail(line[1])}\"`)
  });
})
var generator = generate({})

var input = fs.createReadStream(inFile)

const myTransform = new Transform({
  transform(chunk, encoding, callback) {
    console.log(chunk)
    callback(null, chunk.toString())
  }
});
input.pipe(parser)
