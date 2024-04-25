import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YaxisComponent } from './yaxis.component';

describe('YaxisComponent', () => {
  let component: YaxisComponent;
  let fixture: ComponentFixture<YaxisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [YaxisComponent]
    });
    fixture = TestBed.createComponent(YaxisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
