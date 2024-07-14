import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ProfilePage } from './profile.page';
import { AuthService } from 'src/app/core/services/auth.service';

xdescribe('ProfilePage', () => {
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(waitForAsync(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['subscribeToUserUpdates', 'getAllUsers']);
    TestBed.configureTestingModule({
      declarations: [ProfilePage],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    }).compileComponents();
    fixture = TestBed.createComponent(ProfilePage);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
