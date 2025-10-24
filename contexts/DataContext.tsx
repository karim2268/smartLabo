
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Material, Movement, Order, Category, Unit, MovementType, OrderStatus } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';

interface AppState {
    materials: Material[];
    movements: Movement[];
    orders: Order[];
}

const initialMockData: AppState = {
    materials: [
        { id: '1', code: 'PHY-001', name: 'Bécher 250ml', category: Category.MATERIEL_CHIMIE, description: 'Verrerie de laboratoire', quantity: 50, alertThreshold: 10, unit: Unit.UNITE, brand: 'Pyrex', model: '1000-250', location: 'Étagère A1', createdAt: new Date().toISOString() },
        { id: '2', code: 'PHY-002', name: 'Multimètre', category: Category.MATERIEL_PHYSIQUE, description: 'Appareil de mesure électrique', quantity: 15, alertThreshold: 5, unit: Unit.UNITE, brand: 'Fluke', model: '115', location: 'Armoire B2', createdAt: new Date().toISOString() },
        { id: '3', code: 'CHM-001', name: 'Acide Chlorhydrique', category: Category.PRODUIT_CHIMIE, description: 'Solution 1M', quantity: 5, alertThreshold: 2, unit: Unit.LITRE, brand: 'Sigma-Aldrich', model: 'N/A', location: 'Hotte', createdAt: new Date().toISOString() },
        { id: '4', code: 'SVT-001', name: 'Microscope', category: Category.MATERIEL_SVT, description: 'Microscope optique', quantity: 12, alertThreshold: 3, unit: Unit.UNITE, brand: 'Olympus', model: 'CX23', location: 'Table 3', createdAt: new Date().toISOString() },
    ],
    movements: [
        { id: 'm1', materialId: '1', materialName: 'Bécher 250ml', type: MovementType.ENTREE, quantity: 5, date: new Date().toISOString(), notes: 'Nouvelle commande' },
    ],
    orders: [
         { id: 'o1', orderDate: new Date().toISOString(), supplier: 'Fournisseur Local', items: [{id: 'oi1', materialName: 'Bécher 250ml', quantity: 20}], status: OrderStatus.RECU, deliveryDate: new Date().toISOString() },
    ],
};

type Action =
    | { type: 'ADD_MATERIAL'; payload: Material }
    | { type: 'UPDATE_MATERIAL'; payload: Material }
    | { type: 'DELETE_MATERIAL'; payload: string }
    | { type: 'UPDATE_STOCK'; payload: { materialId: string; quantityChange: number; type: MovementType; notes: string } }
    | { type: 'ADD_ORDER'; payload: Order }
    | { type: 'UPDATE_ORDER'; payload: Order }
    | { type: 'DELETE_ORDER'; payload: string }
    | { type: 'SET_STATE'; payload: AppState };

const dataReducer = (state: AppState, action: Action): AppState => {
    switch (action.type) {
        case 'ADD_MATERIAL':
            return { ...state, materials: [...state.materials, action.payload] };
        case 'UPDATE_MATERIAL':
            return { ...state, materials: state.materials.map(m => m.id === action.payload.id ? action.payload : m) };
        case 'DELETE_MATERIAL':
            return { ...state, materials: state.materials.filter(m => m.id !== action.payload) };
        case 'UPDATE_STOCK': {
            const { materialId, quantityChange, type, notes } = action.payload;
            const material = state.materials.find(m => m.id === materialId);
            if (!material) return state;

            const newMovement: Movement = {
                id: `mvt-${Date.now()}`,
                materialId,
                materialName: material.name,
                type,
                quantity: quantityChange,
                date: new Date().toISOString(),
                notes
            };
            
            return {
                ...state,
                materials: state.materials.map(m => m.id === materialId ? { ...m, quantity: m.quantity + quantityChange } : m),
                movements: [newMovement, ...state.movements]
            };
        }
        case 'ADD_ORDER':
            return { ...state, orders: [...state.orders, action.payload] };
        case 'UPDATE_ORDER':
             return { ...state, orders: state.orders.map(o => o.id === action.payload.id ? action.payload : o) };
        case 'DELETE_ORDER':
            return { ...state, orders: state.orders.filter(o => o.id !== action.payload) };
        case 'SET_STATE':
            return action.payload;
        default:
            return state;
    }
};

interface DataContextType {
    state: AppState;
    dispatch: React.Dispatch<Action>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [storedState, setStoredState] = useLocalStorage<AppState>('smartlabo_data', initialMockData);
    const [state, dispatch] = useReducer(dataReducer, storedState);
    
    useEffect(() => {
        setStoredState(state);
    }, [state, setStoredState]);

    // This effect ensures that if the local storage is empty (e.g., first visit), it gets populated.
    useEffect(() => {
        const item = window.localStorage.getItem('smartlabo_data');
        if (!item || JSON.parse(item).materials.length === 0) {
           dispatch({ type: 'SET_STATE', payload: initialMockData });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <DataContext.Provider value={{ state, dispatch }}>
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
