import React from 'react';
import { FileText, FilterX, TrendingUp, Hash } from 'lucide-react';
import { useLang } from '../contexts/LanguageContext';

interface StatRowProps {
  total: number;
  filtered: number;
  tagCount: number;
}

const StatRow: React.FC<StatRowProps> = ({ total, filtered, tagCount }) => {
  const { t } = useLang();
  const isFiltered = filtered !== total;
  return (
    <div className="grid grid-4">
      <div className="stat-tile">
        <div className="stat-label-row">
          <span className="stat-label">{t.statDocs}</span>
          <FileText size={14} style={{ color: 'rgb(var(--np-text-muted))' }} />
        </div>
        <div className="stat-value">{total}</div>
        {isFiltered && (
          <div className="stat-delta">
            <TrendingUp size={11} /> {filtered} {t.statVisible}
          </div>
        )}
      </div>

      {isFiltered && (
        <div className="stat-tile">
          <div className="stat-label-row">
            <span className="stat-label">{t.statFiltered}</span>
            <FilterX size={14} style={{ color: 'rgb(var(--np-text-muted))' }} />
          </div>
          <div className="stat-value">{filtered}</div>
          <div className="stat-delta">{t.statOfTotal(total)}</div>
        </div>
      )}

      <div className="stat-tile">
        <div className="stat-label-row">
          <span className="stat-label">{t.statTags}</span>
          <Hash size={14} style={{ color: 'rgb(var(--np-text-muted))' }} />
        </div>
        <div className="stat-value">{tagCount}</div>
      </div>
    </div>
  );
};

export default StatRow;
