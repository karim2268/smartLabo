
import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { Material } from '../../types';
import Modal from '../ui/Modal';
import MaterialForm from '../features/MaterialForm';
import StockMovementForm from '../features/StockMovementForm';

const Inventory: React.FC = () => {
    const { state, dispatch } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isStockModalOpen, setStockModalOpen] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

    const filteredMaterials = useMemo(() =>
        state.materials.filter(material =>
            material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            material.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            material.category.toLowerCase().includes(searchTerm.toLowerCase())
        ).sort((a, b) => a.name.localeCompare(b.name)),
        [state.materials, searchTerm]
    );

    const handleEdit = (material: Material) => {
        setSelectedMaterial(material);
        setAddModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
            dispatch({ type: 'DELETE_MATERIAL', payload: id });
        }
    };
    
    const handleOpenStockModal = (material: Material) => {
        setSelectedMaterial(material);
        setStockModalOpen(true);
    };

    const handleCloseAddModal = () => {
        setAddModalOpen(false);
        setSelectedMaterial(null);
    };
    
    const handleCloseStockModal = () => {
        setStockModalOpen(false);
        setSelectedMaterial(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Inventaire</h2>
                <button
                    onClick={() => setAddModalOpen(true)}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 transition duration-300 ease-in-out shadow-md"
                >
                    + Ajouter un Article
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <input
                    type="text"
                    placeholder="Rechercher par nom, code, catégorie..."
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nom</th>
                            <th scope="col" className="px-6 py-3">Catégorie</th>
                            <th scope="col" className="px-6 py-3">Quantité</th>
                            <th scope="col" className="px-6 py-3">Seuil d'Alerte</th>
                            <th scope="col" className="px-6 py-3">Emplacement</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMaterials.map(material => {
                             const isLowStock = material.quantity <= material.alertThreshold;
                             return (
                                <tr key={material.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{material.name}</th>
                                    <td className="px-6 py-4">{material.category}</td>
                                    <td className={`px-6 py-4 font-bold ${isLowStock ? 'text-danger' : 'text-gray-900 dark:text-white'}`}>
                                        {material.quantity} {material.unit}
                                        {isLowStock && <span className="ml-2 text-xs">(Faible)</span>}
                                    </td>
                                    <td className="px-6 py-4">{material.alertThreshold}</td>
                                    <td className="px-6 py-4">{material.location}</td>
                                    <td className="px-6 py-4 space-x-2">
                                        <button onClick={() => handleOpenStockModal(material)} className="font-medium text-green-600 dark:text-green-500 hover:underline">Stock</button>
                                        <button onClick={() => handleEdit(material)} className="font-medium text-primary-600 dark:text-primary-500 hover:underline">Modifier</button>
                                        <button onClick={() => handleDelete(material.id)} className="font-medium text-danger hover:underline">Supprimer</button>
                                    </td>
                                </tr>
                             );
                        })}
                    </tbody>
                </table>
                 {filteredMaterials.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        Aucun article trouvé.
                    </div>
                )}
            </div>

            <Modal isOpen={isAddModalOpen} onClose={handleCloseAddModal} title={selectedMaterial ? 'Modifier un Article' : 'Ajouter un Article'}>
                <MaterialForm material={selectedMaterial} onDone={handleCloseAddModal} />
            </Modal>
            
             <Modal isOpen={isStockModalOpen} onClose={handleCloseStockModal} title={`Gérer le stock de ${selectedMaterial?.name}`}>
                {selectedMaterial && <StockMovementForm material={selectedMaterial} onDone={handleCloseStockModal} />}
            </Modal>
        </div>
    );
};

export default Inventory;
