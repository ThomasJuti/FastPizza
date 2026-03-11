import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
    IonContent, IonHeader, IonToolbar, IonTitle, IonIcon, IonButton, IonButtons
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logOutOutline, shieldCheckmarkOutline, personCircleOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { UserProfile } from '../../models/user.model';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [
        CommonModule,
        IonContent, IonHeader, IonToolbar, IonTitle, IonIcon, IonButton, IonButtons
    ],
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit {
    private authService = inject(AuthService);
    private router = inject(Router);

    profile: UserProfile | null = null;

    constructor() {
        addIcons({ logOutOutline, shieldCheckmarkOutline, personCircleOutline });
    }

    ngOnInit(): void {
        this.authService.userProfile$.subscribe(p => {
            this.profile = p;
        });
    }

    goToAdmin(): void {
        this.router.navigate(['/admin/dashboard']);
    }

    async logout(): Promise<void> {
        await this.authService.logout();
        this.router.navigate(['/login']);
    }
}
