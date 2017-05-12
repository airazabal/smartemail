import { TestBed, inject } from '@angular/core/testing';

import { ConfusionMatrixService } from './confusion-matrix.service';

describe('ConfusionMatrixService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfusionMatrixService]
    });
  });

  it('should ...', inject([ConfusionMatrixService], (service: ConfusionMatrixService) => {
    expect(service).toBeTruthy();
  }));
});
