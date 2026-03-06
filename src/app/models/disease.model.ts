export interface Disease {
  id: string;
  name: string;
  type: 'fungal' | 'bacterial' | 'viral' | 'pest' | 'deficiency';
  description: string;
  symptoms: string[];
  treatment: string;
  prevention: string;
  imageUrl?: string;
  affectedPlants?: string[];
}

export interface CreateDisease {
  name: string;
  type: 'fungal' | 'bacterial' | 'viral' | 'pest' | 'deficiency';
  description: string;
  symptoms: string[];
  treatment: string;
  prevention: string;
  imageUrl?: string;
  affectedPlants?: string[];
}
