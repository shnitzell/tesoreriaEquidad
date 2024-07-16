import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransaccionComponent } from './pages/transaccion/transaccion.component';
import { ResultadosFacturasComponent } from './pages/resultados-facturas/resultados-facturas.component';
import { SearchComponent } from './pages/search/search.component';

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
  {
    path: '**',
    redirectTo: 'search',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
