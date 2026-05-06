'use client';

// DataTable  internal sub-components
// Task 1 of N: file header + sub-components only.
// The main DataTable export and cell renderers are added in later tasks.

import React, { useState, useEffect, useRef, useCallback, useMemo, useId, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { SxProps, Theme, useTheme } from '@mui/material/styles';
import {
  ColVisTriggerButton,
  ActionIconButtonRoot,
  DataTableRoot,
  Toolbar,
  ToolbarSpacer,
  ScrollContainerOuter,
  ScrollShadow,
  ScrollContainerInner,
  EmptyStateContainer,
  EmptyStateIconCircle,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateActions,
  HeaderCellInner,
  SortableHeaderButton,
  SkeletonCheckboxBox,
  SkeletonBar,
  SkeletonBarAnimated,
  FooterBar,
  FooterRangeText,
  PaginationNav,
  RowsPerPageWrapper,
  StatusBadgeRoot,
  DocStatusIconWrapper,
  PillChip,
  NotRegisteredDot,
  MoreDataBadge,
  InlineAddRow,
  InlineAddTriggerRow,
  InlineAddStickyWrap,
  AddRowFooter,
} from './DataTable.styles';
import ImagePlaceholder from './ImagePlaceholder';
import IconTooltip from './IconTooltip';
import BaseButton from './BaseButton';
import TextInputField from './TextInputField';
import SelectField from './SelectField';
import Checkbox from './Checkbox';
import { SettingsAdjustIcon, CheckmarkIcon, ViewOutlineIcon, SearchIcon, EmailIcon, PhoneIcon, ChatIcon, LocationOutlineIcon, AddIcon, DataEmptyIcon, HelpFilledIcon } from './icons';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import PushPinIcon from '@mui/icons-material/PushPin';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EventIcon from '@mui/icons-material/Event';
import ArticleIcon from '@mui/icons-material/Article';
import VerifiedIcon from '@mui/icons-material/Verified';


// Public interfaces

export type DataTableSortDirection = 'asc' | 'desc' | null;

export interface DataTableSortState {
  field: string | null;
  direction: DataTableSortDirection;
}

export interface DataTablePaginationConfig {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
}

export interface DataTableSearchConfig {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export interface DataTableExternalSortingConfig {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export interface DataTableRowAction<T = Record<string, unknown>> {
  id: string;
  label: string;
  icon: React.ReactElement;
  onClick: (row: T) => void;
  disabled?: boolean | ((row: T) => boolean);
  hidden?: boolean | ((row: T) => boolean);
  color?: string;
}

export interface DataTableRowDragEvent<T = Record<string, unknown>> {
  row: T;
  rowIndex: number;
  absoluteIndex: number;
  event: React.DragEvent<HTMLTableRowElement>;
}

export interface DataTableRowDropEvent<T = Record<string, unknown>>
  extends DataTableRowDragEvent<T> {
  sourceRow: T;
  sourceIndex: number;
  sourceAbsoluteIndex: number;
}

export type DataTableRowProps<T = Record<string, unknown>> =
  React.HTMLAttributes<HTMLTableRowElement> | ((row: T, rowIndex: number) => React.HTMLAttributes<HTMLTableRowElement>);

export type DataTableHeaderProps<T = Record<string, unknown>> =
  React.ThHTMLAttributes<HTMLTableCellElement> | ((column: ColumnDef<T>, columnIndex: number) => React.ThHTMLAttributes<HTMLTableCellElement>);

export interface ColumnDef<T = Record<string, unknown>> {
  id: string;
  header: React.ReactNode;
  /** Plain-text label used by column visibility, sorting announcements, and aria labels when `header` is not a string. */
  headerLabel?: string;
  /**
   * Optional helper description shown in a HelpFilledIcon tooltip to the
   * right of the header label. The icon has `flex-shrink: 0` so it stays
   * visible when the column narrows; the header text ellipsizes first.
   */
  description?: React.ReactNode;
  width?: number;
  minWidth?: number;
  sortable?: boolean;
  resizable?: boolean;
  defaultVisible?: boolean;
  align?: 'left' | 'center' | 'right';
  accessor?: ((row: T) => unknown) | string;
  cell?: (value: unknown, row: T, column: ColumnDef<T>, rowIndex: number) => React.ReactNode;
  headerCell?: (column: ColumnDef<T>) => React.ReactNode;
  footer?: React.ReactNode | ((column: ColumnDef<T>) => React.ReactNode);
  getCellProps?: (row: T, rowIndex: number, value: unknown) => React.TdHTMLAttributes<HTMLTableCellElement>;
  getHeaderProps?: (column: ColumnDef<T>, columnIndex: number) => React.ThHTMLAttributes<HTMLTableCellElement>;
}

export interface DataTableProps<T = Record<string, unknown>> {
  columns: ColumnDef<T>[];
  data: T[];
  title?: string;
  searchable?: boolean;
  selectable?: boolean;
  /** Hides the toolbar (search + selection + settings). Useful when the table lives inside a modal with its own header and doesn't need table-level tools. */
  hideToolbar?: boolean;
  showSearch?: boolean;
  showColumnVisibility?: boolean;
  /** Position of the `actionCell` column. Defaults to 'right'. Users can still toggle via the toolbar's actions-position select (unless `hideToolbar`). */
  actionsColumnPosition?: 'left' | 'right';
  /**
   * Inline-add layout variant. Controls where the "Add" trigger and any
   * pending draft rows live:
   *
   * - `'footer'` (default)  the "Add +" trigger renders in a footer bar
   *   BELOW the `<table>`, and `inlineAddRow` is slotted as a single
   *   pseudo-row at the end of `<tbody>`. Good for page-level tables.
   *
   * - `'inline'`  opt-in for tables inside modals where popping another
   *   modal to add records is bad UX. The "Add +" trigger is a `<tr>`
   *   inside `<tbody>` (after all data + drafts), and `inlineAddRow` can
   *   be an ARRAY of pseudo-rows (each wrapped by the consumer in the
   *   exported `InlineAddRow` styled component) so multiple drafts can be
   *   filled in simultaneously. Empty-state and drafts coexist  when
   *   data is empty, the empty-state row renders alongside the trigger.
   */
  inlineAddVariant?: 'footer' | 'inline';
  /**
   * Pseudo-row(s) rendered at the end of the table body (after data rows,
   * before pagination). In the `'footer'` variant, DataTable wraps this
   * node in a single `<InlineAddRow>` `<tr>`. In the `'inline'` variant,
   * DataTable renders the node RAW so consumers can supply multiple rows
   * by importing the `InlineAddRow` styled component and emitting a
   * fragment of `<InlineAddRow>` elements. Not counted in pagination.
   */
  inlineAddRow?: React.ReactNode;
  /** When provided, renders the "Add" trigger (location depends on `inlineAddVariant`). */
  onAddClick?: () => void;
  /** Label for the "Add" trigger. Defaults to "Add". */
  addLabel?: string;
  /**
   * Whether cell content is allowed to wrap to multiple lines.
   * - `false` (default)  single-line cells with `text-overflow: ellipsis`
   *   on overflow. Every row is uniform height.
   * - `true`  cells use `white-space: normal` and grow vertically to fit
   *   their content. Useful for tables that display long names, notes, or
   *   paragraphs and need the full text visible.
   */
  wrapCells?: boolean;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  pagination?: DataTablePaginationConfig;
  showPagination?: boolean;
  /** Hides the footer range, pagination controls, and rows-per-page selector. */
  hideFooter?: boolean;
  search?: DataTableSearchConfig;
  sort?: DataTableSortState;
  onSortChange?: (sort: DataTableSortState) => void;
  externalSorting?: DataTableExternalSortingConfig;
  onSelectionChange?: (rows: T[]) => void;
  onRowSelectionChange?: (rows: T[]) => void;
  onRowClick?: (row: T) => void;
  getRowId?: (row: T, index: number) => string;
  selectedRowId?: string | null;
  getRowProps?: DataTableRowProps<T>;
  getHeaderProps?: DataTableHeaderProps<T>;
  emptyMessage?: string;
  noDataMessage?: string;
  loading?: boolean;
  isLoading?: boolean;
  searchPlaceholder?: string;
  actionCell?: ((row: T) => React.ReactNode) | null;
  rowActions?: DataTableRowAction<T>[];
  /**
   * Describes how rows in this table are edited. Primarily used to pick
   * sensible defaults for the Actions column and other affordances.
   *
   *   - `'always-editable'`  every cell is an interactive control that
   *     persists on change (e.g. dropdowns, toggles). No per-row action
   *     icons are needed, so the Actions column is hidden.
   *
   *   - `'row-action'`  rows are read-only until the user clicks the
   *     edit icon in the Actions column. The Actions column stays visible.
   *
   *   - `'hybrid'`  some cells enter edit mode when clicked, and the
   *     Actions column holds a Save/Cancel pair while the row is dirty.
   *     (Falls through to default Actions column rendering for now.)
   *
   * When omitted, DataTable behaves as it always has (Actions column is
   * rendered and the consumer provides `actionCell` to populate it).
   */
  editMode?: 'always-editable' | 'row-action' | 'hybrid';
  /**
   * Force-hide the Actions column regardless of `actionCell` / `editMode`.
   * Escape hatch for tables that don't have any row-level actions.
   */
  hideActionsColumn?: boolean;
  stickyActionsColumn?: boolean;
  stickyFirstColumn?: boolean;
  tableId?: string;
  tableContainerSx?: SxProps<Theme>;
  TableFooterComponent?: React.ReactNode;
  SearchActionComponent?: React.ReactNode;
  draggableRows?: boolean;
  onRowDragStart?: (event: DataTableRowDragEvent<T>) => void;
  onRowDragOver?: (event: DataTableRowDragEvent<T>) => void;
  onRowDrop?: (event: DataTableRowDropEvent<T>) => void;
  onRowDragEnd?: (event: DataTableRowDragEvent<T>) => void;
  onRowReorder?: (sourceIndex: number, targetIndex: number, sourceRow: T, targetRow: T) => void;
  sx?: SxProps<Theme>;
}

// Token shortcuts  computed from theme at runtime
// These helpers are called inside each component that needs them.
function makeT(theme: Theme) {
  return {
    primary: theme.semantic.primary.main,
    primaryFg: theme.semantic.primary.contrastText,
    fg: theme.semantic.text.primary,
    fgSub: theme.semantic.text.secondary,
    muted: theme.semantic.action.hover,
    border: theme.semantic.divider,
    card: 'var(--sc-common-white)',
    bg: theme.semantic.background.default,
    headerBg: 'var(--sc-action-hover)',
    headerFg: theme.semantic.text.secondary,
    // Unified row backgrounds  opaque so sticky cells don't show scrolled content
    // Uses CSS vars that flip automatically in dark mode
    rowBase: 'var(--sc-dt-row-base)',
    rowStripe: 'var(--sc-dt-sticky-stripe)',
    rowSelected: 'var(--sc-dt-selected-row)',
    // Header row uses the stripe color
    stickyStripe: 'var(--sc-dt-sticky-stripe)',
  };
}

function makeR(theme: Theme) {
  return {
    card: theme.customBorderRadius.lg,   // 8px
    button: theme.customBorderRadius.xl, // 12px
    sm: theme.customBorderRadius.md,     // 6px
  };
}

function makeFocusRing(theme: Theme) {
  return `0 0 0 2px ${theme.semantic.primary.focusVisible}`;
}

function getColumnHeaderText<T>(col: ColumnDef<T>): string {
  if (col.headerLabel) return col.headerLabel;
  return typeof col.header === 'string' ? col.header : col.id;
}

function resolveBoolean<T>(value: boolean | ((row: T) => boolean) | undefined, row: T): boolean {
  return typeof value === 'function' ? value(row) : value === true;
}

function mergeStyle(
  base: React.CSSProperties,
  extra?: React.CSSProperties,
): React.CSSProperties {
  return extra ? { ...base, ...extra } : base;
}

// Helper: getInitials
// Returns up to 2 uppercase initials from a full name string.
function getInitials(name: string): string {
  if (!name) return '';
  return String(name)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

// Checkbox checkmark SVG path (from Figma asset p428900)
const CHECKBOX_CHECK_PATH = 'M2.5 8L6.16667 11.5L13.5 4.5';

// TableCheckbox
// 16 - 16 custom checkbox matching Figma DS: unchecked / checked / indeterminate.
// The native <input> is visually hidden and provides keyboard + AT semantics.
interface TableCheckboxProps {
  id: string;
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

function TableCheckbox({
  id,
  checked,
  indeterminate = false,
  onChange,
  label,
}: TableCheckboxProps) {
  const theme = useTheme();
  const T = makeT(theme);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Sync native indeterminate property  cannot be set via a React attribute
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const isActive = checked || indeterminate;

  return (
    <label
      htmlFor={id}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        flexShrink: 0,
        lineHeight: 0,
        position: 'relative',
      }}
    >
      {/* Native input  visually hidden; provides keyboard, AT and form semantics */}
      <input
        ref={inputRef}
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-label={label}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          position: 'absolute',
          opacity: 0,
          width: '16px',
          height: '16px',
          margin: 0,
          padding: 0,
          cursor: 'pointer',
          zIndex: 1,
        }}
      />

      {/* Visual layer  aria-hidden; replicates Figma design exactly */}
      <span
        aria-hidden="true"
        style={{
          display: 'block',
          width: '16px',
          height: '16px',
          flexShrink: 0,
          position: 'relative',
          borderRadius: theme.customBorderRadius.sm, // 2px  matches Figma
          outline: isFocused ? `2px solid ${T.primary}` : 'none',
          outlineOffset: '2px',
          transition: 'outline 0.1s ease',
        }}
      >
        {isActive ? (
          /*  Checked / Indeterminate: primary fill + white mark  */
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ display: 'block' }}>
            <rect width="16" height="16" fill={T.primary} />
            {indeterminate ? (
              /* Indeterminate: centred dash */
              <rect x="3.5" y="7.25" width="9" height="1.5" rx="0.75" fill={T.primaryFg} />
            ) : (
              /* Checked: checkmark */
              <path
                d={CHECKBOX_CHECK_PATH}
                stroke={T.primaryFg}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            )}
          </svg>
        ) : (
          /*  Unchecked: white box + 1 px border  */
          <>
            <span
              style={{
                display: 'block',
                width: '16px',
                height: '16px',
                backgroundColor: T.card,
              }}
            />
            <span
              style={{
                position: 'absolute',
                inset: 0,
                border: `1px solid ${T.fgSub}`,
                pointerEvents: 'none',
              }}
            />
          </>
        )}
      </span>
    </label>
  );
}

