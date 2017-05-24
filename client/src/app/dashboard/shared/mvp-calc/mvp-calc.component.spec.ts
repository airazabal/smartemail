import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MvpCalcComponent } from './mvp-calc.component';

describe('MvpCalcComponent', () => {
  let component: MvpCalcComponent;
  let fixture: ComponentFixture<MvpCalcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MvpCalcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MvpCalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
