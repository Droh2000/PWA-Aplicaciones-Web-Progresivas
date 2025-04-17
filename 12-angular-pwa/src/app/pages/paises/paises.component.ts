import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PaisesService } from '../../services/paises.service';
import { PaisInterface } from '../../interfaces/pais.interface';

@Component({
  selector: 'app-paises',
  imports: [RouterLink],
  templateUrl: './paises.component.html',
  styleUrl: './paises.component.css'
})
export class PaisesComponent {
  paises: PaisInterface[] = [];

  constructor(
    public paisService: PaisesService
  ){
    this.paisService.getPaises()
    .then( paises => this.paises = paises );
  }
}
