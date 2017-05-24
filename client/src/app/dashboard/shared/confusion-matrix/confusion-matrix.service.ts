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
    'Driver': 'Driver',
    'not_found':'not_found'
  }
  // Map to search for matches for entities.
  // Updated on 5/21 to latest entity Map
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

  /** generate a confusion matrix for a 'Type', save it... */
  public generate(type:string, transactions: any[]): ConfusionMatrix {
    console.log('confusionMatrixService.generate --', type)
    let result = null;
    if (this._cmStore.hasOwnProperty(type)) {
      // Return this w/out creating a new one.
      /*
      if (this._cmStore[type]) {
        console.log('this._cmStore[type] is valid, returing existing data.', this._cmStore[type])
        result = this._cmStore[type]
      } else {
      */
        // type = 'classification'
        // Alway generate -- seems to be a problem otherwise...
        // TODO:  Investigate why...
        Object.keys(this._cmMap).forEach((t) => {
          // generate them all when we are called if we need to.
          this._cmStore[t] = this._cmMap[t](transactions)
        })
        // Should populate the type and we will return it here.
        result = this._cmStore[type]
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
      if (longform.topTransactionActual) {
        confusion.increment(longform.topTransactionActual, longform.topTransactionPredicted)
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
      confusionMatrix.increment(longform.toc)
     // console.log(`longform.toc ${longform.source_id} `, longform.toc)
    })
    //    console.log('ActualEntityList', actualEntityList)
    return confusionMatrix
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
}
