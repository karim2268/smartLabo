
import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { Material, Category, Unit } from '../../types';
import { CATEGORIES, UNITS } from '../../constants';

interface MaterialFormProps {
    material: Material | null;
    onDone: () => void;
}

const MaterialForm: React.FC<MaterialFormProps> = ({ material, onDone }) => {
    const { dispatch } = useData();
    const [formData, setFormData] = useState<Omit<Material, 'id' | 'createdAt'>>({
        code: '',
        name: '',
        category: Category.AUTRE,
        description: '',
        quantity: 0,
        alertThreshold: 5,
        unit: Unit.UNITE,
        brand: '',
        model: '',
        location: '',
    });

    useEffect(() => {
        if (material) {
            setFormData(material);
        }
    }, [material]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'quantity' || name === 'alertThreshold' ? Number(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (material) {
            dispatch({ type: 'UPDATE_MATERIAL', payload: { ...formData, id: material.id, createdAt: material.createdAt } });
        } else {
            const newMaterial: Material = {
                ...formData,
                id: `mat-${Date.now()}`,
                createdAt: new Date().toISOString(),
            };
            dispatch({ type: 'ADD_MATERIAL', payload: newMaterial });
        }
        onDone();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nom de l'article</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Code</label>
                    <input type="text" name="code" value={formData.code} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Catégorie</label>
                <select name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600">
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
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
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Emplacement</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" />
            </div>
            <div className="pt-4 flex justify-end space-x-2">
                <button type="button" onClick={onDone} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">{material ? 'Mettre à jour' : 'Ajouter'}</button>
            </div>
        </form>
    );
};

export default MaterialForm;
