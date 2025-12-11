import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterOrg } from './register-org';

describe('RegisterOrg', () => {
  let component: RegisterOrg;
  let fixture: ComponentFixture<RegisterOrg>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterOrg]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterOrg);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
