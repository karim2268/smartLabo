import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { Reservation, ReservationStatus, PersonnelRole } from '../../types';
import Modal from '../ui/Modal';

const Reservations: React.FC = () => {
    const { state, dispatch, getPersonnelNameById } = useData();
    const [isAddModalOpen, setAddModalOpen] = useState(false);

    const getInitialFormState = () => ({
        personnelId: state.personnel.find(p => p.role === PersonnelRole.ENSEIGNANT)?.id || '',
        salle: state.rooms[0]?.name || '',
        date: new Date().toISOString().split('T')[0],
        heure: '08:00',
        materiels: '',
    });
    
    const [newReservation, setNewReservation] = useState(getInitialFormState());

    const handleStatusChange = (id: string, status: ReservationStatus) => {
        if (window.confirm(`Êtes-vous sûr de vouloir ${status === ReservationStatus.CONFIRMEE ? 'confirmer' : 'refuser'} cette réservation ?`)) {
            dispatch({ type: 'UPDATE_RESERVATION_STATUS', payload: { id, status } });
        }
    };
    
    const handleAddReservation = (e: React.FormEvent) => {
        e.preventDefault();
        if(!newReservation.personnelId || !newReservation.salle || !newReservation.date || !newReservation.heure || !newReservation.materiels) {
            alert('Veuillez remplir tous les champs.');
            return;
        }

        const reservationToAdd: Omit<Reservation, 'id' | 'status'> = {
            ...newReservation,
        };
        
        dispatch({
            type: 'ADD_RESERVATION',
            payload: {
                ...reservationToAdd,
                id: `res-${Date.now()}`,
                status: ReservationStatus.EN_ATTENTE,
            }
        });
        
        setAddModalOpen(false);
    };
    
    const handleOpenAddModal = () => {
        setNewReservation(getInitialFormState());
        setAddModalOpen(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewReservation(prev => ({ ...prev, [name]: value }));
    };

    const getStatusColor = (status: ReservationStatus) => {
        switch (status) {
            case ReservationStatus.CONFIRMEE:
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case ReservationStatus.EN_ATTENTE:
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case ReservationStatus.REFUSEE:
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const sortedReservations = useMemo(() => {
        return [...state.reservations].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [state.reservations]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Réservations de Matériel</h2>
                <button
                    onClick={handleOpenAddModal}
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
                            <th scope="col" className="px-6 py-3">Date & Heure</th>
                            <th scope="col" className="px-6 py-3">Salle</th>
                            <th scope="col" className="px-6 py-3">Matériels Demandés</th>
                            <th scope="col" className="px-6 py-3">Statut</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedReservations.map(res => (
                            <tr key={res.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{getPersonnelNameById(res.personnelId)}</td>
                                <td className="px-6 py-4">{new Date(res.date).toLocaleDateString('fr-FR')} à {res.heure}</td>
                                <td className="px-6 py-4">{res.salle}</td>
                                <td className="px-6 py-4">{res.materiels}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(res.status)}`}>
                                        {res.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 space-x-2 whitespace-nowrap">
                                    {res.status === ReservationStatus.EN_ATTENTE && (
                                        <>
                                            <button onClick={() => handleStatusChange(res.id, ReservationStatus.CONFIRMEE)} className="font-medium text-green-600 dark:text-green-500 hover:underline">Confirmer</button>
                                            <button onClick={() => handleStatusChange(res.id, ReservationStatus.REFUSEE)} className="font-medium text-danger hover:underline">Refuser</button>
                                        </>
                                    )}
                                </td>
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
            
            <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} title="Nouvelle Réservation">
                 <form onSubmit={handleAddReservation} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Demandeur</label>
                        <select name="personnelId" value={newReservation.personnelId} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" required>
                            <option value="" disabled>-- Choisir un personnel --</option>
                            {state.personnel.filter(p => p.role === PersonnelRole.ENSEIGNANT).map(p => (
                                <option key={p.id} value={p.id}>{p.nom}</option>
                            ))}
                        </select>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                            <input type="date" name="date" value={newReservation.date} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Heure</label>
                            <input type="time" name="heure" value={newReservation.heure} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Salle / Laboratoire</label>
                        <select name="salle" value={newReservation.salle} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" required>
                           <option value="" disabled>-- Choisir une salle --</option>
                            {state.rooms.map(r => (
                                <option key={r.id} value={r.name}>{r.name}</option>
                            ))}
                             {state.labs.map(l => (
                                <option key={l.id} value={l.name}>{l.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Matériels demandés</label>
                        <textarea name="materiels" value={newReservation.materiels} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" placeholder="Ex: 5 multimètres, 1 oscilloscope..." required></textarea>
                    </div>
                    <div className="pt-4 flex justify-end space-x-2">
                        <button type="button" onClick={() => setAddModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Annuler</button>
                        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Soumettre la demande</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Reservations;
