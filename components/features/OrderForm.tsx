import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { Order, OrderItem, OrderStatus, Material, MovementType } from '../../types';
import FormField from '../ui/FormField';
import FormActions from '../ui/FormActions';

interface OrderFormProps {
    order: Order | null;
    onDone: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ order, onDone }) => {
    const { state, dispatch } = useData();

    // Form State
    const [supplier, setSupplier] = useState('');
    const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
    const [status, setStatus] = useState<OrderStatus>(OrderStatus.EN_ATTENTE);
    const [items, setItems] = useState<OrderItem[]>([]);
    
    // State for adding a new item
    const [selectedMaterialId, setSelectedMaterialId] = useState('');
    const [quantityToAdd, setQuantityToAdd] = useState(1);
    const [materialSearchTerm, setMaterialSearchTerm] = useState('');

    useEffect(() => {
        if (order) {
            setSupplier(order.supplier);
            setOrderDate(new Date(order.orderDate).toISOString().split('T')[0]);
            setStatus(order.status);
            setItems(order.items);
        } else {
            // Reset for new order
            setSupplier('');
            setOrderDate(new Date().toISOString().split('T')[0]);
            setStatus(OrderStatus.EN_ATTENTE);
            setItems([]);
        }
    }, [order]);

    const materialSearchResults = useMemo(() => {
        const selected = state.materials.find(m => m.id === selectedMaterialId);
        if (!materialSearchTerm || (selected && selected.name === materialSearchTerm)) {
            return [];
        }
        return state.materials.filter(m =>
            m.name.toLowerCase().includes(materialSearchTerm.toLowerCase())
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

    const handleAddItem = () => {
        if (!selectedMaterialId || quantityToAdd <= 0) {
            alert("Veuillez sélectionner un article et une quantité valide.");
            return;
        }
        const material = state.materials.find(m => m.id === selectedMaterialId);
        if (!material) return;
        
        const existingItemIndex = items.findIndex(item => item.materialId === selectedMaterialId);
        if (existingItemIndex > -1) {
            const newItems = [...items];
            newItems[existingItemIndex].quantity += quantityToAdd;
            setItems(newItems);
        } else {
            setItems([...items, { materialId: selectedMaterialId, materialName: material.name, quantity: quantityToAdd }]);
        }
        
        setSelectedMaterialId('');
        setMaterialSearchTerm('');
        setQuantityToAdd(1);
    };
    
    const handleRemoveItem = (materialId: string) => {
        setItems(items.filter(item => item.materialId !== materialId));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!supplier || items.length === 0) {
            alert("Veuillez renseigner le fournisseur et ajouter au moins un article.");
            return;
        }

        // --- Stock update logic ---
        // If status is changing to "Reçu" and it wasn't "Reçu" before
        if (status === OrderStatus.RECU && order?.status !== OrderStatus.RECU) {
             items.forEach(item => {
                const materialToUpdate = state.materials.find(m => m.id === item.materialId);
                if (materialToUpdate) {
                    // 1. Update material stock
                    const newQuantity = materialToUpdate.quantity + item.quantity;
                    dispatch({
                        type: 'UPDATE_MATERIAL',
                        payload: { ...materialToUpdate, quantity: newQuantity, date_modification: new Date().toISOString() }
                    });
                    
                    // 2. Add movement log
                    dispatch({
                        type: 'ADD_MOVEMENT',
                        payload: {
                            id: `mov-${Date.now()}-${item.materialId}`,
                            materialId: item.materialId,
                            materialName: item.materialName,
                            type: MovementType.ENTREE,
                            quantity: item.quantity,
                            date: new Date().toISOString(),
                            notes: `Réception commande ${order ? order.id.substring(0,8) : 'nouvelle'}`,
                        }
                    });
                }
             });
        }
        
        if (order) {
            // Update existing order
            dispatch({
                type: 'UPDATE_ORDER',
                payload: { id: order.id, supplier, orderDate, status, items }
            });
        } else {
            // Add new order
            const newOrder: Order = {
                id: `ord-${Date.now()}`,
                supplier,
                orderDate,
                status,
                items,
            };
            dispatch({ type: 'ADD_ORDER', payload: newOrder });
        }
        
        onDone();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Fournisseur" htmlFor="supplier">
                    <input type="text" id="supplier" value={supplier} onChange={e => setSupplier(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600" required />
                </FormField>
                <FormField label="Date de Commande" htmlFor="orderDate">
                    <input type="date" id="orderDate" value={orderDate} onChange={e => setOrderDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600" required />
                </FormField>
            </div>
            {order && (
                <FormField label="Statut de la Commande" htmlFor="status">
                    <select id="status" value={status} onChange={e => setStatus(e.target.value as OrderStatus)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600">
                        {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </FormField>
            )}

            <div className="border-t dark:border-gray-700 pt-4">
                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Ajouter des articles</h4>
                <div className="flex items-end gap-2 p-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                     <div className="flex-grow relative">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Article</label>
                        <input
                            type="text"
                            value={materialSearchTerm}
                            onChange={handleMaterialSearchChange}
                            placeholder="Rechercher un article..."
                            autoComplete="off"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600"
                        />
                        {materialSearchResults.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                {materialSearchResults.map(mat => (
                                    <div key={mat.id} onClick={() => handleMaterialSelect(mat)} className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                                        {mat.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                     <div className="w-24">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantité</label>
                        <input type="number" value={quantityToAdd} onChange={e => setQuantityToAdd(Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600" min="1" />
                     </div>
                     <button type="button" onClick={handleAddItem} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 self-end transition" disabled={!selectedMaterialId}>
                        Ajouter
                    </button>
                </div>
            </div>

            {items.length > 0 && (
                <div className="border rounded-lg p-3 dark:border-gray-600 space-y-2 max-h-48 overflow-y-auto">
                    <h5 className="font-semibold text-gray-800 dark:text-gray-200">Articles commandés :</h5>
                    {items.map(item => (
                        <div key={item.materialId} className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-2 rounded">
                            <span className="text-sm">{item.materialName} - Quantité: {item.quantity}</span>
                            <button type="button" onClick={() => handleRemoveItem(item.materialId)} className="text-red-500 hover:text-red-700 text-sm font-semibold">Retirer</button>
                        </div>
                    ))}
                </div>
            )}
            
            <FormActions onCancel={onDone} submitLabel={order ? 'Mettre à jour' : 'Créer la commande'} />
        </form>
    );
};

export default OrderForm;