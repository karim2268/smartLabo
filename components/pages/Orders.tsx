
import React from 'react';
import { useData } from '../../contexts/DataContext';
import { OrderStatus } from '../../types';

const Orders: React.FC = () => {
    const { state } = useData();

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
                    // onClick={() => {}} // TODO: Implement add order modal
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition shadow-md cursor-not-allowed opacity-50"
                    disabled
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
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.orders.map(order => (
                            <tr key={order.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{order.id}</td>
                                <td className="px-6 py-4">{order.supplier}</td>
                                <td className="px-6 py-4">{new Date(order.orderDate).toLocaleDateString('fr-FR')}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{order.items.map(i => `${i.materialName} (x${i.quantity})`).join(', ')}</td>
                                <td className="px-6 py-4">
                                    <button className="font-medium text-primary-600 dark:text-primary-500 hover:underline cursor-not-allowed opacity-50" disabled>
                                        Détails
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
             <div className="text-center p-4 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 rounded-lg">
                La gestion complète des commandes est en cours de développement.
            </div>
        </div>
    );
};

export default Orders;