// SortIcon
// Shows KeyboardArrowUp/Down when sorted, UnfoldMore when unsorted.
interface SortIconProps {
  direction: 'asc' | 'desc' | null;
}

function SortIcon({ direction }: SortIconProps) {
  const theme = useTheme();
  const T = makeT(theme);
  const shared = { fontSize: 16, flexShrink: 0 };
  if (direction === 'asc')
    return <KeyboardArrowUpIcon aria-hidden="true" style={{ ...shared, color: T.primary }} />;
  if (direction === 'desc')
    return <KeyboardArrowDownIcon aria-hidden="true" style={{ ...shared, color: T.primary }} />;
  return <UnfoldMoreIcon aria-hidden="true" style={{ ...shared, color: T.headerFg }} />;
}

// ResizeHandle
// Drag right edge of a column header to resize; double-click to auto-fit.
// Thin 2px visual handle appears on hover/active.
interface ResizeHandleProps {
  colId: string;
  onResize: (colId: string, newWidth: number) => void;
  onAutoFit: (colId: string) => void;
}

function ResizeHandle({ colId, onResize, onAutoFit }: ResizeHandleProps) {
  const theme = useTheme();
  const T = makeT(theme);
  const [hovered, setHovered] = useState(false);

  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const th = (e.currentTarget as HTMLElement).closest('th');
      const startX = e.clientX;
      const startW = th ? parseInt(window.getComputedStyle(th).width, 10) : 100;

      const onMove = (me: MouseEvent) => {
        const newW = Math.max(50, startW + (me.clientX - startX));
        onResize(colId, newW);
      };
      const onUp = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    },
    [colId, onResize]
  );

  return (
    <div
      aria-hidden="true"
      title="Drag to resize - Double-click to auto-fit"
      style={{
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: '8px',
        cursor: 'col-resize',
        zIndex: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDown={onMouseDown}
      onDoubleClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onAutoFit(colId);
      }}
      onDragStart={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div
        style={{
          width: '2px',
          height: '55%',
          borderRadius: theme.customBorderRadius.sm,
          backgroundColor: hovered ? T.primary : T.border,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.15s ease, background-color 0.15s ease',
        }}
      />
    </div>
  );
}

// HeaderLabelSpan
// Truncates header text with ellipsis; shows a fixed-position tooltip only
// when the text is actually clipped (scrollWidth > clientWidth).
interface HeaderLabelSpanProps {
  children: React.ReactNode;
  textAlign?: 'left' | 'center' | 'right';
}

function HeaderLabelSpan({ children, textAlign = 'left' }: HeaderLabelSpanProps) {
  const theme = useTheme();
  const T = makeT(theme);
  const R = makeR(theme);
  const spanRef = useRef<HTMLSpanElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [ttPos, setTtPos] = useState<{ top: number; left: number } | null>(null);

  const showTt = () => {
    const el = spanRef.current;
    if (!el) return;
    // Only show tooltip when the label is genuinely truncated
    if (el.scrollWidth <= el.clientWidth) return;
    if (hideTimer.current) clearTimeout(hideTimer.current);
    const r = el.getBoundingClientRect();
    setTtPos({ top: r.top - 6, left: r.left + r.width / 2 });
  };

  const startHideTt = () => {
    hideTimer.current = setTimeout(() => setTtPos(null), 140);
  };

  const cancelHideTt = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
  };

  // Clean up timer on unmount
  useEffect(
    () => () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    },
    []
  );

  return (
    <>
      <span
        ref={spanRef}
        onMouseEnter={showTt}
        onMouseLeave={startHideTt}
        style={{
          flex: 1,
          minWidth: 0,
          textAlign,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {children}
      </span>

      {/* Tooltip  position:fixed escapes all overflow/sticky clipping */}
      {ttPos && (
        <div
          role="tooltip"
          onMouseEnter={cancelHideTt}
          onMouseLeave={startHideTt}
          style={{
            position: 'fixed',
            top: ttPos.top,
            left: ttPos.left,
            transform: 'translate(-50%, -100%)',
            zIndex: 9999,
            backgroundColor: T.card,
            border: `1px solid ${T.border}`,
            borderRadius: R.card,
            boxShadow: theme.customShadows.md,
            padding: '5px 10px',
            pointerEvents: 'auto',
            whiteSpace: 'nowrap',
          }}
        >
          <span
            style={{
              fontFamily: theme.fontFamilies.body,
              fontSize: '14px',
              color: T.fg,
              lineHeight: '1.5',
            }}
          >
            {children}
          </span>
          {/* Downward caret */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: '-5px',
              left: '50%',
              transform: 'translateX(-50%) rotate(45deg)',
              width: '8px',
              height: '8px',
              backgroundColor: T.card,
              border: `1px solid ${T.border}`,
              borderTop: 'none',
              borderLeft: 'none',
            }}
          />
        </div>
      )}
    </>
  );
}

// ColumnVisibilityMenu
// Trigger button (TuneIcon)  dropdown panel with:
//    Search input
//    Select All / Clear All / Restore Default links
//    Scrollable staged checkbox list
//    Save Changes button (applies staged changes and closes)
// Staged changes  toggles only committed to the parent when Save is clicked.
interface ColumnVisibilityMenuProps {
  columns: ColumnDef[];
  visibleColumns: Set<string>;
  onSave: (next: Set<string>) => void;
}

