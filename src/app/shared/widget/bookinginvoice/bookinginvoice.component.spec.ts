import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookinginvoiceComponent } from './bookinginvoice.component';

describe('BookinginvoiceComponent', () => {
  let component: BookinginvoiceComponent;
  let fixture: ComponentFixture<BookinginvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookinginvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookinginvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
