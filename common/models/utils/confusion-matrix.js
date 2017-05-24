'use strict'
// Ground truth transaction mapping
const GTTransactionMap = {
  'Vehicle Change': 'Vehicle_Change',
  'Vehicle': 'Vehicle_Change',
  'Request for Certificate': 'Request_for_CERT',
  'Request for CERT': 'Request_for_CERT',
  'cert': 'Request_for_CERT',
  'COI': 'Request_for_CERT',
  'Cancellation': 'Cancellation',
  'cancel': 'Cancellation',
  'Location': 'Location',
  'Mailing': 'Mailing',
  'Driver': 'Driver'
}
const normalizeTr = (tr) => {
  return GTTransactionMap[tr.trim()]
}

// Map to search for matches for entities.
const GTEntityMap = {
  /*
  Location_ClassCode: 'Location_ClassCode',
  Vehicle_GarageZip: 'Vehicle_GarageZip',
  CancelReason: 'CancelReason',
  Effective_Date: 'Effective_Date',
  ChangeType_Modify: 'ChangeType_Modify',
  ChangeType_Add: 'ChangeType_Add',
  COI_Wording_Additional_Insured: 'COI_Wording_Additional_Insured',
  COI_Wording_Additional_Insured_Relationship: 'COI_Wording_Additional_Insured_Relationship',
  COI_Wording_All_Other: 'COI_Wording_All_Other',
  */
  Address_City: 'Address_City',
  Address_State: 'Address_State',
  Address_StreetNumber: 'Address_StreetNumber',
  Address_ZIP: 'Address_ZIP',
  'Address_Zip': 'Address_ZIP',
  // Changing Send_To to Email in type system...
  Send_To: 'Email',
  'Send To': 'Email',
  COI_FormType_COI: 'COI_FormType_COI',
  'Form Type': 'COI_FormType_COI',
  Delivery_Method: 'Delivery_Method',
  'Delivery Method': 'Delivery_Method',
  'Cert Holder Address': 'Cert_Holder_Address',
  // Use Company Name instead of Cert_Holder_Name
  Cert_Holder_Name: 'Company_Name',
  'Cert Holder Name': 'Company_Name',
  'Phone_Number': 'Phone_Number',
  Policy_Number: 'Policy_Number',
  'Policy Number': 'Policy_Number',
  COI_Wording_Additional_Insured: 'COI_Wording_Additional_Insured',
  'COI Wording Additional Insured': 'COI_Wording_Additional_Insured'
}

const normalizeEntity = (entity) => {
  return GTEntityMap[entity.trim()]
}

