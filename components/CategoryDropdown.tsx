'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Search,
  Megaphone,
  BarChart3,
  Coins,
  Code2,
  Scale,
  ShieldCheck,
  Heart,
  Share2,
  Trophy,
  Briefcase,
  GraduationCap,
  Building2,
  ChevronDown,
  Check,
  Sparkles,
} from 'lucide-react';

export interface CategoryOption {
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
}

export const CATEGORY_OPTIONS: CategoryOption[] = [
  { name: 'AI Agents & Infrastructure', icon: Bot },
  { name: 'SEO & AI Visibility', icon: Search },
  { name: 'Marketing & Advertising', icon: Megaphone },
  { name: 'Analytics', icon: BarChart3 },
  { name: 'Crypto, Web3 & Investing', icon: Coins },
  { name: 'Developer Tools', icon: Code2 },
  { name: 'Business, Finance & Legal', icon: Scale },
  { name: 'Security, Privacy & Compliance', icon: ShieldCheck },
  { name: 'Health, Fitness & Wellness', icon: Heart },
  { name: 'Social Media & Creator Tools', icon: Share2 },
  { name: 'Leaderboards & Attention Markets', icon: Trophy },
  { name: 'Hiring, Jobs & Careers', icon: Briefcase },
  { name: 'Education & Learning', icon: GraduationCap },
  { name: 'Agencies, Studios & Services', icon: Building2 },
];

export function getCategoryIcon(name: string) {
  const found = CATEGORY_OPTIONS.find(
    (c) => c.name.toLowerCase() === (name || '').toLowerCase()
  );
  if (found) return found.icon;
  if (name?.toLowerCase().includes('ai')) return Bot;
  if (name?.toLowerCase().includes('dev')) return Code2;
  return Sparkles;
}

interface CategoryDropdownProps {
  value: string;
  onChange: (category: string) => void;
  className?: string;
  buttonClassName?: string;
  align?: 'left' | 'right';
  placeholder?: string;
}

export default function CategoryDropdown({
  value,
  onChange,
  className = '',
  buttonClassName = '',
  align = 'left',
  placeholder = 'Select Category',
}: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Find active option
  const selectedOption = CATEGORY_OPTIONS.find((c) => c.name === value) || {
    name: value || placeholder,
    icon: getCategoryIcon(value),
  };

  const SelectedIcon = selectedOption.icon;

  // Smooth outside click dismissal
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (categoryName: string) => {
    onChange(categoryName);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`custom-category-dropdown-wrapper ${className}`}
    >
      <button
        type="button"
        className={`custom-category-trigger-btn ${buttonClassName} ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="trigger-content">
          <SelectedIcon size={17} className="trigger-icon" strokeWidth={1.8} />
          <span className="trigger-label">{selectedOption.name}</span>
        </div>
        <ChevronDown
          size={16}
          className={`trigger-chevron ${isOpen ? 'open' : ''}`}
          strokeWidth={2}
        />
      </button>

      {/* Floating Menu with smooth entrance animation */}
      <div
        className={`custom-category-popover ${align === 'right' ? 'align-right' : 'align-left'} ${
          isOpen ? 'is-open' : 'is-closed'
        }`}
        role="listbox"
      >
        <div className="popover-scroll-area">
          {CATEGORY_OPTIONS.map((item) => {
            const ItemIcon = item.icon;
            const isSelected = item.name === value;
            return (
              <button
                type="button"
                key={item.name}
                className={`custom-category-item ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelect(item.name)}
                role="option"
                aria-selected={isSelected}
              >
                <div className="item-icon-wrap">
                  <ItemIcon size={17} strokeWidth={1.8} />
                </div>
                <span className="item-name">{item.name}</span>
                {isSelected && (
                  <Check size={14} className="item-check" strokeWidth={2.5} />
                )}
              </button>
            );
          })}
        </div>
        <div className="popover-bottom-chevron" aria-hidden="true">
          <ChevronDown size={14} />
        </div>
      </div>
    </div>
  );
}
