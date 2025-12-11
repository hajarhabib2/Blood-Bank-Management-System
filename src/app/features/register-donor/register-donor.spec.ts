import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterDonor } from './register-donor';

describe('RegisterDonor', () => {
  let component: RegisterDonor;
  let fixture: ComponentFixture<RegisterDonor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterDonor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterDonor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
