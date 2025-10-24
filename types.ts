
export enum Unit {
    UNITE = "Unité(s)",
    LITRE = "L",
    MILLILITRE = "mL",
    KILOGRAMME = "kg",
    GRAMME = "g",
    MILLIGRAMME = "mg",
    BOITE = "Boîte(s)",
    FLACON = "Flacon(s)",
    PIECE = "Pièce(s)",
}

export type Material = {
    id: string;
    num_fiche: string;
    name: string;
    description: string;
    brand: string;
    categoryId: string;
    quantity: number;
    unit: Unit;
    location: string;
    etat: 'Neuf' | 'Bon' | 'À réparer' | 'Hors service';
    observation: string;
    date_saisie: string;
    date_modification: string;
    alertThreshold: number;
};

export enum MovementType {
    ENTREE = "Entrée",
    SORTIE = "Sortie",
    AJUSTEMENT = "Ajustement",
}

export type Movement = {
    id: string;
    materialId: string;
    materialName: string;
    type: MovementType;
    quantity: number;
    date: string;
    notes: string;
};

export type Category = {
    id: string;
    name: string;
};

export enum OrderStatus {
    EN_ATTENTE = "En attente",
    COMMANDE = "Commandé",
    RECU = "Reçu",
    ANNULE = "Annulé",
}

export type OrderItem = {
    materialId: string;
    materialName: string;
    quantity: number;
};

export type Order = {
    id: string;
    supplier: string;
    orderDate: string;
    status: OrderStatus;
    items: OrderItem[];
};

export enum PersonnelRole {
    TECHNICIEN = "Technicien de laboratoire",
    ENSEIGNANT = "Enseignant",
}

export type Personnel = {
    id: string;
    nom: string;
    role: PersonnelRole;
    labo: string; // Laboratory or subject
};

export type Room = {
    id: string;
    name: string;
};

export type Lab = {
    id: string;
    name: string;
};

export type Configuration = {
    school_name: string;
    region: string;
};

export type ReservationItem = {
    materialId: string;
    quantity: number;
};

export enum ReservationStatus {
    EN_ATTENTE = "En attente",
    VALIDEE = "Validée",
    REFUSEE = "Refusée",
    RETIREE = "Retirée",
}

export type Reservation = {
    id: string;
    demandeur: string;
    date_demande: string;
    date_prevue: string;
    status: ReservationStatus;
    materiels: ReservationItem[];
    notes: string;
};
