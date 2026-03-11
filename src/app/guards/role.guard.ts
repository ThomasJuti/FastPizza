import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs';

export const roleGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.userProfile$.pipe(
        take(1),
        map(profile => {
            if (profile?.role === 'admin') return true;
            router.navigate(['/tabs/menu']);
            return false;
        })
    );
};
