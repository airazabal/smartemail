var Envelope = require( 'envelope' )
var utf8 = require( 'utf8' )

var closings = ['Thanks', 'Thank you', 'Regards', 'Best Wishes', 'Have a great day']
const findClosing = (text) => {
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

const cleanupSubjectAndBody = (emailText) => {
  console.log("\n\n\n\n*****trying to cleanup subject and body \n\n\n")
  let modified = emailText.toString().replace(/\r/g, '\r\n') // need to do this for the Envelope module to properly parse the email
  let email = new Envelope(modified) // extract email into structured format
  let body = getBody(email['0'])[0].replace('\"',''); // replace escaped double quotes with spaces
  body = body.replace('\"',''); // replace non-escaped double quotes
  body = body.replace("\'","'"); // replace escaped single quotes
  body = body.replace(/\r?\n|\r/g, ' '); // remove all new lines
  const subject = email.header.subject; // extract header
  subjectAndBody = ['Subject: '+subject, body ].join('\r\n') // create a new string, separated
  return subjectAndBody;
}

module.exports = {
  transformEmail: function(emailText) {
    subjectAndBody = cleanupSubjectAndBody(emailText);
    return utf8.encode(subjectAndBody);
  },
  cleanupEmail: function(emailText) {
    subjectAndBody = cleanupSubjectAndBody(emailText);
    return subjectAndBody;
  }
}
