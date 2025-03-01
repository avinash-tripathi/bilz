import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WALLETComponent } from './wallet.component';

describe('WALLETComponent', () => {
  let component: WALLETComponent;
  let fixture: ComponentFixture<WALLETComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WALLETComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WALLETComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
