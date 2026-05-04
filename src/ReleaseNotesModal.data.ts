/**
 * Release Notes — user-friendly changelog for testers and stakeholders.
 *
 * Each entry summarizes what changed in plain language so non-developers
 * (like Larry or other testers) can quickly see what's new and what to test.
 *
 * Update this file whenever a meaningful batch of changes is deployed.
 */

export interface ReleaseItem {
  label: string;
  description: string;
}

export interface ReleaseEntry {
  version: string;
  date: string;
  summary: string;
  whatsNew: ReleaseItem[];       // Prototypes, pages, flows (e.g. Dashboard, Calendar, Registration)
  designSystem: ReleaseItem[];   // Components, tokens, design tooling
  improvements: ReleaseItem[];
  bugFixes: ReleaseItem[];
}

export const releaseNotes: ReleaseEntry[] = [
  {
    version: '1.4.0',
    date: 'March 30, 2026',
    summary: 'Company Page, Calendar page with event blocks, and Chip/StatusChip enhancements.',
    whatsNew: [
      { label: 'Company Page', description: 'Full company profile with hero banner, office locations (map + calendar), about us, services, documents, licenses, fees, and FAQ sections.' },
      { label: 'Calendar Page', description: 'Google Calendar-style month view with transaction event blocks. Supports Law Firm and Notary companies. Title Search/Insurance show empty state.' },
      { label: 'Release Notes', description: 'Click the version number in the SideNav to see what\'s new (you\'re looking at it!).' },
    ],
    designSystem: [
      { label: 'CalendarEventBlock', description: 'Color-coded event pills with hover peek popover showing event details, transaction type, and action buttons.' },
      { label: 'StatusChip', description: 'Purpose-built status indicator that auto-maps status strings to the correct color (New = blue, In Progress = yellow, Completed = green, etc.).' },
      { label: 'Chip — Duotone', description: 'New duotone style variant matching BaseButton pattern with dark mode support via color-mix.' },
      { label: 'Chip — Sizes', description: 'Added "mid" (body2 text, base icons) and "overline" (uppercase 10px) size variants.' },
      { label: 'Chip — Colors', description: 'New color options: success, error, alert, warning, new (blue). All work across filled/outline/ghost/duotone styles.' },
      { label: 'Chip — Bold', description: 'New bold prop applies semibold font weight to label text.' },
    ],
    improvements: [
      { label: 'Dashboard Data', description: 'Dashboard data changes when switching companies — KPIs, closings, activity feed, status breakdown all update per company.' },
      { label: 'Live Activity Feed', description: 'Recent Activity has a simulated live feed that adds new entries after scrolling.' },
      { label: 'Company-Aware Labels', description: 'Status Overview labels and closings section headers adapt per company type (e.g. "Active Title Searches" for Title Search).' },
      { label: 'Dark Mode Logo', description: 'Header logo switches to white in dark mode automatically.' },
      { label: 'Dropdown Shadows', description: 'Header user dropdown and CompanySwitcher dropdown have stronger shadows in dark mode for better visibility.' },
    ],
    bugFixes: [
      { label: 'Chip Truncation', description: 'Chip text now truncates with ellipsis and shows tooltip on hover when clipped.' },
      { label: 'SVG Logos', description: 'Updated all logos from PNG to scalable SVG format for sharper rendering.' },
      { label: 'NamePill Phone', description: 'Fixed missing phone numbers on NamePill entries in the design system.' },
    ],
  },
  {
    version: '1.3.0',
    date: 'March 25, 2026',
    summary: 'Pipeline page rebuild, DataTable improvements, and full TypeScript migration.',
    whatsNew: [
      { label: 'Pipeline Page', description: 'Fully interactive transaction pipeline with search, pagination, and column management.' },
    ],
    designSystem: [
      { label: 'SideNav', description: 'Company switcher, navigation items, profile section, and collapsible sidebar.' },
      { label: 'Modal', description: 'Responsive modal with title/body/actions slots and close icon.' },
      { label: 'DataTable', description: 'Rebuilt with sortable columns, resizable headers, row selection, search, and column visibility menu.' },
    ],
    improvements: [
      { label: 'TypeScript Migration', description: 'Complete migration — all components and pages converted from JavaScript to TypeScript.' },
    ],
    bugFixes: [
      { label: 'Playground Code Tab', description: 'Code tab now correctly resolves TypeScript source files after migration.' },
    ],
  },
  {
    version: '1.2.0',
    date: 'March 18, 2026',
    summary: 'Schedule Transaction page, form components, and step progress.',
    whatsNew: [
      { label: 'Schedule Transaction', description: 'Three-step transaction scheduling wizard with map, form fields, and party invitations.' },
    ],
    designSystem: [
      { label: 'ArrowStepProgress', description: 'Multi-step wizard indicator with active/completed/canceled states.' },
      { label: 'TextareaField', description: 'Multi-line text input with label, validation, and character count.' },
      { label: 'Toast', description: 'Success, error, warning, and info feedback notification messages.' },
      { label: 'DatePickerField', description: 'Single and range date selection with calendar popup.' },
      { label: 'LocationSuggestionField', description: 'Address autocomplete with async suggestions and keyboard nav.' },
      { label: 'Accordion', description: 'Expandable sections with optional checkbox.' },
      { label: 'CounterBadge', description: 'Numeric badge for navigation items and notifications.' },
    ],
    improvements: [
      { label: 'Field Validation', description: 'All text input fields now support email/phone/password validation with built-in formatting.' },
      { label: 'Toggle Sizes', description: 'Toggle component now has xs size and offset-head style variant.' },
    ],
    bugFixes: [],
  },
  {
    version: '1.1.0',
    date: 'March 10, 2026',
    summary: 'Design system foundation with core components and playground tooling.',
    whatsNew: [
      { label: 'Design System Page', description: 'Browse all tokens, icons, and components in one place.' },
      { label: 'Playground Shell', description: 'Preview pages at Desktop, Tablet, and Mobile sizes with annotation mode.' },
    ],
    designSystem: [
      { label: 'BaseButton', description: 'Primary interactive button with filled, outline, ghost, and duotone variants.' },
      { label: 'Chip', description: 'Pill-shaped display element with filled, outline, and ghost styles.' },
      { label: 'Form Inputs', description: 'TextInputField, SelectField, MultiselectField, ComboField — full form input suite.' },
      { label: 'ImagePlaceholder', description: 'Initials-based avatar with Circle and Quadrilateral shapes.' },
      { label: 'Header & Footer', description: 'Header with logged-in and logged-out variants. Footer component.' },
      { label: 'Corner Smoothing', description: 'Native CSS corner-shape: squircle for iOS-style rounded corners.' },
    ],
    improvements: [],
    bugFixes: [],
  },
  {
    version: '1.0.0',
    date: 'February 28, 2026',
    summary: 'Initial release with design tokens and project scaffolding.',
    whatsNew: [],
    designSystem: [
      { label: 'Design Tokens', description: 'Color, typography, spacing, border radius, and shadow scales.' },
      { label: 'Dark Mode', description: 'CSS custom properties with automatic token switching.' },
      { label: 'MUI Theme', description: 'Custom breakpoints (xs/sm/md/lg/xl) integrated with MUI.' },
    ],
    improvements: [],
    bugFixes: [],
  },
];
