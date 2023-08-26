import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { EventService } from 'src/app/core/services/event.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.page.html',
  styleUrls: ['./leaderboard.page.scss'],
})
export class LeaderboardPage implements OnInit {
  users: User[] = [];

  isLoading = false;

  constructor(
    private eventService: EventService,
    private authService: AuthService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    this.authService.subscribeToUserUpdates(async () => {
      this.users = await this.eventService.getAllUsers();
      this.users.sort((a: User, b: User) => b.points - a.points);
    });
    this.isLoading = false;
  }

  async doRefresh(event: Partial<CustomEvent>): Promise<void> {
    this.users = await this.eventService.getAllUsers();
    this.users.sort((a: User, b: User) => b.points - a.points);
    const eventTarget = event.target as HTMLIonRefresherElement;
    eventTarget.complete();
  }
}
