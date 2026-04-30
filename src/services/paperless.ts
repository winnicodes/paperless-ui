import axios from 'axios';

export interface Document {
  id: number;
  title: string;
  content: string;
  created: string;
  modified: string;
  added: string;
  tags: number[];
  correspondent: number | null;
  document_type: number | null;
  storage_path: number | null;
  thumbnail_url?: string;
  download_url?: string;
}

export interface Tag {
  id: number;
  name: string;
  color: string;
  is_inbox_tag: boolean;
  document_count: number;
}

export interface Correspondent {
  id: number;
  name: string;
  document_count: number;
}

export interface DocumentType {
  id: number;
  name: string;
}

const MOCK_TAGS = [
  { id: 1, name: "Finanzen", color: "#eab308", document_count: 5 },
  { id: 2, name: "Wichtig", color: "#ef4444", document_count: 3 },
  { id: 3, name: "Auto", color: "#3b82f6", document_count: 2 },
  { id: 4, name: "Privat", color: "#10b981", document_count: 4 },
];

const MOCK_DOCS = [
  {
    id: 1,
    title: "Telekom Rechnung März 2024",
    content: "Rechnungsbetrag: 45,90€",
    created: "2024-03-15T10:00:00Z",
    added: "2024-03-15T10:00:00Z",
    modified: "2024-03-15T10:00:00Z",
    tags: [1, 2],
    correspondent: 1,
    document_type: 1,
    storage_path: null,
    thumbnail_url: "/test-pdfpdf.pdf"
  },
  {
    id: 2,
    title: "Mietvertrag Wohnung am Park",
    content: "Mietbeginn: 01.01.2024",
    created: "2023-12-10T14:30:00Z",
    added: "2023-12-10T14:30:00Z",
    modified: "2023-12-10T14:30:00Z",
    tags: [2, 4],
    correspondent: 2,
    document_type: 2,
    storage_path: null,
    thumbnail_url: "/test-pdfpdf.pdf"
  },
  {
    id: 3,
    title: "KFZ Versicherung 2024",
    content: "Versicherungsschein Nummer: 12345678",
    created: "2024-01-05T09:15:00Z",
    added: "2024-01-05T09:15:00Z",
    modified: "2024-01-05T09:15:00Z",
    tags: [3],
    correspondent: 3,
    document_type: 1,
    storage_path: null,
    thumbnail_url: "/test-pdfpdf.pdf"
  },
  {
    id: 4,
    title: "Gehaltsabrechnung Februar 2024",
    content: "Nettoverdienst: 2850,00€",
    created: "2024-02-28T16:00:00Z",
    added: "2024-02-28T16:00:00Z",
    modified: "2024-02-28T16:00:00Z",
    tags: [1, 4],
    correspondent: 4,
    document_type: 3,
    storage_path: null,
    thumbnail_url: "/test-pdfpdf.pdf"
  },
  {
    id: 5,
    title: "Amazon Bestellung - Gaming Maus",
    content: "Bestellbestätigung",
    created: "2024-04-12T11:20:00Z",
    added: "2024-04-12T11:20:00Z",
    modified: "2024-04-12T11:20:00Z",
    tags: [4],
    correspondent: 5,
    document_type: 1,
    storage_path: null,
    thumbnail_url: "/test-pdfpdf.pdf"
  }
];

// Paperless NGX legacy integer colour index → hex
const PAPERLESS_COLOUR_MAP: Record<number, string> = {
  1: "#a6cee3", 2: "#1f78b4", 3: "#b2df8a",  4: "#33a02c",
  5: "#fb9a99", 6: "#e31a1c", 7: "#fdbf6f",  8: "#ff7f00",
  9: "#cab2d6", 10: "#6a3d9a", 11: "#ffff99", 12: "#b15928",
};

function resolveColour(raw: unknown): string {
  if (typeof raw === 'number') return PAPERLESS_COLOUR_MAP[raw] ?? '#6b7280';
  if (typeof raw === 'string' && raw.startsWith('#')) return raw;
  return '#6b7280';
}

export const paperlessApi = {
  getDocuments: async (params: any = {}) => {
    try {
      const allDocs: any[] = [];
      let page = 1;
      while (true) {
        const res = await axios.get('/api/paperless/documents/', {
          params: { ...params, page, page_size: 100 },
        });
        allDocs.push(...res.data.results);
        if (!res.data.next) break;
        page++;
      }
      const results = allDocs.map((doc: any) => ({
        ...doc,
        thumbnail_url: `/api/paperless/documents/${doc.id}/thumb/`,
        download_url:  `/api/paperless/documents/${doc.id}/download/`,
      }));
      return { results, count: results.length };
    } catch (e) {
      console.warn("Using mock documents fallback");
      return { results: MOCK_DOCS, count: MOCK_DOCS.length };
    }
  },

  getTags: async () => {
    try {
      const allTags: any[] = [];
      let page = 1;
      while (true) {
        const res = await axios.get('/api/paperless/tags/', {
          params: { page, page_size: 100 },
        });
        console.log(`[tags] page ${page} raw response:`, res.data);
        allTags.push(...res.data.results);
        if (!res.data.next) break;
        page++;
      }
      console.log(`[tags] total fetched: ${allTags.length}`, allTags);
      if (allTags.length === 0) {
        console.warn('[tags] No tags returned from Paperless — using mock fallback. Create tags in your Paperless instance to see real data.');
        return { results: MOCK_TAGS, count: MOCK_TAGS.length };
      }
      const results = allTags.map((tag: any) => ({
        id:             tag.id,
        name:           tag.name,
        color:          resolveColour(tag.colour ?? tag.color),
        is_inbox_tag:   tag.is_inbox_tag,
        document_count: tag.document_count,
      }));
      return { results, count: results.length };
    } catch (e) {
      console.warn("Using mock tags fallback", e);
      return { results: MOCK_TAGS, count: MOCK_TAGS.length };
    }
  },
  
  getCorrespondents: async () => {
    const res = await axios.get('/api/paperless/correspondents/');
    return res.data;
  },
  
  getDocumentTypes: async () => {
    const res = await axios.get('/api/paperless/document_types/');
    return res.data;
  },
  
  uploadDocument: async (file: File) => {
    const formData = new FormData();
    formData.append('document', file);
    const res = await axios.post('/api/paperless/documents/post_document/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  }
};
