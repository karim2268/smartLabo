import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Material, MovementType } from '../../types';
import FormField from '../ui/FormField';
import FormActions from '../ui/FormActions';

interface StockMovementFormProps {
    material: Material;
    onDone: () => void;
}

const StockMovementForm: React.FC<StockMovementFormProps> = ({ material, onDone }) => {
    const { dispatch } = useData();
    const [movementType, setMovementType] = useState<MovementType>(MovementType.SORTIE);
    const [quantity, setQuantity] = useState(1);
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        let newQuantity = material.quantity;
        if(movementType === MovementType.ENTREE) {
            newQuantity += quantity;
        } else if (movementType === MovementType.SORTIE) {
            newQuantity -= quantity;
        } else {
            newQuantity = quantity;
        }

        if (newQuantity < 0) {
            alert("La quantité en stock ne peut pas être négative.");
            return;
        }

        dispatch({
            type: 'ADD_MOVEMENT',
            payload: {
                id: `mov-${Date.now()}`,
                materialId: material.id,
                materialName: material.name,
                type: movementType,
                quantity: quantity,
                date: new Date().toISOString(),
                notes: notes,
            }
        });

        dispatch({
            type: 'UPDATE_MATERIAL',
            payload: { ...material, quantity: newQuantity, date_modification: new Date().toISOString() }
        });

        onDone();
    };

    return (
         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Stock actuel: <span className="font-bold text-lg text-primary-600 dark:text-primary-400">{material.quantity} {material.unit}</span></p>
            </div>
            <FormField label="Type de Mouvement" htmlFor="movementType">
                <select 
                    id="movementType"
                    value={movementType} 
                    onChange={(e) => setMovementType(e.target.value as MovementType)} 
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                >
                    <option value={MovementType.SORTIE}>Sortie</option>
                    <option value={MovementType.ENTREE}>Entrée</option>
                    <option value={MovementType.AJUSTEMENT}>Ajustement (Nouvelle quantité totale)</option>
                </select>
            </FormField>
            <FormField label={movementType === MovementType.AJUSTEMENT ? "Nouvelle Quantité Totale" : "Quantité"} htmlFor="quantity">
                <input 
                    id="quantity"
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                    min="0"
                    required
                />
            </FormField>
            <FormField label="Notes / Motif" htmlFor="notes">
                 <textarea 
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3} 
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Ex: TP de physique 2ème année, Réception commande..."
                 ></textarea>
            </FormField>
            
            <FormActions onCancel={onDone} submitLabel="Valider" />
        </form>
    );
};

export default StockMovementForm;