function ColumnVisibilityMenu({ columns, visibleColumns, onSave }: ColumnVisibilityMenuProps) {
  const theme = useTheme();
  const T = makeT(theme);
  const R = makeR(theme);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuId = useId();
  const [portalPos, setPortalPos] = useState({ top: 0, right: 0 });

  // Compute portal position when opening
  const handleToggle = useCallback(() => {
    setOpen((prev) => {
      if (!prev && triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setPortalPos({ top: rect.bottom + 6, right: window.innerWidth - rect.right });
      }
      return !prev;
    });
  }, []);

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const portalEl = document.getElementById(menuId);
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (portalEl?.contains(target)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Columns that can be toggled (exclude 'actions')
  const toggleable = columns.filter((c) => c.id !== 'actions');

  // Staged state  local copy; committed only on Save
  const [searchQuery, setSearchQuery] = useState('');
  const [stagedVisible, setStagedVisible] = useState<Set<string>>(() => new Set(visibleColumns));
  const defaultVisibleRef = useRef(
    new Set(
      columns.filter((c) => c.id !== 'actions' && c.defaultVisible !== false).map((c) => c.id)
    )
  );

  // Sync staged state and reset search each time the menu opens
  useEffect(() => {
    if (open) {
      setStagedVisible(new Set(visibleColumns));
      setSearchQuery('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Focus search input when panel opens
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => searchInputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Filter by search query
  const filtered = toggleable.filter((c) =>
    getColumnHeaderText(c).toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Apply staged changes to parent and close
  const handleSave = () => {
    onSave(new Set(stagedVisible));
    setOpen(false);
  };

  return (
    <div ref={rootRef} style={{ position: 'relative' }}>
      {/* Trigger button  styled to match SelectField outline variant */}
      <span ref={triggerRef}>
        <ColVisTriggerButton
          component="button"
          onClick={handleToggle}
          aria-expanded={open}
          aria-controls={menuId}
          aria-haspopup="true"
          aria-label="Toggle column visibility"
          isOpen={open}
        >
          <TuneIcon style={{ fontSize: 16 }} />
          Columns
        </ColVisTriggerButton>
      </span>

      {/* Dropdown panel  portal to body to escape overflow:hidden ancestors */}
      {open && ReactDOM.createPortal(
        <div
          id={menuId}
          role="dialog"
          aria-label="Column visibility options"
          style={{
            position: 'fixed',
            top: portalPos.top,
            right: portalPos.right,
            zIndex: 1300,
            backgroundColor: T.card,
            backgroundImage: theme.surfaceOverlay.high,
            borderRadius: R.card,
            border: `1px solid ${T.border}`,
            boxShadow: theme.customShadows.lg,
            padding: '16px 24px',
            width: '436px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {/* Search input */}
          <TextInputField
            placeholder="Search Columns"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            endIcon={<SearchIcon size={20} />}
            inputProps={{ ref: searchInputRef }}
          />

          {/* Divider */}
          <div
            style={{ height: '1px', backgroundColor: T.border, flexShrink: 0, margin: '0 -24px' }}
          />

          {/* Action row: Select All / Clear All / Restore Default */}
          <div style={{ display: 'flex', gap: theme.customSpacing[4], alignItems: 'center', flexShrink: 0 }}>
            <BaseButton variant="ghost" color="primary" onClick={() => setStagedVisible(new Set(toggleable.map((c) => c.id)))}>
              Select All
            </BaseButton>
            <BaseButton variant="ghost" color="primary" onClick={() => setStagedVisible(new Set())}>
              Clear All
            </BaseButton>
            <BaseButton variant="ghost" color="primary" onClick={() => setStagedVisible(new Set(defaultVisibleRef.current))}>
              Restore Default
            </BaseButton>
          </div>

          {/* Scrollable column list */}
          <div style={{ height: '400px', overflowY: 'auto', overflowX: 'clip', flexShrink: 0 }}>
            <div
              role="group"
              aria-label="Columns"
              style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '4px 0' }}
            >
              {filtered.map((col) => {
                const on = stagedVisible.has(col.id);
                return (
                  <Checkbox
                    key={col.id}
                    checked={on}
                    label={getColumnHeaderText(col)}
                    onChange={() => {
                      setStagedVisible((prev) => {
                        const next = new Set(prev);
                        if (next.has(col.id)) next.delete(col.id);
                        else next.add(col.id);
                        return next;
                      });
                    }}
                  />
                );
              })}
              {filtered.length === 0 && (
                <p
                  style={{
                    fontFamily: theme.fontFamilies.body,
                    fontSize: '14px',
                    color: T.fgSub,
                    textAlign: 'center',
                    padding: '16px 0',
                    margin: 0,
                  }}
                >
                  No columns match
                </p>
              )}
            </div>
          </div>

          {/* Divider */}
          <div
            style={{ height: '1px', backgroundColor: T.border, flexShrink: 0, margin: '0 -24px' }}
          />

          {/* Save Changes footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', flexShrink: 0 }}>
            <BaseButton variant="ghost" color="primary" onClick={handleSave}>
              Save Changes
            </BaseButton>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

// PaginationBtn
// Small icon button 28 - 28, borderRadius R.sm (6px).
interface PaginationBtnProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  label?: string;
  title?: string;
}

function PaginationBtn({ children, onClick, disabled, label, title }: PaginationBtnProps) {
  const theme = useTheme();
  const T = makeT(theme);
  const R = makeR(theme);
  const FOCUS_RING = makeFocusRing(theme);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={title}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '28px',
        height: '28px',
        borderRadius: R.sm,
        border: `1px solid ${T.border}`,
        backgroundColor: disabled ? T.muted : T.card,
        color: disabled ? T.fgSub : T.fg,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        outline: 'none',
        padding: 0,
        flexShrink: 0,
        transition: 'background-color 0.12s ease',
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.backgroundColor = T.muted;
      }}
      onMouseLeave={(e) => {
        if (!disabled) e.currentTarget.style.backgroundColor = T.card;
      }}
      onFocus={(e) => {
        if (!disabled) e.currentTarget.style.boxShadow = FOCUS_RING;
      }}
      onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
    >
      {children}
    </button>
  );
}

// PageNumbers
// Smart ellipsis page number row  at most 7 slots.
interface PageNumbersProps {
  current: number;
  total: number;
  onChange: (page: number) => void;
}

function PageNumbers({ current, total, onChange }: PageNumbersProps) {
  const theme = useTheme();
  const T = makeT(theme);
  const R = makeR(theme);
  const FOCUS_RING = makeFocusRing(theme);
  const pages = useMemo<(number | '...')[]>(() => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const r: (number | '...')[] = [1];
    if (current > 4) r.push('...');
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) r.push(i);
    if (current < total - 3) r.push('...');
    r.push(total);
    return r;
  }, [current, total]);

  return (
    <>
      {pages.map((p, i) =>
        p === '...' ? (
          <span
            key={`e${i}`}
            aria-hidden="true"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              fontFamily: theme.fontFamilies.body,
              fontSize: '14px',
              color: T.fgSub,
            }}
          >
            
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-label={`Page ${p}`}
            aria-current={p === current ? 'page' : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              borderRadius: R.sm,
              border: p === current ? `1px solid ${T.primary}` : `1px solid ${T.border}`,
              backgroundColor: p === current ? T.primary : T.card,
              color: p === current ? T.primaryFg : T.fg,
              cursor: 'pointer',
              outline: 'none',
              fontFamily: theme.fontFamilies.body,
              fontSize: '14px',
              fontWeight: p === current ? theme.fontWeights.semibold : theme.fontWeights.regular,
              padding: 0,
              flexShrink: 0,
              transition: 'background-color 0.12s ease',
            }}
            onMouseEnter={(e) => {
              if (p !== current) e.currentTarget.style.backgroundColor = T.muted;
            }}
            onMouseLeave={(e) => {
              if (p !== current) e.currentTarget.style.backgroundColor = T.card;
            }}
            onFocus={(e) => (e.currentTarget.style.boxShadow = FOCUS_RING)}
            onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
          >
            {p}
          </button>
        )
      )}
    </>
  );
}

// ActionPositionToggle
// Two-button toggle: FormatAlignLeft / FormatAlignRight.
// Includes an "Actions" label chip on the left.
interface ActionPositionToggleProps {
  value: string;
  onChange: (value: string) => void;
}

function ActionPositionToggle({ value, onChange }: ActionPositionToggleProps) {
  const theme = useTheme();
  const T = makeT(theme);
  const R = makeR(theme);
  const FOCUS_RING = makeFocusRing(theme);
  const options = [
    {
      key: 'left',
      label: 'Left',
      icon: <FormatAlignLeftIcon aria-hidden="true" style={{ fontSize: 16 }} />,
    },
    {
      key: 'right',
      label: 'Right',
      icon: <FormatAlignRightIcon aria-hidden="true" style={{ fontSize: 16 }} />,
    },
  ];

  return (
    <div
      role="group"
      aria-label="Actions column position"
      style={{
        display: 'flex',
        border: `1px solid ${T.border}`,
        borderRadius: R.button,
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* "Actions" label chip */}
      <span
        aria-hidden="true"
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 10px',
          borderRight: `1px solid ${T.border}`,
          backgroundColor: T.muted,
          fontFamily: theme.fontFamilies.body,
          fontSize: '12px', // UI chrome overline  12px allowed
          fontWeight: theme.fontWeights.semibold,
          color: T.fgSub,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          whiteSpace: 'nowrap',
        }}
      >
        Actions
      </span>

      {options.map(({ key, label, icon }) => {
        const active = value === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            aria-pressed={active}
            aria-label={`Place actions column on the ${label.toLowerCase()}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '7px 13px',
              border: 'none',
              borderRight: key === 'left' ? `1px solid ${T.border}` : 'none',
              backgroundColor: active ? T.primary : T.card,
              color: active ? T.primaryFg : T.fg,
              cursor: 'pointer',
              fontFamily: theme.fontFamilies.body,
              fontSize: '14px',
              fontWeight: active ? theme.fontWeights.semibold : theme.fontWeights.regular,
              outline: 'none',
              transition: 'background-color 0.15s ease, color 0.15s ease',
            }}
            onMouseEnter={(e) => {
              if (!active) e.currentTarget.style.backgroundColor = T.muted;
            }}
            onMouseLeave={(e) => {
              if (!active) e.currentTarget.style.backgroundColor = T.card;
            }}
            onFocus={(e) => (e.currentTarget.style.boxShadow = FOCUS_RING)}
            onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
          >
            {icon}
            {label}
          </button>
        );
      })}
    </div>
  );
}

// PinnedBanner
// "Actions pinned left/right" informational banner  shown when table is
// overflowing horizontally and the actions column is sticky-pinned.
// Includes a PushPinIcon and an unpin/dismiss affordance (CloseIcon button).
interface PinnedBannerProps {
  actionPosition: string;
  isOverflowing: boolean;
  onUnpin?: () => void;
}

function PinnedBanner({ actionPosition, isOverflowing, onUnpin }: PinnedBannerProps) {
  const theme = useTheme();
  const T = makeT(theme);
  const R = makeR(theme);
  const FOCUS_RING = makeFocusRing(theme);
  if (!isOverflowing) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        marginBottom: '8px',
        borderRadius: R.card,
        backgroundColor: `${T.primary}12`,
        border: `1px solid ${T.primary}2e`,
      }}
    >
      <PushPinIcon aria-hidden="true" style={{ fontSize: 14, color: T.primary, flexShrink: 0 }} />
      <span
        style={{
          fontFamily: theme.fontFamilies.body,
          fontSize: '14px',
          color: T.primary,
          fontWeight: theme.fontWeights.medium,
          flex: 1,
          lineHeight: '1.5',
        }}
      >
        Actions column is pinned to the{' '}
        <strong style={{ fontWeight: theme.fontWeights.semibold }}>{actionPosition}</strong>  scroll
        horizontally to view all columns.
      </span>
      {onUnpin && (
        <button
          onClick={onUnpin}
          aria-label="Unpin actions column"
          title="Unpin"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20px',
            height: '20px',
            border: 'none',
            background: 'transparent',
            color: T.primary,
            cursor: 'pointer',
            outline: 'none',
            padding: 0,
            flexShrink: 0,
            borderRadius: theme.customBorderRadius.default,
          }}
          onFocus={(e) => (e.currentTarget.style.boxShadow = FOCUS_RING)}
          onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
        >
          <CloseIcon style={{ fontSize: 14 }} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

// SelectionToggle
// Inline banner shown in the toolbar when one or more rows are selected.
// Displays: selected count - "Select all N" button - "Clear" button.
interface SelectionToggleProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll?: () => void;
  onClear?: () => void;
}

function SelectionToggle({
  selectedCount,
  totalCount,
  onSelectAll,
  onClear,
}: SelectionToggleProps) {
  const theme = useTheme();
  const T = makeT(theme);
  const FOCUS_RING = makeFocusRing(theme);
  if (selectedCount === 0) return null;

  const linkStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    padding: '0 2px',
    cursor: 'pointer',
    fontFamily: theme.fontFamilies.body,
    fontSize: '14px',
    fontWeight: theme.fontWeights.semibold,
    color: T.primary,
    outline: 'none',
    lineHeight: '1.5',
    textDecoration: 'underline',
    textUnderlineOffset: '2px',
    flexShrink: 0,
  };

  return (
    <div
      aria-live="polite"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        flexShrink: 0,
        flexWrap: 'nowrap',
      }}
    >
      {/* Count */}
      <span
        style={{
          fontFamily: theme.fontFamilies.body,
          fontSize: '14px',
          fontWeight: theme.fontWeights.semibold,
          color: T.primary,
          whiteSpace: 'nowrap',
        }}
      >
        {selectedCount} selected
      </span>

      {/* Select all N */}
      {onSelectAll && selectedCount < totalCount && (
        <>
          <span aria-hidden="true" style={{ color: T.fgSub, fontSize: '14px' }}>
            -
          </span>
          <button
            onClick={onSelectAll}
            style={linkStyle}
            onFocus={(e) => (e.currentTarget.style.boxShadow = FOCUS_RING)}
            onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
          >
            Select all {totalCount}
          </button>
        </>
      )}

      {/* Clear */}
      {onClear && (
        <>
          <span aria-hidden="true" style={{ color: T.fgSub, fontSize: '14px' }}>
            -
          </span>
          <button
            onClick={onClear}
            style={{
              ...linkStyle,
              color: T.fgSub,
              textDecoration: 'none',
              fontWeight: theme.fontWeights.regular,
            }}
            onFocus={(e) => (e.currentTarget.style.boxShadow = FOCUS_RING)}
            onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
          >
            Clear
          </button>
        </>
      )}
    </div>
  );
}

// ActionIconButton
// Standardized icon button for the Actions column. Wraps every icon in an
// IconTooltip so users always get a label on hover.
interface ActionIconButtonProps {
  /** Tooltip label shown on hover */
  label: string;
  /** The icon element to render */
  icon: React.ReactElement;
  /** Click handler */
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  disabled?: boolean;
  /** Icon size (default 18) */
  size?: number;
  /** Icon color (default semantic.text.secondary) */
  color?: string;
}

function ActionIconButton({
  label,
  icon,
  onClick,
  disabled = false,
  size = 18,
  color,
}: ActionIconButtonProps) {
  const theme = useTheme();
  const FOCUS_RING = makeFocusRing(theme);
  const resolvedColor = color ?? theme.semantic.text.secondary;
  return (
    <ActionIconButtonRoot
      component="button"
      onClick={disabled ? undefined : onClick}
      aria-label={label}
      aria-disabled={disabled || undefined}
      sx={{
        opacity: disabled ? 0.45 : undefined,
        pointerEvents: disabled ? 'none' : undefined,
      }}
    >
      <IconTooltip
        title={label}
        icon={React.cloneElement(icon, { size, color: resolvedColor } as Record<string, unknown>)}
        size={size}
        color={resolvedColor}
        placement="top"
      />
    </ActionIconButtonRoot>
  );
}

// Exports  sub-components only (main DataTable added in a later task)
export {
  getInitials,
  CHECKBOX_CHECK_PATH,
  makeT,
  makeR,
  makeFocusRing,
  TableCheckbox,
  SortIcon,
  ResizeHandle,
  HeaderLabelSpan,
  ColumnVisibilityMenu,
  PaginationBtn,
  PageNumbers,
  ActionPositionToggle,
  PinnedBanner,
  SelectionToggle,
  ActionIconButton,
};

// DataTable  main export
export default function DataTable<T = Record<string, unknown>>({
  columns,
  data,
  title,
  searchable = true,
  selectable = false,
  hideToolbar = false,
  showSearch,
  showColumnVisibility = true,
  actionsColumnPosition = 'right',
  inlineAddVariant = 'footer',
  inlineAddRow,
  onAddClick,
  addLabel = 'Add',
  wrapCells = false,
  defaultPageSize = 10,
  pageSizeOptions = [10, 25, 50],
  pagination,
  showPagination = true,
  hideFooter = false,
  search: controlledSearch,
  sort: controlledSort,
  onSortChange,
  externalSorting,
  onSelectionChange,
  onRowSelectionChange,
  onRowClick,
  getRowId,
  selectedRowId,
  getRowProps,
  getHeaderProps,
  emptyMessage = 'No results',
  noDataMessage,
  loading = false,
  isLoading,
  searchPlaceholder = 'Search',
  actionCell = null,
  rowActions,
  editMode,
  hideActionsColumn,
  stickyActionsColumn = true,
  stickyFirstColumn = false,
  tableId: tableIdProp,
  tableContainerSx,
  TableFooterComponent,
  SearchActionComponent,
  draggableRows = false,
  onRowDragStart,
  onRowDragOver,
  onRowDrop,
  onRowDragEnd,
  onRowReorder,
  sx = {},
}: DataTableProps<T>) {
  //  Theme 
  const theme = useTheme();
  const T = makeT(theme);
  const R = makeR(theme);
  const FOCUS_RING = makeFocusRing(theme);

  //  Actions column visibility 
  // `editMode === 'always-editable'` implies there's no per-row action icon
  // (every cell is already interactive and auto-saves). `hideActionsColumn`
  // is the explicit escape hatch. When either is true, every header/body
  // block below treats `actionPosition` as 'none' so no Actions column
  // is rendered.
  const showActionsColumn =
    !(hideActionsColumn || editMode === 'always-editable') &&
    (actionCell != null || (rowActions?.length ?? 0) > 0);

  //  Unique id for this table instance 
  const generatedTableId = useId();
  const tableId = tableIdProp ?? generatedTableId;
  const resolvedLoading = isLoading ?? loading;
  const resolvedEmptyMessage = noDataMessage ?? emptyMessage;
  const resolvedSearchable = showSearch ?? searchable;
  const usesServerPagination = pagination != null;
  const usesControlledSearch = controlledSearch != null;
  const controlledSortState = externalSorting
    ? { field: externalSorting.sortBy ?? null, direction: externalSorting.sortOrder ?? null }
    : controlledSort;

  //  Aria live region 
  const liveRef = useRef<HTMLDivElement>(null);
  const announce = useCallback((msg: string) => {
    if (liveRef.current) {
      liveRef.current.textContent = '';
      setTimeout(() => {
        if (liveRef.current) liveRef.current.textContent = msg;
      }, 50);
    }
  }, []);

  //  Core state 
  const [internalSearch, setInternalSearch] = useState('');
  const [internalPage, setInternalPage] = useState(1);
  const [internalPageSize, setInternalPageSize] = useState(defaultPageSize);
  const [internalSort, setInternalSort] = useState<DataTableSortState>({
    field: null,
    direction: null,
  });
  const search = controlledSearch?.value ?? internalSearch;
  const page = pagination?.page ?? internalPage;
  const pageSize = pagination?.pageSize ?? internalPageSize;
  const sort = controlledSortState ?? internalSort;
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    () => new Set(columns.filter((c) => c.defaultVisible !== false).map((c) => c.id))
  );
  const [columnOrder, setColumnOrder] = useState<string[]>(() => columns.map((c) => c.id));
  // Only seed colWidths for columns with an explicit `width` in their
  // ColumnDef. Flex columns (c.width == null) must NOT start with a
  // concrete width  otherwise the flex-detection in the colgroup (below)
  // can never identify them, the colgroup locks them to `width: 100%`,
  // and the resize handle silently no-ops. Once a user drags a flex
  // column, setColWidths populates its entry and the column switches to
  // its persisted width from that point on.
  const [colWidths, setColWidths] = useState<Record<string, number>>(() =>
    Object.fromEntries(
      columns
        .filter((c) => c.width != null)
        .map((c) => [c.id, c.width as number]),
    )
  );
  const [selectedRows, setSelectedRows] = useState<Set<unknown>>(new Set());
  const [actionPosition, setActionPosition] = useState<'left' | 'right'>(actionsColumnPosition);
  const [rowDensity, setRowDensity] = useState<'compact' | 'comfortable' | 'spacious'>('spacious');
  const [draggedRow, setDraggedRow] = useState<{ row: T; rowIndex: number; absoluteIndex: number } | null>(null);

  // Row density padding map  header row is fixed, only data rows change
  const cellPy = rowDensity === 'compact' ? '4px' : rowDensity === 'comfortable' ? '10px' : '16px';
  const headerPy = '10px'; // header padding is constant across all densities
  const cellPx = '12px';

  //  Drag-reorder 
  const dragColIdRef = useRef<string | null>(null);
  const [dragActiveColId, setDragActiveColId] = useState<string | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  //  Scroll shadows 
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasLeft, setHasLeft] = useState(false);
  const [hasRight, setHasRight] = useState(false);

  //  Derived: getValue 
  const getValue = useCallback((row: T, col: ColumnDef<T>): unknown => {
    if (typeof col.accessor === 'function') return col.accessor(row);
    if (typeof col.accessor === 'string') return (row as Record<string, unknown>)[col.accessor];
    return (row as Record<string, unknown>)[col.id];
  }, []);

  //  Derived: filtered 
  const filtered = useMemo(() => {
    if (usesControlledSearch || usesServerPagination) return data;
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter((row) =>
      columns.some((col) => {
        const v = getValue(row, col);
        if (v == null) return false;
        const str = Array.isArray(v) ? v.join(' ') : String(v);
        return str.toLowerCase().includes(q);
      })
    );
  }, [data, search, columns, getValue, usesControlledSearch, usesServerPagination]);

  //  Derived: sorted 
  const sorted = useMemo(() => {
    if (controlledSortState || usesServerPagination) return filtered;
    if (!sort.field || !sort.direction) return filtered;
    const col = columns.find((c) => c.id === sort.field);
    return [...filtered].sort((a, b) => {
      const av = getValue(a, col ?? ({ id: sort.field } as ColumnDef<T>));
      const bv = getValue(b, col ?? ({ id: sort.field } as ColumnDef<T>));
      const as = Array.isArray(av) ? av.join(', ') : String(av ?? '');
      const bs = Array.isArray(bv) ? bv.join(', ') : String(bv ?? '');
      const cmp = as.localeCompare(bs, undefined, { numeric: true });
      return sort.direction === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sort, columns, getValue, controlledSortState, usesServerPagination]);

  //  Derived: pagination 
  const totalRows = pagination?.total ?? sorted.length;
  const totalPages = Math.max(1, pagination?.totalPages ?? Math.ceil(totalRows / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = usesServerPagination ? sorted : sorted.slice((safePage - 1) * pageSize, safePage * pageSize);
  const startRow = totalRows === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endRow = Math.min(safePage * pageSize, totalRows);

  const setPage = useCallback(
    (nextPage: number | ((page: number) => number)) => {
      const resolvedPage = typeof nextPage === 'function' ? nextPage(safePage) : nextPage;
      if (pagination) pagination.onPageChange(resolvedPage, pageSize);
      else setInternalPage(resolvedPage);
    },
    [pagination, pageSize, safePage],
  );

  const setPageSize = useCallback(
    (nextPageSize: number) => {
      if (pagination) pagination.onPageChange(1, nextPageSize);
      else {
        setInternalPageSize(nextPageSize);
        setInternalPage(1);
      }
    },
    [pagination],
  );

  const setSearch = useCallback(
    (nextSearch: string) => {
      if (controlledSearch) controlledSearch.onChange(nextSearch);
      else setInternalSearch(nextSearch);
    },
    [controlledSearch],
  );

  const setSort = useCallback(
    (updater: DataTableSortState | ((prev: DataTableSortState) => DataTableSortState)) => {
      const next = typeof updater === 'function' ? updater(sort) : updater;
      if (externalSorting) {
        if (next.field && next.direction) externalSorting.onSortChange(next.field, next.direction);
      } else if (onSortChange) {
        onSortChange(next);
      } else {
        setInternalSort(next);
      }
    },
    [externalSorting, onSortChange, sort],
  );

  const resolveRowProps = useCallback(
    (row: T, rowIndex: number): React.HTMLAttributes<HTMLTableRowElement> => {
      if (!getRowProps) return {};
      return typeof getRowProps === 'function' ? getRowProps(row, rowIndex) : getRowProps;
    },
    [getRowProps],
  );

  const resolveHeaderProps = useCallback(
    (column: ColumnDef<T>, columnIndex: number): React.ThHTMLAttributes<HTMLTableCellElement> => {
      const tableProps = !getHeaderProps
        ? {}
        : typeof getHeaderProps === 'function'
          ? getHeaderProps(column, columnIndex)
          : getHeaderProps;
      const columnProps = column.getHeaderProps?.(column, columnIndex) ?? {};
      return { ...tableProps, ...columnProps };
    },
    [getHeaderProps],
  );

  const renderActionContent = useCallback(
    (row: T) => {
      const custom = actionCell?.(row);
      const visibleActions = (rowActions ?? []).filter((action) => !resolveBoolean(action.hidden, row));
      if (!custom && visibleActions.length === 0) return null;
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          {custom}
          {visibleActions.map((action) => {
            const disabled = resolveBoolean(action.disabled, row);
            return (
              <ActionIconButton
                key={action.id}
                icon={action.icon}
                label={action.label}
                disabled={disabled}
                onClick={(event) => {
                  event.stopPropagation();
                  if (!disabled) action.onClick(row);
                }}
                color={action.color}
              />
            );
          })}
        </div>
      );
    },
    [actionCell, rowActions],
  );

  // Reset page on search/pageSize change
  useEffect(() => {
    if (!pagination) setInternalPage(1);
  }, [search, pageSize, pagination]);

  //  Row key helper
  const rowKey = useCallback(
    (row: T, i: number): string =>
      getRowId?.(row, i) ??
      String((row as Record<string, unknown>).id ?? (row as Record<string, unknown>)._id ?? i),
    [getRowId],
  );

  // Notify parent on selection change
  useEffect(() => {
    const handler = onSelectionChange ?? onRowSelectionChange;
    if (!handler) return;
    handler(data.filter((r, i) => selectedRows.has(rowKey(r, i))));
  }, [data, onRowSelectionChange, onSelectionChange, rowKey, selectedRows]);

  //  Derived: orderedCols 
  const orderedCols = useMemo(() => {
    const colMap = Object.fromEntries(columns.map((c) => [c.id, c]));
    return columnOrder.filter((id) => visibleColumns.has(id) && colMap[id]).map((id) => colMap[id]);
  }, [columns, columnOrder, visibleColumns]);

  // The single flex column  absorbs remaining horizontal space via
  // `<col width: 100%>`. Shared between the colgroup (which sets the 100%
  // width) and the `<th>` renderer (which must NOT pin its width so the
  // 100% rule applies). A column is "flex" when it has neither an explicit
  // ColumnDef `width` nor a user-resized `colWidths` entry; once the user
  // drags a flex column, its colWidths entry is populated and flex shifts
  // to the next eligible column. Fallback: if every column has a concrete
  // width, the trailing column takes the flex slot so the table still
  // fills its wrapper.
  const flexColId = useMemo(() => {
    if (orderedCols.length === 0) return null;
    const firstFlex = orderedCols.find((c) => (colWidths[c.id] ?? c.width) == null);
    if (firstFlex) return firstFlex.id;
    return orderedCols[orderedCols.length - 1].id;
  }, [orderedCols, colWidths]);

  //  Handlers 
  const handleSort = useCallback(
    (colId: string) => {
      let msg = '';
      const dir: DataTableSortDirection =
        sort.field !== colId
          ? 'asc'
          : sort.direction === 'asc'
            ? 'desc'
            : sort.direction === 'desc'
              ? null
              : 'asc';
      const next = { field: dir ? colId : null, direction: dir };
      msg = dir ? `Sorted ${dir === 'asc' ? 'ascending' : 'descending'}` : 'Sort cleared';

      if (externalSorting) {
        if (dir) externalSorting.onSortChange(colId, dir);
      } else if (onSortChange) {
        onSortChange(next);
      } else if (!controlledSort) {
        setInternalSort(next);
      }
      // announce after state update to avoid firing twice in Strict Mode
      setTimeout(() => announce(msg), 0);
      setPage(1);
    },
    [announce, controlledSort, externalSorting, onSortChange, setPage, sort]
  );

  const handleResize = useCallback(
    (colId: string, newWidth: number) => {
      setColWidths((prev) => ({
        ...prev,
        [colId]: Math.max(newWidth, columns.find((c) => c.id === colId)?.minWidth ?? 50),
      }));
    },
    [columns]
  );

  const handleAutoFit = useCallback(
    (colId: string) => {
      const col = columns.find((c) => c.id === colId);
      if (col) setColWidths((prev) => ({ ...prev, [colId]: col.width ?? 140 }));
    },
    [columns]
  );

  // Column drag-reorder
  const handleColDragStart = useCallback((colId: string) => {
    dragColIdRef.current = colId;
    setDragActiveColId(colId);
  }, []);

  const handleColDragOver = useCallback((e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDropIndex(idx);
  }, []);

  const handleColDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const fromId = dragColIdRef.current;
      if (!fromId || dropIndex === null) {
        setDragActiveColId(null);
        setDropIndex(null);
        return;
      }
      setColumnOrder((prev) => {
        const withoutFrom = prev.filter((id) => id !== fromId);
        const visibleWithout = orderedCols.filter((c) => c.id !== fromId);
        let insertBeforeId: string | null = null;
        if (dropIndex === 0) insertBeforeId = visibleWithout[0]?.id ?? null;
        else if (dropIndex < visibleWithout.length)
          insertBeforeId = visibleWithout[dropIndex]?.id ?? null;
        const result = [...withoutFrom];
        if (insertBeforeId) {
          const idx = result.indexOf(insertBeforeId);
          result.splice(idx === -1 ? result.length : idx, 0, fromId);
        } else {
          const lastId = visibleWithout[visibleWithout.length - 1]?.id;
          const idx = lastId ? result.indexOf(lastId) : -1;
          result.splice(idx + 1, 0, fromId);
        }
        return result;
      });
      dragColIdRef.current = null;
      setDragActiveColId(null);
      setDropIndex(null);
    },
    [dropIndex, orderedCols]
  );

  const handleColDragEnd = useCallback(() => {
    dragColIdRef.current = null;
    setDragActiveColId(null);
    setDropIndex(null);
  }, []);

  //  Selection state 
  const allPageSel =
    pageRows.length > 0 &&
    pageRows.every((r, i) => selectedRows.has(rowKey(r, (safePage - 1) * pageSize + i)));
  const somePageSel =
    !allPageSel &&
    pageRows.some((r, i) => selectedRows.has(rowKey(r, (safePage - 1) * pageSize + i)));

  const toggleAll = useCallback(
    (checked: boolean) => {
      setSelectedRows((prev) => {
        const next = new Set(prev);
        pageRows.forEach((r, i) => {
          const k = rowKey(r, (safePage - 1) * pageSize + i);
          checked ? next.add(k) : next.delete(k);
        });
        announce(checked ? `${pageRows.length} rows selected` : 'Selection cleared');
        return next;
      });
    },
    [pageRows, safePage, pageSize, announce]
  );

  const toggleRow = useCallback((key: unknown, checked: boolean) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      checked ? next.add(key) : next.delete(key);
      return next;
    });
  }, []);

  //  Scroll shadows 
  // `hasRight` drives the Actions-column inset shadow that cues the user
  // the table extends further than the visible viewport. It must react to
  // BOTH the container resizing (viewport change) AND the table's own
  // width changing (rows added, column resized, data loaded)  the latter
  // keeps the container's own box the same, so observing only the scroll
  // container misses it. Observe the inner table as well.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const check = () => {
      setHasLeft(el.scrollLeft > 4);
      setHasRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };
    check();
    el.addEventListener('scroll', check, { passive: true });
    const ro = new ResizeObserver(check);
    ro.observe(el);
    const table = el.querySelector('table');
    if (table) ro.observe(table);
    return () => {
      el.removeEventListener('scroll', check);
      ro.disconnect();
    };
  }, [orderedCols, colWidths, pageRows.length]);

  const hasLeftActionsColumn = showActionsColumn && actionPosition === 'left';
  const hasRightActionsColumn = showActionsColumn && actionPosition === 'right';
  const stickyFirstColId = stickyFirstColumn ? orderedCols[0]?.id : undefined;
  const firstColumnLeft = (selectable ? 48 : 0) + (hasLeftActionsColumn ? 48 : 0);
  const totalColumnCount =
    orderedCols.length + (selectable ? 1 : 0) + (showActionsColumn ? 1 : 0);
  const hasColumnFooter = orderedCols.some((col) => col.footer != null);

  const renderRowActions = useCallback(
    (row: T) => {
      if (actionCell) return actionCell(row);
      if (!rowActions?.length) return null;

      return rowActions
        .filter((action) => !resolveBoolean(action.hidden, row))
        .map((action) => {
          const disabled = resolveBoolean(action.disabled, row);
          return (
            <ActionIconButton
              key={action.id}
              label={action.label}
              icon={action.icon}
              color={action.color}
              onClick={
                disabled
                  ? undefined
                  : () => {
                      action.onClick(row);
                    }
              }
            />
          );
        });
    },
    [actionCell, rowActions],
  );

  //  Render 
  return (
    <DataTableRoot
      sx={sx}
    >
      {/* Aria live region */}
      <div
        ref={liveRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          whiteSpace: 'nowrap',
        }}
      />

      {/*  Toolbar  */}
      {!hideToolbar && (
        <Toolbar>
          {resolvedSearchable && (
            <TextInputField
              placeholder={controlledSearch?.placeholder ?? searchPlaceholder}
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              startIcon={<SearchIcon size={16} />}
              sx={{ width: 220, '& > div:last-of-type': { bgcolor: 'transparent', py: 0, height: theme.inputHeights.base, boxSizing: 'border-box' } }}
            />
          )}
          {SearchActionComponent}
          {selectable && selectedRows.size > 0 && (
            <SelectionToggle
              selectedCount={selectedRows.size}
              totalCount={totalRows}
              onSelectAll={() => setSelectedRows(new Set(sorted.map((r, i) => rowKey(r, i))))}
              onClear={() => {
                setSelectedRows(new Set());
                announce('Selection cleared');
              }}
            />
          )}
          <ToolbarSpacer />
          {showActionsColumn && (
            <SelectField
              variant="outline"
              placeholder="Actions"
              tooltip="Actions column position"
              value={actionPosition}
              onChange={(v: string) => setActionPosition(v as 'left' | 'right')}
              options={[
                { value: 'left', label: 'Left' },
                { value: 'right', label: 'Right' },
              ]}
            />
          )}
          <SelectField
            variant="outline"
            placeholder="Row Density"
            tooltip="Adjust row spacing"
            value={rowDensity}
            onChange={(v: string) => setRowDensity(v as 'compact' | 'comfortable' | 'spacious')}
            options={[
              { value: 'compact', label: 'Compact' },
              { value: 'comfortable', label: 'Comfortable' },
              { value: 'spacious', label: 'Spacious' },
            ]}
          />
          {showColumnVisibility && (
            <ColumnVisibilityMenu
              columns={columns as ColumnDef[]}
              visibleColumns={visibleColumns}
              onSave={(next) => setVisibleColumns(next)}
            />
          )}
        </Toolbar>
      )}

      {/*  Scroll container  */}
      <ScrollContainerOuter>
        {hasLeft && !selectable && !(showActionsColumn && actionPosition === 'left') && (
          <ScrollShadow side="left" />
        )}
        {hasRight && !(showActionsColumn && actionPosition === 'right') && (
          <ScrollShadow side="right" />
        )}

        <ScrollContainerInner
          ref={scrollRef}
          data-has-right-overflow={hasRight ? 'true' : undefined}
          sx={tableContainerSx}
        >
          {orderedCols.length === 0 ? (
            <EmptyStateContainer>
              {/* Icon */}
              <EmptyStateIconCircle>
                <SettingsAdjustIcon size={24} color={theme.semantic.primary.main} />
              </EmptyStateIconCircle>

              {/* Title */}
              <EmptyStateTitle>
                No columns visible
              </EmptyStateTitle>

              {/* Description */}
              <EmptyStateDescription>
                {columns.filter((c) => c.id !== 'actions').length} column{columns.filter((c) => c.id !== 'actions').length === 1 ? '' : 's'} {columns.filter((c) => c.id !== 'actions').length === 1 ? 'is' : 'are'} currently hidden. Choose an option below to restore them.
              </EmptyStateDescription>

              {/* Action buttons */}
              <EmptyStateActions>
                <BaseButton
                  variant="outline"
                  color="neutral"
                  startIcon={<CheckmarkIcon size={18} />}
                  onClick={() => {
                    const defaults = new Set(columns.filter((c) => c.id !== 'actions' && c.defaultVisible !== false).map((c) => c.id));
                    setVisibleColumns(defaults);
                  }}
                >
                  Reset to Default
                </BaseButton>
                <BaseButton
                  variant="filled"
                  color="primary"
                  startIcon={<ViewOutlineIcon size={18} />}
                  onClick={() => {
                    const all = new Set(columns.filter((c) => c.id !== 'actions').map((c) => c.id));
                    setVisibleColumns(all);
                  }}
                >
                  Show All Columns
                </BaseButton>
              </EmptyStateActions>
            </EmptyStateContainer>
          ) : (
          <table
            id={tableId}
            role="grid"
            aria-label={title ?? 'Data table'}
            style={{
              borderCollapse: 'separate',
              borderSpacing: 0,
              width: '100%',
              tableLayout: 'auto',
              fontFamily: theme.fontFamilies.body,
            }}
          >
            {/*
              Column width distribution:
              - Columns with an explicit `width` in their ColumnDef keep
                that width (or the resized value from colWidths).
              - The LEFTMOST column without an explicit `width` becomes the
                flex column  it absorbs the remaining horizontal space via
                `width: 100%`. This gives consumers control: specify `width`
                on compact columns (dates, actions, status) and leave `width`
                off on the main content column (name, title, description).
              - Fallback: if every column has an explicit `width`, the last
                column gets `100%` so the table still fills its wrapper.
            */}
            <colgroup>
              {selectable && <col style={{ width: 48 }} />}
              {showActionsColumn && actionPosition === 'left' && <col style={{ width: 48 }} />}
              {orderedCols.map((col) => (
                <col
                  key={col.id}
                  style={{
                    width:
                      col.id === flexColId
                        ? '100%'
                        : (colWidths[col.id] ?? col.width ?? 'auto'),
                  }}
                />
              ))}
              {showActionsColumn && actionPosition === 'right' && (
                // Explicit pixel width (not 0 / auto) so that `tableLayout:
                // auto` EXCLUDES this column from redistributing freed
                // horizontal space  when the user shrinks a data column,
                // the extras go to the other flexible columns (covered,
                // date, etc.) rather than ballooning the Actions cell.
                // 48px fits a single icon comfortably (20px icon + 2-14px
                // padding). Tables with multiple action icons can expand
                // naturally past this in auto layout  it's a MIN hint,
                // not a hard ceiling.
                <col style={{ width: 48 }} />
              )}
            </colgroup>

            {/*  thead  */}
            <thead>
              <tr style={{ backgroundColor: T.stickyStripe }}>
                {selectable && (
                  <th
                    scope="col"
                    style={{
                      width: 48,
                      minWidth: 48,
                      maxWidth: 48,
                      boxSizing: 'border-box',
                      padding: `${headerPy} ${cellPx}`,
                      textAlign: 'center',
                      position: 'sticky',
                      top: 0,
                      left: 0,
                      zIndex: 3,
                      backgroundColor: T.stickyStripe,
                      borderRight: `1px solid ${T.border}`,
                      borderBottom: `1px solid ${T.border}`,
                      boxShadow: hasLeft ? '6px 0 12px var(--sc-dt-sticky-shadow)' : 'none',
                    }}
                  >
                    <TableCheckbox
                      id={`${tableId}-select-all`}
                      checked={allPageSel}
                      indeterminate={somePageSel}
                      onChange={toggleAll}
                      label="Select all rows on this page"
                    />
                  </th>
                )}
                {showActionsColumn && actionPosition === 'left' && (
                  <th
                    scope="col"
                    style={{
                      width: 0,
                      whiteSpace: 'nowrap',
                      padding: `${headerPy} ${cellPx}`,
                      position: stickyActionsColumn ? 'sticky' : undefined,
                      top: 0,
                      left: stickyActionsColumn ? (selectable ? 48 : 0) : undefined,
                      zIndex: 3,
                      backgroundColor: T.stickyStripe,
                      borderRight: `1px solid ${T.border}`,
                      borderBottom: `1px solid ${T.border}`,
                      textAlign: 'center',
                      boxShadow: stickyActionsColumn && hasLeft ? '6px 0 12px var(--sc-dt-sticky-shadow)' : 'none',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: theme.fontWeights.semibold,
                        color: T.fgSub,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                      }}
                    >
                      Actions
                    </span>
                  </th>
                )}
                {orderedCols.map((col, colIdx) => {
                  // `<col width>` is only a hint under `tableLayout: auto`
                  //  the browser's auto-layout algorithm can and does
                  // override it based on min-content of cells and the
                  // `width: 100%` flex column. Pinning width + minWidth
                  // + maxWidth on the non-flex `<th>` forces the browser
                  // to respect the target width even in auto layout, so
                  // dragging the resize handle actually changes the
                  // rendered column width. The flex column must leave
                  // these unset so its `<col width: 100%>` still absorbs
                  // remaining space.
                  const isFlex = col.id === flexColId;
                  const pinnedWidth = colWidths[col.id] ?? col.width;
                  const effectiveMinWidth = col.minWidth ?? 50;
                  const localHeaderProps =
                    typeof getHeaderProps === 'function'
                      ? getHeaderProps(col, colIdx)
                      : getHeaderProps;
                  const columnHeaderProps = col.getHeaderProps?.(col, colIdx);
                  const mergedHeaderProps = {
                    ...localHeaderProps,
                    ...columnHeaderProps,
                    style: mergeStyle(
                      mergeStyle(
                        (localHeaderProps?.style ?? {}) as React.CSSProperties,
                        columnHeaderProps?.style,
                      ),
                    ),
                  };
                  return (
                  <th
                    {...mergedHeaderProps}
                    key={col.id}
                    scope="col"
                    draggable={true}
                    onDragStart={() => handleColDragStart(col.id)}
                    onDragOver={(e) => handleColDragOver(e, colIdx)}
                    onDrop={handleColDrop}
                    onDragEnd={handleColDragEnd}
                    aria-sort={
                      sort.field === col.id
                        ? sort.direction === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                    }
                    style={mergeStyle({
                      padding: `${headerPy} 8px ${headerPy} ${cellPx}`,
                      position: stickyFirstColId === col.id ? 'sticky' : 'sticky',
                      top: 0,
                      left: stickyFirstColId === col.id ? firstColumnLeft : undefined,
                      zIndex: stickyFirstColId === col.id ? 3 : 1,
                      backgroundColor: dragActiveColId === col.id ? `${T.primary}0d` : T.stickyStripe,
                      borderRight:
                        dropIndex === colIdx ? `2px solid ${T.primary}` : `1px solid ${T.border}`,
                      borderBottom: `1px solid ${T.border}`,
                      boxShadow:
                        stickyFirstColId === col.id && hasLeft
                          ? '6px 0 12px var(--sc-dt-sticky-shadow)'
                          : undefined,
                      cursor: 'grab',
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                      transition: 'background-color 0.15s',
                      width: !isFlex && pinnedWidth != null ? pinnedWidth : undefined,
                      minWidth:
                        !isFlex && pinnedWidth != null ? pinnedWidth : effectiveMinWidth,
                      maxWidth: !isFlex && pinnedWidth != null ? pinnedWidth : undefined,
                    }, mergedHeaderProps.style)}
                  >
                    <HeaderCellInner>
                      <DragIndicatorIcon
                        style={{ fontSize: 14, color: T.headerFg, flexShrink: 0, cursor: 'grab' }}
                        aria-hidden="true"
                      />
                      {col.sortable !== false ? (
                        <SortableHeaderButton
                          component="button"
                          onClick={() => handleSort(col.id)}
                        >
                          {col.headerCell ? (
                            col.headerCell(col)
                          ) : (
                          <HeaderLabelSpan>
                            <span
                              style={{
                                ...theme.customTypography.overline,
                                fontSize: 12,
                                color: T.fgSub,
                              }}
                            >
                              {col.header}
                            </span>
                          </HeaderLabelSpan>
                          )}
                          {col.description != null && (
                            // Wrapper stops clicks from bubbling into the
                            // sort button so users can hover the help icon
                            // without accidentally triggering a sort.
                            <Box
                              component="span"
                              onClick={(e) => e.stopPropagation()}
                              sx={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}
                            >
                              <IconTooltip
                                title={col.description}
                                icon={<HelpFilledIcon />}
                                size={16}
                              />
                            </Box>
                          )}
                          <SortIcon direction={sort.field === col.id ? sort.direction : null} />
                        </SortableHeaderButton>
                      ) : (
                        <>
                          {col.headerCell ? (
                            col.headerCell(col)
                          ) : (
                          <HeaderLabelSpan>
                            <span
                              style={{
                                ...theme.customTypography.overline,
                                fontSize: 12,
                                color: T.fgSub,
                              }}
                            >
                              {col.header}
                            </span>
                          </HeaderLabelSpan>
                          )}
                          {col.description != null && (
                            <IconTooltip
                              title={col.description}
                              icon={<HelpFilledIcon />}
                              size={16}
                            />
                          )}
                        </>
                      )}
                    </HeaderCellInner>
                    {col.resizable !== false && (
                      <ResizeHandle
                        colId={col.id}
                        onResize={handleResize}
                        onAutoFit={handleAutoFit}
                      />
                    )}
                  </th>
                  );
                })}
                {showActionsColumn && actionPosition === 'right' && (
                  <th
                    scope="col"
                    style={{
                      width: 0,
                      whiteSpace: 'nowrap',
                      padding: `${headerPy} ${cellPx}`,
                      position: stickyActionsColumn ? 'sticky' : undefined,
                      top: 0,
                      right: stickyActionsColumn ? 0 : undefined,
                      zIndex: 3,
                      backgroundColor: T.stickyStripe,
                      borderBottom: `1px solid ${T.border}`,
                      textAlign: 'center',
                      boxShadow: stickyActionsColumn && hasRight ? '-6px 0 12px var(--sc-dt-sticky-shadow)' : 'none',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: theme.fontWeights.semibold,
                        color: T.fgSub,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                      }}
                    >
                      Actions
                    </span>
                  </th>
                )}
              </tr>
            </thead>

            {/*  tbody  */}
            <tbody>
              {resolvedLoading ? (
                Array.from({ length: pageSize }).map((_, i) => (
                  <tr key={i}>
                    {selectable && (
                      <td style={{ padding: `${cellPy} ${cellPx}`, position: 'sticky', left: 0, zIndex: 1, backgroundColor: T.rowBase, borderRight: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
                        <SkeletonCheckboxBox />
                      </td>
                    )}
                    {showActionsColumn && actionPosition === 'left' && (
                      <td style={{ padding: `${cellPy} ${cellPx}`, borderBottom: `1px solid ${T.border}` }}>
                        <SkeletonBar barWidth="60%" />
                      </td>
                    )}
                    {orderedCols.map((col) => (
                      <td key={col.id} style={{ padding: `${cellPy} ${cellPx}`, borderBottom: `1px solid ${T.border}` }}>
                        <SkeletonBarAnimated />
                      </td>
                    ))}
                    {showActionsColumn && actionPosition === 'right' && (
                      <td style={{ padding: `${cellPy} ${cellPx}`, borderBottom: `1px solid ${T.border}` }}>
                        <SkeletonBar barWidth="60%" />
                      </td>
                    )}
                  </tr>
                ))
              ) : pageRows.length === 0 ? (
                // Empty-state suppression rules:
                //
                // 1. `'footer'` variant + `inlineAddRow` present  suppress the
                //    empty state entirely (the user is mid-way through adding
                //    the first record; showing both is confusing).
                //
                // 2. `'inline'` variant  render a simpler, single-line empty
                //    state (no icon, no "try adjusting your filters" hint)
                //    above the drafts + trigger row, matching modal UX.
                //
                // 3. Default (has data but filter matched none)  full empty
                //    state with the "try adjusting your search" description.
                data.length === 0 && inlineAddVariant === 'footer' && inlineAddRow ? null : (
                  <tr>
                    <td
                      colSpan={totalColumnCount}
                      // Empty-state row needs its own bottom border: data
                      // rows draw their divider via each td's borderBottom,
                      // but the empty-state td has zero padding/borders by
                      // default. Without this, an empty table flanked by the
                      // InlineAddTriggerRow (which intentionally has no
                      // borderTop) shows no divider between the two rows.
                      style={{ padding: 0, borderBottom: `1px solid ${T.border}` }}
                    >
                      {inlineAddVariant === 'inline' ? (
                        // Inline-variant empty state  reuses the shared
                        // blue-duotone circle from the default variant so the
                        // icon treatment stays consistent, but drops the
                        // title + "try adjusting your filters" description to
                        // stay compact inside a modal sub-view table. Row bg
                        // inherits var(--sc-dt-empty-bg) (slate/50 light,
                        // dark-mode-mapped to a tinted navy).
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: theme.customSpacing[3],
                            padding: `${theme.customSpacing[8]} ${theme.customSpacing[4]}`,
                            textAlign: 'center',
                            color: theme.semantic.text.secondary,
                            backgroundColor: 'var(--sc-dt-empty-bg)',
                            ...theme.customTypography.body1.regular,
                          }}
                        >
                          <EmptyStateIconCircle>
                            <DataEmptyIcon size={24} color={theme.semantic.primary.main} />
                          </EmptyStateIconCircle>
                          <span>{resolvedEmptyMessage}</span>
                        </div>
                      ) : (
                        <EmptyStateContainer>
                          <EmptyStateIconCircle>
                            <DataEmptyIcon size={24} color={theme.semantic.primary.main} />
                          </EmptyStateIconCircle>
                          <EmptyStateTitle>
                            {resolvedEmptyMessage}
                          </EmptyStateTitle>
                          <EmptyStateDescription>
                            Try adjusting your search or filters to find what you&apos;re looking for.
                          </EmptyStateDescription>
                        </EmptyStateContainer>
                      )}
                    </td>
                  </tr>
                )
              ) : (
                pageRows.map((row, rowIdx) => {
                  const absIdx = (safePage - 1) * pageSize + rowIdx;
                  const key = rowKey(row, absIdx);
                  const isSelected = selectedRows.has(key) || selectedRowId === key;
                  const rowProps =
                    typeof getRowProps === 'function' ? getRowProps(row, rowIdx) : getRowProps;
                  const rowStyle = mergeStyle({
                    backgroundColor: isSelected
                      ? T.rowSelected
                      : rowIdx % 2 === 1
                        ? T.rowStripe
                        : T.rowBase,
                    cursor: onRowClick ? 'pointer' : 'default',
                    transition: 'background-color 0.1s',
                  }, rowProps?.style);
                  return (
                    <tr
                      {...rowProps}
                      key={String(key)}
                      draggable={draggableRows || rowProps?.draggable}
                      onClick={(e) => {
                        rowProps?.onClick?.(e);
                        if (!e.defaultPrevented) onRowClick?.(row);
                      }}
                      tabIndex={rowProps?.tabIndex ?? (onRowClick ? 0 : undefined)}
                      role={rowProps?.role ?? (onRowClick ? 'button' : undefined)}
                      onKeyDown={
                        onRowClick
                          ? (e) => {
                              rowProps?.onKeyDown?.(e);
                              if (e.defaultPrevented) return;
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onRowClick(row);
                              }
                            }
                          : rowProps?.onKeyDown
                      }
                      onDragStart={(e) => {
                        rowProps?.onDragStart?.(e);
                        if (e.defaultPrevented) return;
                        if (!draggableRows) return;
                        dragColIdRef.current = key;
                        e.dataTransfer.effectAllowed = 'move';
                        onRowDragStart?.({ row, rowIndex: rowIdx, absoluteIndex: absIdx, event: e });
                      }}
                      onDragOver={(e) => {
                        rowProps?.onDragOver?.(e);
                        if (e.defaultPrevented) return;
                        if (!draggableRows) return;
                        e.preventDefault();
                        onRowDragOver?.({ row, rowIndex: rowIdx, absoluteIndex: absIdx, event: e });
                      }}
                      onDrop={(e) => {
                        rowProps?.onDrop?.(e);
                        if (e.defaultPrevented) return;
                        if (!draggableRows) return;
                        e.preventDefault();
                        const sourceKey = dragColIdRef.current;
                        const sourceIndex = pageRows.findIndex((candidate, candidateIdx) =>
                          rowKey(candidate, (safePage - 1) * pageSize + candidateIdx) === sourceKey
                        );
                        if (sourceIndex === -1) return;
                        const sourceRow = pageRows[sourceIndex];
                        const sourceAbsoluteIndex = (safePage - 1) * pageSize + sourceIndex;
                        onRowDrop?.({
                          row,
                          rowIndex: rowIdx,
                          absoluteIndex: absIdx,
                          sourceRow,
                          sourceIndex,
                          sourceAbsoluteIndex,
                          event: e,
                        });
                        onRowReorder?.(sourceAbsoluteIndex, absIdx, sourceRow, row);
                      }}
                      onDragEnd={(e) => {
                        rowProps?.onDragEnd?.(e);
                        if (draggableRows) {
                          onRowDragEnd?.({ row, rowIndex: rowIdx, absoluteIndex: absIdx, event: e });
                          dragColIdRef.current = null;
                        }
                      }}
                      style={rowStyle}
                      onMouseEnter={(e) => {
                        rowProps?.onMouseEnter?.(e);
                        if (!isSelected) e.currentTarget.style.backgroundColor = T.muted;
                      }}
                      onMouseLeave={(e) => {
                        rowProps?.onMouseLeave?.(e);
                        e.currentTarget.style.backgroundColor = isSelected
                          ? T.rowSelected
                          : rowIdx % 2 === 1
                            ? T.rowStripe
                            : T.rowBase;
                      }}
                    >
                      {selectable && (
                        <td
                          style={{
                            padding: `${cellPy} ${cellPx}`,
                            textAlign: 'center',
                            width: 48,
                            minWidth: 48,
                            maxWidth: 48,
                            boxSizing: 'border-box',
                            position: 'sticky',
                            left: 0,
                            zIndex: 1,
                            backgroundColor: isSelected
                              ? T.rowSelected
                              : rowIdx % 2 === 1
                                ? T.rowStripe
                                : T.rowBase,
                            borderRight: `1px solid ${T.border}`,
                            borderBottom: `1px solid ${T.border}`,
                            boxShadow: hasLeft ? '6px 0 12px var(--sc-dt-sticky-shadow)' : 'none',
                          }}
                        >
                          <TableCheckbox
                            id={`row-sel-${String(key)}`}
                            checked={isSelected}
                            onChange={(v) => toggleRow(key, v)}
                            label={`Select row ${rowIdx + 1}`}
                          />
                        </td>
                      )}
                      {showActionsColumn && actionPosition === 'left' && (
                        <td
                          style={{
                            width: 0,
                            padding: `${cellPy} ${cellPx}`,
                            whiteSpace: 'nowrap',
                            position: stickyActionsColumn ? 'sticky' : undefined,
                            left: stickyActionsColumn ? (selectable ? 48 : 0) : undefined,
                            zIndex: 1,
                            backgroundColor: isSelected
                              ? T.rowSelected
                              : rowIdx % 2 === 1
                                ? T.rowStripe
                                : T.rowBase,
                            borderRight: `1px solid ${T.border}`,
                            borderBottom: `1px solid ${T.border}`,
                            boxShadow: stickyActionsColumn && hasLeft ? '6px 0 12px var(--sc-dt-sticky-shadow)' : 'none',
                          }}
                        >
                          {(actionCell || rowActions?.length) && (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                              {renderRowActions(row)}
                            </div>
                          )}
                        </td>
                      )}
                      {orderedCols.map((col) => {
                        const value = getValue(row, col);
                        const isStickyFirstColumn = stickyFirstColId === col.id;
                        const cellProps = col.getCellProps?.(row, absIdx, value);
                        return (
                          <td
                            {...cellProps}
                            key={col.id}
                            style={mergeStyle({
                              padding: `${cellPy} ${cellPx}`,
                              ...theme.customTypography.body1.regular,
                              color: T.fg,
                              position: isStickyFirstColumn ? 'sticky' : cellProps?.style?.position,
                              left: isStickyFirstColumn ? firstColumnLeft : cellProps?.style?.left,
                              zIndex: isStickyFirstColumn ? 1 : cellProps?.style?.zIndex,
                              // Overflow behavior depends on the cell's mode:
                              //    wrapCells  `visible`, content grows vertically
                              //    always-editable  `visible`, the cell holds a
                              //     control (SelectField, etc.) that renders its
                              //     own focus halo and dropdown; clipping shaves
                              //     the halo on open/focus.
                              //    default  `clip` + 8px `overflowClipMargin`
                              //     so text truncates with ellipsis but small
                              //     focus decorations on inline controls can
                              //     still spill past the edge.
                              overflow: wrapCells || editMode === 'always-editable' ? 'visible' : 'clip',
                              overflowClipMargin:
                                wrapCells || editMode === 'always-editable' ? undefined : '8px',
                              whiteSpace:
                                wrapCells || editMode === 'always-editable' ? 'normal' : 'nowrap',
                              textOverflow:
                                wrapCells || editMode === 'always-editable' ? 'clip' : 'ellipsis',
                              wordBreak:
                                wrapCells || editMode === 'always-editable' ? 'break-word' : 'normal',
                              textAlign: col.align ?? 'left',
                              verticalAlign: 'middle',
                              // maxWidth anchors cell content width for
                              // ellipsis/wrap calculations. Two cases:
                              //    The column has a persisted width
                              //     (either from its ColumnDef or from a
                              //     user resize)  use that as the ceiling
                              //     so long content truncates instead of
                              //     forcing the column wider than intended.
                              //    Neither is set (unresized flex column)
                              //      leave undefined so the column can
                              //     grow into the 100% space the colgroup
                              //     allocates and hug its content.
                              //
                              // Using colWidths BEFORE col.width is the
                              // critical bit: when the user drags a flex
                              // column narrower, this is what lets the td
                              // actually shrink  without it, `tableLayout:
                              // auto` would hold the column at the content's
                              // natural width and the resize would look
                              // broken even though colWidths is updating.
                              maxWidth: colWidths[col.id] ?? col.width ?? undefined,
                              backgroundColor: isSelected
                                ? T.rowSelected
                                : rowIdx % 2 === 1
                                  ? T.rowStripe
                                  : T.rowBase,
                              borderRight: `1px solid ${T.border}`,
                              borderBottom: `1px solid ${T.border}`,
                              boxShadow:
                                isStickyFirstColumn && hasLeft
                                  ? '6px 0 12px var(--sc-dt-sticky-shadow)'
                                  : cellProps?.style?.boxShadow,
                            }, cellProps?.style)}
                          >
                            <div
                              style={{
                                // In always-editable mode the wrapper holds a
                                // control (SelectField, etc.) whose focus halo
                                // / open-state box-shadow must render past the
                                // cell edges. `overflow: hidden` here would
                                // clip the halo before the td's overflow rule
                                // ever gets a chance  so we mirror the td's
                                // `visible` treatment.
                                overflow:
                                  wrapCells || editMode === 'always-editable'
                                    ? 'visible'
                                    : 'hidden',
                                textOverflow:
                                  wrapCells || editMode === 'always-editable'
                                    ? 'clip'
                                    : 'ellipsis',
                                whiteSpace:
                                  wrapCells || editMode === 'always-editable'
                                    ? 'normal'
                                    : 'nowrap',
                                wordBreak:
                                  wrapCells || editMode === 'always-editable'
                                    ? 'break-word'
                                    : 'normal',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                flexWrap:
                                  wrapCells || editMode === 'always-editable'
                                    ? 'wrap'
                                    : 'nowrap',
                                // `min-width: 0` lets flex children shrink
                                // below their content width so the inner
                                // span can ellipsize instead of forcing the
                                // cell wider. Without this, long strings
                                // (e.g. "Commonwealth Land Title Insurance
                                // Company") act as the flex min-content and
                                // the column refuses to resize narrower.
                                minWidth: 0,
                              }}
                            >
                              {col.cell ? (
                                col.cell(value, row, col, absIdx)
                              ) : (
                                // Plain text / arrays need their own
                                // truncation wrapper because `text-overflow:
                                // ellipsis` on the flex parent doesn't cascade
                                // to an anonymous text-node child. A span
                                // with its own overflow/ellipsis styles +
                                // `min-width: 0` lets the string truncate
                                // inside the flex container.
                                <span
                                  style={{
                                    display: 'block',
                                    overflow: wrapCells ? 'visible' : 'hidden',
                                    textOverflow: wrapCells ? 'clip' : 'ellipsis',
                                    whiteSpace: wrapCells ? 'normal' : 'nowrap',
                                    wordBreak: wrapCells ? 'break-word' : 'normal',
                                    minWidth: 0,
                                    flex: '1 1 auto',
                                  }}
                                >
                                  {Array.isArray(value)
                                    ? (value as unknown[]).join(', ')
                                    : value != null
                                      ? String(value)
                                      : ''}
                                </span>
                              )}
                            </div>
                          </td>
                        );
                      })}
                      {showActionsColumn && actionPosition === 'right' && (
                        <td
                          style={{
                            width: 0,
                            padding: `${cellPy} ${cellPx}`,
                            whiteSpace: 'nowrap',
                            position: stickyActionsColumn ? 'sticky' : undefined,
                            right: stickyActionsColumn ? 0 : undefined,
                            zIndex: 1,
                            backgroundColor: isSelected
                              ? T.rowSelected
                              : rowIdx % 2 === 1
                                ? T.rowStripe
                                : T.rowBase,
                            borderBottom: `1px solid ${T.border}`,
                            boxShadow: stickyActionsColumn && hasRight ? '-6px 0 12px var(--sc-dt-sticky-shadow)' : 'none',
                          }}
                        >
                          {(actionCell || rowActions?.length) && (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                              {renderRowActions(row)}
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
              {/*
                Inline-add slot behavior depends on `inlineAddVariant`:
                - 'footer': auto-wrap in a single <InlineAddRow> tr so page-level
                  consumers don't have to import the styled component.
                - 'inline': render raw so consumers can emit multiple rows by
                  importing <InlineAddRow> and returning a fragment of them.
              */}
              {inlineAddRow != null && (
                inlineAddVariant === 'footer'
                  ? <InlineAddRow>{inlineAddRow}</InlineAddRow>
                  : inlineAddRow
              )}
              {/*
                In the 'inline' variant, the "Add +" trigger lives INSIDE the
                <tbody> so it's part of the table's visual frame (matches the
                Figma checklist sub-view tables). In 'footer' mode, this trigger
                doesn't render here  it renders as an <AddRowFooter> below the
                <table> instead.
              */}
              {inlineAddVariant === 'inline' && onAddClick && (
                <InlineAddTriggerRow>
                  <td colSpan={totalColumnCount}>
                    <InlineAddStickyWrap>
                      <BaseButton
                        variant="ghost"
                        color="primary"
                        size="small"
                        endIcon={<AddIcon size={16} color="currentColor" />}
                        onClick={onAddClick}
                      >
                        {addLabel}
                      </BaseButton>
                    </InlineAddStickyWrap>
                  </td>
                </InlineAddTriggerRow>
              )}
            </tbody>
            {hasColumnFooter && (
              <tfoot>
                <tr>
                  {selectable && (
                    <td style={{ padding: `${headerPy} ${cellPx}`, borderTop: `1px solid ${T.border}` }} />
                  )}
                  {showActionsColumn && actionPosition === 'left' && (
                    <td style={{ padding: `${headerPy} ${cellPx}`, borderTop: `1px solid ${T.border}` }} />
                  )}
                  {orderedCols.map((col) => (
                    <td
                      key={col.id}
                      style={{
                        padding: `${headerPy} ${cellPx}`,
                        ...theme.customTypography.body2.medium,
                        color: T.fgSub,
                        textAlign: col.align ?? 'left',
                        borderTop: `1px solid ${T.border}`,
                        borderRight: `1px solid ${T.border}`,
                        backgroundColor: T.stickyStripe,
                      }}
                    >
                      {typeof col.footer === 'function' ? col.footer(col) : col.footer}
                    </td>
                  ))}
                  {showActionsColumn && actionPosition === 'right' && (
                    <td style={{ padding: `${headerPy} ${cellPx}`, borderTop: `1px solid ${T.border}` }} />
                  )}
                </tr>
              </tfoot>
            )}
          </table>
          )}
        </ScrollContainerInner>
      </ScrollContainerOuter>

      {inlineAddVariant === 'footer' && onAddClick && (
        <AddRowFooter>
          <BaseButton
            variant="ghost"
            color="primary"
            size="small"
            endIcon={<AddIcon size={16} color="currentColor" />}
            onClick={onAddClick}
          >
            {addLabel}
          </BaseButton>
        </AddRowFooter>
      )}

      {/*
        Pagination footer  hidden when the table has zero entries. There's
        nothing to paginate, and the "00 of 0" + disabled chevrons add noise
        (especially in inline-variant tables where the empty-state and Add+
        trigger already read as the full UI).
      */}
      {!hideFooter && totalRows > 0 && (
        <FooterBar>
          <FooterRangeText>{`${startRow}${endRow} of ${totalRows}`}</FooterRangeText>
          <PaginationNav role="navigation" aria-label="Table pagination">
            <PaginationBtn onClick={() => setPage(1)} disabled={safePage === 1} label="First page">
              <FirstPageIcon style={{ fontSize: 18 }} />
            </PaginationBtn>
            <PaginationBtn
              onClick={() => setPage((p) => p - 1)}
              disabled={safePage === 1}
              label="Previous page"
            >
              <ChevronLeftIcon style={{ fontSize: 18 }} />
            </PaginationBtn>
            <PageNumbers current={safePage} total={totalPages} onChange={setPage} />
            <PaginationBtn
              onClick={() => setPage((p) => p + 1)}
              disabled={safePage === totalPages}
              label="Next page"
            >
              <ChevronRightIcon style={{ fontSize: 18 }} />
            </PaginationBtn>
            <PaginationBtn
              onClick={() => setPage(totalPages)}
              disabled={safePage === totalPages}
              label="Last page"
            >
              <LastPageIcon style={{ fontSize: 18 }} />
            </PaginationBtn>
          </PaginationNav>
          <RowsPerPageWrapper>
            <span>Rows per page</span>
            <SelectField
              variant="outline"
              size="small"
              value={String(pageSize)}
              onChange={(v) => setPageSize(Number(v))}
              options={pageSizeOptions.map((n) => ({ value: String(n), label: String(n) }))}
              aria-label="Rows per page"
              sx={{ minWidth: 64 }}
            />
          </RowsPerPageWrapper>
        </FooterBar>
      )}
    </DataTableRoot>
  );
}

// 
// Named cell-renderer exports
// 

//  StatusBadge 
// Raw rgba() values are intentional  these semantic status colors have no
// equivalent project token.
function makeStatusColors(theme: Theme) {
  return {
    blue:        { bg: 'rgba(37,99,235,0.12)',  text: '#1e3a8a', darkBg: `color-mix(in srgb, ${theme.colors.blue[500]} 18%, ${theme.colors.slate[900]})`,   darkText: theme.colors.blue[300] },
    green:       { bg: 'rgba(34,197,94,0.15)',   text: '#166534', darkBg: `color-mix(in srgb, ${theme.colors.green[500]} 18%, ${theme.colors.slate[900]})`,  darkText: theme.colors.green[300] },
    yellow:      { bg: 'rgba(234,179,8,0.15)',   text: '#92400e', darkBg: `color-mix(in srgb, ${theme.colors.yellow[500]} 18%, ${theme.colors.slate[900]})`, darkText: theme.colors.yellow[300] },
    red:         { bg: 'rgba(239,68,68,0.12)',   text: '#991b1b', darkBg: `color-mix(in srgb, ${theme.colors.red[500]} 18%, ${theme.colors.slate[900]})`,    darkText: theme.colors.red[300] },
    gray:        { bg: 'rgba(148,163,184,0.22)', text: '#334155', darkBg: `color-mix(in srgb, ${theme.colors.slate[500]} 18%, ${theme.colors.slate[900]})`,  darkText: theme.colors.slate[300] },
    solid_green: { bg: '#166534',                text: '#ffffff', darkBg: theme.colors.green[700],                                                            darkText: '#ffffff' },
  } as Record<string, { bg: string; text: string; darkBg: string; darkText: string }>;
}

export interface StatusBadgeProps {
  status?: string;
  label?: string;
  color?: string;
}

export function StatusBadge({ status, label, color = 'gray' }: StatusBadgeProps) {
  const theme = useTheme();
  const STATUS_COLORS = makeStatusColors(theme);
  const cfg = STATUS_COLORS[color] ?? STATUS_COLORS.gray;
  return (
    <StatusBadgeRoot
      component="span"
      aria-label={`Status: ${label ?? status}`}
      bgColor={cfg.bg}
      textColor={cfg.text}
      darkBgColor={cfg.darkBg}
      darkTextColor={cfg.darkText}
    >
      {label ?? status}
    </StatusBadgeRoot>
  );
}

//  DocStatusIcon 
const DOC_TYPE_ICONS: Record<
  string,
  React.ComponentType<{ style?: React.CSSProperties; 'aria-label'?: string; role?: string }>
> = {
  appt: EventIcon,
  ts: ArticleIcon,
  ti: VerifiedIcon,
};

export interface DocStatusIconProps {
  type?: string;
  status?: string;
}

export function DocStatusIcon({ type, status = '' }: DocStatusIconProps) {
  const theme = useTheme();
  const T = makeT(theme);
  const Icon = DOC_TYPE_ICONS[type ?? ''] ?? ArticleIcon;
  const color =
    status === 'completed' ? T.primary :
    status === 'scheduled' ? theme.colors.amber[500] :
    theme.colors.slate[400];
  const typeLabel =
    type === 'appt' ? 'Appointment' : type === 'ts' ? 'Title Search' : 'Title Insurance';
  const statusLabel =
    status === 'completed' ? 'completed' : status === 'scheduled' ? 'scheduled' : 'pending';
  return (
    <DocStatusIconWrapper>
      <Icon style={{ fontSize: 18, color }} aria-label={`${typeLabel}: ${statusLabel}`} role="img" />
    </DocStatusIconWrapper>
  );
}

//  Shared pill style factories 
function makePillTextStyle(theme: Theme): React.CSSProperties {
  return {
    fontSize: theme.customTypography.body1.regular.fontSize,
    fontFamily: theme.fontFamilies.body,
    fontWeight: theme.fontWeights.regular,
    color: theme.semantic.text.primary,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };
}

function makeTooltipCardStyle(theme: Theme): React.CSSProperties {
  return {
    backgroundColor: theme.semantic.common.white,
    backgroundImage: theme.surfaceOverlay.high,
    border: `1px solid ${theme.semantic.divider}`,
    borderRadius: theme.customBorderRadius.xl,
    boxShadow: theme.customShadows.lg,
    padding: theme.customSpacing[4],
    width: 260,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.customSpacing[3],
  };
}

// Shared tooltip hook
/**
 * Position descriptor for the shared pill tooltip portal. All coordinates
 * are in viewport-fixed px.
 *
 *  - `top` / `left`  the tooltip's CENTER X + top anchor. Consumer wraps
 *    the tooltip in `transform: translate(-50%, <offsetY>)` so the tooltip
 *    is centered horizontally on `left`. `offsetY` is `-100%` when the
 *    tooltip sits above the pill (`placement: 'top'`), or `0` when below
 *    (`placement: 'bottom'`).
 *  - `placement`  flipped to `'bottom'` automatically when there isn't
 *    enough room above the pill; tells the consumer which side the caret
 *    goes on (caret always points TOWARD the pill).
 *  - `caretX`  left offset in px from the tooltip's left edge where the
 *    caret should render. When the tooltip is horizontally clamped to the
 *    viewport (pill near the screen edge), the caret stays pinned to the
 *    pill's center so the callout still reads as "connected" to the pill.
 *  - `ready`  `false` on the first render after `showTt`, `true` after the
 *    tooltip has been measured and the position has been clamped. Consumers
 *    use this to keep the tooltip invisible for one frame so there's no
 *    flash at the initial guess position.
 */
interface PillTooltipPosition {
  top: number;
  left: number;
  placement: 'top' | 'bottom';
  caretX: number;
  ready: boolean;
}

const PILL_TOOLTIP_MARGIN = 8;
const PILL_TOOLTIP_CARET_EDGE_MIN = 12;

function usePillTooltip(pillRef: React.RefObject<HTMLElement | null>) {
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [ttPos, setTtPos] = useState<PillTooltipPosition | null>(null);

  useEffect(
    () => () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    },
    []
  );

  const showTt = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    const r = pillRef.current?.getBoundingClientRect();
    if (!r) return;
    // Initial guess: tooltip above the pill, centered on it. The
    // useLayoutEffect below will measure the tooltip and re-clamp both
    // placement and horizontal position to fit the viewport.
    setTtPos({
      top: r.top - PILL_TOOLTIP_MARGIN,
      left: r.left + r.width / 2,
      placement: 'top',
      caretX: 0,
      ready: false,
    });
  }, [pillRef]);

  const hideTt = useCallback(() => {
    hideTimer.current = setTimeout(() => setTtPos(null), 120);
  }, []);

  // Viewport-aware re-positioning: after the tooltip mounts we can measure
  // it and decide whether it fits where we initially placed it. If not,
  // flip the placement (bottom instead of top) and/or clamp the horizontal
  // center so the tooltip stays fully on-screen, then recompute where the
  // caret needs to land so it still points at the pill.
  useLayoutEffect(() => {
    if (!ttPos || ttPos.ready) return;
    const pill = pillRef.current?.getBoundingClientRect();
    const tt = tooltipRef.current?.getBoundingClientRect();
    if (!pill || !tt) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const margin = PILL_TOOLTIP_MARGIN;

    // Placement  prefer top; flip to bottom if there isn't room above
    // AND there is more space below.
    const neededHeight = tt.height + margin;
    const spaceAbove = pill.top;
    const spaceBelow = vh - pill.bottom;
    const placement: 'top' | 'bottom' =
      spaceAbove >= neededHeight || spaceAbove >= spaceBelow ? 'top' : 'bottom';

    // Horizontal clamp  center tooltip on pill, but keep both edges
    // at least `margin` from the viewport edges.
    const pillCenterX = pill.left + pill.width / 2;
    const halfTt = tt.width / 2;
    const minCenter = halfTt + margin;
    const maxCenter = vw - margin - halfTt;
    const clampedCenter =
      minCenter > maxCenter
        ? vw / 2 // tooltip wider than viewport  center it and accept overflow
        : Math.max(minCenter, Math.min(pillCenterX, maxCenter));

    // Caret horizontal offset inside the tooltip  keeps the caret pointing
    // at the pill's center even when the tooltip itself had to be shifted.
    // Clamp so the caret doesn't hang off the tooltip's corner radius.
    const tooltipLeftEdge = clampedCenter - halfTt;
    const rawCaretX = pillCenterX - tooltipLeftEdge;
    const caretX = Math.max(
      PILL_TOOLTIP_CARET_EDGE_MIN,
      Math.min(rawCaretX, tt.width - PILL_TOOLTIP_CARET_EDGE_MIN),
    );

    const top = placement === 'top' ? pill.top - margin : pill.bottom + margin;

    setTtPos({ top, left: clampedCenter, placement, caretX, ready: true });
  }, [ttPos, pillRef]);

  return { ttPos, showTt, hideTt, tooltipRef };
}

/**
 * Inline style helpers for the tooltip's outer positioning div and caret.
 * Centralized here so `NamePill`, `OfficePill`, and `MoreDataIndicator` can
 * share identical flip/clamp behavior without each re-computing transforms.
 */
function getPillTooltipWrapperStyle(
  pos: PillTooltipPosition,
): React.CSSProperties {
  return {
    position: 'fixed',
    top: pos.top,
    left: pos.left,
    transform:
      pos.placement === 'top'
        ? 'translate(-50%, -100%)'
        : 'translate(-50%, 0)',
    zIndex: 9999,
    pointerEvents: 'auto',
    // Hide until the useLayoutEffect has measured and re-clamped, otherwise
    // the user would see a one-frame flash at the initial guess position.
    visibility: pos.ready ? 'visible' : 'hidden',
  };
}

function getPillTooltipCaretStyle(
  pos: PillTooltipPosition,
  theme: Theme,
): React.CSSProperties {
  const base: React.CSSProperties = {
    position: 'absolute',
    left: pos.caretX,
    width: 8,
    height: 8,
    backgroundColor: theme.semantic.common.white,
    border: `1px solid ${theme.semantic.divider}`,
    transform: 'translateX(-50%) rotate(45deg)',
  };
  // Caret visible edges face AWAY from the tooltip (toward the pill):
  //  - placement=top   caret sits at tooltip bottom, points DOWN at pill
  //  - placement=bottom  caret sits at tooltip top, points UP at pill
  if (pos.placement === 'top') {
    return { ...base, bottom: -5, borderTop: 'none', borderLeft: 'none' };
  }
  return { ...base, top: -5, borderBottom: 'none', borderRight: 'none' };
}

//  NamePill 
export interface NamePillProps {
  name: string;
  email?: string;
  phone?: string;
  registered?: boolean;
  role?: string;
}

export function NamePill({ name, email, phone, registered = false, role }: NamePillProps) {
  const theme = useTheme();
  const PILL_TEXT_STYLE = makePillTextStyle(theme);
  const TOOLTIP_CARD_STYLE = makeTooltipCardStyle(theme);
  const pillRef = useRef<HTMLSpanElement>(null);
  const { ttPos, showTt, hideTt, tooltipRef } = usePillTooltip(pillRef);

  return (
    <>
      <PillChip
        ref={pillRef}
        component="span"
        onMouseEnter={showTt}
        onMouseLeave={hideTt}
        onFocus={showTt}
        onBlur={hideTt}
        tabIndex={0}
        role="button"
        aria-label={`${name}  view contact info`}
      >
        <span style={PILL_TEXT_STYLE}>{name}</span>
      </PillChip>

      {ttPos &&
        typeof window !== 'undefined' &&
        ReactDOM.createPortal(
          <div
            ref={tooltipRef}
            onMouseEnter={showTt}
            onMouseLeave={hideTt}
            style={getPillTooltipWrapperStyle(ttPos)}
          >
            <div style={TOOLTIP_CARD_STYLE}>
              {/* Header: Avatar + Name + Role */}
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.customSpacing[3] }}>
                <ImagePlaceholder placeholderType="Initials" name={name} shape="Circle" size={48} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: theme.customTypography.body1.medium.fontSize,
                      fontWeight: theme.fontWeights.medium,
                      color: theme.semantic.text.primary,
                      fontFamily: theme.fontFamilies.body,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {name}
                  </div>
                  {!registered ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: theme.customSpacing[1] }}>
                      <NotRegisteredDot component="span" />
                      <span
                        style={{
                          fontSize: theme.customTypography.body2.regular.fontSize,
                          color: theme.semantic.text.secondary,
                          fontFamily: theme.fontFamilies.body,
                        }}
                      >
                        Not registered
                      </span>
                    </div>
                  ) : role ? (
                    <div
                      style={{
                        fontSize: theme.customTypography.body2.regular.fontSize,
                        fontWeight: theme.fontWeights.regular,
                        color: theme.semantic.text.secondary,
                        fontFamily: theme.fontFamilies.body,
                      }}
                    >
                      {role}
                    </div>
                  ) : null}
                </div>
              </div>
              {/* Contact links */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: theme.customSpacing[2] }}>
                {email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: theme.customSpacing[1] }}>
                    <EmailIcon size={20} color={theme.semantic.primary.dark} />
                    <span
                      style={{
                        fontSize: theme.customTypography.body2.regular.fontSize,
                        color: theme.semantic.primary.dark,
                        fontFamily: theme.fontFamilies.body,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {email}
                    </span>
                  </div>
                )}
                {phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: theme.customSpacing[1] }}>
                    <PhoneIcon size={20} color={theme.semantic.primary.dark} />
                    <span
                      style={{
                        fontSize: theme.customTypography.body2.regular.fontSize,
                        color: theme.semantic.primary.dark,
                        fontFamily: theme.fontFamilies.body,
                      }}
                    >
                      {phone}
                    </span>
                  </div>
                )}
                {registered && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: theme.customSpacing[1] }}>
                    <ChatIcon size={20} color={theme.semantic.primary.dark} />
                    <span
                      style={{
                        fontSize: theme.customTypography.body2.regular.fontSize,
                        color: theme.semantic.primary.dark,
                        fontFamily: theme.fontFamilies.body,
                      }}
                    >
                      Chat
                    </span>
                  </div>
                )}
              </div>
            </div>
            {/* Caret  flips to match placement (top vs bottom) and stays
                pointed at the pill even when the tooltip is clamped to the
                viewport horizontally. */}
            <div aria-hidden="true" style={getPillTooltipCaretStyle(ttPos, theme)} />
          </div>,
          document.body
        )}
    </>
  );
}

