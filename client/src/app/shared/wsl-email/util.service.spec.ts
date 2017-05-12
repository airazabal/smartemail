import { TestBed, inject } from '@angular/core/testing';
import { UtilService } from './util.service';

describe('UtilService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UtilService]
    });
  });

  it('should ...', inject([UtilService], (service: UtilService) => {
    expect(service).toBeTruthy();
  }));

  it('should find obj in sentence', inject([UtilService], (service: UtilService) => {
    let t1 = {text: 'I love to run in the woods'}
    let o1 = { text: 'love', type: 'Unknown'}
    let b = service._merge([t1], o1)
    console.log('BBBBB: ', b)
    expect(b.length).toEqual(3);
  }));

  it('should find obj in begin & end of sentence', inject([UtilService], (service: UtilService) => {
    let t1 = {text: 'love I love to run in the woods love'}
    let o1 = { text: 'love', type: 'Unknown'}

    let b = service._merge([t1], o1)
    console.log('BBBBB: ', b)
    expect(b[0].text).toEqual('love');
    expect(b[b.length-1].text).toEqual('love');
    expect(service).toBeTruthy();
  }));

  it('should find them if together', inject([UtilService], (service: UtilService) => {
    let t1 = {text: 'love love woods love'}
    let o1 = { text: 'love', type: 'Unknown'}

    let b = service._merge([t1], o1)
    console.log('BBBBB: ', b)
    expect(b.length).toEqual(4);
    expect(b[0].text).toEqual('love');
    expect(b[1].text).toEqual('love');
    expect(b[b.length-1].text).toEqual('love');
    expect(service).toBeTruthy();
  }));
});
