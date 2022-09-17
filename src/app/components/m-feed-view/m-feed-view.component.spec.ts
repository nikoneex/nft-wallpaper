import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MFeedViewComponent } from './m-feed-view.component';

describe('MFeedViewComponent', () => {
  let component: MFeedViewComponent;
  let fixture: ComponentFixture<MFeedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MFeedViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MFeedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
