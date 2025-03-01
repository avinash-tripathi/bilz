import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantsellComponent } from './restaurantsell.component';

describe('RestaurantsellComponent', () => {
  let component: RestaurantsellComponent;
  let fixture: ComponentFixture<RestaurantsellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestaurantsellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantsellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
