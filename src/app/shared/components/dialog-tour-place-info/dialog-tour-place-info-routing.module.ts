import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DialogTourPlaceInfoComponent } from './dialog-tour-place-info.component';


const routes: Routes = [
    { path: '', component: DialogTourPlaceInfoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule] 
})
export class DialogTourPlaceInfoRoutingModule { }
