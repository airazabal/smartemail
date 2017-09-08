// //incoming call
// // context.args =
// { data: {
//     modelId: 1234
//   }
// }
// Smartemail.beforeRemote('pocOutputCsv', function(context, user, next) {
//   context.args.data.date = Date.now();
//   context.args.data.publisherId = context.req.accessToken.userId;
//   next();
// });
//
// //after the hook
// { data: {
//     modelId: 1234,
//     date: TODAY,
//     publisherId: '544'
//   }
// }
//
// Smartemail.pocOutputCsv = function(data, res, cb) {
//   console.log(data.date)
//   console.log(data.publisherId)
//   console.log('pocOutputCsv for model_id: ', args.modelId)
//   Smartemail.pocOutput(args.modelId)
//     .then((list) => {
// //        console.log('Flatten returned list: ', list)
//       var datetime = new Date();
//       res.set('Expires', 'Tue, 03 Jul 2001 06:00:00 GMT');
//       res.set('Cache-Control', 'max-age=0, no-cache, must-revalidate, proxy-revalidate');
//       res.set('Last-Modified', datetime + 'GMT');
//       res.set('Content-Type', 'application/force-download');
//       res.set('Content-Type', 'application/octet-stream');
//       res.set('Content-Type', 'application/download');
//       res.set('Content-Disposition', 'attachment;filename=Data.csv');
//       res.set('Content-Transfer-Encoding', 'binary');
//       returnObject = {
//         'csv': list.join('\r\n'),
//         'metric': 80
//       }
//       // for example: return csv, metric
//       cb(null, list.join('\r\n'), 80); // tells loopback runtime that i have an asynchronous response, here's the value
//       // null is the node.js callback convention. always an arrow
//       // normal response is usually null
//       // error situation would have an error object
//       res.set(list.join('\r\n'))
//       // res.send(); //@todo: insert your CSV data here.
//     })
// }
// // ex: remove credit card number from response
// Smartemail.after('pocOutputCsv', function(context, user, next) {
//   res.send(context.result)
// });
//
// Smartemail.remoteMethod('pocOutputCsv', {
//   accepts: [{
//       arg: 'data',
//       type: 'object'
//     },
//     {
//       arg: 'res',
//       type: 'object',
//       'http': {
//         source: 'res'
//       }
//     }
//   ],
//   description: 'Given a model id, returns a CSV of the final output',
//   http: {
//     path: '/pocOutputCsv/:modelId',
//     verb: 'get'
//   },
//   returns: [{
//     arg: 'csv',
//     type: 'string',
//   }, {
//     arg: 'metric',
//     type: 'number',
//   },
// });
