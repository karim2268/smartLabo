import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import type { Personnel } from '../../types';
import { PersonnelRole } from '../../types';
import Modal from '../ui/Modal';
import FormField from '../ui/FormField';
import FormActions from '../ui/FormActions';

// Form component for adding/editing personnel
interface PersonnelFormProps {
    personnel: Personnel | null;
    activeRole: PersonnelRole;
    onDone: () => void;
}

const PersonnelForm: React.FC<PersonnelFormProps> = ({ personnel, activeRole, onDone }) => {
    const { dispatch } = useData();
    const [formData, setFormData] = useState({ nom: '', labo: '' });

    useEffect(() => {
        if (personnel) {
            setFormData({ nom: personnel.nom, labo: personnel.labo });
        } else {
            setFormData({ nom: '', labo: '' });
        }
    }, [personnel]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.nom || !formData.labo) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        if (personnel) {
            // Update existing personnel
            dispatch({
                type: 'UPDATE_PERSONNEL',
                payload: { ...personnel, ...formData }
            });
        } else {
            // Add new personnel
            dispatch({
                type: 'ADD_PERSONNEL',
                payload: { id: `per-${Date.now()}`, role: activeRole, ...formData }
            });
        }
        onDone();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Nom" htmlFor="nom">
                <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                />
            </FormField>
            <FormField label="Laboratoire / Matière" htmlFor="labo">
                <input
                    type="text"
                    id="labo"
                    name="labo"
                    value={formData.labo}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                    placeholder={activeRole === PersonnelRole.TECHNICIEN ? "Ex: Physique-Chimie" : "Ex: SVT"}
                    required
                />
            </FormField>
            <FormActions onCancel={onDone} submitLabel={personnel ? "Mettre à jour" : "Ajouter"} />
        </form>
    );
};


const Personnel: React.FC = () => {
    const { state, dispatch } = useData();
    const [activeTab, setActiveTab] = useState<PersonnelRole>(PersonnelRole.TECHNICIEN);
    
    // Modal states
    const [isConfigModalOpen, setConfigModalOpen] = useState(false);
    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

    // Data for modals
    const [editingPersonnel, setEditingPersonnel] = useState<Personnel | null>(null);
    const [personnelToDelete, setPersonnelToDelete] = useState<Personnel | null>(null);

    // Config state
    const [config, setConfig] = useState(state.configuration);

    const filteredPersonnel = useMemo(() => {
        return state.personnel.filter(p => p.role === activeTab);
    }, [state.personnel, activeTab]);

    // Handlers for Add/Edit Modal
    const handleOpenAddModal = () => {
        setEditingPersonnel(null);
        setFormModalOpen(true);
    };

    const handleOpenEditModal = (p: Personnel) => {
        setEditingPersonnel(p);
        setFormModalOpen(true);
    };
    
    const handleCloseFormModal = () => {
        setFormModalOpen(false);
        setEditingPersonnel(null);
    };

    // Handlers for Delete Modal
    const handleOpenDeleteModal = (p: Personnel) => {
        setPersonnelToDelete(p);
        setDeleteModalOpen(true);
    };
    
    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
        setPersonnelToDelete(null);
    };

    const confirmDelete = () => {
        if (personnelToDelete) {
            dispatch({ type: 'DELETE_PERSONNEL', payload: personnelToDelete.id });
            handleCloseDeleteModal();
        }
    };

    // Handler for Config Modal
    const handleConfigSave = () => {
        dispatch({ type: 'UPDATE_CONFIG', payload: config });
        setConfigModalOpen(false);
    };
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                 <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Gestion du Personnel</h2>
                 <div className="flex items-center space-x-2">
                    <button onClick={handleOpenAddModal} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition shadow">
                        + Ajouter du Personnel
                    </button>
                    <button onClick={() => setConfigModalOpen(true)} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                        Configuration
                    </button>
                 </div>
            </div>
           

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab(PersonnelRole.TECHNICIEN)}
                            className={`${activeTab === PersonnelRole.TECHNICIEN ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Personnel Labo
                        </button>
                        <button
                            onClick={() => setActiveTab(PersonnelRole.ENSEIGNANT)}
                            className={`${activeTab === PersonnelRole.ENSEIGNANT ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Enseignants
                        </button>
                    </nav>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Laboratoire / Matière</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredPersonnel.map(p => (
                                <tr key={p.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{p.nom}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{p.labo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right space-x-2">
                                        <button onClick={() => handleOpenEditModal(p)} className="font-medium text-primary-600 dark:text-primary-500 hover:underline">Modifier</button>
                                        <button onClick={() => handleOpenDeleteModal(p)} className="font-medium text-danger hover:underline">Supprimer</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredPersonnel.length === 0 && (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                           Aucun personnel à afficher dans cette catégorie.
                        </div>
                    )}
                </div>
            </div>
            
            <Modal isOpen={isConfigModalOpen} onClose={() => setConfigModalOpen(false)} title="Configuration de l'établissement">
                <div className="space-y-4">
                    <FormField label="Direction Régionale" htmlFor="region">
                        <input type="text" id="region" value={config.region} onChange={e => setConfig({...config, region: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" />
                    </FormField>
                    <FormField label="Nom du Lycée" htmlFor="school_name">
                        <input type="text" id="school_name" value={config.school_name} onChange={e => setConfig({...config, school_name: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" />
                    </FormField>
                    <div className="pt-4 flex justify-end">
                        <button onClick={handleConfigSave} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Enregistrer</button>
                    </div>
                </div>
            </Modal>
            
            <Modal isOpen={isFormModalOpen} onClose={handleCloseFormModal} title={editingPersonnel ? 'Modifier Personnel' : 'Ajouter Personnel'}>
                <PersonnelForm personnel={editingPersonnel} onDone={handleCloseFormModal} activeRole={activeTab} />
            </Modal>
            
            <Modal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal} title="Confirmer la suppression">
                <div className="space-y-6">
                    <p className="text-gray-600 dark:text-gray-400">
                        Êtes-vous sûr de vouloir supprimer définitivement <span className="font-semibold text-gray-800 dark:text-gray-200">{personnelToDelete?.nom}</span> ? Cette action est irréversible.
                    </p>
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={handleCloseDeleteModal}
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
            </Modal>

        </div>
    );
};

export default Personnel;