'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Popover from '@mui/material/Popover';
import { SxProps, Theme, useTheme } from '@mui/material/styles';
import IconTooltip from './IconTooltip';
import SmoothBox from './SmoothBox';
import { CloseFilledIcon, LocationOutlineIcon, WarningOutlineIcon } from './icons';
import { useDropdownPlacement } from './useDropdownPlacement';
import { useInheritedColorMode } from './useInheritedColorMode';
import {
  LocationAdornmentSlot,
  LocationAdornmentWrap,
  LocationCenteredBox,
  LocationClearButton,
  LocationErrorRow,
  LocationErrorText,
  LocationFieldRoot,
  LocationHelperText,
  LocationInputBase,
  LocationInputBox,
  LocationLabelRow,
  LocationLabelText,
  LocationNoResultsText,
  LocationRequiredMark,
  LocationSrOnly,
  LocationSuggestionItem,
  LocationSuggestionLabel,
  LocationSuggestionList,
  LocationSuggestionSublabel,
} from './LocationSuggestionField.styles';

type ColorModePaperSlotProps = NonNullable<React.ComponentProps<typeof Popover>['slotProps']>['paper'] & {
  'data-color-mode'?: 'light' | 'dark';
};

function getColorModePaperProps(
  mode: 'light' | 'dark' | undefined,
  sx: Record<string, unknown>,
): ColorModePaperSlotProps {
  return {
    ...(mode ? { 'data-color-mode': mode } : {}),
    sx,
  } as ColorModePaperSlotProps;
}

export interface Suggestion {
  label: string;
  sublabel?: string;
  id?: string;
  [key: string]: unknown;
}

export interface LocationSuggestionFieldProps {
  getSuggestions: (query: string) => Promise<Suggestion[]>;
  value?: string;
  onChange?: (displayValue: string, suggestion: Suggestion) => void;
  label?: string;
  hideLabel?: boolean;
  helperText?: string;
  error?: string;
  errorIcon?: React.ReactNode;
  tooltip?: string;
  disabled?: boolean;
  debounceMs?: number;
  minChars?: number;
  placeholder?: string;
  noResultsText?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  required?: boolean;
  size?: 'base' | 'small';
  sx?: SxProps<Theme>;
  [key: string]: unknown;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debounced;
}

