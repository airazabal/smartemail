export class ConfusionMatrix {

  // init the matrix
  public matrix: any = {}
  // Store combos we couldn't increment.
  public unknown:any[] = []
  private _statistics: any[]

  constructor(private _datamap: string[]) {
    // Only going to have an array of keys (strings)
    // to build our Matrix which will be like:
    // { value: { value: 0, value1: 0, value2, 0},
    //   value1: { value: 0, value1: 0, value2: 0},
    // etc...}
    let lineItem: any = this._datamap.reduce((line, item) => {
      line[item] = 0
      return line
    }, {})
    // Add actual key used to count actual
    lineItem.actual = 0
    // Set this to each item
    this.matrix = this._datamap.reduce((_matrix, item) => {
      // Must copy the lineItem object.
      _matrix[item] = Object.assign({},lineItem)
      return _matrix
    }, {})
    console.log(this.matrix)
  }

  increment(actual:string,predicted:string) {
    if (this.matrix.hasOwnProperty(actual)) {
      if (predicted) {
        if (this.matrix[actual].hasOwnProperty(predicted)) {
          this.matrix[actual].actual++
          this.matrix[actual][predicted]++
        } else {
          this.unknown.push(`${actual}:${predicted}`)
          console.log(`ConfusionMatrix: ${actual} predicted of ${predicted} not found`)
        }
      } else {
        this.matrix[actual].actual++
      }
    } else {
      console.log(`ConfusionMatrix: actual of ${actual} not found`)
      this.unknown.push(`${actual}:${predicted}`)
    }
  }
  keys():string[] {
    return Object.keys(this.matrix)
  }

  toTable():any {
    let t = {
      headers: [null,'F1 Score (Precision/Recall)'],
      summary: []
    }
    let cfKeys = this.keys()
    // Define the headers
    t.headers = t.headers.concat(cfKeys)
    cfKeys.forEach((row) => {
      // first get stats for the row.

      t[row]=[row].concat(this.getRowStatistics(row))
      // Add the predicted
      t[row]=t[row].concat(this.predictedToArray(row, cfKeys))
    })
    return t
   }

  toTableData():any {
    let rows = this.keys()
    return rows.reduce((td, current) => {
      return td.concat(this.predictedToArrayOfObjs(current, rows))
      // Remove statistics
      // .concat(this.getRowStatisticsAsObjs(current))
    },[])
   }
  // Take an actual, return array,
  predictedToArray(row:string, order:any[]):any[] {
    return order.map((header) => {
      return this.matrix[row][header]
    })
  }

  // Take an actual, return array,
  predictedToArrayOfObjs(row:string, order:any[]):any[] {
    return order.map((header) => {
      return { 'column': header,
               'row': row,
               'value': this.matrix[row][header] }
    })
  }

  getRowStatistics(row:string):any[] {
      let p = this._calculatePrecision(row)
      let r = this._calculateRecall(row)
      let f1 = this._calculateF1(p,r)
      return [f1, p, r]
  }

  getRowStatisticsAsObjs(row:string):any[] {
      let p = { 'row': row,
                'column': 'Precision',
                 'value': this._calculatePrecision(row) }

      let r = { 'row': row,
                'column': 'Recall',
                'value': this._calculateRecall(row) }

      let f1 = { 'row': row,
                  'column': 'F1',
                  'value': this._calculateF1(p.value,r.value)}

      return [f1, p, r]
  }


  statistics():any[] {
    // Precision
    // Sum of true positives/ sum of TP + FP
    this._statistics = Object.keys(this.matrix).map((k) => {
      let p = this._calculatePrecision(k)
      let r = this._calculateRecall(k)
      let f1 = this._calculateF1(p,r)
      return {
        class: k,
        f1: f1,
        precision: p,
        recall: r,
        support: this.matrix[k].actual
      }
    })
    return this._statistics
  }

  _calculateF1(precision?:number,recall?:number) {
    let f1 = 0;
    if (precision && recall) {
      f1 = 2*((precision*recall)/(precision + recall))
    }
    return f1
  }

  _calculatePrecision(classification:string):number {
    console.log('Calculating Precision ---------')
    const truePositives = this.matrix[classification][classification]
    const allPositives = Object.keys(this.matrix).reduce((sum, current)=> {
//      console.log('SUM? ', sum)
      return sum+=this.matrix[current][classification]
    },0)
//  console.log('allPositives:',allPositives)
    return (truePositives/allPositives)
  }

  _calculateRecall(classification:string):number {
    const truePositives = this.matrix[classification][classification]
    const actualPositives = this.matrix[classification].actual
    return (truePositives/actualPositives)
  }

  toMatrixArray():any[] {
    console.log('toMatrixArray - this.matrix', this.matrix)
    let k = this.keys()
    // First line headers...
    let confusionArray = [[null, 'actual'].concat(k)]

    k.forEach((actual) => {
      let a = [actual, this.matrix[actual].actual]
      k.forEach((p) => {
        a.push(this.matrix[actual][p])
      })
      confusionArray.push(a)
    })
    console.log('toMatrixArray - confusionArray', confusionArray)
    return confusionArray
  }
}
