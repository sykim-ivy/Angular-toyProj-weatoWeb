import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule }    from '@angular/forms';
// main-page
import { MainPageRoutingModule } from './main-page-routing.module';
import { MainPageComponent, After10DayComponent, DateValidationComponent, SelectAreaCodeComponent, SelectSigunguCodeComponent } from './main-page.component';
// service at main-page
import { HttpCommonInfoService, HttpTourApiRequestService } from '../shared';
// material design
import { MdDatepickerModule, MdIconModule, MdCardModule, MdSelectModule, MdSnackBarModule, MdButtonModule, MdInputModule,
         DateAdapter, MD_DATE_FORMATS} from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from '../shared';

@NgModule({
    imports: [
        CommonModule, 
        FormsModule,
        MainPageRoutingModule,
        MdDatepickerModule, MdIconModule, MdCardModule, MdSelectModule, MdSnackBarModule, MdButtonModule, MdInputModule
    ],
    declarations: [MainPageComponent, After10DayComponent, DateValidationComponent, SelectAreaCodeComponent, SelectSigunguCodeComponent],
    providers: [
        HttpCommonInfoService, HttpTourApiRequestService,
        { provide: DateAdapter, useClass: AppDateAdapter },
        { provide: MD_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    ],
    entryComponents : [After10DayComponent, DateValidationComponent, SelectAreaCodeComponent, SelectSigunguCodeComponent]
})
export class MainPageModule {
}