const _strContains = (text1, text2) => {
  // String 1 Contains String 2
  console.log(`_strContains comparing: ${text1} to ${text2}`)
  let match = false
  if (text1 && text2) {
    // We will remove spaces/lowercase & trim
    // Occassionally it might have a # in front, remove it if it does for comparison
    let left = text1.replace(/\s+/g, '').replace(/^#/g, '').toLowerCase()
    let right = text2.replace(/\s+/g, '').replace(/^#/g, '').toLowerCase()
    //left should be the 'long one' the modulus should be 0
    console.log(`Comparing ${left} && ${right} ${left.length % right.length} ${left.search(right)}`)
    if (left.length % right.length === 0) {
      match = left.search(right) >= 0
    }
  }
  console.log(`_strContains: Matched: ${match}`)
  return match
}


// Compare two strings
const _strCmp = (text1, text2) => {
//  console.log(`_strCmp comparing: ${text1} to ${text2}`)
  let match = false
  if (text1 && text2) {
    if (text1.toLowerCase().trim() === text2.toLowerCase().trim()) {
      // lowercase both and trim them... try for match...
      match = true
    } else {
      // We will remove spaces/lowercase & trim
      // Occassionally it might have a # in front, remove it if it does for comparison
      let left = text1.replace(/\s+/g, '').replace(/^#/g, '').toLowerCase()
      let right = text2.replace(/\s+/g, '').replace(/^#/g, '').toLowerCase()
      //    console.log(`Comparing ${left} && ${right} ${left === right}`)
      match = (left === right)
    }

    // We only try this technique if text two is > 7 length.  That makes it less likely
    // it will be in the longer pattern...
    if (!match && text2.length > 7) {
      // Try the strContains method...
      match = _strContains(text1,text2)
    }
  }
 // console.log(`_strCmp: Matched: ${match}`)
  return match
}


const getTopPredictedTransaction = (item) => {
  let predicted = null;
  // Sort it
  if (item.transaction_types.length > 0) {
    item.transaction_types.sort((a, b) => {
      return (b.confidence_level - a.confidence_level)
    })
    predicted = item.transaction_types[0].transaction_type.trim()
  }
  // Return the first 1
  return predicted
}


const getTopActualTransaction = (item) => {
  let actual = null
  if (item.ground_truth && item.ground_truth.transaction_types) {
    // Item has a ground_truth
    // Return the first one.
    if (item.ground_truth.transaction_types.length > 0) {
      actual = item.ground_truth.transaction_types[0].transaction_type.trim()
    }
  }
  return actual
}

// Given an email, search its groundTruth and see if we can add the actual/predicted to compare to.
const _transactionAnalysis = (email) => {
  // Transactions is an ARRAY.  We want to dice this up...
  // First reduce transaction_types to match the same number as ground_truth
  let topPredicted = getTopPredictedTransaction(email)
  let topActual = getTopActualTransaction(email)
  let mappedActual = GTTransactionMap[topActual]
  console.log(`_transactionAnalysis ${topPredicted}:${topActual} --> ${mappedActual}`)
  if (!mappedActual) {
    console.log(`Actual ${topActual} does not map`)
  }
  if (topActual) {
    // actual/predicted...
    //        console.log('topActual is:  ',topActual)
    //       console.log('topPredicted is:  ',topPredicted)
    email.topTransactionPredicted = topPredicted
    email.topTransactionActual = mappedActual
    if (!topPredicted) {
      console.log('topPredicted not found: ', email)
    }
  } else {
    console.log('Failed to do what was needed w/ this item', email)
  }
  return email
}

// Add a 'toc' field to the email.  This has all
// the ACTUAL Entities (not NULL) and the Predicted entities
// analyzed and merged together.
const _entityAnalysis = (email) => {
  console.log('confusion-matrix._entityAnalysis begin: ', email.toc)
  /**
   *  We need to generate a confusion Matrix.
   *
   * For Entities, for each email, we need to go through the Predicted
   * and check them against the Actual.  They are both arrays, and
   * we need to Find:
   *   True Positives:  actual & predicted types are equal and text's are equal
   *   False Positives:  A & P Types equal, texts are not.
   *   False Negatives:  Actual Defined, no Predicted (Type II)
   *
   *  Example:
   *  actual: Policy_Number, Predicted Policy_Number, but Text not equal...
   *
   *  For filtering later, we need to update the item itself with
   *  information about what was foudn/not found. we need a:
   *
   * toc: [{ type, text, toc_type}]
   */
  //  let topPredicted:string= this.getTopPredictedTransaction(email)
  // let topActual:string = this.getTopActualTransaction(email)
  let entities_actual = email.ground_truth.extracted_entities
  let entities_predicted = email.entities_extracted
  let source_id = email.source_id
  // go through each of these and see if we found it.
  email.toc = []
  if (entities_actual && entities_actual.length > 0) {
    // We have Ground Truth to compare against.
    if (entities_predicted && entities_predicted.length > 0) {
      // We have entities we found.
      /**
       * Go through all predicted items...
       */
      entities_predicted.forEach((predicted) => {
        // Init this property on email
        // Deal with Types matching...
        entities_actual.filter((_actual) => {
          // The predicted type is an actual
          let tp = false;
          if (normalizeEntity(_actual.type) === predicted.type ) {
            if (predicted.type === 'Policy_Number') {
              // This is a special case, the Ground truth COULD have two so we will
              // validate the length and then compare... Trimmed length should be 8
              if (_strCmp(_actual.text, predicted.text)) {
                tp = true
              } else {
                 tp = _strContains(_actual.text, predicted.text)
                // Now not an exact match, but could be 'IN THERE.'
              }
            } else {
              tp = _strCmp(_actual.text, predicted.text)
            }
          }
          return tp
        }).map((_actual) => {
          let newP = Object.assign({}, predicted)
          newP.source_id = source_id
          newP.toc_type = 'true_positive'
          newP.actual = _actual
          email.toc.push(newP)
          return newP
        })
        // anything already marked in toc as a True_Positive should be ignored now.
//        console.log(`After true_positive ${email.source_id}`, email.toc)
        // Now decide if predicted is a FalsePositive
        // A false_positive is something we found, but should not have found.
        entities_actual.filter((_actual) => {
          // The predicted type is an actual and text is not OR text is not and Type is
          return (normalizeEntity(_actual.type) !== predicted.type &&
              _strCmp(_actual.text, predicted.text)) ||
            (normalizeEntity(_actual.type) === predicted.type &&
              !_strCmp(_actual.text, predicted.text))
        }).map((_actual) => {
          let newP = Object.assign({}, predicted)
          newP.source_id = source_id
          newP.toc_type = 'false_positive'
          newP.actual = _actual
          email.toc.push(newP)
          return newP
        })
 //       console.log(`After false_positive ${email.source_id}`, email.toc)
      })
      // Now what are the false negatives...
      entities_actual.filter((_actual) => {
        return (_actual.text !== 'NULL')
      }).reduce((false_negatives, _actual) => {
        //console.log('existing TOC -> ', JSON.stringify(email.toc))
        let found = email.toc.findIndex((entity) => {
          //            console.log(`searching ${entity.type} for ${_actual.type}`)
          return (entity.type === normalizeEntity(_actual.type))
        })
        if (found < 0) {
          // Create a new object...
          let newA = Object.assign({}, _actual)
          newA.text = null
          newA.source_id = source_id
          newA.toc_type = 'false_negative'
          newA.type = normalizeEntity(_actual.type)
          newA.actual = _actual
          email.toc.push(newA)
          false_negatives.push(newA)
      //    console.log(`${email.source_id} Found a False_Negative! `, newA)
        }
        return false_negatives
      }, [])
  //    console.log(`after false_negative ${email.source_id}`, email.toc)
      // Final_predicted is actually
    }
  }
  console.log('confusion-matrix._entityAnalysis end: ', email.toc)
  return email
}

const populateConfusion = (email) => {
  console.log('populateConfusion -- Start ')
  return _entityAnalysis(_transactionAnalysis(email))
}

module.exports = {
  populateConfusion : populateConfusion
}
