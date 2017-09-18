import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations'; // material design
import { AppRoutingModule } from './app-routing.module'; //route
import { AppComponent } from './app.component';  // component
import { CommonServiceService, HttpNavermapV3ApiRequestService } from './shared'; // service
import { MoveResultpageResolver } from './main-page/move-resultpage.resolver'; // resolver


@NgModule({
  declarations: [
      AppComponent
  ],
  imports: [
      BrowserModule,
      FormsModule,
      HttpClientModule,
      BrowserAnimationsModule,      
      AppRoutingModule,
  ],
  providers: [CommonServiceService, HttpNavermapV3ApiRequestService, MoveResultpageResolver],
  bootstrap: [AppComponent]
})
export class AppModule {
}

/////////////////////////////////////////////////////Befor Renewal ///////////////////////////////////////////////////////////////////////////

// // pagination
// import {NgxPaginationModule} from 'ngx-pagination';  
// // component
// // import { AppComponent } from './app.component';
// import { SearchResultComponent } from './search-result/search-result.component';
// import { ShowOverInfoComponent } from './search-result/dialog-over-info.component';
// import { MainPageComponent, After10DayComponent, DateValidationComponent, SelectAreaCodeComponent, SelectSigunguCodeComponent } from './main-page/main-page.component';
// // service
// // import { CommonInfoService } from './common-info.service';
// // import { CommonServiceService } from './common-service.service'
// // import { HttpRequestInputdataService } from './http-request-inputdata.service';
// // material design
// // import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// import {MdDatepickerModule, MdInputModule, MdIconModule, MdSelectModule, 
//         MdButtonModule, MdButtonToggleModule, MdTooltipModule,
//         MdListModule, MdCardModule, MdSnackBarModule, MdDialogModule, DateAdapter, MD_DATE_FORMATS} from '@angular/material';

// // //route
// // import { AppRoutingModule }     from './app-routing.module';
// // pipe
// // import { PipeCommaSeparatedNumberPipe } from './pipe-comma-separated-number.pipe';
// // resolver
// import { MoveResultpageResolver } from './main-page/move-resultpage.resolver';
// // spinner
// // import { SpinnerComponentModule } from 'ng2-component-spinner'; // spinner

// @NgModule({
//   declarations: [
//     AppComponent,
//     SearchResultComponent, ShowOverInfoComponent,
//     MainPageComponent,
//     After10DayComponent, DateValidationComponent, SelectAreaCodeComponent, SelectSigunguCodeComponent, PipeCommaSeparatedNumberPipe
//   ],
//   imports: [
//     BrowserModule,
//     BrowserAnimationsModule,
//     MdDatepickerModule, MdInputModule, MdIconModule, MdSelectModule, 
//     MdButtonModule, MdButtonToggleModule, MdTooltipModule,
//     MdListModule, MdCardModule, MdSnackBarModule, MdDialogModule,
//     AppRoutingModule,
//     FormsModule,
//     HttpClientModule,
//     NgxPaginationModule,
//     SpinnerComponentModule
//   ],
//   providers: [
//     { provide: DateAdapter, useClass: AppDateAdapter },
//     { provide: MD_DATE_FORMATS, useValue: APP_DATE_FORMATS },
//     CommonInfoService, CommonServiceService, HttpRequestInputdataService, MoveResultpageResolver
//   ],
//   bootstrap: [AppComponent],
//   entryComponents : [ShowOverInfoComponent, After10DayComponent, DateValidationComponent, SelectAreaCodeComponent, SelectSigunguCodeComponent]
// })
// export class AppModule { }
