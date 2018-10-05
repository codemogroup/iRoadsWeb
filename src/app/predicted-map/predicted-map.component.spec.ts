import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictedMapComponent } from './predicted-map.component';

describe('PredictedMapComponent', () => {
  let component: PredictedMapComponent;
  let fixture: ComponentFixture<PredictedMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PredictedMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PredictedMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
