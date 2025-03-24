type Category = 'CATTLE' | 'GOAT' | 'SHEEP' | 'POULTRY';
type Breed = 'BREED_A' | 'BREED_B';
type HealthStatus = 'HEALTHY' | 'SICK' | 'VACCINATED';

export interface AnimalListing {
  id?: string | null;
  title: string;
  description: string;
  category: Category;
  breed: Breed;
  age: number;
  age_unit: string;
  gender: string;
  weight: number;
  weight_unit: string;
  price: number;
  negotiable: boolean;
  quantity: number;
  location: string;
  health_status: HealthStatus;
  feeding_type: string;
  image_url: Record<string, any>;
  video: string;
  certified: boolean;
  auction: boolean;
  available_immediate: boolean;
  listed_date?: Date | null;
  delivery_option: Record<string, any>;
  max_delivery_distance: number;
  delivery_distance_unit: string;
  delivery_restrictions: string;
  seller_id: string;
  farm_id: string;
}
