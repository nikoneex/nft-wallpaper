import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MToolbarComponent } from './m-toolbar.component';

describe('MToolbarComponent', () => {
  let component: MToolbarComponent;
  let fixture: ComponentFixture<MToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MToolbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
