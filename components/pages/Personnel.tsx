import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { Personnel, PersonnelRole } from '../../types';
import Modal from '../ui/Modal';

const Personnel: React.FC = () => {
    const { state, dispatch } = useData();
    const [activeTab, setActiveTab] = useState<PersonnelRole>(PersonnelRole.TECHNICIEN);
    const [isConfigModalOpen, setConfigModalOpen] = useState(false);

    const [newPersonnel, setNewPersonnel] = useState({ nom: '', role: activeTab, labo: ''});
    const [config, setConfig] = useState(state.configuration);

    const filteredPersonnel = useMemo(() => {
        return state.personnel.filter(p => p.role === activeTab);
    }, [state.personnel, activeTab]);

    const handleAddPersonnel = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPersonnel.nom || !newPersonnel.labo) {
            alert("Veuillez remplir tous les champs.");
            return;
        }
        dispatch({
            type: 'ADD_PERSONNEL',
            payload: { ...newPersonnel, id: `p-${Date.now()}` }
        });
        setNewPersonnel({ nom: '', role: activeTab, labo: '' });
    };

    const handleConfigSave = () => {
        dispatch({ type: 'UPDATE_CONFIG', payload: config });
        setConfigModalOpen(false);
    }
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                 <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Gestion du Personnel</h2>
                 <button onClick={() => setConfigModalOpen(true)} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                    Configuration de l'établissement
                </button>
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <h3 className="text-lg font-medium mb-2">Ajouter</h3>
                        <form onSubmit={handleAddPersonnel} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nom:</label>
                                <input type="text" value={newPersonnel.nom} onChange={e => setNewPersonnel({...newPersonnel, nom: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rôle:</label>
                                <input type="text" value={activeTab} className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-900 border-gray-300" disabled />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Laboratoire:</label>
                                <input type="text" value={newPersonnel.labo} onChange={e => setNewPersonnel({...newPersonnel, labo: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" />
                            </div>
                            <button type="submit" className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Ajouter</button>
                        </form>
                    </div>
                    <div className="lg:col-span-2">
                         <h3 className="text-lg font-medium mb-2">Liste</h3>
                         <div className="overflow-x-auto border rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Labo</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredPersonnel.map(p => (
                                        <tr key={p.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">{p.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{p.nom}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">{p.role}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">{p.labo}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                         </div>
                    </div>
                </div>
            </div>
            
            <Modal isOpen={isConfigModalOpen} onClose={() => setConfigModalOpen(false)} title="Configuration de l'établissement">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Direction Régionale:</label>
                        <input type="text" value={config.region} onChange={e => setConfig({...config, region: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nom du Lycée:</label>
                        <input type="text" value={config.school_name} onChange={e => setConfig({...config, school_name: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div className="pt-4 flex justify-end">
                        <button onClick={handleConfigSave} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Enregistrer</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Personnel;
