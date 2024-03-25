import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { catchError, finalize, from, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loaderService: LoaderService,
    private alertController: AlertController,
  ) {}

  fg: FormGroup;

  ngOnInit(): void {
    this.fg = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get formValue(): { email: string; password: string } {
    return this.fg.value as { email: string; password: string };
  }

  login(): void {
    from(this.loaderService.showLoader())
      .pipe(
        switchMap(() => this.authService.login(this.formValue)),
        catchError((error) => {
          this.showAlert('Incorrect Password', 'Please try again!');
          return throwError(error);
        }),
        finalize(() => from(this.loaderService.hideLoader())),
      )
      .subscribe(() => {
        // replaceUrl make sure the user can't go back to the login page
        this.router.navigateByUrl('tabs/feed', { replaceUrl: true });
      });
  }

  async onSubmit(): Promise<void> {
    if (this.fg.valid) {
      this.login();
    } else {
      this.fg.markAllAsTouched();
    }
  }

  isInvalid(control: string): boolean {
    return this.fg.controls[control].touched && !this.fg.controls[control].valid;
  }

  showAlert(header: string, message: string): void {
    from(
      this.alertController.create({
        header,
        message,
        buttons: ['OK'],
      }),
    )
      .pipe(switchMap((alert) => alert.present()))
      .subscribe();
  }

  DoesNotHaveAnAccountClick(): void {
    this.router.navigate(['/', 'register']);
  }
}
