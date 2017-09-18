import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
// main-page
import { DialogTourPlaceInfoRoutingModule } from './dialog-tour-place-info-routing.module';
import { DialogTourPlaceInfoComponent } from './dialog-tour-place-info.component';
// service at main-page
import { HttpNavermapV3ApiRequestService } from '../../services';
// material design 
import { MdDialogModule } from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        DialogTourPlaceInfoRoutingModule,
        MdDialogModule
    ],
    declarations: [DialogTourPlaceInfoComponent],
    providers: [HttpNavermapV3ApiRequestService]
})
export class DialogTourPlaceInfoModule {
}
