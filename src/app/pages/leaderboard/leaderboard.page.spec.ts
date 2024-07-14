import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LeaderboardPage } from './leaderboard.page';
import { AuthService } from 'src/app/core/services/auth.service';

describe('LeaderboardPage', () => {
  let component: LeaderboardPage;
  let fixture: ComponentFixture<LeaderboardPage>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(waitForAsync(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['subscribeToUserUpdates', 'getAllUsers']);
    TestBed.configureTestingModule({
      declarations: [LeaderboardPage],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaderboardPage);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
