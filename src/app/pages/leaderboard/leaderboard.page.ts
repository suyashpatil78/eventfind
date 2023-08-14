import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { EventService } from 'src/app/core/services/event.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.page.html',
  styleUrls: ['./leaderboard.page.scss'],
})
export class LeaderboardPage implements OnInit {
  players: any = [];
  isLoading = false;

  constructor(
    private eventService: EventService,
    private authService: AuthService,
  ) {}

  async ngOnInit() {
    this.isLoading = true;
    this.authService.subscribeToUserUpdates(async () => {
      this.players = await this.eventService.getAllPlayers();
      this.players.sort((a: any, b: any) => b.points - a.points);
    });
    this.isLoading = false;
  }

  async doRefresh(event: any) {
    this.players = await this.eventService.getAllPlayers();
    this.players.sort((a: any, b: any) => b.points - a.points);
    event.target.complete();
  }
}
