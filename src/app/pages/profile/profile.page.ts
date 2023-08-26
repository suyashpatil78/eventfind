import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { User } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: User = null;

  isLoading = false;

  constructor(
    private router: Router,
    private loadingController: LoadingController,
    private authService: AuthService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    this.user = await this.authService.getCurrentUser();
    this.isLoading = false;
  }

  async signOut(): Promise<void> {
    const loading = await this.loadingController.create();
    await loading.present();

    await this.authService.signOut();
    await loading.dismiss();

    this.router.navigateByUrl('', { replaceUrl: true });
  }

  async doRefresh(event: Partial<CustomEvent>): Promise<void> {
    this.user = await this.authService.getCurrentUser();
    const eventTarget = event.target as HTMLIonRefresherElement;
    eventTarget.complete();
  }

  getRowIndices(): number[] {
    const rowCount = Math.ceil(this.user?.images.length / 2);
    return Array.from({ length: rowCount }, (_, index) => index);
  }

  getColumnIndices(): number[] {
    return Array.from({ length: 2 }, (_, index) => index);
  }

  getIndex(rowIndex: number, colIndex: number): number {
    return rowIndex * 2 + colIndex;
  }
}
