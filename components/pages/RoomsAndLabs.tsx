import React from 'react';
import { useData } from '../../contexts/DataContext';

const InfoList: React.FC<{title: string, items: {id: string; name: string}[]}> = ({title, items}) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{title}</h3>
        <ul className="space-y-2">
            {items.map(item => (
                <li key={item.id} className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300">
                    {item.name}
                </li>
            ))}
             {items.length === 0 && <p className="text-gray-500 dark:text-gray-400">Aucun élément à afficher.</p>}
        </ul>
    </div>
)

const RoomsAndLabs: React.FC = () => {
    const { state } = useData();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InfoList title="Salles" items={state.rooms} />
            <InfoList title="Laboratoires" items={state.labs} />
        </div>
    );
};

export default RoomsAndLabs;