export default function LocationSuggestionField({
  getSuggestions,
  value = '',
  onChange,
  label,
  hideLabel,
  helperText,
  error,
  errorIcon,
  tooltip,
  disabled = false,
  debounceMs = 300,
  minChars = 2,
  placeholder,
  noResultsText = 'No results',
  startAdornment,
  endAdornment,
  required = false,
  size = 'base',
  sx,
  ...props
}: LocationSuggestionFieldProps) {
  const theme = useTheme();
  const isSmall = size === 'small';
  const iconSize = isSmall ? 16 : 20;

  const [inputText, setInputText] = useState(value);
  const [committedValue, setCommittedValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);

  const anchorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectionMadeRef = useRef(Boolean(value));
  const getSuggestionsRef = useRef(getSuggestions);
  const debouncedQuery = useDebounce(inputText, debounceMs);
  const { placement: dropdownPlacement, maxHeight: dropdownMaxHeight } = useDropdownPlacement(
    anchorRef.current,
    { open: isOpen, maxHeight: 240 },
  );
  const isDropdownTop = dropdownPlacement === 'top';
  const inheritedMode = useInheritedColorMode(anchorRef.current, isOpen);

  useEffect(() => {
    getSuggestionsRef.current = getSuggestions;
  });

  useEffect(() => {
    if (value !== inputText) {
      selectionMadeRef.current = true;
      setInputText(value);
      setCommittedValue(value);
      setIsOpen(false);
      setSuggestions([]);
    }
  }, [value]);

  useEffect(() => {
    if (disabled) {
      setIsOpen(false);
      setLoading(false);
      setSuggestions([]);
    }
  }, [disabled]);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < minChars) {
      setIsOpen(false);
      setSuggestions([]);
      return;
    }

    if (selectionMadeRef.current || debouncedQuery === committedValue) {
      selectionMadeRef.current = false;
      return;
    }

    let cancelled = false;
    setLoading(true);
    setIsOpen(true);
    setHighlighted(-1);

    getSuggestionsRef
      .current(debouncedQuery)
      .then((results) => {
        if (!cancelled) {
          setSuggestions(results ?? []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSuggestions([]);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, minChars, committedValue]);

  const selectSuggestion = useCallback(
    (suggestion: Suggestion) => {
      selectionMadeRef.current = true;
      setInputText(suggestion.label);
      setCommittedValue(suggestion.label);
      setSuggestions([]);
      setIsOpen(false);
      setHighlighted(-1);
      onChange?.(suggestion.label, suggestion);
      inputRef.current?.blur();
    },
    [onChange],
  );

  function handlePopoverClose() {
    if (!selectionMadeRef.current) setInputText(committedValue);
    selectionMadeRef.current = false;
    setIsOpen(false);
    setHighlighted(-1);
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (!isOpen) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (suggestions.length === 0) return;
      setHighlighted((current) => (current + 1) % suggestions.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (suggestions.length === 0) return;
      setHighlighted((current) => (current - 1 + suggestions.length) % suggestions.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (highlighted >= 0 && highlighted < suggestions.length) selectSuggestion(suggestions[highlighted]);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setIsOpen(false);
      setInputText(committedValue);
      setHighlighted(-1);
    } else if (event.key === 'Tab') {
      setIsOpen(false);
      setHighlighted(-1);
    }
  }

  const isError = Boolean(error && !disabled);
  const hasLeft = Boolean(startAdornment);

  return (
    <LocationFieldRoot data-annotation-target="LocationSuggestionField" sx={sx} {...props}>
      {label && !hideLabel && (
        <LocationLabelRow>
          <LocationLabelText>{label}</LocationLabelText>
          {required && <LocationRequiredMark component="span">*</LocationRequiredMark>}
          {tooltip && <IconTooltip title={tooltip} size={18} />}
        </LocationLabelRow>
      )}

      <LocationSrOnly aria-live="polite" aria-atomic="true">
        {isOpen && !loading && suggestions.length > 0 &&
          `${suggestions.length} suggestion${suggestions.length !== 1 ? 's' : ''} available`}
        {isOpen && !loading && suggestions.length === 0 && noResultsText}
      </LocationSrOnly>

      <Box ref={anchorRef}>
        <LocationInputBox
          isError={isError}
          isFocused={isFocused}
          isDisabled={disabled}
          isSmall={isSmall}
          hasLeft={hasLeft}
        >
          {startAdornment && (
            <LocationAdornmentWrap component="span">
              <LocationAdornmentSlot component="span" iconSize={iconSize}>{startAdornment}</LocationAdornmentSlot>
            </LocationAdornmentWrap>
          )}

          <LocationInputBase
            inputRef={inputRef}
            value={inputText}
            onChange={(event) => setInputText(event.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            isSmall={isSmall}
            inputProps={{
              role: 'combobox',
              'aria-expanded': isOpen,
              'aria-haspopup': 'listbox',
              'aria-controls': 'lsf-listbox',
              'aria-activedescendant': highlighted >= 0 ? `lsf-option-${highlighted}` : undefined,
              'aria-label': label ?? placeholder ?? 'Location search',
            }}
          />

          {endAdornment && (
            <LocationAdornmentWrap component="span">
              <LocationAdornmentSlot component="span" iconSize={iconSize}>{endAdornment}</LocationAdornmentSlot>
            </LocationAdornmentWrap>
          )}

          {inputText ? (
            <LocationClearButton
              component="span"
              onClick={(event: React.MouseEvent) => {
                event.stopPropagation();
                setInputText('');
                setCommittedValue('');
                setSuggestions([]);
                onChange?.('', { label: '' });
                inputRef.current?.focus();
              }}
            >
              <LocationAdornmentSlot component="span" iconSize={iconSize}>
                <CloseFilledIcon size={iconSize} color="currentColor" />
              </LocationAdornmentSlot>
            </LocationClearButton>
          ) : (
            <LocationAdornmentWrap component="span">
              <LocationAdornmentSlot component="span" iconSize={iconSize}>
                <LocationOutlineIcon size={iconSize} color={theme.semantic.text.secondary} />
              </LocationAdornmentSlot>
            </LocationAdornmentWrap>
          )}
        </LocationInputBox>
      </Box>

      {isError && (
        <LocationErrorRow>
          {errorIcon ?? <WarningOutlineIcon size={16} color={theme.semantic.error.main} />}
          <LocationErrorText>{error}</LocationErrorText>
        </LocationErrorRow>
      )}

      {helperText && !isError && <LocationHelperText>{helperText}</LocationHelperText>}

      <Popover
        open={isOpen}
        anchorEl={anchorRef.current}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: isDropdownTop ? 'top' : 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: isDropdownTop ? 'bottom' : 'top', horizontal: 'left' }}
        disableAutoFocus
        disableEnforceFocus
        disablePortal={false}
        slotProps={{
          paper: getColorModePaperProps(inheritedMode, {
            borderRadius: theme.customBorderRadius.md,
            overflow: 'visible',
            boxShadow: 'none',
            mt: isDropdownTop ? 0 : theme.customSpacing[1],
            mb: isDropdownTop ? theme.customSpacing[1] : 0,
            bgcolor: theme.semantic.common.white,
            backgroundImage: theme.surfaceOverlay.high,
          }),
        }}
      >
        <SmoothBox
          id="lsf-listbox"
          role="listbox"
          aria-busy={loading}
          smoothRadius={theme.customBorderRadius.md}
          sx={{
            bgcolor: theme.semantic.common.white,
            backgroundImage: theme.surfaceOverlay.high,
            border: `1px solid ${theme.semantic.divider}`,
            boxShadow: theme.customShadows.md,
            maxHeight: dropdownMaxHeight,
            overflowY: 'auto',
            minWidth: 'max-content',
          }}
        >
          <LocationSuggestionList>
            {loading && (
              <LocationCenteredBox>
                <CircularProgress size={20} />
              </LocationCenteredBox>
            )}

            {!loading && suggestions.map((suggestion, index) => {
              const isHighlighted = index === highlighted;
              return (
                <LocationSuggestionItem
                  key={suggestion.id ?? `${suggestion.label}__${index}`}
                  id={`lsf-option-${index}`}
                  role="option"
                  aria-selected={isHighlighted}
                  isHighlighted={isHighlighted}
                  onMouseDown={(event: React.MouseEvent) => {
                    event.preventDefault();
                    selectSuggestion(suggestion);
                  }}
                  onMouseEnter={() => setHighlighted(index)}
                  onMouseLeave={() => setHighlighted(-1)}
                >
                  <LocationSuggestionLabel>{suggestion.label}</LocationSuggestionLabel>
                  {suggestion.sublabel && (
                    <LocationSuggestionSublabel>{suggestion.sublabel}</LocationSuggestionSublabel>
                  )}
                </LocationSuggestionItem>
              );
            })}

            {!loading && suggestions.length === 0 && (
              <LocationCenteredBox>
                <LocationNoResultsText>{noResultsText}</LocationNoResultsText>
              </LocationCenteredBox>
            )}
          </LocationSuggestionList>
        </SmoothBox>
      </Popover>
    </LocationFieldRoot>
  );
}
