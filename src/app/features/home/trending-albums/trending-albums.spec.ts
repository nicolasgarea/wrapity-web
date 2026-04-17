import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingAlbums } from './trending-albums';

describe('TrendingAlbums', () => {
  let component: TrendingAlbums;
  let fixture: ComponentFixture<TrendingAlbums>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrendingAlbums],
    }).compileComponents();

    fixture = TestBed.createComponent(TrendingAlbums);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
