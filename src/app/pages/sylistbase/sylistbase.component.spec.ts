import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SylistbaseComponent } from './sylistbase.component';

describe('SylistbaseComponent', () => {
  let component: SylistbaseComponent;
  let fixture: ComponentFixture<SylistbaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SylistbaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SylistbaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
