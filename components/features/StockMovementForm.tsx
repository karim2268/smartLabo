
import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Material, MovementType } from '../../types';

interface StockMovementFormProps {
    material: Material;
    onDone: () => void;
}

const StockMovementForm: React.FC<StockMovementFormProps> = ({ material, onDone }) => {
    const { dispatch } = useData();
    const [quantityChange, setQuantityChange] = useState<number>(1);
    const [movementType, setMovementType] = useState<MovementType>(MovementType.SORTIE);
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const change = movementType === MovementType.ENTREE ? quantityChange : -quantityChange;
        
        if (movementType === MovementType.SORTIE && material.quantity < quantityChange) {
            alert("La quantité de sortie ne peut pas être supérieure au stock actuel.");
            return;
        }

        dispatch({
            type: 'UPDATE_STOCK',
            payload: {
                materialId: material.id,
                quantityChange: change,
                type: movementType,
                notes: notes || (movementType === MovementType.SORTIE ? 'Utilisation normale' : 'Réapprovisionnement')
            }
        });
        onDone();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <p className="text-lg">Stock Actuel: <span className="font-bold">{material.quantity} {material.unit}</span></p>
            </div>
            
            <div className="flex items-center space-x-4">
                <div className="flex items-center">
                    <input id="sortie" type="radio" value={MovementType.SORTIE} name="movementType"
                           checked={movementType === MovementType.SORTIE} onChange={() => setMovementType(MovementType.SORTIE)}
                           className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                    <label htmlFor="sortie" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Sortie</label>
                </div>
                <div className="flex items-center">
                    <input id="entree" type="radio" value={MovementType.ENTREE} name="movementType"
                           checked={movementType === MovementType.ENTREE} onChange={() => setMovementType(MovementType.ENTREE)}
                           className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                    <label htmlFor="entree" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Entrée</label>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantité</label>
                <input 
                    type="number" 
                    value={quantityChange} 
                    onChange={(e) => setQuantityChange(Number(e.target.value))} 
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" 
                    min="1"
                    required
                />
            </div>
            
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes (Optionnel)</label>
                <input 
                    type="text" 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)} 
                    placeholder="Ex: Utilisation pour cours de 1ère S"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" 
                />
            </div>

            <div className="pt-4 flex justify-end space-x-2">
                <button type="button" onClick={onDone} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Valider Mouvement</button>
            </div>
        </form>
    );
};

export default StockMovementForm;
