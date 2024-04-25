import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XaxisComponent } from './xaxis.component';

describe('XaxisComponent', () => {
  let component: XaxisComponent;
  let fixture: ComponentFixture<XaxisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [XaxisComponent]
    });
    fixture = TestBed.createComponent(XaxisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
