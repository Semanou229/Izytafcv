// Fichier : EmailCollectionModal.tsx
import React, { useState } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void; // Appelée après l'envoi, pour lancer le téléchargement
}

// 🛑 REMPLACER PAR VOTRE LIEN FORMSPREE 🛑
const FORMSPREE_URL = "VOTRE_URL_FORMSPREE_ICI"; 

const EmailCollectionModal: React.FC<ModalProps> = ({ isOpen, onClose, onSuccess }) => {
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
        formData.append('Nom', name);
        formData.append('Email', email);
        formData.append('Téléphone', phone); 

        try {
            const response = await fetch(FORMSPREE_URL, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                },
            });

            // En cas de succès ou d'échec de Formspree (pour ne pas bloquer l'utilisateur)
            if (response.ok || response.status === 422) { 
                onClose();
                onSuccess(); // Déclenche le téléchargement
            } else {
                console.error("Erreur Formspree. Téléchargement forcé.");
                onClose();
                onSuccess(); 
            }
        } catch (error) {
            console.error("Erreur réseau. Téléchargement forcé.", error);
            onClose();
            onSuccess(); 
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-[9999] flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-11/12 max-w-lg">
                <h2 className="text-xl font-bold text-slate-700 mb-3">Téléchargez votre CV Gratuitement !</h2>
                <p className="text-sm text-slate-500 mb-5">
                    Pour finaliser le téléchargement, veuillez renseigner vos coordonnées.
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
