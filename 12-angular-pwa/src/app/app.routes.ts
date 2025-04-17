import { Routes } from '@angular/router';
import { PaisesComponent } from './pages/paises/paises.component';
import { PaisComponent } from './pages/pais/pais.component';

export const routes: Routes = [
  {
      path: '',
      component: PaisesComponent
    },
    // Aqui le tenemos que mandar un Id por el URL porque queremos mostrar un pais en particular
    {
      path: 'pais/:id',
      component: PaisComponent
    },
    // Cualquier otro URL que no sea los de arriba
    {
      path: '**',
      component: PaisesComponent
    },
];
