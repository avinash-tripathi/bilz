import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FranchiseonboardComponent } from './franchiseonboard.component';

describe('FranchiseonboardComponent', () => {
  let component: FranchiseonboardComponent;
  let fixture: ComponentFixture<FranchiseonboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FranchiseonboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FranchiseonboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
