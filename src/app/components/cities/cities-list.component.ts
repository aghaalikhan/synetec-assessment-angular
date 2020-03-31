import { Component, OnInit, OnDestroy } from "@angular/core";
import { ICity } from "../../models/city.model";
import { takeUntil } from"rxjs/operators";
import { CitiesService } from "../../services/cities/cities.service";
import { Subject } from "rxjs/Subject";

@Component ({
    selector: 'cities-list',
    templateUrl: './cities-list.component.html',
    styleUrls: ['./cities-list.component.css']
})

export class CitiesListComponent implements OnInit, OnDestroy{

    public cities: ICity[];    
    public destroy$ = new Subject<void>();

    constructor(private citiesService: CitiesService) {}

    ngOnInit(): void { 
        this.citiesService.getCities()        
            .pipe(takeUntil(this.destroy$))
            .subscribe(cities => {            
                this.cities = cities;
            })
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }

    public deleteCity(id: number): void {
        this.citiesService.deleteCity(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.cities.splice(this.cities.findIndex(x => x.id == id), 1));        
    }
}