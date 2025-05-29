import { LanguageStrings, Language } from '../types';

// English strings (default)
const en: LanguageStrings = {
  'app.title': 'GDPR Consent Management',
  'app.subtitle': 'Manage your privacy preferences',
  'form.name': 'Full Name',
  'form.email': 'Email Address',
  'form.name.placeholder': 'Enter your full name',
  'form.email.placeholder': 'Enter your email address',
  'consent.title': 'Privacy Preference Center',
  'consent.introduction': 'We use cookies and similar technologies to process your personal data, such as your IP address and browser information. This allows us to measure and improve the performance of our site.',
  'consent.privacyLink': 'Please select which cookies you want to allow. You can read more about our cookies in our Privacy Policy.',
  'consent.userInfo': 'Your Information',
  'consent.preferences': 'Consent Preferences',
  'button.acceptAll': 'Accept All',
  'button.rejectNonEssential': 'Reject Non-Essential',
  'button.savePreferences': 'Save Preferences',
  'button.updatePreferences': 'Update Preferences',
  'consent.success.title': 'Thank you!',
  'consent.success.message': 'Your consent preferences have been saved. You can update these preferences at any time.',
  'footer.copyright': 'All rights reserved.',
  'loading': 'Loading...',
  'error.retrieval': 'Failed to retrieve your preferences. Please try again.',
  'error.submission': 'Failed to save your preferences. Please try again.',
  'badge.required': 'Required',
  'retrieve.message': 'We found existing preferences for this email address.',
  'retrieve.action': 'Load Existing Preferences',
};

// French strings
const fr: LanguageStrings = {
  'app.title': 'Gestion du Consentement RGPD',
  'app.subtitle': 'Gérez vos préférences de confidentialité',
  'form.name': 'Nom complet',
  'form.email': 'Adresse e-mail',
  'form.name.placeholder': 'Entrez votre nom complet',
  'form.email.placeholder': 'Entrez votre adresse e-mail',
  'consent.title': 'Centre de Préférences de Confidentialité',
  'consent.introduction': 'Nous utilisons des cookies et des technologies similaires pour traiter vos données personnelles, telles que votre adresse IP et les informations de votre navigateur. Cela nous permet de mesurer et d\'améliorer les performances de notre site.',
  'consent.privacyLink': 'Veuillez sélectionner les cookies que vous souhaitez autoriser. Vous pouvez en savoir plus sur nos cookies dans notre Politique de Confidentialité.',
  'consent.userInfo': 'Vos Informations',
  'consent.preferences': 'Préférences de Consentement',
  'button.acceptAll': 'Tout Accepter',
  'button.rejectNonEssential': 'Rejeter Non-Essentiel',
  'button.savePreferences': 'Enregistrer les Préférences',
  'button.updatePreferences': 'Mettre à Jour les Préférences',
  'consent.success.title': 'Merci !',
  'consent.success.message': 'Vos préférences de consentement ont été enregistrées. Vous pouvez mettre à jour ces préférences à tout moment.',
  'footer.copyright': 'Tous droits réservés.',
  'loading': 'Chargement...',
  'error.retrieval': 'Échec de la récupération de vos préférences. Veuillez réessayer.',
  'error.submission': 'Échec de l\'enregistrement de vos préférences. Veuillez réessayer.',
  'badge.required': 'Obligatoire',
  'retrieve.message': 'Nous avons trouvé des préférences existantes pour cette adresse e-mail.',
  'retrieve.action': 'Charger les Préférences Existantes',
};

