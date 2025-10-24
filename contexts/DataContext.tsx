import React, { createContext, useContext, useReducer, ReactNode, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import {
    Material,
    Movement,
    Category,
    Order,
    Personnel,
    Room,
    Lab,
    Configuration,
    Unit,
    MovementType,
    OrderStatus,
    PersonnelRole,
    Reservation,
    ReservationStatus
} from '../types';

// Initial state
const initialState: AppState = {
    materials: [
        { id: 'mat-1', num_fiche: 'P01', name: 'Bécher 250ml', description: 'Verrerie de laboratoire', brand: 'Pyrex', categoryId: 'cat-chim-mat', quantity: 20, unit: Unit.UNITE, location: 'Armoire A1', etat: 'Bon', observation: '', date_saisie: new Date().toISOString(), date_modification: new Date().toISOString(), alertThreshold: 5 },
        { id: 'mat-2', num_fiche: 'C01', name: 'Acide Chlorhydrique', description: 'Solution 1M', brand: 'Sigma', categoryId: 'cat-chim-prod', quantity: 2, unit: Unit.LITRE, location: 'Armoire C3', etat: 'Bon', observation: 'Corrosif', date_saisie: new Date().toISOString(), date_modification: new Date().toISOString(), alertThreshold: 1 },
        { id: 'mat-3', num_fiche: 'E01', name: 'Multimètre', description: 'Appareil de mesure électrique', brand: 'Fluke', categoryId: 'cat-phys', quantity: 8, unit: Unit.UNITE, location: 'Armoire B2', etat: 'Bon', observation: '', date_saisie: new Date().toISOString(), date_modification: new Date().toISOString(), alertThreshold: 2 },
        { id: 'mat-4', num_fiche: 'S01', name: 'Microscope optique', description: 'Microscope pour observations', brand: 'Olympus', categoryId: 'cat-svt-mat', quantity: 5, unit: Unit.UNITE, location: 'Armoire SVT1', etat: 'Bon', observation: '', date_saisie: new Date().toISOString(), date_modification: new Date().toISOString(), alertThreshold: 1 },
        { id: 'mat-5', num_fiche: 'S02', name: 'Bleu de méthylène', description: 'Colorant pour préparations microscopiques', brand: 'Jeulin', categoryId: 'cat-svt-prod', quantity: 1, unit: Unit.FLACON, location: 'Armoire SVT2', etat: 'Bon', observation: '', date_saisie: new Date().toISOString(), date_modification: new Date().toISOString(), alertThreshold: 1 },
    ],
    categories: [
        { id: 'cat-phys', name: 'Matériels Physique' },
        { id: 'cat-chim-mat', name: 'Matériels Chimie' },
        { id: 'cat-chim-prod', name: 'Produits Chimie' },
        { id: 'cat-svt-mat', name: 'Matériels SVT' },
        { id: 'cat-svt-prod', name: 'Produits SVT' },
    ],
    movements: [
        { id: 'mov-1', materialId: 'mat-1', materialName: 'Bécher 250ml', type: MovementType.ENTREE, quantity: 5, date: new Date().toISOString(), notes: 'Nouvelle commande' },
    ],
    orders: [
         { id: 'ord-1', supplier: 'Fournisseur A', orderDate: new Date().toISOString(), status: OrderStatus.RECU, items: [{ materialId: 'mat-1', materialName: 'Bécher 250ml', quantity: 5 }] }
    ],
    reservations: [
        {
            id: 'res-1',
            demandeur: 'Mme. Durant',
            date_demande: new Date().toISOString(),
            date_prevue: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            status: ReservationStatus.EN_ATTENTE,
            materiels: [
                { materialId: 'mat-1', quantity: 5 },
                { materialId: 'mat-3', quantity: 2 }
            ],
            notes: 'Pour TP de physique classe de 2ème année.'
        }
    ],
    personnel: [
        { id: 'per-1', nom: 'Mr. Dupont', role: PersonnelRole.TECHNICIEN, labo: 'Physique-Chimie' },
        { id: 'per-2', nom: 'Mme. Durant', role: PersonnelRole.ENSEIGNANT, labo: 'SVT' }
    ],
    rooms: [
        { id: 'room-1', name: 'Salle de TP 101' },
        { id: 'room-2', name: 'Salle de cours 203' },
    ],
    labs: [
        { id: 'lab-1', name: 'Laboratoire de Chimie' },
        { id: 'lab-2', name: 'Laboratoire de Physique' },
        { id: 'lab-3', name: 'Laboratoire de SVT' },
    ],
    configuration: {
        school_name: 'Lycée Pilote de Sfax',
        region: 'Sfax 1'
    }
};

// Types for state and actions
interface AppState {
    materials: Material[];
    categories: Category[];
    movements: Movement[];
    orders: Order[];
    reservations: Reservation[];
    personnel: Personnel[];
    rooms: Room[];
    labs: Lab[];
    configuration: Configuration;
}

type Action =
    | { type: 'ADD_MATERIAL'; payload: Material }
    | { type: 'UPDATE_MATERIAL'; payload: Material }
    | { type: 'DELETE_MATERIAL'; payload: string }
    | { type: 'ADD_MOVEMENT'; payload: Movement }
    | { type: 'ADD_RESERVATION'; payload: Reservation }
    | { type: 'UPDATE_RESERVATION_STATUS'; payload: { id: string; status: ReservationStatus } }
    | { type: 'ADD_PERSONNEL'; payload: Personnel }
    | { type: 'UPDATE_PERSONNEL'; payload: Personnel }
    | { type: 'DELETE_PERSONNEL'; payload: string }
    | { type: 'UPDATE_CONFIG'; payload: Configuration }
    | { type: 'ADD_ROOM'; payload: Room }
    | { type: 'UPDATE_ROOM'; payload: Room }
    | { type: 'DELETE_ROOM'; payload: string }
    | { type: 'ADD_LAB'; payload: Lab }
    | { type: 'UPDATE_LAB'; payload: Lab }
    | { type: 'DELETE_LAB'; payload: string }
    | { type: 'ADD_ORDER'; payload: Order }
    | { type: 'UPDATE_ORDER'; payload: Order }
    | { type: 'DELETE_ORDER'; payload: string };

// Reducer function
const dataReducer = (state: AppState, action: Action): AppState => {
    switch (action.type) {
        case 'ADD_MATERIAL':
            return { ...state, materials: [...state.materials, action.payload] };
        case 'UPDATE_MATERIAL':
            return {
                ...state,
                materials: state.materials.map(m =>
                    m.id === action.payload.id ? action.payload : m
                ),
            };
        case 'DELETE_MATERIAL':
            return {
                ...state,
                materials: state.materials.filter(m => m.id !== action.payload),
            };
        case 'ADD_MOVEMENT':
            // Add movement to the beginning of the array to show recent ones first
            return { ...state, movements: [action.payload, ...state.movements] };
        case 'ADD_RESERVATION':
            return { ...state, reservations: [action.payload, ...state.reservations] };
        case 'UPDATE_RESERVATION_STATUS':
            return {
                ...state,
                reservations: state.reservations.map(r =>
                    r.id === action.payload.id ? { ...r, status: action.payload.status } : r
                ),
            };
        case 'ADD_PERSONNEL':
            return { ...state, personnel: [...state.personnel, action.payload] };
        case 'UPDATE_PERSONNEL':
            return {
                ...state,
                personnel: state.personnel.map(p =>
                    p.id === action.payload.id ? action.payload : p
                ),
            };
        case 'DELETE_PERSONNEL':
            return {
                ...state,
                personnel: state.personnel.filter(p => p.id !== action.payload),
            };
        case 'UPDATE_CONFIG':
            return { ...state, configuration: action.payload };
        case 'ADD_ROOM':
            return { ...state, rooms: [...state.rooms, action.payload] };
        case 'UPDATE_ROOM':
            return {
                ...state,
                rooms: state.rooms.map(r => r.id === action.payload.id ? action.payload : r),
            };
        case 'DELETE_ROOM':
            return {
                ...state,
                rooms: state.rooms.filter(r => r.id !== action.payload),
            };
        case 'ADD_LAB':
            return { ...state, labs: [...state.labs, action.payload] };
        case 'UPDATE_LAB':
            return {
                ...state,
                labs: state.labs.map(l => l.id === action.payload.id ? action.payload : l),
            };
        case 'DELETE_LAB':
            return {
                ...state,
                labs: state.labs.filter(l => l.id !== action.payload),
            };
        case 'ADD_ORDER':
            return { ...state, orders: [action.payload, ...state.orders] };
        case 'UPDATE_ORDER':
            return {
                ...state,
                orders: state.orders.map(o => o.id === action.payload.id ? action.payload : o),
            };
        case 'DELETE_ORDER':
            return {
                ...state,
                orders: state.orders.filter(o => o.id !== action.payload),
            };
        default:
            return state;
    }
};


// Context
interface DataContextType {
    state: AppState;
    dispatch: React.Dispatch<Action>;
    getCategoryNameById: (id: string) => string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Provider component
export const DataProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [storedState, setStoredState] = useLocalStorage<AppState>('smartlabo_data', initialState);
    
    const [state, dispatch] = useReducer(dataReducer, storedState);
    
    // Persist state changes to localStorage
    React.useEffect(() => {
        setStoredState(state);
    }, [state, setStoredState]);

    const getCategoryNameById = useMemo(() => (id: string): string => {
        const category = state.categories.find(c => c.id === id);
        return category ? category.name : 'Inconnue';
    }, [state.categories]);

    return (
        <DataContext.Provider value={{ state, dispatch, getCategoryNameById }}>
            {children}
        </DataContext.Provider>
    );
};

// Custom hook to use the context
export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};