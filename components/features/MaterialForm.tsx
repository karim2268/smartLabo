import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { Material, Unit } from '../../types';
import { UNITS } from '../../constants';
import FormField from '../ui/FormField';
import FormActions from '../ui/FormActions';

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
        etat: 'Bon' as Material['etat'],
        observation: '',
        alertThreshold: 5,
        unit: Unit.UNITE,
        location: '',
    });

    const [formData, setFormData] = useState(getInitialFormData());

    useEffect(() => {
        if (material) {
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
                <FormField label="Désignation" htmlFor="name">
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" required />
                </FormField>
                <FormField label="Numéro de fiche" htmlFor="num_fiche">
                    <input type="text" id="num_fiche" name="num_fiche" value={formData.num_fiche} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" />
                </FormField>
            </div>
            <FormField label="Description" htmlFor="description">
                 <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"></textarea>
            </FormField>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Catégorie" htmlFor="categoryId">
                    <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600">
                        {state.categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                </FormField>
                <FormField label="Marque / Modèle" htmlFor="brand">
                    <input id="brand" type="text" name="brand" value={formData.brand} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" />
                </FormField>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <FormField label="Quantité" htmlFor="quantity">
                    <input id="quantity" type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" min="0" />
                </FormField>
                 <FormField label="Unité" htmlFor="unit">
                     <select id="unit" name="unit" value={formData.unit} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600">
                        {UNITS.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                     </select>
                </FormField>
                <FormField label="Seuil d'Alerte" htmlFor="alertThreshold">
                    <input id="alertThreshold" type="number" name="alertThreshold" value={formData.alertThreshold} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" min="0" />
                </FormField>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField label="État" htmlFor="etat">
                     <select id="etat" name="etat" value={formData.etat} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600">
                        <option value="Neuf">Neuf</option>
                        <option value="Bon">Bon</option>
                        <option value="À réparer">À réparer</option>
                        <option value="Hors service">Hors service</option>
                     </select>
                </FormField>
                 <FormField label="Emplacement" htmlFor="location">
                    <input id="location" type="text" name="location" value={formData.location} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" placeholder="Ex: Armoire A, Étagère B2..." />
                </FormField>
            </div>
            <FormField label="Observation" htmlFor="observation">
                 <textarea id="observation" name="observation" value={formData.observation} onChange={handleChange} rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"></textarea>
            </FormField>
            
            <FormActions onCancel={onDone} submitLabel={material ? 'Mettre à jour' : 'Ajouter'} />
        </form>
    );
};

export default MaterialForm;
