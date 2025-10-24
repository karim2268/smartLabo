import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Room, Lab } from '../../types';
import Modal from '../ui/Modal';

// Icons for actions
const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
    </svg>
);

const DeleteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const SaveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const CancelIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

interface EditableSectionProps<T extends { id: string; name: string }> {
    title: string;
    items: T[];
    onAdd: (name: string) => void;
    onUpdate: (id: string, name: string) => void;
    onDeleteRequest: (item: T) => void;
}

const EditableSection = <T extends { id: string; name: string }>({ title, items, onAdd, onUpdate, onDeleteRequest }: EditableSectionProps<T>) => {
    const [newItemName, setNewItemName] = useState('');
    const [editingItem, setEditingItem] = useState<T | null>(null);
    const [editingName, setEditingName] = useState('');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (newItemName.trim()) {
            onAdd(newItemName.trim());
            setNewItemName('');
        }
    };

    const handleEditStart = (item: T) => {
        setEditingItem(item);
        setEditingName(item.name);
    };

    const handleEditCancel = () => {
        setEditingItem(null);
        setEditingName('');
    };

    const handleEditSave = () => {
        if (editingItem && editingName.trim()) {
            onUpdate(editingItem.id, editingName.trim());
            handleEditCancel();
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{title}</h3>
            <div className="flex-grow space-y-2 mb-4 overflow-y-auto max-h-96 pr-2">
                {items.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
                        {editingItem?.id === item.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    className="flex-grow p-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md focus:ring-primary-500 focus:border-primary-500 text-gray-700 dark:text-gray-300"
                                    autoFocus
                                />
                                <div className="flex space-x-2 ml-2">
                                    <button onClick={handleEditSave} className="text-green-500 hover:text-green-700"><SaveIcon /></button>
                                    <button onClick={handleEditCancel} className="text-gray-500 hover:text-gray-700"><CancelIcon /></button>
                                </div>
                            </>
                        ) : (
                            <>
                                <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                                <div className="flex space-x-3">
                                    <button onClick={() => handleEditStart(item)} className="text-primary-500 hover:text-primary-700"><EditIcon /></button>
                                    <button onClick={() => onDeleteRequest(item)} className="text-danger hover:text-red-700"><DeleteIcon /></button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
                {items.length === 0 && <p className="text-gray-500 dark:text-gray-400 text-center py-4">Aucun élément à afficher.</p>}
            </div>
            <form onSubmit={handleAdd} className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="Ajouter un nouvel élément..."
                    className="flex-grow p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition shadow">
                    Ajouter
                </button>
            </form>
        </div>
    );
};

const RoomsAndLabs: React.FC = () => {
    const { state, dispatch } = useData();
    const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string; type: 'room' | 'lab' } | null>(null);

    // Handlers for Rooms
    const handleAddRoom = (name: string) => {
        const newRoom: Room = { id: `room-${Date.now()}`, name };
        dispatch({ type: 'ADD_ROOM', payload: newRoom });
    };
    const handleUpdateRoom = (id: string, name: string) => {
        const updatedRoom: Room = { id, name };
        dispatch({ type: 'UPDATE_ROOM', payload: updatedRoom });
    };

    // Handlers for Labs
    const handleAddLab = (name: string) => {
        const newLab: Lab = { id: `lab-${Date.now()}`, name };
        dispatch({ type: 'ADD_LAB', payload: newLab });
    };
    const handleUpdateLab = (id: string, name: string) => {
        const updatedLab: Lab = { id, name };
        dispatch({ type: 'UPDATE_LAB', payload: updatedLab });
    };
    
    // Modal handlers
    const openDeleteModal = (item: Room | Lab, type: 'room' | 'lab') => {
        setItemToDelete({ ...item, type });
    };

    const closeDeleteModal = () => {
        setItemToDelete(null);
    };

    const confirmDelete = () => {
        if (!itemToDelete) return;

        if (itemToDelete.type === 'room') {
            dispatch({ type: 'DELETE_ROOM', payload: itemToDelete.id });
        } else {
            dispatch({ type: 'DELETE_LAB', payload: itemToDelete.id });
        }
        closeDeleteModal();
    };
    
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <EditableSection
                    title="Salles"
                    items={state.rooms}
                    onAdd={handleAddRoom}
                    onUpdate={handleUpdateRoom}
                    onDeleteRequest={(item) => openDeleteModal(item as Room, 'room')}
                />
                <EditableSection
                    title="Laboratoires"
                    items={state.labs}
                    onAdd={handleAddLab}
                    onUpdate={handleUpdateLab}
                    onDeleteRequest={(item) => openDeleteModal(item as Lab, 'lab')}
                />
            </div>
            <Modal isOpen={!!itemToDelete} onClose={closeDeleteModal} title="Confirmer la suppression">
                {itemToDelete && (
                     <div className="space-y-6">
                        <p className="text-gray-600 dark:text-gray-400">
                            Êtes-vous sûr de vouloir supprimer définitivement l'élément <span className="font-semibold text-gray-800 dark:text-gray-200">{itemToDelete.name}</span> ? Cette action est irréversible.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={closeDeleteModal}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-danger text-white font-semibold rounded-lg hover:bg-red-700"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default RoomsAndLabs;