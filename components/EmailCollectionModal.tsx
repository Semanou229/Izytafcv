// Fichier : EmailCollectionModal.tsx
import React, { useState } from 'react';

// --- Interface des Props de la Modale ---
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void; // Appelée après l'envoi pour lancer le téléchargement
}

// 🛑 VOS VALEURS GOOGLE FORMS 🛑
const GOOGLE_FORM_URL = "https://docs.google.com/forms/u/0/d/e/1FAIpQLScpVccxTUD_8UKD2V2YImfo9Gpx2lWwng6We-596AyTEDzyqA/formResponse"; 

const FIELD_ENTRY_IDS = {
    NAME: "entry.446767201",    // ID pour le champ Nom
    EMAIL: "entry.314587565",   // ID pour le champ Email
    PHONE: "entry.2029197602",   // ID pour le champ Téléphone
};
// ------------------------------------

const EmailCollectionModal: React.FC<ModalProps> = ({ isOpen, onClose, onSuccess }) => {
    // --- États du formulaire ---
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) {
        return null; 
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        
        // 🛑 Utilisation des ENTRY IDs pour la soumission à Google Forms
        formData.append(FIELD_ENTRY_IDS.NAME, name);
        formData.append(FIELD_ENTRY_IDS.EMAIL, email);
        formData.append(FIELD_ENTRY_IDS.PHONE, phone); 
        // -----------------------------------------------------------------

        try {
            const response = await fetch(GOOGLE_FORM_URL, {
                method: 'POST',
                body: formData,
                mode: 'no-cors' // Essentiel pour éviter les erreurs CORS avec Google Forms
            });

            // En mode 'no-cors', nous ne pouvons pas vérifier le statut, mais la requête part.
            // On considère l'envoi comme réussi s'il n'y a pas d'erreur réseau.
            onClose();
            onSuccess(); // Déclenche le téléchargement du CV
            
        } catch (error) {
            console.error("Erreur réseau lors de la soumission à Google Forms. Téléchargement forcé.", error);
            // En cas d'erreur réseau (chute de connexion), on permet quand même le téléchargement
            onClose();
            onSuccess(); 
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Rendu du composant (avec Tailwind CSS pour le style) ---
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-[9999] flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-11/12 max-w-lg">
                <h2 className="text-xl font-bold text-slate-700 mb-3">Téléchargez votre CV Gratuitement !</h2>
                <p className="text-sm text-slate-500 mb-5">
                    Pour finaliser le téléchargement et vous tenir informé des mises à jour, veuillez renseigner vos coordonnées.
                </p>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="block text-sm font-medium text-slate-700">Nom Complet</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                            className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2" />
                    </div>

                    <div className="mb-3">
                        <label className="block text-sm font-medium text-slate-700">Adresse E-mail</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                            className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2" />
                    </div>

                    <div className="mb-5">
                        <label className="block text-sm font-medium text-slate-700">Numéro de Téléphone (Optionnel)</label>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                            className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2" />
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button type="button" onClick={onClose} 
                                className="px-4 py-2 text-slate-600 font-semibold rounded-md transition duration-150 border">
                            Annuler
                        </button>
                        <button type="submit" disabled={isSubmitting}
                                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition duration-150 disabled:bg-blue-400">
                            {isSubmitting ? 'Envoi...' : 'Télécharger le CV'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmailCollectionModal;
