import * as lodash from 'lodash';

// Take a ground truth and see if we found and entities...
const checkGroundtruth = (gt, en) => {
  return gt.map((_gt) => {
    // Go through and merge any that match
    _gt.is_ground_truth = true
    en.forEach((_en) => {
      if (_en.text === _gt.text) {
        // we found one, merge and push
        _gt.entity = _en
      }
    })
    return _gt
  })
}

// take gt and entitiy data and merg,e marking entities if they
// have groundtruth.
const mergeGroundTruthEntities = (gt, en) => {
  let mergedArray = []
  en.forEach((_en) => {
    let match: boolean = false
    // Go through and merge any that match
    gt.forEach((_gt) => {
      if (_en.text === _gt.text) {
        // we found one, merge and push
        _en.ground_truth = _gt
        _en.found = true
        match = true
      }
    })
    mergedArray.push(_en)
  })
  // Now make srue all of the Ground Truth's made it in
  gt.forEach((_gt) => {
    _gt.is_ground_truth = true
    if (!mergedArray.find((_ma) => {
      return _ma.text === _gt.text
    })) {
      // It was not found...
      _gt.found = false
      mergedArray.push(_gt)
    }
  })
  return mergedArray
}

const mergeGroundTruthTransactions = (gt, tr) => {

  // This is a Map for what WE call this and what it is called
  // In the Ground Truth
  const GTTransactionMap = {
    'Vehicle Change': 'Vehicle_Change',
    'Request for Certificate': 'Request_for_CERT',
    'COI': 'Request_for_CERT',
    'Request for CERT': 'Request_for_CERT',
    'Cancellation': 'Cancellation',
    'Location': 'Location',
    'Mailing': 'Mailing',
    'Driver': 'Driver'
  }

  let mergedArray = []
  tr.forEach((_tr) => {
    // Go through and merge any that match
    gt.forEach((_gt) => {
      //console.log(`Looking for ${_gt.transaction_type}`)
      if (_tr.transaction_type.trim() === GTTransactionMap[_gt.transaction_type.trim()]) {
      //console.log(`Found  ${_gt.transaction_type}`)
        // we found one, merge and push
        _tr.ground_truth = _gt
        _tr.found = true
      }
    })
    mergedArray.push(_tr)
  })
//  console.log('MergdArray: ', mergedArray)
  // Now make srue all of the Ground Truth's made it in
  gt.forEach((_gt) => {
    _gt.is_ground_truth = true
    if (!mergedArray.find((_ma) => {
      return _ma.transaction_type.trim() === GTTransactionMap[_gt.transaction_type.trim()]
    })) {
      // It was not found...
      _gt.found = false
      mergedArray.push(_gt)
    }
  })

  return mergedArray.map((_t) => {
    _t.toc_type = getTocType(_t.transaction_type)
    return _t
  })
}

const getTocType = (type:string) => {
  if (type === this.topTransactionActual && type === this.topTransactionPredicted) {
    return 'true_positive'
  }
  if (type === this.topTransactionActual && type !== this.topTransactionPredicted) {
    return 'false_positive'
  }
  // No predicted transaction
  if (type === this.topTransactionActual && !this.topTransactionPredicted) {
    return 'false_negative'
  }
  return null
}



export class SmartEmail {

  public entityPercentage: number = 0;
  public transactionPercentage: number = 0;
  public expanded = {
    emailSrc: false,
    transaction: true,
    entities: true
  }

  constructor(private _email: any) {
    // _email is my default object and will get saved as _email
  }

  get toc(): any {
    return this._email.toc
  }
  get topTransactionActual() : any {
    return this._email.topTransactionActual
  }

  get topTransactionPredicted() : any {
    return this._email.topTransactionPredicted
  }

  get ground_truth(): any {
    return this._email.ground_truth
  }

  get transaction_types(): any {
    return this._email.transaction_types
  }

  get source_email(): any {
    return this._email.source_email
  }

  get entities(): any {
    // Discovery way
//    return this._email.enriched_text.entities
    return this._email.entities_extracted
  }

  get exception(): any {
    return this._email.exception
  }
  get source_id(): string {
    return this._email.source_id
  }

  hasGroundTruthTransactions(): boolean {
    return (this.ground_truth &&
      this.ground_truth.transaction_types &&
      this.ground_truth.transaction_types.length > 0)
  }

  hasGroundTruthEntities(): boolean {
    return (this.ground_truth &&
      this.ground_truth.extracted_entities &&
      this.ground_truth.extracted_entities.length > 0)
  }
  /**
   * Return a combined array of GT & entities
   */
  entitiesVsGroundTruth(): any {
    let result: any[] = []

    if (this.hasGroundTruthEntities()) {
      // We have a ground truth to measuer against...
      // validate groundTruth
      result = mergeGroundTruthEntities(this.ground_truth.extracted_entities, this.entities)
      this.entityPercentage = result.filter(r => r.found).length / this.ground_truth.extracted_entities.length;
    } else {
      console.log('entitiesVsGroundTruth: No Ground Truth set.')
      result = this.entities
    }
    return result
  }

  transactionsVsGroundTruth(): any {

    let result: any[] = []
    if (this.hasGroundTruthTransactions()) {
      // We have a ground truth to measuer against...
      // validate groundTruth
      result = mergeGroundTruthTransactions(this.ground_truth.transaction_types, this.transaction_types)
      this.transactionPercentage = result.filter(r => r.found).length / this.ground_truth.transaction_types.length;
    } else {
      console.log('TransactionsVsGroundTruth: No Ground Truth set.')
      result = this.transaction_types
    }
    return result
  }
}