//  OfficePill 
export interface OfficePillProps {
  name: string;
  address?: string;
  city?: string;
  state?: string;
}

export function OfficePill({ name, address, city, state }: OfficePillProps) {
  const theme = useTheme();
  const PILL_TEXT_STYLE = makePillTextStyle(theme);
  const TOOLTIP_CARD_STYLE = makeTooltipCardStyle(theme);
  const pillRef = useRef<HTMLSpanElement>(null);
  const { ttPos, showTt, hideTt, tooltipRef } = usePillTooltip(pillRef);

  const fullAddress = [address, city && state ? `${city}, ${state}` : (city ?? state)]
    .filter(Boolean)
    .join('\n');

  return (
    <>
      <PillChip
        ref={pillRef}
        component="span"
        onMouseEnter={showTt}
        onMouseLeave={hideTt}
        onFocus={showTt}
        onBlur={hideTt}
        tabIndex={0}
        role="button"
        aria-label={`${name}  view office info`}
      >
        <span style={PILL_TEXT_STYLE}>{name}</span>
      </PillChip>

      {ttPos &&
        typeof window !== 'undefined' &&
        ReactDOM.createPortal(
          <div
            ref={tooltipRef}
            onMouseEnter={showTt}
            onMouseLeave={hideTt}
            style={getPillTooltipWrapperStyle(ttPos)}
          >
            <div style={TOOLTIP_CARD_STYLE}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: theme.customSpacing[3] }}>
                <ImagePlaceholder
                  placeholderType="Initials"
                  name={name}
                  shape="RoundedSquare"
                  size={56}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: theme.customTypography.body1.medium.fontSize,
                      fontWeight: theme.fontWeights.medium,
                      color: theme.semantic.text.primary,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontFamily: theme.fontFamilies.body,
                    }}
                  >
                    {name}
                  </div>
                  {fullAddress && (
                    <div style={{ display: 'flex', gap: theme.customSpacing[1], marginTop: theme.customSpacing[1], alignItems: 'flex-start' }}>
                      <LocationOutlineIcon size={20} color={theme.semantic.text.secondary} />
                      <span
                        style={{
                          fontSize: theme.customTypography.body2.regular.fontSize,
                          color: theme.semantic.text.secondary,
                          fontFamily: theme.fontFamilies.body,
                          whiteSpace: 'pre-line',
                          lineHeight: '1.4',
                        }}
                      >
                        {fullAddress}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div aria-hidden="true" style={getPillTooltipCaretStyle(ttPos, theme)} />
          </div>,
          document.body
        )}
    </>
  );
}

