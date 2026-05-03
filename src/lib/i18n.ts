import { de as deLocale, enUS } from 'date-fns/locale';
import type { Locale } from 'date-fns';

export type Lang = 'de' | 'en';

export interface T {
  overview: string;
  timeline: string;
  navigation: string;
  collapse: string;
  darkMode: string;
  lightMode: string;
  overviewDesc: string;
  timelineDesc: string;
  sectionSearch: string;
  sectionStats: string;
  sectionDocs: string;
  gridView: string;
  listView: string;
  noDocsTitle: string;
  noDocsHint: string;
  searchPlaceholder: string;
  resetFilters: string;
  statDocs: string;
  statFiltered: string;
  statTags: string;
  statVisible: string;
  statOfTotal: (n: number) => string;
  download: string;
  close: string;
  noPreview: string;
  timelineEmpty: string;
  showMoreTags: (n: number) => string;
  showLessTags: string;
  colDocument: string;
  colDate: string;
  colTags: string;
  donate: string;
  logout: string;
  switchLangLabel: string;
  settings: string;
  settingsServer: string;
  settingsPaperlessUrl: string;
  settingsConnection: string;
  settingsTest: string;
  settingsConnected: string;
  settingsDisconnected: string;
  settingsNotConfigured: string;
  settingsInterface: string;
  settingsLanguage: string;
  settingsTheme: string;
  settingsAbout: string;
  settingsVersion: string;
  settingsGitHub: string;
  renameDoc: string;
  dateFormat: string;
  dateLocale: Locale;
}

export const translations: Record<Lang, T> = {
  de: {
    overview: 'Übersicht',
    timeline: 'Zeitstrahl',
    navigation: 'Navigation',
    collapse: 'Einklappen',
    darkMode: 'Dunkelmodus',
    lightMode: 'Hellmodus',
    overviewDesc: 'Alle Dokumente auf einen Blick — suchen, filtern und verwalten.',
    timelineDesc: 'Chronologische Ansicht deiner Dokumente nach Monat geordnet.',
    sectionSearch: 'Suche & Filter',
    sectionStats: 'Kennzahlen',
    sectionDocs: 'Dokumente',
    gridView: 'Rasteransicht',
    listView: 'Listenansicht',
    noDocsTitle: 'Keine Dokumente gefunden',
    noDocsHint: 'Probiere einen anderen Suchbegriff oder setze die Filter zurück.',
    searchPlaceholder: 'Dokumente durchsuchen…',
    resetFilters: 'Zurücksetzen',
    statDocs: 'Dokumente',
    statFiltered: 'Gefiltert',
    statTags: 'Tags',
    statVisible: 'sichtbar',
    statOfTotal: (n) => `von ${n} gesamt`,
    download: 'Herunterladen',
    close: 'Schließen',
    noPreview: 'Keine Vorschau verfügbar',
    timelineEmpty: 'Keine Dokumente für die gewählten Filter.',
    showMoreTags: (n) => `+ ${n} weitere`,
    showLessTags: 'Weniger',
    colDocument: 'Dokument',
    colDate: 'Datum',
    colTags: 'Tags',
    donate: 'Spenden',
    logout: 'Abmelden',
    switchLangLabel: 'English',
    settings: 'Einstellungen',
    settingsServer: 'Server',
    settingsPaperlessUrl: 'Paperless URL',
    settingsConnection: 'Verbindung',
    settingsTest: 'Testen',
    settingsConnected: 'Verbunden',
    settingsDisconnected: 'Keine Verbindung',
    settingsNotConfigured: 'Nicht konfiguriert',
    settingsInterface: 'Darstellung',
    settingsLanguage: 'Sprache',
    settingsTheme: 'Erscheinungsbild',
    settingsAbout: 'Über paperless-ui',
    settingsVersion: 'Version',
    settingsGitHub: 'Quellcode auf GitHub',
    renameDoc: 'Umbenennen',
    dateFormat: 'dd. MMM yyyy',
    dateLocale: deLocale,
  },
  en: {
    overview: 'Overview',
    timeline: 'Timeline',
    navigation: 'Navigation',
    collapse: 'Collapse',
    darkMode: 'Dark mode',
    lightMode: 'Light mode',
    overviewDesc: 'All documents at a glance — search, filter and manage.',
    timelineDesc: 'Chronological view of your documents sorted by month.',
    sectionSearch: 'Search & Filter',
    sectionStats: 'Statistics',
    sectionDocs: 'Documents',
    gridView: 'Grid view',
    listView: 'List view',
    noDocsTitle: 'No documents found',
    noDocsHint: 'Try a different search term or reset the filters.',
    searchPlaceholder: 'Search documents…',
    resetFilters: 'Reset',
    statDocs: 'Documents',
    statFiltered: 'Filtered',
    statTags: 'Tags',
    statVisible: 'visible',
    statOfTotal: (n) => `of ${n} total`,
    download: 'Download',
    close: 'Close',
    noPreview: 'No preview available',
    timelineEmpty: 'No documents for the selected filters.',
    showMoreTags: (n) => `+ ${n} more`,
    showLessTags: 'Less',
    colDocument: 'Document',
    colDate: 'Date',
    colTags: 'Tags',
    donate: 'Donate',
    logout: 'Logout',
    switchLangLabel: 'German',
    settings: 'Settings',
    settingsServer: 'Server',
    settingsPaperlessUrl: 'Paperless URL',
    settingsConnection: 'Connection',
    settingsTest: 'Test',
    settingsConnected: 'Connected',
    settingsDisconnected: 'Not connected',
    settingsNotConfigured: 'Not configured',
    settingsInterface: 'Appearance',
    settingsLanguage: 'Language',
    settingsTheme: 'Theme',
    settingsAbout: 'About paperless-ui',
    settingsVersion: 'Version',
    settingsGitHub: 'Source code on GitHub',
    renameDoc: 'Rename',
    dateFormat: 'MMM dd, yyyy',
    dateLocale: enUS,
  },
};
