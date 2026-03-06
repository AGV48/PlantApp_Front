export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  imageUrl?: string;
  category: string;
  careLevel: 'easy' | 'medium' | 'hard';
  wateringFrequency: string;
  sunlightRequirement: string;
  temperature: string;
  commonDiseases?: string[];
  source?: 'local' | 'external'; // Nueva propiedad para diferenciar fuentes
  externalId?: number; // ID de la planta en Perenual si es externa
}

export interface CreatePlant {
  name: string;
  scientificName: string;
  description: string;
  imageUrl?: string;
  category: string;
  careLevel: 'easy' | 'medium' | 'hard';
  wateringFrequency: string;
  sunlightRequirement: string;
  temperature: string;
  commonDiseases?: string[];
}
