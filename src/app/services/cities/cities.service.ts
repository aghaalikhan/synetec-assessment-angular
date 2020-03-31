import { Injectable } from "@angular/core";
import { CitiesEndpoint } from "./cities-endpoint.service";
import { ICity } from "../../models/city.model";
import { Observable } from "rxjs/Observable";

@Injectable()
export class CitiesService {

    constructor(private _citiesEndpoint: CitiesEndpoint) {}

    public getCities = () => this._citiesEndpoint.getCities();  

    public deleteCity = (id: number) => this._citiesEndpoint.deleteCity(id); 
}