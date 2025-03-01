import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageamenityComponent } from './packageamenity.component';

describe('PackageamenityComponent', () => {
  let component: PackageamenityComponent;
  let fixture: ComponentFixture<PackageamenityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackageamenityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageamenityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
