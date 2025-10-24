import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { Reservation, ReservationItem, ReservationStatus, Material } from '../../types';
import Modal from '../ui/Modal';
import FormField from '../ui/FormField';
import FormActions from '../ui/FormActions';

const Reservations: React.FC = () => {
    const { state, dispatch } = useData();
    const [isModalOpen, setModalOpen] = useState(false);
    
    // New Reservation Form State
    const [demandeur, setDemandeur] = useState('');
    const [datePrevue, setDatePrevue] = useState('');
    const [notes, setNotes] = useState('');
    const [requestedItems, setRequestedItems] = useState<ReservationItem[]>([]);
    
    // State for the item being added
    const [selectedMaterialId, setSelectedMaterialId] = useState<string>('');
    const [quantityToAdd, setQuantityToAdd] = useState(1);
    const [materialSearchTerm, setMaterialSearchTerm] = useState('');
    
    const resetForm = () => {
        setDemandeur('');
        setDatePrevue('');
        setNotes('');
        setRequestedItems([]);
        setSelectedMaterialId('');
        setMaterialSearchTerm('');
        setQuantityToAdd(1);
    };
    
    const handleOpenModal = () => {
        resetForm();
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };
    
    const handleAddItem = () => {
        if (!selectedMaterialId || quantityToAdd <= 0) {
            alert("Veuillez sélectionner un article et une quantité valide.");
            return;
        }

        const material = state.materials.find(m => m.id === selectedMaterialId);
        if (!material) return;
        
        const alreadyRequestedQty = requestedItems.find(item => item.materialId === selectedMaterialId)?.quantity || 0;

        if (quantityToAdd + alreadyRequestedQty > material.quantity) {
             alert(`La quantité demandée (${quantityToAdd + alreadyRequestedQty}) dépasse le stock disponible (${material.quantity}).`);
             return;
        }
        
        const existingItemIndex = requestedItems.findIndex(item => item.materialId === selectedMaterialId);
        if (existingItemIndex > -1) {
            const newRequestedItems = [...requestedItems];
            newRequestedItems[existingItemIndex].quantity += quantityToAdd;
            setRequestedItems(newRequestedItems);
        } else {
            setRequestedItems([...requestedItems, { materialId: selectedMaterialId, quantity: quantityToAdd }]);
        }
        
        // Reset selection for next item
        setSelectedMaterialId('');
        setMaterialSearchTerm('');
        setQuantityToAdd(1);
    };
    
    const handleRemoveItem = (materialId: string) => {
        setRequestedItems(requestedItems.filter(item => item.materialId !== materialId));
    };
    
    const handleSubmitReservation = (e: React.FormEvent) => {
        e.preventDefault();
        if (!demandeur || !datePrevue || requestedItems.length === 0) {
            alert("Veuillez remplir le nom du demandeur, la date prévue et ajouter au moins un article.");
            return;
        }
        
        const newReservation: Reservation = {
            id: `res-${Date.now()}`,
            demandeur,
            date_demande: new Date().toISOString(),
            date_prevue: new Date(datePrevue).toISOString(),
            status: ReservationStatus.EN_ATTENTE,
            materiels: requestedItems,
            notes,
        };
        
        dispatch({ type: 'ADD_RESERVATION', payload: newReservation });
        handleCloseModal();
    };

    const getMaterialNameById = (id: string) => {
        return state.materials.find(m => m.id === id)?.name || 'Inconnu';
    };

    const materialSearchResults = useMemo(() => {
        const selected = state.materials.find(m => m.id === selectedMaterialId);
        if (!materialSearchTerm || (selected && selected.name === materialSearchTerm)) {
            return [];
        }
        return state.materials.filter(m =>
            m.quantity > 0 && m.name.toLowerCase().includes(materialSearchTerm.toLowerCase())
        );
    }, [materialSearchTerm, selectedMaterialId, state.materials]);

    const handleMaterialSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMaterialSearchTerm(e.target.value);
        if (selectedMaterialId) {
            setSelectedMaterialId('');
        }
    };

    const handleMaterialSelect = (material: Material) => {
        setSelectedMaterialId(material.id);
        setMaterialSearchTerm(material.name);
    };
    
    const memoizedSelectedMaterial = useMemo(() => {
        return state.materials.find(m => m.id === selectedMaterialId);
    }, [selectedMaterialId, state.materials]);

    return (
         <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Réservations</h2>
                <button
                    onClick={handleOpenModal}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition shadow-md"
                >
                    + Nouvelle Réservation
                </button>
            </div>
             <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Demandeur</th>
                            <th scope="col" className="px-6 py-3">Date Prévue</th>
                            <th scope="col" className="px-6 py-3">Matériels Demandés</th>
                            <th scope="col" className="px-6 py-3">Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.reservations.map(res => (
                            <tr key={res.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{res.demandeur}</td>
                                <td className="px-6 py-4">{new Date(res.date_prevue).toLocaleDateString('fr-FR')}</td>
                                <td className="px-6 py-4">
                                    <ul className="list-disc list-inside">
                                        {res.materiels.map(item => (
                                            <li key={item.materialId}>{getMaterialNameById(item.materialId)} (x{item.quantity})</li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="px-6 py-4">{res.notes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {state.reservations.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        Aucune réservation à afficher.
                    </div>
                )}
            </div>

             <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Nouvelle Réservation de Matériel">
                <form onSubmit={handleSubmitReservation} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Demandeur" htmlFor="demandeur">
                            <input type="text" id="demandeur" value={demandeur} onChange={e => setDemandeur(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500" required />
                        </FormField>
                        <FormField label="Date prévue pour le retrait" htmlFor="datePrevue">
                            <input type="date" id="datePrevue" value={datePrevue} onChange={e => setDatePrevue(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500" required />
                        </FormField>
                    </div>

                    <div className="border-t dark:border-gray-700 pt-4">
                        <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Ajouter des articles</h4>
                        <div className="flex items-end gap-2 p-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                            <div className="flex-grow relative">
                                <label htmlFor="material-search" className="text-sm font-medium text-gray-700 dark:text-gray-300">Article (Stock)</label>
                                <input
                                    id="material-search"
                                    type="text"
                                    value={materialSearchTerm}
                                    onChange={handleMaterialSearchChange}
                                    placeholder="Rechercher un article..."
                                    autoComplete="off"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500"
                                />
                                {materialSearchResults.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                        <ul>
                                            {materialSearchResults.map(mat => (
                                                <li
                                                    key={mat.id}
                                                    onClick={() => handleMaterialSelect(mat)}
                                                    className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                                >
                                                    {mat.name} <span className="text-xs text-gray-500 dark:text-gray-400">({mat.quantity} en stock)</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                             <div className="w-24">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantité</label>
                                <input 
                                    type="number" 
                                    value={quantityToAdd} 
                                    onChange={e => setQuantityToAdd(Number(e.target.value))} 
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-200 dark:disabled:bg-gray-800" 
                                    min="1" 
                                    max={memoizedSelectedMaterial?.quantity} 
                                    disabled={!selectedMaterialId}
                                />
                             </div>
                             <button 
                                type="button" 
                                onClick={handleAddItem} 
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 self-end transition disabled:bg-blue-400 disabled:cursor-not-allowed"
                                disabled={!selectedMaterialId}
                            >
                                Ajouter
                            </button>
                        </div>
                    </div>
                    
                    {requestedItems.length > 0 && (
                        <div className="border rounded-lg p-3 dark:border-gray-600 space-y-2 max-h-48 overflow-y-auto">
                            <h5 className="font-semibold text-gray-800 dark:text-gray-200">Articles demandés :</h5>
                            {requestedItems.map(item => (
                                <div key={item.materialId} className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-2 rounded">
                                    <span className="text-sm text-gray-800 dark:text-gray-200">{getMaterialNameById(item.materialId)} - Quantité: {item.quantity}</span>
                                    <button type="button" onClick={() => handleRemoveItem(item.materialId)} className="text-red-500 hover:text-red-700 text-sm font-semibold">Retirer</button>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    <FormField label="Notes (Optionnel)" htmlFor="notes">
                        <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500" placeholder="Ex: Pour TP de chimie, classe 3ème Science..."></textarea>
                    </FormField>
                    
                    <FormActions onCancel={handleCloseModal} submitLabel="Soumettre la demande" />
                </form>
            </Modal>
        </div>
    );
};

export default Reservations;