import React, { createContext, useReducer, useContext, ReactNode, useEffect } from 'react';
import { AppState, Material, Movement, Category, Personnel, Room, Lab, AppConfiguration, Unit, MovementType, PersonnelRole, Order, OrderStatus, Reservation, ReservationStatus } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';

type Action =
    | { type: 'ADD_MATERIAL'; payload: Material }
    | { type: 'UPDATE_MATERIAL'; payload: Material }
    | { type: 'DELETE_MATERIAL'; payload: string }
    | { type: 'ADD_MOVEMENT'; payload: Movement }
    | { type: 'ADD_PERSONNEL'; payload: Personnel }
    | { type: 'UPDATE_CONFIG'; payload: AppConfiguration }
    | { type: 'ADD_RESERVATION'; payload: Reservation }
    | { type: 'UPDATE_RESERVATION_STATUS'; payload: { id: string; status: ReservationStatus }};

const initialState: AppState = {
    categories: [
        { id: 'cat-physique', name: 'Matériels de Physique' },
        { id: 'cat-chimie-verre', name: 'Verrerie & Chimie' },
        { id: 'cat-chimie-produit', name: 'Produits Chimiques' },
        { id: 'cat-svt', name: 'Matériels de SVT' },
    ],
    materials: [
        { id: 'mat-1', num_fiche: 'P001', name: 'Multimètre Numérique', description: 'Multimètre standard pour mesures de tension, courant et résistance.', brand: 'Fluke', categoryId: 'cat-physique', quantity: 12, unit: Unit.UNITE, etat: 'Bon', observation: '', alertThreshold: 3, location: 'Armoire A1', date_saisie: '2023-01-10T10:00:00Z', date_modification: '2023-09-15T14:30:00Z' },
        { id: 'mat-2', num_fiche: 'C001', name: 'Bécher en verre 250ml', description: 'Bécher en verre borosilicaté gradué.', brand: 'Pyrex', categoryId: 'cat-chimie-verre', quantity: 45, unit: Unit.UNITE, etat: 'Bon', observation: 'Quelques uns ébréchés', alertThreshold: 10, location: 'Étagère V1', date_saisie: '2023-01-10T10:00:00Z', date_modification: '2023-10-02T11:00:00Z' },
        { id: 'mat-3', num_fiche: 'C002', name: 'Acide Chlorhydrique (1L)', description: 'Solution d\'acide chlorhydrique concentré à 37%.', brand: 'Sigma-Aldrich', categoryId: 'cat-chimie-produit', quantity: 5, unit: Unit.FLACON, etat: 'Neuf', observation: 'Corrosif, à manipuler avec soin.', alertThreshold: 2, location: 'Armoire ventilée C2', date_saisie: '2023-02-20T09:00:00Z', date_modification: '2023-02-20T09:00:00Z' },
        { id: 'mat-4', num_fiche: 'SVT001', name: 'Microscope Optique', description: 'Microscope binoculaire avec grossissement jusqu\'à 1000x.', brand: 'Olympus', categoryId: 'cat-svt', quantity: 8, unit: Unit.UNITE, etat: 'Bon', observation: 'Entretien annuel requis', alertThreshold: 1, location: 'Salle TP SVT', date_saisie: '2022-11-05T15:00:00Z', date_modification: '2023-08-01T12:00:00Z' },
        { id: 'mat-5', num_fiche: 'P002', name: 'Générateur de fonctions (GBF)', description: 'Génère des signaux sinusoïdaux, carrés, et triangulaires.', brand: 'Tektronix', categoryId: 'cat-physique', quantity: 4, unit: Unit.UNITE, etat: 'À réparer', observation: 'Le canal 2 est défectueux sur un appareil.', alertThreshold: 2, location: 'Armoire A2', date_saisie: '2023-01-15T11:00:00Z', date_modification: '2023-10-10T16:00:00Z' },
    ],
    movements: [
        { id: 'mov-1', materialId: 'mat-2', materialName: 'Bécher en verre 250ml', type: MovementType.SORTIE, quantity: 5, date: '2023-10-05T14:00:00Z', notes: 'Utilisé pour TP Chimie 2ème année' },
        { id: 'mov-2', materialId: 'mat-1', materialName: 'Multimètre Numérique', type: MovementType.SORTIE, quantity: 2, date: '2023-10-06T09:30:00Z', notes: 'Utilisé pour TP Physique 3ème année' },
        { id: 'mov-3', materialId: 'mat-3', materialName: 'Acide Chlorhydrique (1L)', type: MovementType.ENTREE, quantity: 3, date: '2023-09-28T10:00:00Z', notes: 'Réception commande n°2023-08-C01' },
    ],
    personnel: [
        { id: 'pers-1', nom: 'M. Ben Ali', role: PersonnelRole.TECHNICIEN, labo: 'Physique-Chimie' },
        { id: 'pers-2', nom: 'Mme. Trabelsi', role: PersonnelRole.ENSEIGNANT, labo: 'Physique' },
        { id: 'pers-3', nom: 'M. Guirat', role: PersonnelRole.ENSEIGNANT, labo: 'Chimie' },
        { id: 'pers-4', nom: 'Mme. Khemir', role: PersonnelRole.ENSEIGNANT, labo: 'SVT' },
    ],
    rooms: [
        { id: 'room-1', name: 'Salle TP 1 (Physique)' },
        { id: 'room-2', name: 'Salle TP 2 (Chimie)' },
        { id: 'room-3', name: 'Salle TP 3 (SVT)' },
    ],
    labs: [
        { id: 'lab-1', name: 'Laboratoire de Physique' },
        { id: 'lab-2', name: 'Laboratoire de Chimie' },
        { id: 'lab-3', name: 'Laboratoire de SVT' },
    ],
    configuration: {
        region: 'Sfax 1',
        school_name: 'Lycée Pilote de Sfax',
    },
    orders: [
        { id: 'CMD-001', supplier: 'Fournisseur Local A', items: [{ materialId: 'mat-3', materialName: 'Acide Chlorhydrique', quantity: 5 }], orderDate: '2023-09-01T00:00:00Z', status: OrderStatus.RECU},
        { id: 'CMD-002', supplier: 'Equipement Scientifique International', items: [{ materialId: 'mat-1', materialName: 'Multimètre', quantity: 10 }], orderDate: '2023-10-15T00:00:00Z', status: OrderStatus.COMMANDE},
    ],
    reservations: [
         { id: 'res-1', personnelId: 'pers-2', salle: 'Salle TP 1', date: '2023-11-20', heure: '10:00', materiels: '5 multimètres, 5 générateurs', status: ReservationStatus.EN_ATTENTE },
    ]
};

