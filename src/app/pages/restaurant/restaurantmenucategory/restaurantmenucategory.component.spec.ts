import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantmenucategoryComponent } from './restaurantmenucategory.component';

describe('RestaurantmenucategoryComponent', () => {
  let component: RestaurantmenucategoryComponent;
  let fixture: ComponentFixture<RestaurantmenucategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestaurantmenucategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantmenucategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