//  MoreDataIndicator 
interface MoreDataItem {
  name: string;
  detail?: string;
  registered?: boolean;
}

export interface MoreDataIndicatorProps {
  count: number;
  items: MoreDataItem[];
  isOffice?: boolean;
  title?: string;
  totalCount?: number;
}

export function MoreDataIndicator({
  count,
  items,
  isOffice = false,
  title,
  totalCount,
}: MoreDataIndicatorProps): React.ReactElement {
  const theme = useTheme();
  const T = makeT(theme);
  const TOOLTIP_CARD_STYLE = makeTooltipCardStyle(theme);
  const pillRef = useRef<HTMLSpanElement>(null);
  const tooltipState = usePillTooltip(pillRef);
  const ttPos = tooltipState.ttPos;
  const showTt = tooltipState.showTt;
  const hideTt = tooltipState.hideTt;
  const tooltipRef = tooltipState.tooltipRef;

  return (
    <>
      <MoreDataBadge
        ref={pillRef}
        component="span"
        onMouseEnter={showTt}
        onMouseLeave={hideTt}
        onFocus={showTt}
        onBlur={hideTt}
        tabIndex={0}
        role="button"
        aria-label={`${count} more items  view all`}
      >
        <span
          style={{
            fontSize: theme.customTypography.body1.medium.fontSize,
            fontWeight: theme.fontWeights.medium,
            fontFamily: theme.fontFamilies.body,
            color: theme.semantic.primary.dark,
            whiteSpace: 'nowrap',
          }}
        >
          +{count}
        </span>
      </MoreDataBadge>

      {ttPos &&
        typeof window !== 'undefined' &&
        ReactDOM.createPortal(
          <div
            ref={tooltipRef}
            onMouseEnter={showTt}
            onMouseLeave={hideTt}
            style={getPillTooltipWrapperStyle(ttPos)}
          >
            <div style={TOOLTIP_CARD_STYLE}>
              {/* Header */}
              {title && (
                <div style={{
                  fontSize: theme.customTypography.overline.fontSize,
                  fontWeight: theme.fontWeights.semibold,
                  letterSpacing: theme.customTypography.overline.letterSpacing,
                  textTransform: 'uppercase' as const,
                  color: theme.semantic.text.secondary,
                  fontFamily: theme.fontFamilies.body,
                  lineHeight: theme.customTypography.overline.lineHeight,
                  paddingBottom: theme.customSpacing[2],
                  borderBottom: `1px solid ${theme.semantic.divider}`,
                  marginBottom: theme.customSpacing[1],
                }}>
                  {title} - {totalCount ?? items.length}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: theme.customSpacing[2] }}>
                {items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: theme.customSpacing[2] }}>
                    <ImagePlaceholder
                      placeholderType="Initials"
                      name={item.name}
                      shape={isOffice ? 'RoundedSquare' : 'Circle'}
                      size={24}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: theme.customTypography.body2.medium.fontSize,
                          fontWeight: theme.fontWeights.medium,
                          color: theme.semantic.text.primary,
                          fontFamily: theme.fontFamilies.body,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.name}
                      </div>
                      {item.detail ? (
                        <div
                          style={{
                            fontSize: isOffice ? theme.customTypography.caption.regular.fontSize : theme.customTypography.body2.regular.fontSize,
                            fontWeight: theme.fontWeights.regular,
                            color: theme.semantic.text.secondary,
                            fontFamily: theme.fontFamilies.body,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item.detail}
                        </div>
                      ) : !isOffice && item.registered === false ? (
                        <div style={{ fontSize: theme.customTypography.body2.regular.fontSize, color: theme.semantic.text.secondary, fontFamily: theme.fontFamilies.body }}>
                          Not registered
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div aria-hidden="true" style={getPillTooltipCaretStyle(ttPos, theme)} />
          </div>,
          document.body
        )}
    </>
  );
}
