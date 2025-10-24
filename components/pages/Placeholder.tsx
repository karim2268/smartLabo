import React from 'react';
import { ICONS } from '../../constants';

interface PlaceholderProps {
    title: string;
}

const Placeholder: React.FC<PlaceholderProps> = ({ title }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="p-4 bg-primary-100 dark:bg-primary-900/50 rounded-full mb-6">
                <svg className="w-16 h-16 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{title}</h2>
            <p className="text-lg text-gray-500 dark:text-gray-400">Cette fonctionnalité est en cours de développement.</p>
            <p className="mt-4 text-gray-500 dark:text-gray-400">Revenez bientôt pour découvrir les nouveautés !</p>
        </div>
    );
};

export default Placeholder;
