'use client';

/**
 * FilterBar €” single-trigger faceted filter built on top of MultiselectField.
 *
 * One chip in the toolbar regardless of how many filters are applied. The
 * popover opens to a category list, each row showing the per-category
 * applied count; drilling into a category reveals a listbox that uses
 * MultiselectField's exact styled exports (`DropdownSearchSection`,
 * `DropdownOptionsSection`, `DropdownOptionRow`, `DropdownOptionLabel`,
 * `Checkbox`) so the multi-select interaction is identical to a stand-
 * alone `<MultiselectField>` €” same row chrome, same search input, same
 * checkbox affordance.
 *
 * Designed to replace stacks of single-purpose `<SelectField>`s when a
 * page has multiple categorical filters that share a toolbar. Saves
 * horizontal space by collapsing every filter into one trigger; adding
 * filters happens entirely inside the popover, never spawning new chips.
 *
 * Trigger states:
 *   - 0 filters †’ dashed "Add filter" affordance
 *   - 1+ filters †’ solid "Filter" chip with a numeric count badge
 *
 * @example
 *   <FilterBar
 *     categories={[
 *       { key: 'office', label: 'Office', options: OFFICES },
 *       { key: 'staff',  label: 'Staff',  options: STAFF   },
 *     ]}
 *     value={filters}
 *     onChange={setFilters}
 *   />
 */

import React, { useState, useRef, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import TextInputField from './TextInputField';
import Checkbox from './Checkbox';
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  FilterIcon,
  SearchIcon,
} from './icons';
import {
  DropdownSearchSection,
  DropdownOptionsSection,
  DropdownOptionRow,
  DropdownOptionLabel,
  DropdownEmptyMessage,
  MultiSelectTrigger,
  TriggerDisplayText,
} from './MultiselectField.styles';
import {
  FilterBarRoot,
  FilterCountBadge,
  PopoverPaper,
  PopoverHeader,
  PopoverBackButton,
  CategoryListRow,
  CategoryRowMeta,
  PopoverFooter,
  PopoverFooterAction,
} from './FilterBar.styles';

export interface FilterOption {
  value: string;
  label: string;
  /** Optional left-aligned icon shown next to the option (e.g. color swatch). */
  leftIcon?: React.ReactNode;
}

export interface FilterCategory {
  /** Stable key €” used as the property name in `value` / `onChange`. */
  key: string;
  /** Display label for the category ("Office", "Staff", etc.). */
  label: string;
  /** Optional icon shown next to the category in the menu. */
  icon?: React.ReactNode;
  /** Multi-select options for this category. */
  options: FilterOption[];
  /**
   * Values that should be selected when the user clicks "Reset Defaults"
   * inside this category's drill-down. Also useful for seeding the
   * initial filter state from the consumer.
   */
  defaultValue?: string[];
  /** When true, shows a search input above the option list. Defaults to true if options.length > 6. */
  searchable?: boolean;
  /** Custom search placeholder (only when searchable). */
  searchPlaceholder?: string;
}

export interface FilterBarProps {
  categories: FilterCategory[];
  /** Map of categoryKey †’ array of selected option values. */
  value: Record<string, string[]>;
  onChange: (next: Record<string, string[]>) => void;
  /** Custom CTA copy when no filters are applied. Defaults to "Filters". */
  addLabel?: string;
  /** Custom CTA copy when at least one filter is applied. Defaults to "Filters". */
  activeLabel?: string;
  /**
   * Trigger sizing €” matches MultiselectField. `'base'` is 46px tall with
   * `borderRadius.xl`; `'small'` is 38px tall with `borderRadius.lg`.
   * Defaults to `'base'`.
   */
  size?: 'base' | 'small';
  sx?: SxProps<Theme>;
}

type View =
  | { kind: 'closed' }
  | { kind: 'category-list' }
  | { kind: 'category-options'; categoryKey: string };

