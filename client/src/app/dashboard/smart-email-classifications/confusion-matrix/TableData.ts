export class TableData {
  // Array of objects w/
  // { 'row': 'row name',
  //   'column': 'column',
  //   'value': 'value' }
  private _columns:string[] = []
  private _rows:string[] = []

  constructor(private arrayOfObjects:any[]) {

  }

  get columns():string[] {
    if (this._columns.length === 0) {
      let _cols = this.arrayOfObjects.reduce((columns, current) => {
        columns[current.column] = 0
        return columns
      }, {})
      this._columns = Object.keys(_cols)
    }
    return this._columns
  }

  get rows():string[] {
    if (this._rows.length === 0) {
      let _rows = this.arrayOfObjects.reduce((rows, current) => {
        rows[current.row] = 0
        return rows
      }, {})
      this._rows = Object.keys(_rows)
    }
    return this._rows
  }

  array():any[] {
    let arrayData = []
    // Push columns first
    // First column needs to be Null or title of rows?
    arrayData.push([null].concat(this.columns))
    console.log('this._rows', this._rows)

    console.log('this.arrayOfObjects', this.arrayOfObjects)

    this.rows.forEach((row) => {
      // preload the row string
      let r = [row]
      this.columns.forEach((column) => {
        r.push(this._getObject(row,column))
      })
      arrayData.push(r)
    })
    return arrayData
  }

  _getObject(row:string,column:string):any {
    let filtered = this.arrayOfObjects.filter((o) => {
      return (o.row === row && o.column === column)
    })
    if (filtered.length === 1) {
      return filtered[0]
    } else {
      return null
    }
  }

}
