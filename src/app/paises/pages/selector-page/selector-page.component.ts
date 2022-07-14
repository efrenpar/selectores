import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PaisesServiceService } from '../../services/paises-service.service';
import { Pais, PaisSmall } from '../../interfaces/paises.interface';
import { switchMap,tap } from 'rxjs/operators';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css']
})
export class SelectorPageComponent implements OnInit {

  miFormulario:FormGroup = this.fb.group({
    region:   ['',Validators.required],
    pais:     ['',Validators.required],
    frontera: ['',Validators.required],
  });

  //llenar selectores
  regiones:string[] = [];
  paises:PaisSmall[]=[];
  fronteras:PaisSmall[]=[];

  cargando:boolean=false;

  constructor(
    private fb:FormBuilder,
    private paisesService:PaisesServiceService
  ) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;
  
    this.miFormulario.get("region")?.valueChanges
        .pipe(
          tap((_)=>{
              this.miFormulario.get("pais")?.reset("");
              this.cargando = true;
          }),
          switchMap(region=>this.paisesService.obtenerPaisesXRegion(region))
        )
        .subscribe(paises=>{
          this.paises = paises;
          this.cargando = false;
        })

    this.miFormulario.get("pais")?.valueChanges
        .pipe(
          tap((_)=>{
              this.miFormulario.get("frontera")?.reset("");
              this.cargando = true;
            }),
          switchMap(pais=>this.paisesService.obtenerFronteras(pais)),
          switchMap(border=>this.paisesService.getPaisesXCodigos(border?.borders!)),
        )
        .subscribe(paises=>{
            // if(resp){
            //   this.fronteras = resp;
            //   this.cargando = false;
            // }
            this.fronteras = paises;
            console.log(paises);
            this.cargando = false;
        })
        
  }

  guardar(){
    console.log(this.miFormulario.value);
  }

}
