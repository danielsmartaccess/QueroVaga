/**
 * Interface que representa uma vaga de estacionamento no sistema
 */
export interface ParkingSpace {
  id?: number;
  space_number: string;
  owner_id: number;
  owner_name?: string; 
  apartment_number?: string;
  is_available: boolean;
  is_occupied?: boolean; // Status atual de ocupação (diferente de disponibilidade)
  vehicle_plate?: string; // Placa do veículo estacionado (se ocupado)
}

/**
 * Interface para criação de uma nova vaga
 */
export interface ParkingSpaceCreate {
  space_number: string;
  owner_id: number;
  is_available: boolean;
}

/**
 * Interface para atualização de uma vaga existente
 */
export interface ParkingSpaceUpdate {
  space_number?: string;
  owner_id?: number;
  is_available?: boolean;
  is_occupied?: boolean;
  vehicle_plate?: string;
}
