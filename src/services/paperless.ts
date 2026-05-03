import axios from 'axios';

const TOKEN_KEY = 'paperless_token';

// Attach stored token to every outgoing request
axios.interceptors.request.use(config => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers['x-auth-token'] = token;
  return config;
});

export const auth = {
  login: async (username: string, password: string): Promise<string> => {
    const res = await axios.post('/api/auth/login', { username, password });
    localStorage.setItem(TOKEN_KEY, res.data.token);
    return res.data.token;
  },
  logout: () => localStorage.removeItem(TOKEN_KEY),
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
};

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

export interface DocumentsParams {
  page?: number;
  page_size?: number;
  search?: string;
  tags__id__in?: string;
}

export const paperlessApi = {
  getDocuments: async (params: DocumentsParams = {}) => {
    const res = await axios.get('/api/paperless/documents/', {
      params: { page_size: 10, page: 1, ...params },
    });
    const results = res.data.results.map((doc: any) => ({
      ...doc,
      thumbnail_url: `/api/paperless/documents/${doc.id}/thumb/`,
      download_url:  `/api/paperless/documents/${doc.id}/download/`,
    }));
    return { results, count: res.data.count as number, hasMore: !!res.data.next };
  },

  getTags: async () => {
    const allTags: any[] = [];
    let page = 1;
    while (true) {
      const res = await axios.get('/api/paperless/tags/', {
        params: { page, page_size: 100 },
      });
      allTags.push(...res.data.results);
      if (!res.data.next) break;
      page++;
    }
    const results = allTags.map((tag: any) => ({
      id:             tag.id,
      name:           tag.name,
      color:          resolveColour(tag.colour ?? tag.color),
      is_inbox_tag:   tag.is_inbox_tag,
      document_count: tag.document_count,
    }));
    return { results, count: results.length };
  },
  
  getCorrespondents: async () => {
    const res = await axios.get('/api/paperless/correspondents/');
    return res.data;
  },
  
  getDocumentTypes: async () => {
    const res = await axios.get('/api/paperless/document_types/');
    return res.data;
  },
  
  patchDocument: async (id: number, data: { title?: string }) => {
    const res = await axios.patch(`/api/paperless/documents/${id}/`, data);
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
