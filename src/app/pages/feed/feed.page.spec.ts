import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FeedPage } from './feed.page';

xdescribe('FeedPage', () => {
  let component: FeedPage;
  let fixture: ComponentFixture<FeedPage>;

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(FeedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
