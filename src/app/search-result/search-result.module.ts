import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule }    from '@angular/forms';
// search-result
import { SearchResultRoutingModule } from './search-result-routing.module';
import { SearchResultComponent } from './search-result.component';
// component
import { DialogTourPlaceInfoComponent } from '../shared';
// service at search-result
import { HttpCommonInfoService, HttpTourApiRequestService, HttpWeatherplanetApiRequestService} from '../shared';
// pagination
import { NgxPaginationModule } from 'ngx-pagination'; 
// material design
// import { MaterialModule, MdDialog, 
//          MdCardModule, MdIconModule, MdListModule, MdButtonModule } from '@angular/material';
import {MaterialModule, MdDialog, MdDatepickerModule, MdInputModule, MdIconModule, MdSelectModule, MdTableModule,
    MdButtonModule, MdButtonToggleModule, MdTooltipModule,
    MdListModule, MdCardModule, MdSnackBarModule, MdDialogModule, DateAdapter, MD_DATE_FORMATS} from '@angular/material';
// pipe
import { PipeCommaSeparatedNumberPipe } from '../shared';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SearchResultRoutingModule,
        MaterialModule,
        MdDatepickerModule, MdInputModule, MdIconModule, MdSelectModule, MdTableModule,
        MdButtonModule, MdButtonToggleModule, MdTooltipModule,
        MdListModule, MdCardModule, MdSnackBarModule, MdDialogModule, 
        // MdCardModule, MdIconModule, MdListModule, MdButtonModule,  
        NgxPaginationModule
    ],
    declarations: [SearchResultComponent, DialogTourPlaceInfoComponent, PipeCommaSeparatedNumberPipe],
    providers: [HttpCommonInfoService, HttpTourApiRequestService, HttpWeatherplanetApiRequestService, MdDialog
    ],
    entryComponents : [DialogTourPlaceInfoComponent]
})
export class SearchResultModule {
}
