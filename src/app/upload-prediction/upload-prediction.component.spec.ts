import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPredictionComponent } from './upload-prediction.component';

describe('UploadPredictionComponent', () => {
  let component: UploadPredictionComponent;
  let fixture: ComponentFixture<UploadPredictionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadPredictionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadPredictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
