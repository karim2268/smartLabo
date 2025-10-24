
export enum Category {
    MATERIEL_PHYSIQUE = "Matériel Physique",
    MATERIEL_CHIMIE = "Matériel Chimie",
    PRODUIT_CHIMIE = "Produit Chimique",
    MATERIEL_SVT = "Matériel SVT",
    PRODUIT_SVT = "Produit SVT",
    AUTRE = "Autre"
}

export enum Unit {
    UNITE = "Unité",
    LITRE = "Litre",
    KILOGRAMME = "Kilogramme",
    GRAMME = "Gramme",
    MILLILITRE = "Millilitre",
    BOITE = "Boîte"
}

export interface Material {
    id: string;
    code: string;
    name: string;
    category: Category;
    description: string;
    quantity: number;
    alertThreshold: number;
    unit: Unit;
    brand: string;
    model: string;
    location: string;
    createdAt: string;
}

export enum MovementType {
    ENTREE = "Entrée",
    SORTIE = "Sortie",
    AJUSTEMENT = "Ajustement"
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

export enum OrderStatus {
    EN_ATTENTE = "En attente",
    COMMANDE = "Commandé",
    RECU = "Reçu",
    ANNULE = "Annulé"
}

export interface OrderItem {
    id: string;
    materialName: string;
    quantity: number;
}

export interface Order {
    id: string;
    orderDate: string;
    supplier: string;
    items: OrderItem[];
    status: OrderStatus;
    deliveryDate?: string;
}
