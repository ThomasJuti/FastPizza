import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
    IonContent, IonButton, IonInput, IonItem, IonLabel,
    IonIcon, IonText, IonSpinner, IonInputPasswordToggle
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, pizzaOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule, FormsModule,
        IonContent, IonButton, IonInput, IonItem, IonLabel,
        IonIcon, IonText, IonSpinner, IonInputPasswordToggle
    ],
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss']
})
export class LoginPage {
    private authService = inject(AuthService);
    private router = inject(Router);

    email = '';
    password = '';
    showPassword = false;
    isLoading = false;
    errorMessage = '';

    constructor() {
        addIcons({ mailOutline, lockClosedOutline, pizzaOutline });
    }

    async loginWithEmail() {
        if (!this.email || !this.password) {
            this.errorMessage = 'Por favor completa todos los campos';
            return;
        }
        this.isLoading = true;
        this.errorMessage = '';
        try {
            await this.authService.loginWithEmail(this.email, this.password);
            this.router.navigate(['/tabs/menu']);
        } catch (error: any) {
            this.errorMessage = this.getErrorMessage(error.code);
        } finally {
            this.isLoading = false;
        }
    }

    goToRegister() {
        this.router.navigate(['/register']);
    }

    private getErrorMessage(code: string): string {
        switch (code) {
            case 'auth/user-not-found': return 'No existe una cuenta con este correo';
            case 'auth/wrong-password': return 'Contraseña incorrecta';
            case 'auth/invalid-email': return 'Correo electrónico inválido';
            case 'auth/too-many-requests': return 'Demasiados intentos. Intenta más tarde';
            case 'auth/invalid-credential': return 'Credenciales inválidas. Verifica tu correo y contraseña';
            default: return 'Error al iniciar sesión. Intenta de nuevo';
        }
    }
}
