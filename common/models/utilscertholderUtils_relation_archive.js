//now, trying to add each relation to the graph.
// console.log("\n\n-------finding the following relations: -------")
//
// for (let _relation of _relations) {
//   // find the source node ID
//   // console.log(JSON.stringify(_relation, null, 2))
//   let source_type = _relation.arguments[0].entities[0].type;
//   let source_text = _relation.arguments[0].entities[0].text;
//   let source_id = null;
//   // console.log("looking for source text " + source_text)
//   // console.log("looking for source type " + source_type)
//
//   for (let entity_id of Object.keys(_entities)) {
//     if (_entities[entity_id].text == source_text && _entities[entity_id].type == source_type){
//       // console.log("found it")
//
//       // console.log(_entities[entity_id])
//       source_id = entity_id
//       break;
//     }
//   }
//
//   // find the target node id
//   let target_type = _relation.arguments[1].entities[0].type
//   let target_text = _relation.arguments[1].entities[0].text
//   let target_id = null;
//
//   // console.log("looking for target text " + target_text)
//   // console.log("looking for target type " + target_type)
//   for (let entity_id of Object.keys(_entities)) {
//     if (_entities[entity_id].text == target_text && _entities[entity_id].type == target_type && !_entities[entity_id].visited) {
//       if (_entities[entity_id].type == 'Address_StreetNumber' || _entities[entity_id].type == 'Address_City' ||
//           _entities[entity_id].type == 'Address_State' || _entities[entity_id].type == 'Address_Zip') {
//             // need to mark visited
//             _entities[entity_id].visited = true
//           }
//       target_id = entity_id;
//       break;
//     }
//   }
//   //let source_id = _entities.filter(_entity => (_entity.type == source_type && _entity.text == source_text));
//   console.log(target_id + " " + target_type + ": "+ target_text + "'  ---> " + source_id + ": "+ source_type + ": '"+ source_type+ "'")
//   // note, switching the relationships order from the WKS model to make them more intuitive
//   if(target_id && source_id) {
//     g.addEdge(target_id, source_id)
//   }
// }
