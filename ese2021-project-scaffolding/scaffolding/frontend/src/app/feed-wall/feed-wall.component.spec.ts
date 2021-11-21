import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedWallComponent } from './feed-wall.component';

describe('FeedWallComponent', () => {
  let component: FeedWallComponent;
  let fixture: ComponentFixture<FeedWallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedWallComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedWallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
