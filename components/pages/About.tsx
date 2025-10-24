import React from 'react';

const FeatureCard: React.FC<{ title: string, description: string, icon: React.ReactElement }> = ({ title, description, icon }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-200">
        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mb-4">
            {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
);


const About: React.FC = () => {
    const ICONS = {
        inventory: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>,
        alert: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
        pdf: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>,
        intuitive: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 max-w-4xl mx-auto">
            <div className="text-center">
                 <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-400">SmartLabo</h1>
                 
                 <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Copyright Abdelkrim Salem</p>
                 <p className="text-sm text-gray-500 dark:text-gray-400">Lycée Ibn-Khaldoun Oudref</p>
                 <p className="mt-2 text-xl text-gray-600 dark:text-gray-300">La solution intelligente pour la gestion des laboratoires de sciences au lycée.</p>
            </div>

            <div className="mt-10">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 text-center">Notre Mission</h2>
                <p className="text-lg text-gray-700 dark:text-gray-400 leading-relaxed text-center max-w-3xl mx-auto">
                    L'objectif principal de SmartLabo est de fournir une application intuitive et puissante pour simplifier et moderniser la gestion des stocks de matériels et de produits dans les laboratoires de sciences physiques, chimiques et SVT des lycées en Tunisie. Nous visons à optimiser le travail des laborantins et à faciliter la préparation des cours pour les enseignants.
                </p>
            </div>

            <div className="mt-12">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 text-center">Fonctionnalités Clés</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FeatureCard 
                        title="Gestion des Stocks Simplifiée" 
                        description="Enregistrez, suivez et mettez à jour les quantités de votre matériel en temps réel avec une interface claire et simple." 
                        icon={ICONS.inventory}
                    />
                     <FeatureCard 
                        title="Alertes de Stock Faible" 
                        description="Définissez des seuils d'alerte personnalisés et recevez des notifications pour ne jamais être à court de matériel essentiel." 
                        icon={ICONS.alert}
                    />
                     <FeatureCard 
                        title="Rapports et Inventaires" 
                        description="Générez des inventaires complets au format PDF et exportez vos données en Excel en un seul clic pour une traçabilité parfaite." 
                        icon={ICONS.pdf}
                    />
                     <FeatureCard 
                        title="Interface Intuitive" 
                        description="Conçue spécifiquement pour les laborantins et les enseignants, l'application est facile à prendre en main et à utiliser au quotidien." 
                        icon={ICONS.intuitive}
                    />
                </div>
            </div>
        </div>
    );
};

export default About;