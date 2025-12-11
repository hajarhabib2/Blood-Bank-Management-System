import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodBankList } from './blood-bank-list';

describe('BloodBankList', () => {
  let component: BloodBankList;
  let fixture: ComponentFixture<BloodBankList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BloodBankList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BloodBankList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