const dataReducer = (state: AppState, action: Action): AppState => {
    switch (action.type) {
        case 'ADD_MATERIAL':
            return {
                ...state,
                materials: [...state.materials, action.payload]
            };
        case 'UPDATE_MATERIAL':
            return {
                ...state,
                materials: state.materials.map(m =>
                    m.id === action.payload.id ? action.payload : m
                )
            };
        case 'DELETE_MATERIAL':
            return {
                ...state,
                materials: state.materials.filter(m => m.id !== action.payload)
            };
        case 'ADD_MOVEMENT':
            return {
                ...state,
                movements: [action.payload, ...state.movements]
            };
        case 'ADD_PERSONNEL':
            return {
                ...state,
                personnel: [...state.personnel, action.payload]
            };
        case 'UPDATE_CONFIG':
            return {
                ...state,
                configuration: action.payload
            };
        case 'ADD_RESERVATION':
            return {
                ...state,
                reservations: [action.payload, ...state.reservations],
            };
        case 'UPDATE_RESERVATION_STATUS':
            return {
                ...state,
                reservations: state.reservations.map(r => 
                    r.id === action.payload.id ? { ...r, status: action.payload.status } : r
                ),
            };
        default:
            return state;
    }
};

interface DataContextType {
    state: AppState;
    dispatch: React.Dispatch<Action>;
    getCategoryNameById: (id: string) => string;
    getPersonnelNameById: (id: string) => string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [storedState, setStoredState] = useLocalStorage('smartlabo_data', initialState);

    const [state, dispatch] = useReducer(dataReducer, storedState);

    useEffect(() => {
        setStoredState(state);
    }, [state, setStoredState]);

    const getCategoryNameById = (id: string) => {
        return state.categories.find(c => c.id === id)?.name || 'Inconnue';
    }
    
    const getPersonnelNameById = (id: string) => {
        return state.personnel.find(p => p.id === id)?.nom || 'Inconnu';
    }

    return (
        <DataContext.Provider value={{ state, dispatch, getCategoryNameById, getPersonnelNameById }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
