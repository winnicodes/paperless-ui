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
    dateFormat: 'MMM dd, yyyy',
    dateLocale: enUS,
  },
};
