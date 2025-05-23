
export interface AnimalListing {
  id?: string | null;
  title: string;
  description: string;
  category: string;
  breed: string;
  age: number | null;
  age_unit: string;
  gender: string;
  weight: number | null;
  weight_unit: string;
  price: number;
  negotiable: boolean;
  quantity: number;
  location: string;
  health_status: string;
  feeding_type: string;
  image_url: Record<string, any>;
  video: string | null;
  certified: boolean;
  auction: boolean;
  available_immediate: boolean;
  listed_date?: Date;
  delivery_option: Record<string, any>;
  max_delivery_distance: number | null;
  delivery_distance_unit: string;
  delivery_restrictions: string;
  seller_id?: string | null;
}

export interface LivestockListing {
  id: number;
  title: string;
  description: string;
  category: string;
  breed: string;
  age: number | null;
  age_unit: string;
  gender: string;
  weight: number | null;
  weight_unit: string;
  price: number;
  negotiable: boolean;
  quantity: number;
  location: string;
  health_status: string;
  feeding_type: string;
  image_url: Record<string, any>;
  video_url?: string;
  video_thumbnail?: string;
  certified: boolean;
  auction: boolean;
  available_immediate: boolean;
  isFavorite: boolean;
  listed_date: Date;
}