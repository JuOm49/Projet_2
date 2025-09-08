import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorDataComponent } from './error-data.component';

describe('ErrorDataComponent', () => {
  let component: ErrorDataComponent;
  let fixture: ComponentFixture<ErrorDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
