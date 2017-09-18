import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// resolver
import { MoveResultpageResolver } from './main-page/move-resultpage.resolver';

const routes: Routes = [ 
    { path: '', redirectTo: '/main', pathMatch: 'full' },
    { path: 'main',  loadChildren: './main-page/main-page.module#MainPageModule' },
    { path: 'result', loadChildren: './search-result/search-result.module#SearchResultModule', 
      resolve : {result : MoveResultpageResolver} }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}


/*
Copyright 2017 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/