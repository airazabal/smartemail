import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailVizComponent } from './email-viz.component';

describe('EmailVizComponent', () => {
  let component: EmailVizComponent;
  let fixture: ComponentFixture<EmailVizComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailVizComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailVizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
