import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FranchisetoproductComponent } from './franchisetoproduct.component';

describe('FranchisetoproductComponent', () => {
  let component: FranchisetoproductComponent;
  let fixture: ComponentFixture<FranchisetoproductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FranchisetoproductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FranchisetoproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
