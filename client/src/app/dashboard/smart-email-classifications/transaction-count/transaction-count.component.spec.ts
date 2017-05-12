import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionCountComponent } from './transaction-count.component';

describe('TransactionCountComponent', () => {
  let component: TransactionCountComponent;
  let fixture: ComponentFixture<TransactionCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
