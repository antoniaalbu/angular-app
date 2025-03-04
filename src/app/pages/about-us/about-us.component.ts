import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CarBrand, CarBrandsResponse } from '../../models/car-brand.model';
import { VehicleType } from '../../models/vehicle-types.model';
import { ErrorMessageService } from '../../services/error-message.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ErrorModalComponent } from '../../components/error-modal/error-modal.component';
import { TranslationService } from '../../services/translation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-about-us',
  standalone: true,
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css'],
  imports: [CommonModule, FormsModule, ErrorModalComponent]
})
export class AboutUsComponent implements OnInit {
  carBrands: CarBrand[] = [];
  selectedBrand: string | null = null;
  vehicleTypes: VehicleType[] = [];
  selectedVehicleType: string | null = null;
  selectedYear: number | null = null;
  carModels: any[] = [];
  errorMessage: string | null = null;
  isLoading: boolean = false;
  private langSubscription!: Subscription;


  constructor(
    private http: HttpClient,
    private errorMessageService: ErrorMessageService,
    public translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.loadBrands();
    this.langSubscription = this.translationService.currentLanguage$.subscribe(() => {
      
    });
  }
    
  handleError(error: any, context: string): void {
    this.errorMessage = this.errorMessageService.getFriendlyErrorMessage(error, context);
  }

  closeErrorModal(): void {
    this.errorMessage = null;
  }

  loadBrands(): void {
    this.isLoading = true;
    this.http.get<CarBrandsResponse>('https://vpic.nhtsa.dot.gov/api/vehicles/GetAllMakes?format=json').subscribe({
      next: (data) => {
        this.carBrands = data.Results ?? [];
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = this.translationService.getTranslation('about.errorLoadingBrands');
        this.isLoading = false;
      }
    });
  }

  onBrandChange(): void {
    this.selectedVehicleType = null;
    this.carModels = [];
    this.vehicleTypes = [];
    this.errorMessage = null;

    if (this.selectedBrand) {
      this.loadVehicleTypes(this.selectedBrand);
    }
  }

  loadVehicleTypes(brand: string): void {
    this.isLoading = true;
    this.http.get<{ Results: VehicleType[] }>(`https://vpic.nhtsa.dot.gov/api/vehicles/GetVehicleTypesForMake/${brand}?format=json`).subscribe({
      next: (data) => {
        this.vehicleTypes = data.Results ?? [];
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = this.translationService.getTranslation('about.errorLoadingTypes');
        this.isLoading = false;
      }
    });
  }
  
 
  

  loadModels(): void {
    if (this.selectedBrand && this.selectedVehicleType && this.selectedYear) {
      const year = this.selectedYear;
      const vehicleType = this.selectedVehicleType;
      this.isLoading = true;
      this.http.get<any>(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${this.selectedBrand}/modelyear/${year}/vehicletype/${vehicleType}?format=json`).subscribe({
        next: (data) => {
          if (data.Results && data.Results.length > 0) {
            this.carModels = data.Results;
            this.errorMessage = null;
          } else {
            this.handleError(`No models found for ${this.selectedBrand} in ${year} for the selected vehicle type.`, 'Loading Models');
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.handleError(err, `Failed to load models for ${this.selectedBrand}, ${vehicleType}, and ${year}`);
          this.isLoading = false;
        }
      });
    } else {
      this.handleError({ message: 'Please select all filters (Brand, Vehicle Type, and Year).' }, 'Loading Car Models');
    }
  }

  


  
}