export default function FilterBar({
  categories,
  value,
  onChange,
  addLabel = 'Filters',
  activeLabel = 'Filters',
  size = 'base',
  sx,
}: FilterBarProps) {
  const theme = useTheme();
  const [view, setView] = useState<View>({ kind: 'closed' });
  const [searchQuery, setSearchQuery] = useState('');
  // Pending values for the currently-drilled category €” staged until the
  // user clicks Apply so toggles don't immediately mutate the parent
  // filter state. Reset to null whenever the drill view exits without
  // applying (back chevron, click outside, escape, navigating to the
  // category list).
  const [pendingValues, setPendingValues] = useState<string[] | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const openCategoryList = useCallback(() => {
    setSearchQuery('');
    setPendingValues(null);
    setView({ kind: 'category-list' });
  }, []);
  const close = useCallback(() => {
    setPendingValues(null);
    setView({ kind: 'closed' });
  }, []);
  const drillInto = useCallback(
    (categoryKey: string) => {
      const cat = categories.find((c) => c.key === categoryKey);
      if (!cat) return;
      // Seed the staged pending list from the parent's committed value;
      // fall back to the category's defaults when no filter is yet
      // applied so users land in a meaningful starting state.
      setPendingValues(value[categoryKey] ?? cat.defaultValue ?? []);
      setSearchQuery('');
      setView({ kind: 'category-options', categoryKey });
    },
    [categories, value],
  );

  const togglePending = useCallback((optionValue: string) => {
    setPendingValues((prev) => {
      if (prev === null) return prev;
      return prev.includes(optionValue)
        ? prev.filter((v) => v !== optionValue)
        : [...prev, optionValue];
    });
  }, []);

  const clearPending = useCallback(() => {
    setPendingValues((prev) => (prev === null ? prev : []));
  }, []);

  const resetPendingToDefaults = useCallback(
    (categoryKey: string) => {
      const cat = categories.find((c) => c.key === categoryKey);
      setPendingValues(cat?.defaultValue ?? []);
    },
    [categories],
  );

  const applyPending = useCallback(
    (categoryKey: string) => {
      if (pendingValues === null) return;
      onChange({ ...value, [categoryKey]: pendingValues });
      setPendingValues(null);
      setView({ kind: 'closed' });
    },
    [pendingValues, value, onChange],
  );

  // Sum across categories drives the trigger badge. Empty arrays count as
  // zero (matches the "any" semantic exposed to consumers).
  const totalCount = categories.reduce(
    (sum, cat) => sum + (value[cat.key]?.length ?? 0),
    0,
  );
  const hasActive = totalCount > 0;

  const isOpen = view.kind !== 'closed';
  const isBase = size === 'base';
  const iconSize = isBase ? 18 : 16;

  return (
    <FilterBarRoot sx={sx}>
      <MultiSelectTrigger
        ref={triggerRef}
        role="combobox"
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        isOpen={isOpen}
        isBase={isBase}
        onClick={openCategoryList}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openCategoryList();
          }
        }}
        // FilterBar lives inline in toolbars, not as a full-width form
        // field; collapse to content width. Override the inherited
        // MultiselectField border color to gray/400 in the closed state
        // so the trigger reads as a softer toolbar control rather than
        // a heavy form input €” open state stays primary-tinted. In dark
        // mode we layer surfaceOverlay.base on top of the slate/900 base
        // so the trigger picks up the same mica tint used by other
        // input-elevation surfaces (the overlay collapses to a no-op in
        // light mode so the white input box is unchanged).
        sx={{
          width: 'auto',
          minWidth: 0,
          borderColor: isOpen ? theme.semantic.primary.main : theme.colors.gray[400],
          backgroundImage: theme.surfaceOverlay.base,
        }}
      >
        <TriggerDisplayText isPlaceholder={!hasActive} isBase={isBase}>
          {hasActive ? activeLabel : addLabel}
        </TriggerDisplayText>
        {hasActive && <FilterCountBadge>{totalCount}</FilterCountBadge>}
        {/* Filter icon on the right, text.secondary, mirrors the chevron
            position in MultiselectField but signals "this is a filter"
            instead of a generic dropdown. */}
        <FilterIcon size={iconSize} color={theme.semantic.text.secondary} />
      </MultiSelectTrigger>

      <Popover
        open={view.kind !== 'closed'}
        anchorEl={triggerRef.current}
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              mt: theme.customSpacing[1],
              borderRadius: theme.customBorderRadius.xl,
              overflow: 'visible',
              boxShadow: 'none',
              backgroundColor: 'transparent',
            },
          },
        }}
      >
        <PopoverPaper smoothRadius={theme.customBorderRadius.xl}>
          {view.kind === 'category-list' && (
            <>
              <PopoverHeader>
                <span>Filter by</span>
              </PopoverHeader>
              {categories.map((cat) => {
                const count = value[cat.key]?.length ?? 0;
                return (
                  <CategoryListRow
                    key={cat.key}
                    type="button"
                    onClick={() => drillInto(cat.key)}
                  >
                    {cat.icon}
                    {cat.label}
                    <CategoryRowMeta>
                      {count > 0 && <FilterCountBadge>{count}</FilterCountBadge>}
                      <ChevronRightIcon size={14} color={theme.semantic.text.secondary} />
                    </CategoryRowMeta>
                  </CategoryListRow>
                );
              })}
            </>
          )}

          {view.kind === 'category-options' && (() => {
            const cat = categories.find((c) => c.key === view.categoryKey);
            if (!cat) return null;
            // Pending = staged toggle list. Drill-in seeds it from the
            // current parent value (or category defaults), so once we're
            // in this view it's never null.
            const vals = pendingValues ?? [];
            const isSearchable = cat.searchable ?? cat.options.length > 6;
            const q = searchQuery.toLowerCase().trim();
            const filteredOptions = q
              ? cat.options.filter((o) => o.label.toLowerCase().includes(q))
              : cat.options;
            return (
              <>
                <PopoverHeader>
                  <PopoverBackButton type="button" onClick={openCategoryList}>
                    <ChevronLeftIcon size={14} color="currentColor" />
                    {cat.label}
                  </PopoverBackButton>
                </PopoverHeader>

                {/* Listbox uses MultiselectField's exact styled exports so
                    the multi-select interaction matches a standalone
                    <MultiselectField> 1:1 (search input, checkbox rows,
                    spacing, hover treatment). */}
                {isSearchable && (
                  <DropdownSearchSection>
                    <TextInputField
                      label="Search"
                      hideLabel
                      size="base"
                      placeholder={cat.searchPlaceholder ?? `Search ${cat.label.toLowerCase()}...`}
                      value={searchQuery}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSearchQuery(e.target.value)
                      }
                      startIcon={<SearchIcon size={20} color="currentColor" />}
                    />
                  </DropdownSearchSection>
                )}
                <DropdownOptionsSection
                  role="listbox"
                  aria-multiselectable="true"
                >
                  {filteredOptions.length === 0 ? (
                    <DropdownEmptyMessage>No matching options.</DropdownEmptyMessage>
                  ) : (
                    filteredOptions.map((opt) => {
                      const checked = vals.includes(opt.value);
                      return (
                        <DropdownOptionRow
                          key={opt.value}
                          type="button"
                          role="option"
                          aria-selected={checked}
                          onClick={() => togglePending(opt.value)}
                        >
                          {/* The checkbox is purely visual €” only the row
                              owns the toggle. Wiring onChange here would
                              double-fire when the user clicks the
                              checkbox directly (Checkbox's onClick †’
                              onChange, then bubbles to the row's
                              onClick), netting zero change. */}
                          <Checkbox checked={checked} />
                          {opt.leftIcon}
                          <DropdownOptionLabel>{opt.label}</DropdownOptionLabel>
                        </DropdownOptionRow>
                      );
                    })
                  )}
                </DropdownOptionsSection>

                {/* Footer order (left †’ right): Clear  -  Reset Defaults -
                    Apply. Apply is the only action that commits pending
                    toggles to parent state; the others mutate the staged
                    list only. The header chevron-back acts as the cancel
                    affordance €” it discards pending and returns to the
                    category list. Reset Defaults + Apply are grouped on
                    the right so Reset sits adjacent to Apply rather than
                    getting centered by `space-between`. */}
                <PopoverFooter>
                  <PopoverFooterAction type="button" onClick={clearPending}>
                    Clear
                  </PopoverFooterAction>
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: theme.customSpacing[3] }}>
                    <PopoverFooterAction
                      type="button"
                      onClick={() => resetPendingToDefaults(cat.key)}
                    >
                      Reset Defaults
                    </PopoverFooterAction>
                    <PopoverFooterAction
                      type="button"
                      onClick={() => applyPending(cat.key)}
                      style={{ color: theme.semantic.primary.main }}
                    >
                      Apply
                    </PopoverFooterAction>
                  </Box>
                </PopoverFooter>
              </>
            );
          })()}
        </PopoverPaper>
      </Popover>
    </FilterBarRoot>
  );
}
