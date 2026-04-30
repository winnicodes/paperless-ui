import React from 'react';
import { cn } from '../lib/cn';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active, onClick }) => (
  <div onClick={onClick} className={cn('sidebar-item', active && 'active')}>
    <Icon size={16} strokeWidth={1.75} />
    <span className="sidebar-label">{label}</span>
  </div>
);

export default SidebarItem;
