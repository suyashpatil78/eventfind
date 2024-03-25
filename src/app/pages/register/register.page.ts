import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { catchError, finalize, from, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loaderService: LoaderService,
    private alertController: AlertController,
    private authService: AuthService,
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

  register(): void {
    from(this.loaderService.showLoader())
      .pipe(
        switchMap(() => this.authService.register(this.formValue)),
        catchError((error) => {
          this.showAlert('Registration failed', 'Please try again!');
          return throwError(error);
        }),
        finalize(() => from(this.loaderService.hideLoader())),
      )
      .subscribe(() => {
        // replaceUrl make sure the user can't go back to the login page
        this.router.navigateByUrl('info', { replaceUrl: true });
      });
  }

  onSubmit(): void {
    if (this.fg.valid) {
      this.register();
    } else {
      this.fg.markAllAsTouched();
    }
  }

  isInvalid(control: string): boolean {
    return this.fg.controls[control].touched && !this.fg.controls[control].valid;
  }

  onHaveAnAccountClick(): void {
    this.router.navigate(['/', 'login']);
  }
}
