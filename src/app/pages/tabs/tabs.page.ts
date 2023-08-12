import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  user: any;

  ngOnInit() {
    this.authService.subscribeToUserUpdates((user: any) => {
      this.user = user;
    });
  }

  goToProfilePage() {
    this.router.navigateByUrl('tabs/profile', { replaceUrl: true });
  }
}
