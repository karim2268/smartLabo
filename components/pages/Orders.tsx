import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Order, OrderStatus } from '../../types';
import Modal from '../ui/Modal';
import OrderForm from '../features/OrderForm';

const Orders: React.FC = () => {
    const { state, dispatch } = useData();
    
    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
    
    const handleOpenAddModal = () => {
        setSelectedOrder(null);
        setFormModalOpen(true);
    };
    
    const handleOpenEditModal = (order: Order) => {
        setSelectedOrder(order);
        setFormModalOpen(true);
    };

    const handleCloseFormModal = () => {
        setFormModalOpen(false);
        setSelectedOrder(null);
    };

    const handleOpenDeleteModal = (order: Order) => {
        setOrderToDelete(order);
        setDeleteModalOpen(true);
    };
    
    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
        setOrderToDelete(null);
    };
    
    const confirmDelete = () => {
        if (orderToDelete) {
            dispatch({ type: 'DELETE_ORDER', payload: orderToDelete.id });
            handleCloseDeleteModal();
        }
    };

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.RECU:
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case OrderStatus.COMMANDE:
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case OrderStatus.EN_ATTENTE:
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case OrderStatus.ANNULE:
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Gestion des Commandes</h2>
                <button
                    onClick={handleOpenAddModal}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition shadow-md"
                >
                    + Nouvelle Commande
                </button>
            </div>

            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">ID Commande</th>
                            <th scope="col" className="px-6 py-3">Fournisseur</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Statut</th>
                            <th scope="col" className="px-6 py-3">Articles</th>
                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.orders.map(order => (
                            <tr key={order.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{order.id.substring(0,8)}...</td>
                                <td className="px-6 py-4">{order.supplier}</td>
                                <td className="px-6 py-4">{new Date(order.orderDate).toLocaleDateString('fr-FR')}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{order.items.map(i => `${i.materialName} (x${i.quantity})`).join(', ')}</td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button onClick={() => handleOpenEditModal(order)} className="font-medium text-primary-600 dark:text-primary-500 hover:underline">
                                        Modifier
                                    </button>
                                    <button onClick={() => handleOpenDeleteModal(order)} className="font-medium text-danger hover:underline">
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {state.orders.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        Aucune commande à afficher.
                    </div>
                )}
            </div>
            
            <Modal isOpen={isFormModalOpen} onClose={handleCloseFormModal} title={selectedOrder ? 'Modifier la Commande' : 'Nouvelle Commande'}>
                <OrderForm order={selectedOrder} onDone={handleCloseFormModal} />
            </Modal>

            <Modal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal} title="Confirmer la suppression">
                 <div className="space-y-6">
                    <p className="text-gray-600 dark:text-gray-400">
                        Êtes-vous sûr de vouloir supprimer la commande <span className="font-semibold text-gray-800 dark:text-gray-200">{orderToDelete?.id}</span> ? Cette action est irréversible.
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

export default Orders;