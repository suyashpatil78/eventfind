import { Component, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { User } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.page.html',
  styleUrls: ['./leaderboard.page.scss'],
})
export class LeaderboardPage implements OnInit {
  users: User[] = [];

  isLoading = false;

  constructor(private authService: AuthService) {}

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    this.authService.subscribeToUserUpdates(() => {
      this.authService.getAllUsers().subscribe((users) => {
        this.users = users;
        this.users.sort((a: User, b: User) => b.points - a.points);
        this.isLoading = false;
      });
    });
  }

  doRefresh(evt: Partial<CustomEvent>): void {
    from(this.authService.getAllUsers()).subscribe((users) => {
      this.users = users;
      const eventTarget = evt.target as HTMLIonRefresherElement;
      eventTarget.complete();
    });
  }
}
