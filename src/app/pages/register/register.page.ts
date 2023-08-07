import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loadingController: LoadingController,
    private authService: AuthService,
    private alertController: AlertController,
  ) {}

  fg!: FormGroup;

  ngOnInit() {
    this.fg = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async register() {
    const loading = await this.loadingController.create();
    await loading.present();

    const user = await this.authService.register(this.fg.value);
    await loading.dismiss();

    if (user) {
      this.router.navigateByUrl('info', { replaceUrl: true });
    } else {
      this.showAlert('Registration failed', 'Please try again!');
    }
  }

  async onSubmit() {
    if (this.fg.valid) {
      await this.register();
    } else {
      this.fg.markAllAsTouched();
    }
  }

  isValid(control: string) {
    return (
      this.fg.controls[control].valid || (this.fg.controls[control].pristine && !this.fg.controls[control].touched)
    );
  }

  onHaveAnAccountClick() {
    this.router.navigate(['/', 'login']);
  }
}
