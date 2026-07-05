import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { AuthRepository } from './features/auth/domain/repositories/auth.repository';
import { AuthApiService } from './features/auth/data/repositories/auth-api.service';
import { AdminRepository } from './features/admin/domain/repositories/admin.repository';
import { AdminApiService } from './features/admin/data/repositories/admin-api.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    { provide: AuthRepository, useClass: AuthApiService },
    { provide: AdminRepository, useClass: AdminApiService }
  ]
};