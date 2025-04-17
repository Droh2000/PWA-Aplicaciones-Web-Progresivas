import { Component } from '@angular/core';
import { PaisesService } from '../../services/paises.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { PaisInterface } from '../../interfaces/pais.interface';

@Component({
  selector: 'app-pais',
  imports: [],
  templateUrl: './pais.component.html',
  styleUrl: './pais.component.css'
})
export class PaisComponent {

  pais?: PaisInterface;

  constructor(
    public PaisesService: PaisesService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ){
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.PaisesService.getPaisPorId( id! )
    .then( pais => {
      if(pais){ // Si no es undefined el pais
        this.pais = pais;
        console.log(pais);
      }
    })
  }
}
