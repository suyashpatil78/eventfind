import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth.service';

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
    private loadingController: LoadingController,
    private alertController: AlertController,
  ) {}

  fg!: FormGroup;

  ngOnInit() {
    this.fg = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    const user = await this.authService.login(this.fg.value);
    await loading.dismiss();

    if (user) {
      this.router.navigateByUrl('tabs/feed', { replaceUrl: true });
    } else {
      this.showAlert('Login failed', 'Please try again!');
    }
  }

  async onSubmit() {
    if (this.fg.valid) {
      await this.login();
    } else {
      this.fg.markAllAsTouched();
    }
  }

  isValid(control: string) {
    return !this.fg.controls[control].touched || this.fg.controls[control].valid;
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  DoesNotHaveAnAccountClick() {
    this.router.navigate(['/', 'register']);
  }
}
