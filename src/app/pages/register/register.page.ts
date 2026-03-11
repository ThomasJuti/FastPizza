import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
    IonContent, IonButton, IonInput, IonItem, IonLabel,
    IonIcon, IonText, IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
    personOutline, mailOutline, lockClosedOutline,
    callOutline, locationOutline, arrowBackOutline, pizzaOutline
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        CommonModule, FormsModule,
        IonContent, IonButton, IonInput, IonItem, IonLabel,
        IonIcon, IonText, IonSpinner
    ],
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss']
})
export class RegisterPage {
    private authService = inject(AuthService);
    private router = inject(Router);

    displayName = '';
    email = '';
    password = '';
    phone = '';
    address = '';
    showPassword = false;
    isLoading = false;
    errorMessage = '';
    successMessage = '';

    constructor() {
        addIcons({ personOutline, mailOutline, lockClosedOutline, callOutline, locationOutline, arrowBackOutline, pizzaOutline });
    }

    async register() {
        if (!this.displayName || !this.email || !this.password) {
            this.errorMessage = 'Nombre, correo y contraseña son obligatorios';
            return;
        }
        if (this.password.length < 6) {
            this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';
        try {
            await this.authService.register(this.email, this.password, this.displayName, this.phone, this.address);
            this.successMessage = '¡Cuenta creada exitosamente!';
            setTimeout(() => {
                this.router.navigate(['/tabs/menu']);
            }, 1000);
        } catch (error: any) {
            this.errorMessage = this.getErrorMessage(error.code);
        } finally {
            this.isLoading = false;
        }
    }

    goBack() {
        this.router.navigate(['/login']);
    }

    private getErrorMessage(code: string): string {
        switch (code) {
            case 'auth/email-already-in-use': return 'Ya existe una cuenta con este correo';
            case 'auth/invalid-email': return 'Correo electrónico inválido';
            case 'auth/weak-password': return 'La contraseña es muy débil';
            default: return 'Error al crear la cuenta. Intenta de nuevo';
        }
    }
}
