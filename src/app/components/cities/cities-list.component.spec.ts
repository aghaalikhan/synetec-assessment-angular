import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from '../../app.component';
import { CitiesListComponent } from './cities-list.component';
import { CitiesService } from '../../services/cities/cities.service';
import { Subject } from 'rxjs/Subject';
import { ICity } from '../../models/city.model';
import { By } from '@angular/platform-browser';

describe('CitiesListComponent', () => {

  let citiesServiceMock: jasmine.SpyObj<CitiesService>;
  let fixture: ComponentFixture<CitiesListComponent>;
  let citiesListComponent:  CitiesListComponent;
  let getCities$: Subject<ICity[]> = new Subject();
  let deleteCity$: Subject<void> = new Subject();

  beforeEach(async(() => {

    citiesServiceMock = jasmine.createSpyObj<CitiesService>('citiesService', ['getCities', 'deleteCity'])
    citiesServiceMock.getCities.and.returnValue(getCities$);
    citiesServiceMock.deleteCity.and.returnValue(deleteCity$)
    
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        CitiesListComponent
      ],
      providers: [
        { provide: CitiesService, useValue: citiesServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CitiesListComponent);
    citiesListComponent = fixture.debugElement.componentInstance;    
    fixture.detectChanges();
  }));

  it('should call getcities on cities service', () => {
    expect(citiesServiceMock.getCities).toHaveBeenCalled();
  });

  describe('city list is empty', () => {

    beforeEach(() => {
      getCities$.next([]);
      fixture.detectChanges();
    });

    it('should display the no cities template', () => {
      const noCitiesTemplate = fixture.debugElement.query(By.css('.no-cities-container'));
      expect(noCitiesTemplate.nativeElement.innerText).toBe('There are no cities in the database!!');
    });

    it('should not display the city list container', () => {
      const citiesListContainer = fixture.debugElement.query(By.css('#city-list-container'));
      expect(citiesListContainer).toBeFalsy();
    });
  });

  describe('city list contains cities', () => {
    const cityOne = {
      id: 1,
      name: "Karachi",
      description: "The one with delicious samosas"
    };

    const cityTwo = {
      id: 2,
      name: "Barcelona",
      description: "The one with that insane foodball team"
    }

    beforeEach(() => {      
      getCities$.next([cityOne,cityTwo]);
      fixture.detectChanges();
    });

    it('should not display the no cities template', () => {
      const noCitiesTemplate = fixture.debugElement.query(By.css('.no-cities-container'));
      expect(noCitiesTemplate).toBeFalsy();
    });

    it('should not display the city list table', () => {
      const citiesListContainer = fixture.debugElement.query(By.css('#city-table'));
      expect(citiesListContainer).toBeTruthy();
    });

    it('should display city one row', () => {
      const cityOneRow = fixture.debugElement.query(By.css('#city-table tr:nth-of-type(1)'));
      const cityOneNameColumn = cityOneRow.query(By.css('td:nth-of-type(1)'))
      const cityOneDescriptionColumn = cityOneRow.query(By.css('td:nth-of-type(2)'))      
      expect(cityOneNameColumn.nativeElement.innerText).toEqual(cityOne.name);
      expect(cityOneDescriptionColumn.nativeElement.innerText).toEqual(cityOne.description);
    })

    it('should display city two row', () => {
      const cityTwoRow = fixture.debugElement.query(By.css('#city-table tr:nth-of-type(2)'));
      const cityTwoNameColumn = cityTwoRow.query(By.css('td:nth-of-type(1)'))
      const cityTwoDescriptionColumn = cityTwoRow.query(By.css('td:nth-of-type(2)'))
      expect(cityTwoNameColumn.nativeElement.innerText).toEqual(cityTwo.name);
      expect(cityTwoDescriptionColumn.nativeElement.innerText).toEqual(cityTwo.description);      
    })
    
    describe('delete city', () => {

      beforeEach(() => {     
        const deleteCityTwoButton = fixture.debugElement.query(By.css(`#btn-delete-city-${cityTwo.id}`))   
        deleteCityTwoButton.nativeElement.click();
        deleteCity$.next();
        fixture.detectChanges();
      })

      it('should call delete end point on city service with correct city id', () => {        
        expect(citiesServiceMock.deleteCity).toHaveBeenCalledWith(cityTwo.id);
      });

      it('should not display deleted city in the table any more', () => {        
        expect(fixture.debugElement.query(By.css('#city-table tr:nth-of-type(2)'))).toBeFalsy();
      });
    });    
  });
});
