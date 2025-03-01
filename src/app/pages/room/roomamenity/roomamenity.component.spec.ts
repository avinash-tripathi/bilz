import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomamenityComponent } from './roomamenity.component';

describe('RoomamenityComponent', () => {
  let component: RoomamenityComponent;
  let fixture: ComponentFixture<RoomamenityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomamenityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomamenityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
