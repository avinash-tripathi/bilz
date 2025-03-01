import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletrechargeComponent } from './walletrecharge.component';

describe('WalletrechargeComponent', () => {
  let component: WalletrechargeComponent;
  let fixture: ComponentFixture<WalletrechargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletrechargeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletrechargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
