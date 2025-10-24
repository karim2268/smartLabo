import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { Material } from '../../types';
import Modal from '../ui/Modal';
import MaterialForm from '../features/MaterialForm';
import StockMovementForm from '../features/StockMovementForm';

const Inventory: React.FC = () => {
    const { state, dispatch, getCategoryNameById } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isStockModalOpen, setStockModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [materialToDelete, setMaterialToDelete] = useState<Material | null>(null);
    const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

    const filteredMaterials = useMemo(() => {
        return state.materials.filter(material => {
            const categoryName = getCategoryNameById(material.categoryId).toLowerCase();
            const search = searchTerm.toLowerCase();
            
            const matchesCategory = categoryFilter === 'all' || material.categoryId === categoryFilter;
            const matchesSearch = material.name.toLowerCase().includes(search) ||
                                  material.num_fiche.toLowerCase().includes(search) ||
                                  (material.location && material.location.toLowerCase().includes(search)) ||
                                  categoryName.includes(search);

            return matchesCategory && matchesSearch;
        }).sort((a, b) => a.name.localeCompare(b.name));
    }, [state.materials, searchTerm, categoryFilter, getCategoryNameById]);


    const handleEdit = (material: Material) => {
        setSelectedMaterial(material);
        setAddModalOpen(true);
    };

    const handleDeleteClick = (material: Material) => {
        setMaterialToDelete(material);
        setDeleteModalOpen(true);
    };
    
    const confirmDelete = () => {
        if (materialToDelete) {
            dispatch({ type: 'DELETE_MATERIAL', payload: materialToDelete.id });
            setDeleteModalOpen(false);
            setMaterialToDelete(null);
        }
    };

    const cancelDelete = () => {
        setDeleteModalOpen(false);
        setMaterialToDelete(null);
    };
    
    const handleOpenStockModal = (material: Material) => {
        setSelectedMaterial(material);
        setStockModalOpen(true);
    };
    
    const handleOpenAddModal = () => {
        setSelectedMaterial(null);
        setAddModalOpen(true);
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
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-3/4">
                    <input
                        type="text"
                        placeholder="Rechercher par désignation, N° fiche, emplacement..."
                        className="w-full sm:w-1/2 p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select 
                        className="w-full sm:w-1/2 p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="all">Toutes les catégories</option>
                        {state.categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                 <button 
                    onClick={handleOpenAddModal}
                    className="w-full sm:w-auto px-5 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition shadow"
                >
                    + Ajouter un Article
                </button>
            </div>
            
            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Numéro de fiche</th>
                            <th scope="col" className="px-6 py-3">Désignation</th>
                            <th scope="col" className="px-6 py-3">Catégorie</th>
                            <th scope="col" className="px-6 py-3">Stock Restant</th>
                            <th scope="col" className="px-6 py-3">Emplacement</th>
                            <th scope="col" className="px-6 py-3">État</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMaterials.map(material => {
                             const isLowStock = material.quantity <= material.alertThreshold;
                             return (
                                <tr key={material.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4">{material.num_fiche}</td>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{material.name}</th>
                                    <td className="px-6 py-4">{getCategoryNameById(material.categoryId)}</td>
                                    <td className={`px-6 py-4 font-bold ${isLowStock ? 'text-danger' : 'text-gray-900 dark:text-white'}`}>
                                        {material.quantity} {material.unit}
                                        {isLowStock && <span className="ml-2 text-xs font-semibold text-yellow-500">(Seuil atteint)</span>}
                                    </td>
                                    <td className="px-6 py-4">{material.location}</td>
                                    <td className="px-6 py-4">{material.etat}</td>
                                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                        <button onClick={() => handleOpenStockModal(material)} className="font-medium text-green-600 dark:text-green-500 hover:underline">Stock</button>
                                        <button onClick={() => handleEdit(material)} className="font-medium text-primary-600 dark:text-primary-500 hover:underline">Modifier</button>
                                        <button onClick={() => handleDeleteClick(material)} className="font-medium text-danger hover:underline">Supprimer</button>
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

            <Modal isOpen={isDeleteModalOpen} onClose={cancelDelete} title="Confirmer la suppression">
                <div className="space-y-6">
                    <p className="text-gray-600 dark:text-gray-400">
                        Êtes-vous sûr de vouloir supprimer définitivement l'article <span className="font-semibold text-gray-800 dark:text-gray-200">{materialToDelete?.name}</span> ? Cette action est irréversible.
                    </p>
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={cancelDelete}
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

export default Inventory;