// German strings
const de: LanguageStrings = {
  'app.title': 'DSGVO-Einwilligungsverwaltung',
  'app.subtitle': 'Verwalten Sie Ihre Datenschutzeinstellungen',
  'form.name': 'Vollständiger Name',
  'form.email': 'E-Mail-Adresse',
  'form.name.placeholder': 'Geben Sie Ihren vollständigen Namen ein',
  'form.email.placeholder': 'Geben Sie Ihre E-Mail-Adresse ein',
  'consent.title': 'Datenschutzpräferenzzentrum',
  'consent.introduction': 'Wir verwenden Cookies und ähnliche Technologien, um Ihre personenbezogenen Daten zu verarbeiten, wie Ihre IP-Adresse und Browser-Informationen. Dies ermöglicht es uns, die Leistung unserer Website zu messen und zu verbessern.',
  'consent.privacyLink': 'Bitte wählen Sie aus, welche Cookies Sie zulassen möchten. Weitere Informationen zu unseren Cookies finden Sie in unserer Datenschutzrichtlinie.',
  'consent.userInfo': 'Ihre Informationen',
  'consent.preferences': 'Einwilligungspräferenzen',
  'button.acceptAll': 'Alle Akzeptieren',
  'button.rejectNonEssential': 'Nicht-Wesentliche Ablehnen',
  'button.savePreferences': 'Einstellungen Speichern',
  'button.updatePreferences': 'Einstellungen Aktualisieren',
  'consent.success.title': 'Vielen Dank!',
  'consent.success.message': 'Ihre Einwilligungspräferenzen wurden gespeichert. Sie können diese Einstellungen jederzeit aktualisieren.',
  'footer.copyright': 'Alle Rechte vorbehalten.',
  'loading': 'Wird geladen...',
  'error.retrieval': 'Fehler beim Abrufen Ihrer Einstellungen. Bitte versuchen Sie es erneut.',
  'error.submission': 'Fehler beim Speichern Ihrer Einstellungen. Bitte versuchen Sie es erneut.',
  'badge.required': 'Erforderlich',
  'retrieve.message': 'Wir haben bestehende Einstellungen für diese E-Mail-Adresse gefunden.',
  'retrieve.action': 'Bestehende Einstellungen Laden',
};

// Spanish strings
const es: LanguageStrings = {
  'app.title': 'Gestión de Consentimiento RGPD',
  'app.subtitle': 'Administre sus preferencias de privacidad',
  'form.name': 'Nombre completo',
  'form.email': 'Correo electrónico',
  'form.name.placeholder': 'Introduzca su nombre completo',
  'form.email.placeholder': 'Introduzca su correo electrónico',
  'consent.title': 'Centro de Preferencias de Privacidad',
  'consent.introduction': 'Utilizamos cookies y tecnologías similares para procesar sus datos personales, como su dirección IP e información del navegador. Esto nos permite medir y mejorar el rendimiento de nuestro sitio.',
  'consent.privacyLink': 'Por favor, seleccione qué cookies desea permitir. Puede leer más sobre nuestras cookies en nuestra Política de Privacidad.',
  'consent.userInfo': 'Su Información',
  'consent.preferences': 'Preferencias de Consentimiento',
  'button.acceptAll': 'Aceptar Todo',
  'button.rejectNonEssential': 'Rechazar No Esenciales',
  'button.savePreferences': 'Guardar Preferencias',
  'button.updatePreferences': 'Actualizar Preferencias',
  'consent.success.title': '¡Gracias!',
  'consent.success.message': 'Sus preferencias de consentimiento han sido guardadas. Puede actualizar estas preferencias en cualquier momento.',
  'footer.copyright': 'Todos los derechos reservados.',
  'loading': 'Cargando...',
  'error.retrieval': 'Error al recuperar sus preferencias. Por favor, inténtelo de nuevo.',
  'error.submission': 'Error al guardar sus preferencias. Por favor, inténtelo de nuevo.',
  'badge.required': 'Obligatorio',
  'retrieve.message': 'Hemos encontrado preferencias existentes para esta dirección de correo electrónico.',
  'retrieve.action': 'Cargar Preferencias Existentes',
};

// Languages dictionary
const languages: Record<Language, LanguageStrings> = {
  en,
  fr,
  de,
  es,
};

/**
 * Get a translated string by key
 */
export const getString = (key: string, language: Language = 'en'): string => {
  const strings = languages[language] || languages.en;
  return strings[key] || languages.en[key] || key;
};

/**
 * Get all available languages
 */
export const getAvailableLanguages = (): { code: Language; name: string }[] => [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'es', name: 'Español' },
];