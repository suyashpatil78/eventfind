import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { InfoPage } from './info.page';

xdescribe('InfoPage', () => {
  let component: InfoPage;
  let fixture: ComponentFixture<InfoPage>;

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(InfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
