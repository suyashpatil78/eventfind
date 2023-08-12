import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventpagePage } from './eventpage.page';

describe('EventpagePage', () => {
  let component: EventpagePage;
  let fixture: ComponentFixture<EventpagePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EventpagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
