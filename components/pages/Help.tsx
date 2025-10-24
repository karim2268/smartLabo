import React, { useState } from 'react';

interface FAQItemProps {
    question: string;
    children: React.ReactNode;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-200 dark:border-gray-700 py-4">
            <button
                className="w-full flex justify-between items-center text-left text-lg font-medium text-gray-800 dark:text-gray-200"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{question}</span>
                <svg
                    className={`w-5 h-5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
            {isOpen && (
                <div className="mt-4 text-gray-600 dark:text-gray-400 space-y-2">
                    {children}
                </div>
            )}
        </div>
    );
};


const Help: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                 <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-400">Centre d'Aide</h1>
                 <p className="mt-2 text-xl text-gray-600 dark:text-gray-300">Besoin d'aide ? Trouvez les réponses à vos questions ici.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8">
                 <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Foire Aux Questions (FAQ)</h2>
                 
                 <FAQItem question="Comment ajouter un nouvel article à l'inventaire ?">
                     <p>1. Allez dans la section <strong>"Stock"</strong> depuis le menu latéral.</p>
                     <p>2. Cliquez sur le bouton <strong>"+ Ajouter un Article"</strong> en haut de la page.</p>
                     <p>3. Remplissez les informations demandées dans le formulaire (désignation, catégorie, quantité, etc.).</p>
                     <p>4. Cliquez sur <strong>"Ajouter"</strong> pour sauvegarder le nouvel article.</p>
                 </FAQItem>
                 
                 <FAQItem question="Comment enregistrer une entrée ou une sortie de stock ?">
                     <p>1. Dans la page <strong>"Stock"</strong>, trouvez l'article que vous souhaitez modifier.</p>
                     <p>2. Dans la colonne "Actions", cliquez sur le bouton vert <strong>"Stock"</strong>.</p>
                     <p>3. Dans la fenêtre qui s'ouvre, choisissez le type de mouvement ("Entrée" ou "Sortie"), la quantité et ajoutez une note si nécessaire.</p>
                     <p>4. Cliquez sur <strong>"Valider"</strong>. Le stock sera mis à jour automatiquement et le mouvement sera enregistré dans le journal.</p>
                 </FAQItem>
                 
                 <FAQItem question="Comment générer un inventaire en PDF ?">
                     <p>Il y a deux façons simples :</p>
                     <p>- Depuis n'importe quelle page, cliquez sur le bouton <strong>"Imprimer Inventaire"</strong> dans l'en-tête en haut de l'écran.</p>
                     <p>- Allez dans <strong>"Administration"</strong> &gt; <strong>"Rapports"</strong> et cliquez sur le bouton "Générer PDF" dans la carte "Inventaire Complet".</p>
                 </FAQItem>
                 
                 <FAQItem question="Comment changer le thème de l'application (clair/sombre) ?">
                     <p>Cliquez sur l'icône de lune ou de soleil située dans l'en-tête en haut à droite de l'écran pour basculer instantanément entre le thème clair et le thème sombre.</p>
                 </FAQItem>
                 
                 <FAQItem question="Où puis-je modifier les informations de l'établissement ?">
                     <p>Allez dans la section <strong>"Gestion du personnel"</strong>, puis cliquez sur le bouton <strong>"Configuration de l'établissement"</strong>. Vous pourrez y modifier le nom du lycée et la direction régionale, informations qui apparaîtront sur les rapports PDF.</p>
                 </FAQItem>
            </div>
        </div>
    );
};

export default Help;
