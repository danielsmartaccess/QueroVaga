/**
 * Interface que representa uma reserva de vaga para visitantes
 */
export interface Reservation {
  id?: number;
  parking_space_id: number;
  parking_space_number?: string; // Número da vaga para exibição
  guest_name: string;
  guest_vehicle: string;
  guest_phone: string;  // Número de celular do visitante/convidado
  resident_phone?: string; // Número de celular do condômino responsável
  resident_id?: number; // ID do condômino responsável
  reservation_date: string;
  date?: string; // Data formatada para exibição
  check_in_time?: string;
  check_out_time?: string;
  is_active: boolean;
  visitor_name?: string; // Alias para guest_name usado no dashboard
  apartment_number?: string; // Apartamento associado à reserva
  status?: string; // Status da reserva em texto (ATIVA, CONCLUÍDA, etc.)
}

/**
 * Interface para criação de uma nova reserva
 */
export interface ReservationCreate {
  parking_space_id: number;
  guest_name: string;
  guest_vehicle: string;
  guest_phone: string;
  resident_phone?: string;
  resident_id?: number;
}

/**
 * Interface para atualização de uma reserva existente
 */
export interface ReservationUpdate {
  guest_name?: string;
  guest_vehicle?: string;
  guest_phone?: string;
  resident_phone?: string;
  check_in_time?: string;
  check_out_time?: string;
  is_active?: boolean;
}
