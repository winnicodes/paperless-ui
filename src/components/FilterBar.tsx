import React from 'react';
import { Search, Tag as TagIcon, Check, X, FilterX } from 'lucide-react';
import { type Tag } from '../services/paperless';
import { useLang } from '../contexts/LanguageContext';

export interface FilterBarProps {
  tags: Tag[];
  selectedTags: number[];
  onTagToggle: (id: number) => void;
  onClearFilters: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  tags,
  selectedTags,
  onTagToggle,
  onClearFilters,
  searchQuery,
  onSearchChange,
}) => {
  const { t } = useLang();
  const hasFilters = selectedTags.length > 0 || searchQuery.trim() !== '';

  return (
    <div className="card">
      {/* Search */}
      <div className="input-group">
        <Search className="input-icon" size={16} />
        <input
          type="text"
          className="input h-10 pr-9"
          placeholder={t.searchPlaceholder}
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: 'rgb(var(--np-text-muted))' }}
            onClick={() => onSearchChange('')}
            aria-label="Suche löschen"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Tag pills */}
      {tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap" style={{ marginTop: 'var(--space-3)' }}>
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.08em] flex items-center gap-1.5 shrink-0 mr-1"
            style={{ color: 'rgb(var(--np-text-muted))' }}
          >
            <TagIcon size={11} />
            {t.statTags}
          </span>

          {tags.map(tag => {
            const active = selectedTags.includes(tag.id);
            return (
              <button
                key={tag.id}
                onClick={() => onTagToggle(tag.id)}
                className="badge cursor-pointer text-xs transition-all"
                style={{
                  backgroundColor: active ? tag.color : `${tag.color}18`,
                  color: active ? '#fff' : tag.color,
                  borderColor: active ? 'transparent' : `${tag.color}40`,
                  outline: active ? `2px solid ${tag.color}` : 'none',
                  outlineOffset: '2px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0.2em 0.7em',
                }}
              >
                {active && <Check size={10} />}
                {tag.name}
              </button>
            );
          })}

          {hasFilters && (
            <button
              onClick={onClearFilters}
              className="btn btn-ghost btn-sm ml-auto"
              style={{ color: 'rgb(var(--np-text-muted))' }}
            >
              <FilterX size={13} />
              {t.resetFilters}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterBar;
