import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {
  carBrands: { Make_Name: string }[] = [];
  selectedBrand: string | null = null;
  vehicleTypes: { VehicleTypeId: number, VehicleTypeName: string }[] = [];
  selectedVehicleType: string | null = null;
  selectedYear: number | null = null;
  carModels: any[] = [];
  errorMessage: string | null = null;
  isLoading: boolean = false; 

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadBrands();  
    console.log("Loading car brands.")
  }

 
  loadBrands(): void {
    this.isLoading = true; 
    console.log("Loading car brands from loadBrands function.")
    this.http.get<any>('https://vpic.nhtsa.dot.gov/api/vehicles/GetAllMakes?format=json').subscribe({
      next: (data) => {
        this.carBrands = data.Results;
        this.isLoading = false; 
      },
      error: () => {
        this.errorMessage = 'Failed to load car brands.';
        this.isLoading = false; 
      }
    });
  }

  loadVehicleTypes(brand: string | null): void {
    if (!brand) {
      this.errorMessage = 'Please select a brand.';
      return;
    }

    this.isLoading = true;
    this.http.get<any>(`https://vpic.nhtsa.dot.gov/api/vehicles/GetVehicleTypesForMake/${brand}?format=json`).subscribe({
      next: (data) => {
        if (data.Results) {
          this.vehicleTypes = data.Results.map((item: any) => ({
            VehicleTypeId: item.VehicleTypeId,
            VehicleTypeName: item.VehicleTypeName,
          }));
        } else {
          this.errorMessage = `No vehicle types found for ${brand}.`;
        }
        this.isLoading = false; 
      },
      error: () => {
        this.errorMessage = `Failed to load vehicle types for ${brand}.`;
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
            this.carModels = [];
            this.errorMessage = `No models found for ${this.selectedBrand} in ${year} for the selected vehicle type.`;
          }
          this.isLoading = false; 
        },
        error: () => {
          this.errorMessage = `Failed to load models for ${this.selectedBrand}, ${vehicleType}, and ${year}.`;
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = 'Please select all filters (Brand, Vehicle Type, and Year).';
    }
  }
}
