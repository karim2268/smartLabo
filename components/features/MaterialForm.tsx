import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { Material, Unit } from '../../types';
import { UNITS } from '../../constants';

interface MaterialFormProps {
    material: Material | null;
    onDone: () => void;
}

const MaterialForm: React.FC<MaterialFormProps> = ({ material, onDone }) => {
    const { state, dispatch } = useData();

    const getInitialFormData = () => ({
        num_fiche: '',
        name: '',
        description: '',
        brand: '',
        categoryId: state.categories[0]?.id || '',
        quantity: 0,
        etat: 'Bon' as const,
        observation: '',
        alertThreshold: 5,
        unit: Unit.UNITE,
        location: '',
    });

    const [formData, setFormData] = useState(getInitialFormData());

    useEffect(() => {
        if (material) {
            // map existing material to form data shape
            const { date_saisie, date_modification, ...rest } = material;
            setFormData(rest);
        } else {
            setFormData(getInitialFormData());
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [material, state.categories]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'quantity' || name === 'alertThreshold' ? Number(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (material) {
            dispatch({ type: 'UPDATE_MATERIAL', payload: { ...formData, id: material.id, date_saisie: material.date_saisie, date_modification: new Date().toISOString() } });
        } else {
            const newMaterial: Omit<Material, 'id' | 'date_saisie' | 'date_modification'> = { ...formData };
            dispatch({ 
                type: 'ADD_MATERIAL', 
                payload: {
                    ...newMaterial,
                    id: `mat-${Date.now()}`,
                    date_saisie: new Date().toISOString(),
                    date_modification: new Date().toISOString(),
                } 
            });
        }
        onDone();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Désignation</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Numéro de fiche</label>
                    <input type="text" name="num_fiche" value={formData.num_fiche} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" />
                </div>
            </div>
            <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                 <textarea name="description" value={formData.description} onChange={handleChange} rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Catégorie</label>
                    <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600">
                        {state.categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Marque / Modèle</label>
                    <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantité</label>
                    <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" min="0" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Unité</label>
                     <select name="unit" value={formData.unit} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600">
                        {UNITS.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                     </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Seuil d'Alerte</label>
                    <input type="number" name="alertThreshold" value={formData.alertThreshold} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" min="0" />
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">État</label>
                     <select name="etat" value={formData.etat} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600">
                        <option value="Neuf">Neuf</option>
                        <option value="Bon">Bon</option>
                        <option value="À réparer">À réparer</option>
                        <option value="Hors service">Hors service</option>
                     </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Emplacement</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" placeholder="Ex: Armoire A, Étagère B2..." />
                </div>
            </div>
            <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Observation</label>
                 <textarea name="observation" value={formData.observation} onChange={handleChange} rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"></textarea>
            </div>
            <div className="pt-4 flex justify-end space-x-2">
                <button type="button" onClick={onDone} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">{material ? 'Mettre à jour' : 'Ajouter'}</button>
            </div>
        </form>
    );
};

export default MaterialForm;
