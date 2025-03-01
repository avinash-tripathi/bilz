import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintorderComponent } from './printorder.component';

describe('PrintorderComponent', () => {
  let component: PrintorderComponent;
  let fixture: ComponentFixture<PrintorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintorderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
