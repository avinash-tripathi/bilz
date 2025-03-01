import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FranchisecategoryComponent } from './franchisecategory.component';

describe('FranchisecategoryComponent', () => {
  let component: FranchisecategoryComponent;
  let fixture: ComponentFixture<FranchisecategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FranchisecategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FranchisecategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
