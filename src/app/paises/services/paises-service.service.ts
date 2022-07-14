import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pais, PaisSmall } from '../interfaces/paises.interface';
import { Observable } from 'rxjs/internal/Observable';
import { of,combineLatest } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaisesServiceService {

  private _regiones:string[] = ["Africa", "Americas", "Asia", "Europe", "Oceania"]

  private baseUrl:string = "https://restcountries.com/v2/"

  get regiones(){
    return [...this._regiones];
  }


  constructor(private http:HttpClient) { }

  obtenerPaisesXRegion(region:string):Observable<PaisSmall[]>{
    return this.http.get<PaisSmall[]>(`${this.baseUrl}/region/${region}?fields=alpha3Code,name`);
  }

  obtenerFronteras(codigo:string):Observable<Pais | null>{

    if(!codigo){
        return of(null);
    }

    return this.http.get<Pais>(`${this.baseUrl}/alpha/${codigo}`);
  }

  obtenerFronterasSmall(codigo:string):Observable<PaisSmall>{

    return this.http.get<Pais>(`${this.baseUrl}/alpha/${codigo}?fields=alpha3Code,name`);
  }

  getPaisesXCodigos(borders:string[]):Observable<PaisSmall[]>{

    if(!borders){

      return of([]);
    }

    const peticiones:Observable<PaisSmall>[]=[];

    borders.forEach(codigo=>{
      const peticion = this.obtenerFronterasSmall(codigo);
      peticiones.push(peticion);
    });

    return combineLatest(peticiones);
  }
}
