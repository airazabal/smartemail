import { Component, OnInit, Input, OnChanges, SimpleChange } from '@angular/core';

declare var c3: any

@Component({
  selector: 'app-mvp-calc',
  templateUrl: './mvp-calc.component.html',
  styleUrls: ['./mvp-calc.component.css']
})
export class MvpCalcComponent implements OnInit {

  @Input() transactions: any[]

  private actuals: any = {}
  private mvpList: any = {}
  private graphData: any[] = []

  constructor() { }

  ngOnInit() {
    //    this.reformulateData()
    //   this.buildChart()
  }

  reformulateData() {

    let colors = {
      negative: '#dc267f', positive: '#008949', neutral: '#dddee1'
    }
    if (!this.mvpList) {
      return
    }
    // Create a list of data:
    // [ transaction_type, correct Policy_number, remainder/total]

    let categories:any[] = ['x']
    let tp:any[] = ['True Positives']
    let m_pn:any[] = ['Missed Policy Number']
    let missed:any[] = ['Missed']
    Object.keys(this.mvpList).forEach((classification) => {
      console.log('Working on classification: ', classification)
      categories.push(classification)
      let tp_pn_count = 0;
      let missed_pn = 0;
      this.mvpList[classification].forEach((email) => {
        if (email.toc) {
          let tp_pn = email.toc.filter((entity) => {
            return (entity.type === 'Policy_Number' && entity.toc_type === 'true_positive')
          })
          if (tp_pn.length > 0) {
            tp_pn_count++
          } else {
            missed_pn++
          }
        } else {
          missed_pn++
        }
      })
      // Convert to percentage. (out of 100%)
      console.log(`${classification} - ${tp_pn_count} - ${missed_pn} - ${this.actuals[classification]} `)
      let missed_count = this.actuals[classification]-tp_pn_count-missed_pn
      tp.push(tp_pn_count/this.actuals[classification]*100)
      m_pn.push(missed_pn/this.actuals[classification]*100)
      missed.push(missed_count/this.actuals[classification]*100)
    })
    this.graphData.push(categories,tp,m_pn,missed)
    console.log('graphData', this.graphData)
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    console.log('TransactionCount - ngOnChanges --', changes)
    if (this.transactions) {
      this.actuals = {}
      // Reset actuals...
      this.transactions.forEach((email) => {
        // We want to go find all emails that have a GOOD Policy Number
        // and a GOOD Transaction Type... and create a list.
        if (!this.actuals.hasOwnProperty(email.topTransactionActual)) {
          this.actuals[email.topTransactionActual] = 0
        }
        this.actuals[email.topTransactionActual]++
        if (email.topTransactionPredicted === email.topTransactionActual) {
          // true positive policy numbers..
          if (!this.mvpList.hasOwnProperty(email.topTransactionActual)) {
            this.mvpList[email.topTransactionActual] = []
          }
          this.mvpList[email.topTransactionActual].push(email)
        }
      })
      console.log(this.mvpList)
      this.reformulateData()
      this.buildChart()
    }
  }
  buildChart() {
    let colors = {
      'True Positives': '#116639', 'Missed Policy Number': '#57d785', 'Missed': '#cef3d1'
    }
    var chart = c3.generate({
      bindto: '#mvp-calc-chart',
      data: {
        x: 'x',
        columns: this.graphData,
        type: 'bar',
        groups: [
          ['True Positives', 'Missed Policy Number', 'Missed']
        ],
        colors: colors
      },
      bar: {
        width: {
          ratio: 0.5
        }
      },
      axis: {
        x: {
          type: 'category'
        },
        rotated: true
      },
      legend: {
        show: true
      },
      size: {
        height: 200
      }
    });
  }
}
