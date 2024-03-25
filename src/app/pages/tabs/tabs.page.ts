import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  user: User | null = null;

  isLoading = false;

  ngOnInit(): void {
    this.isLoading = true;

    /*
     * sets up a listner to the user property in the auth service
     * whenever the user updates any data, we want to update the user property
     */
    this.authService.subscribeToUserUpdates((user) => {
      this.user = user;
      this.isLoading = false;
    });
  }

  goToProfilePage(): void {
    this.router.navigateByUrl('tabs/profile', { replaceUrl: true });
  }
}
