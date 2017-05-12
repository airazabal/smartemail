import { Injectable } from '@angular/core';

@Injectable()

export class UtilService {

  constructor() { }

  public _merge(text:any[], obj:any ) {
    // obj must have a .text field
    if (!obj.text) {
      return null
    }
    return text.reduce((merged, current) => {
        // 'current' is an obj with a text param
        // goes through each one...
        // split it...
        return merged.concat(current.text.split(obj.text).reduce((m, c) => {
          // if m = [], this is first time through...
          if (c === '') {
            // it is empty if matches at end or beginning.
            // in this case, we found our obj in first place
            return m.concat([obj]);
          } else if (m.length === 0) {
            return m.concat([{text: c}]);
          } else {
            return m.concat([obj, {text:c}])
          }
          /*

          if (m.length === 0) {
            if (c === '') {
            // it is empty if matches at end or beginning.
              // in this case, we found our obj in first place
              return m.concat([obj]);
            } else {
              return m.concat([{text: c}]);
            }
          } else {
            if (c === '') {
              return m.concat([obj]);
            } else {
              return m.concat([obj, {text:c}])
            }
          }
          */
        }, []))
      },[])
  }

  private _transform(text: string, obj: any[]) {
    // Cast the original text as a single object
    let result = [{text:text}]
    // Iterate over that object looking for obj.text entries
  }

}
