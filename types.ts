import { Page } from './App';

export enum Unit {
    UNITE = 'Unité',
    BOITE = 'Boîte',
    FLACON = 'Flacon',
    LITRE = 'Litre',
    GRAMME = 'Gramme',
    METRE = 'Mètre',
}

export interface Category {
    id: string;
    name: string;
}

export interface Material {
    id: string;
    num_fiche: string;
    name: string;
    description: string;
    brand: string;
    categoryId: string;
    quantity: number;
    unit: Unit;
    etat: 'Neuf' | 'Bon' | 'À réparer' | 'Hors service';
    observation: string;
    alertThreshold: number;
    location: string; 
    date_saisie: string;
    date_modification: string;
}

export enum MovementType {
    ENTREE = 'Entrée',
    SORTIE = 'Sortie',
    AJUSTEMENT = 'Ajustement',
}

export interface Movement {
    id: string;
    materialId: string;
    materialName: string;
    type: MovementType;
    quantity: number;
    date: string;
    notes: string;
}

export enum PersonnelRole {
    TECHNICIEN = 'Personnel de laboratoire',
    ENSEIGNANT = 'Enseignant',
}

export interface Personnel {
    id: string;
    nom: string;
    role: PersonnelRole;
    labo: string;
}

export interface Room {
    id: string;
    name: string;
}

export interface Lab {
    id: string;
    name: string;
}

export interface AppConfiguration {
    region: string;
    school_name: string;
}

export enum OrderStatus {
    EN_ATTENTE = 'En attente',
    COMMANDE = 'Commandé',
    RECU = 'Reçu',
    ANNULE = 'Annulé',
}

export interface OrderItem {
    materialId: string;
    materialName: string;
    quantity: number;
}

export interface Order {
    id: string;
    supplier: string;
    items: OrderItem[];
    orderDate: string;
    status: OrderStatus;
}

export enum ReservationStatus {
    EN_ATTENTE = 'En attente',
    CONFIRMEE = 'Confirmée',
    REFUSEE = 'Refusée',
}

export interface Reservation {
    id: string;
    personnelId: string;
    salle: string;
    date: string;
    heure: string;
    materiels: string;
    status: ReservationStatus;
}

export interface AppState {
    materials: Material[];
    categories: Category[];
    movements: Movement[];
    personnel: Personnel[];
    rooms: Room[];
    labs: Lab[];
    configuration: AppConfiguration;
    orders: Order[];
    reservations: Reservation[];
}
