import { Injectable } from '@angular/core';
import { ConfusionMatrix } from './ConfusionMatrix'

@Injectable()
export class ConfusionMatrixService {

  private GTTransactionMap: any = {
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
  // Map to search for matches for entities.
  private GTEntityMap: any = {
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
    Send_To: 'Send_To',
    'Send To': 'Send_To',
    COI_FormType_COI: 'COI_FormType_COI',
    'Form Type': 'COI_FormType_COI',
    Delivery_Method: 'Delivery_Method',
    'Delivery Method': 'Delivery_Method',
    Cert_Holder_Address: 'Cert_Holder_Address',
    'Cert Holder Address': 'Cert_Holder_Address',
    Cert_Holder_Name: 'Cert_Holder_Name',
    'Cert Holder Name': 'Cert_Holder_Name',
    Policy_Number: 'Policy_Number',
    'Policy Number': 'Policy_Number',
    COI_Wording_Additional_Insured: 'COI_Wording_Additional_Insured',
    'COI Wording Additional Insured': 'COI_Wording_Additional_Insured'
  }

  /** Store the ConfusionMatrix here */
  /** Types of confusion matrices we can generate */
  private _cmMap = {
    'classification': this._generateClassificationCM.bind(this),
    'entity': this._generateEntityCM.bind(this)
  }

  private _cmStore = {
    'classification': null,
    'entity': null
  }


  constructor() { }

  private _strCmp(text1:string, text2:string):boolean {
    if (text1 && text2) {
      if (text1.toLowerCase().trim() === text2.toLowerCase().trim() ) {
        // lowercase both and trim them... try for match...
        return true
      } else {
        // We will remove spaces/lowercase & trim
        let left = text1.replace(/\s+/g, '').toLowerCase()
        let right = text2.replace(/\s+/g, '').toLowerCase()
    //    console.log(`Comparing ${left} && ${right} ${left === right}`)
        return (left === right)
      }
    } else {
      return false
    }
  }

  /** generate a confusion matrix for a 'Type', save it... */
  public generate(type: string, transactions: any[]): ConfusionMatrix {
    console.log('confusionMatrixService.generate --', type)
    let result = null;
    if (this._cmStore.hasOwnProperty(type)) {
      // Return this w/out creating a new one.
      if (this._cmStore[type]) {
        console.log('this._cmStore[type] is falid, returing existing data.', this._cmStore[type])
        result = this._cmStore[type]
      } else {
        // type = 'classification'
        result = this._cmMap[type](transactions)
      }
    } else {
      throw new Error(`${type} is not valid, use one of: ${Object.keys(this._cmStore)}`)
    }
    // GT --> Transaction
    console.log('confusionMatrixService.generate --', result)
    return result
  }

  private _generateClassificationCM(transactions: any[]): ConfusionMatrix {
    console.log('_generateClassficiationCM called: ', transactions)
    const confusion = new ConfusionMatrix(this.gtAsArray(this.GTTransactionMap))
    // Transactions is an ARRAY.  We want to dice this up...
    // First reduce transaction_types to match the same number as ground_truth
    transactions.forEach((longform) => {
      let topPredicted: string = this.getTopPredictedTransaction(longform)
      let topActual: string = this.getTopActualTransaction(longform)
      let mappedActual: string = this.GTTransactionMap[topActual]
      if (!mappedActual) {
        console.log(`Actual ${topActual} does not map`)
      }
      if (topActual) {
        // actual/predicted...
        //        console.log('topActual is:  ',topActual)
        //       console.log('topPredicted is:  ',topPredicted)
        longform.topTransactionPredicted = topPredicted
        longform.topTransactionActual = mappedActual
        if (!topPredicted) {
          console.log('topPredicted not found: ', longform)
        }
        confusion.increment(this.GTTransactionMap[topActual], topPredicted)
      } else {
        console.log('Failed to do what was needed w/ this item', longform)
      }
    })
    return confusion
  }

  private _generateEntityCM(items: any[]) {
    // GT --> Transaction
    const confusionMatrix = new ConfusionMatrix(this.gtAsArray(this.GTEntityMap))

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

    items.forEach((longform) => {
      //  let topPredicted:string= this.getTopPredictedTransaction(longform)
      // let topActual:string = this.getTopActualTransaction(longform)
      let entities_actual = longform.ground_truth.extracted_entities
      let entities_predicted = longform.entities_extracted
      let source_id = longform.source_id
      // go through each of these and see if we found it.
      longform.toc = []
      if (entities_actual && entities_actual.length > 0) {
        // We have Ground Truth to compare against.
        if (entities_predicted && entities_predicted.length > 0) {
          // We have entities we found.
          /**
           * Go through all predicted items...
           */
          entities_predicted.forEach((predicted) => {
            // Init this property on longform
            // Deal with Types matching...
            entities_actual.filter((_actual) => {
              // The predicted type is an actual
              return (this.GTEntityMap[_actual.type] === predicted.type &&
                this._strCmp(_actual.text, predicted.text))
                // ^ Above matching on toLowerCase to see if results better.
            }).map((_actual) => {
              let newP = Object.assign({}, predicted)
              newP.source_id = source_id
              newP.toc_type = 'true_positive'
              newP.actual = _actual
              longform.toc.push(newP)
              return newP
            })
            //console.log(`After true_positive ${longform.source_id}`, longform.toc.length)
            // Now decide if predicted is a FalsePositive
            entities_actual.filter((_actual) => {
              // The predicted type is an actual and text is not OR text is not and Type is
              return (this.GTEntityMap[_actual.type] !== predicted.type &&
                this._strCmp(_actual.text, predicted.text)) ||
                (this.GTEntityMap[_actual.type] === predicted.type &&
                !this._strCmp(_actual.text, predicted.text))
            }).map((_actual) => {
              let newP = Object.assign({}, predicted)
              newP.source_id = source_id
              newP.toc_type = 'false_positive'
              newP.actual = _actual
              longform.toc.push(newP)
              return newP
            })
            //console.log(`After false_positive ${longform.source_id}`, longform.toc.length)
          })
          // Now what are the false negatives...
          entities_actual.filter((_actual) => {
            return (_actual.text !== 'NULL')
          }).reduce((false_negatives, _actual) => {
            //console.log('existing TOC -> ', JSON.stringify(longform.toc))
            let found = longform.toc.findIndex((entity) => {
  //            console.log(`searching ${entity.type} for ${_actual.type}`)
              return (entity.type === this.GTEntityMap[_actual.type])
            })
            if (found < 0) {
              // Create a new object...
              let newA = Object.assign({}, _actual)
              newA.text = null
              newA.source_id = source_id
              newA.toc_type = 'false_negative'
              newA.type = this.GTEntityMap[_actual.type]
              newA.actual = _actual
              longform.toc.push(newA)
              false_negatives.push(newA)
            //  console.log(`${longform.source_id} Found a False_Negative! `, newA)
            }
            return false_negatives
          }, [])
          //          console.log(`after false_negative ${longform.source_id}`, longform.toc.length)
          // Final_predicted is actually
        }
      }
      confusionMatrix.increment(longform.toc)
     // console.log(`longform.toc ${longform.source_id} `, longform.toc)
    })
    //    console.log('ActualEntityList', actualEntityList)
    return confusionMatrix
  }

  private _generateEntityCMOld(items: any[]) {
    // GT --> Transaction
    const confusionMatrix = new ConfusionMatrix(this.gtAsArray(this.GTEntityMap))
    /**
     *  We need to generate a confusion Matrix.
     *
     * For Entities, for each email, we need to go through the Actual
     * and check them against the Predicted.  They are both arrays, and
     * we need to Find:
     *   True Positives:  actual & predicted types are equal and text's are equal
     *   False Positives:  A & P Types equal, texts are not.
     *   False Negatives:  A & P Types Not equal, texts are...
     *
     *  Example:
     *  actual: Policy_Number, Predicted Policy_Number, but Text not equal...
     *
     */
    const actualEntityList = {}
    items.forEach((longform) => {
      //  let topPredicted:string= this.getTopPredictedTransaction(longform)
      // let topActual:string = this.getTopActualTransaction(longform)
      let entities_actual = longform.ground_truth.extracted_entities
      let entities_predicted = longform.entities_extracted
      let source_id = longform.source_id
      // go through each of these and see if we found it.
      if (entities_actual) {
        entities_actual.forEach((actual) => {
          // First Look that type was found...
          actualEntityList[actual.type] = ''
          let confusion = {
            // true positive
            tp: [],
            // false negative
            fn: [],
            // false positive
            fp: [],
            // true negative
            tn: [],
            // Not found
            nf: []
          }
          let a = this.GTEntityMap[actual.type];
          if (a) {
            // Deal with Types matching...
            let predicted = entities_predicted.filter((p) => {
              // we found a matching Type...
              return (p.type === a)
            }).reduce((prev, curr) => {
              // Reduce to a single Item...
              if (curr.text === actual.text) {
                // It is correct. The predicted text & Policy match
                // True positive
                prev.tp.push(curr)
              } else {
                // False Positive...
                prev.fp.push(curr)
              }
              return prev
            }, confusion)

            // Looking for false negatives...
            // Text matches, but Types do not...
            let final_predicted = entities_predicted.filter((p) => {
              // we found a matching text...
              return (p.text === actual.text)
            }).reduce((prev, curr) => {
              // Reduce to a single Item...
              if (curr.type !== a) {
                // The texts were matched but type is wrong  this is a
                // False Negative
                // Actually a False Positive for type it is...
                prev.fn.push(curr)
              }
              return prev
            }, predicted)

            // Finally -- if actual.text !== null and we didn't find it
            if (this.isZero(final_predicted)) {
              if (actual.text !== 'NULL') {
                // These are False Negatives (Type II Errors)
                final_predicted.fn.push(actual)
              }
            }
            //
            // Final_predicted is actually
///            console.log(`!!!!! final_predicted [${a}: ${actual.text}] -- ${this.isZero(final_predicted)}`)
            console.log('SCOTT WAS HERE')
            console.log('!!!!! final_predicted', final_predicted)
            confusionMatrix.increment(a, final_predicted)
          }
        })
      }
    })
    //    console.log('ActualEntityList', actualEntityList)
    return confusionMatrix
  }

  private isZero(toc: any): boolean {
    // all values in object are zero
    let maxValue = 0;
    Object.keys(toc).forEach((key) => {
      if (toc[key].length > maxValue) {
        maxValue = toc[key].length
      }
    })
    return (maxValue === 0)
  }

  private gtAsArray(gt: any): any[] {
    // translate keys to values.  Put in object so can deal w/ unique only
    let _gtO: any = Object.keys(gt).reduce((_gtObject, k) => {
      _gtObject[gt[k]] = 0
      return _gtObject
    }, {})
    // Return the keys of the object (should be unique)
    return Object.keys(_gtO)
  }

  private getTopPredictedTransaction(item: any): any {
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

  private getTopActualTransaction(item: any): string {
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

}
