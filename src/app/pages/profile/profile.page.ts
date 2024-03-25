import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, from, switchMap } from 'rxjs';
import { User } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoaderService } from 'src/app/core/services/loader.service';

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
    private authService: AuthService,
    private loaderService: LoaderService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    this.authService.getCurrentUser().subscribe((user) => {
      this.user = user;
      this.isLoading = false;
    });
  }

  signOut(): void {
    from(this.loaderService.showLoader('Signing out...'))
      .pipe(
        switchMap(() => this.authService.signOut()),
        finalize(() => this.loaderService.hideLoader()),
      )
      .subscribe(() => {
        this.router.navigateByUrl('/login', { replaceUrl: true });
      });
  }

  doRefresh(evt: Partial<CustomEvent>): void {
    from(this.authService.getCurrentUser()).subscribe((user) => {
      this.user = user;
      const eventTarget = evt.target as HTMLIonRefresherElement;
      eventTarget.complete();
    });
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
