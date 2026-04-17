import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowingReviews } from './following-reviews';

describe('FollowingReviews', () => {
  let component: FollowingReviews;
  let fixture: ComponentFixture<FollowingReviews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowingReviews],
    }).compileComponents();

    fixture = TestBed.createComponent(FollowingReviews);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
