import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import {
    HomeService,
    MapsService,
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
    AuthInterceptor,

    CompaniesService,
    UsersService,
    FamiliesService,
    ControlPointsService,
    ControlPointTypesService,
    ReportsService,
    DevicesService,
    PositionsService,
    TemperaturesService
} from './index.service';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        TranslateModule
    ],
    providers: [
        HomeService,
        MapsService,
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
        AuthInterceptor,

        CompaniesService,
        UsersService,
        FamiliesService,
        ControlPointsService,
        ControlPointTypesService,
        ReportsService,
        DevicesService,
        PositionsService,
        TemperaturesService
    ]
})
export class ServicesModule { }

export * from './index.service';