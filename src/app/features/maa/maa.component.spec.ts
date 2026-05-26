import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaaComponent } from './maa.component';

describe('MaaComponent', () => {
  let component: MaaComponent;
  let fixture: ComponentFixture<MaaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MaaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
