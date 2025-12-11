import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterRecipient } from './register-recipient';

describe('Recipient', () => {
  let component: RegisterRecipient;
  let fixture: ComponentFixture<RegisterRecipient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterRecipient],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterRecipient);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
