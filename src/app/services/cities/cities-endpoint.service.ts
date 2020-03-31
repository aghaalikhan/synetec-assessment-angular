import { Injectable, Injector } from "@angular/core";
import { BaseService } from "../base.service";
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";
import { ICity } from "../../models/city.model";

@Injectable()
export class CitiesEndpoint extends BaseService {

    constructor(private _httpClient: HttpClient) {
        super();
    }

    public getCities(): Observable<ICity[]> {
        return this._httpClient.get<ICity[]>(`${this.getBaseUrl}\cities`, this.defaultRequestHeaders());
    }

    public deleteCity(id: number): Observable<void> {
        return this._httpClient.delete<void>(`${this.getBaseUrl}\cities\\delete-city\\${id}`, this.defaultRequestHeaders());
    }
}