import React, { useMemo, useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Movement, MovementType } from '../../types';

const MovementLog: React.FC = () => {
    const { state } = useData();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredMovements = useMemo(() => {
        return state.movements.filter(mov => 
            mov.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mov.notes.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [state.movements, searchTerm]);

    return (
         <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <input
                    type="text"
                    placeholder="Rechercher par nom d'article ou note..."
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Article</th>
                            <th scope="col" className="px-6 py-3">Type</th>
                            <th scope="col" className="px-6 py-3">Quantité</th>
                            <th scope="col" className="px-6 py-3">Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMovements.map((mov: Movement) => (
                            <tr key={mov.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4">{new Date(mov.date).toLocaleString('fr-FR')}</td>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{mov.materialName}</th>
                                <td className="px-6 py-4">
                                     <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        mov.type === MovementType.ENTREE ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                                        mov.type === MovementType.SORTIE ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                    }`}>
                                        {mov.type}
                                    </span>
                                </td>
                                <td className={`px-6 py-4 font-bold ${mov.type === MovementType.ENTREE ? 'text-success' : 'text-danger'}`}>
                                    {mov.type === MovementType.ENTREE ? '+' : '-'}{mov.quantity}
                                </td>
                                <td className="px-6 py-4">{mov.notes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredMovements.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        Aucun mouvement trouvé.
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovementLog;
