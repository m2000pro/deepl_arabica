import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { AuthRepository } from './features/auth/domain/repositories/auth.repository';
import { AuthApiService } from './features/auth/data/repositories/auth-api.service';
import { AdminRepository } from './features/admin/domain/repositories/admin.repository';
import { AdminApiService } from './features/admin/data/repositories/admin-api.service';
import { DashboardRepository } from './features/dashboard/domain/repositories/dashboard.repository';
import { DashboardLocalService } from './features/dashboard/data/repositories/dashboard-local.service';
import { HistorialRepository } from './features/historial/domain/repositories/historial.repository';
import { HistorialApiService } from './features/historial/data/repositories/historial-api.service';
import { ReportesRepository } from './features/reportes/domain/repositories/reportes.repository';
import { ReportesApiService } from './features/reportes/data/repositories/reportes-api.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    { provide: AuthRepository, useClass: AuthApiService },
    { provide: AdminRepository, useClass: AdminApiService },
    { provide: DashboardRepository, useClass: DashboardLocalService },
    { provide: HistorialRepository, useClass: HistorialApiService },
    { provide: ReportesRepository, useClass: ReportesApiService }
  ]
};