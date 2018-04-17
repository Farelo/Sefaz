import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import {
    AlertsService,
    DepartmentService,
    PackingService,
    PlantsService,
    RoutesService,
    SuppliersService,
    SettingsService,
    TagsService,
    InventoryLogisticService,
    ProjectService,
    GC16Service,
    GeocodingService,
    ProfileService,
    InventoryService,
    CEPService,
    LogisticService,
    ToastService,
    ImportService,
    AuthenticationService,
    AuthInterceptor
} from './index.service';

@NgModule({
    imports: [
        CommonModule,
        HttpModule
    ],
    providers: [
        AlertsService,
        DepartmentService,
        PackingService,
        PlantsService,
        RoutesService,
        SuppliersService,
        SettingsService,
        TagsService,
        InventoryLogisticService,
        ProjectService,
        GC16Service,
        GeocodingService,
        ProfileService,
        InventoryService,
        CEPService,
        LogisticService,
        ToastService,
        ImportService,
        AuthenticationService,
        AuthInterceptor
    ]
})
export class ServicesModule { }

export * from './index.service';