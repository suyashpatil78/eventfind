import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EventPage } from './event.page';

xdescribe('EventPage', () => {
  let component: EventPage;
  let fixture: ComponentFixture<EventPage>;

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(EventPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
