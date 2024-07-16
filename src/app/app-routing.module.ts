import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResultadosFacturasComponent } from './pages/resultados-facturas/resultados-facturas.component';

import { SearchComponent } from './pages/search/search.component';
import { TransaccionComponent } from './pages/transaccion/transaccion.component';

const routes: Routes = [
  {
    path: 'search',
    component: SearchComponent,
  },
  {
    path: 'results',
    component: ResultadosFacturasComponent,
  },
  {
    path: 'transaccion',
    component: TransaccionComponent,
  },
  {
    path: 'confirm',
    component: TransaccionComponent,
  },
  // {
  //   path: 'landing',
  //   component: LandingComponent
  // },
  {
    path: '**',
    redirectTo: 'search',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
