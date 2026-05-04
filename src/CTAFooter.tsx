'use client';

import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/material/styles';
import BaseButton from './BaseButton';
import TextareaField from './TextareaField';
import TextInputField from './TextInputField';
import Toast from './Toast';
import { useColorMode } from './ColorModeContext';
import { EmailIcon, LocationOutlineIcon, PhoneIcon } from './icons';
import {
  BrandText,
  ContactDetailsList,
  ContactIconWrap,
  ContactLabel,
  ContactRow,
  ContactValue,
  DarkFormOverridesWrapper,
  DefaultMapBox,
  DefaultMapLabel,
  DotPattern,
  FormGrid,
  FormSubtitle,
  FormTitle,
  FullWidthCell,
  GridContainer,
  LeftPanel,
  LogoImage,
  MapWrapper,
  PanelDivider,
  RightPanel,
  RightPanelDescription,
  SectionRoot,
  SubmitRow,
  WavesContainer,
} from './CTAFooter.styles';

export interface CTAFooterContactInfo {
  phone: string;
  email: string;
  address: string;
}

export interface CTAFooterFormValues {
  name: string;
  email: string;
  company: string;
  message: string;
}

export interface CTAFooterProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: React.ReactNode;
  brandName?: React.ReactNode;
  logoSrc?: string;
  logoAlt?: string;
  contact?: Partial<CTAFooterContactInfo>;
  map?: React.ReactNode;
  mapLabel?: React.ReactNode;
  submitLabel?: React.ReactNode;
  successMessage?: string;
  onSubmit?: (values: CTAFooterFormValues) => void | Promise<void>;
  sx?: SxProps<Theme>;
}

const DEFAULT_CONTACT: CTAFooterContactInfo = {
  phone: '+1 (800) 555-0199',
  email: 'hello@scheduleclosings.com',
  address: '100 Main St, Suite 200, Raleigh, NC 27601',
};

function generateWavePaths(count: number, viewW: number, phaseOffset = 0) {
  return Array.from({ length: count }, (_, i) => {
    const seed = ((i * 7919 + 104729) % 1000) / 1000;
    const seed2 = ((i * 6271 + 32749) % 1000) / 1000;
    const seed3 = ((i * 3571 + 87671) % 1000) / 1000;
    const baseY = -50 + i * 25 + (seed - 0.5) * 18;
    const amplitude = 12 + seed2 * 35;
    const frequency = 0.003 + seed3 * 0.004;
    const phase = seed * Math.PI * 4 + phaseOffset;
    const opacityCurve = seed2 * seed2 * seed2;
    const opacity = 0.03 + opacityCurve * 0.13;
    const strokeW = 0.4 + seed3 * 0.6 + opacityCurve * 0.5;
    const points: string[] = [];

    for (let x = -20; x <= viewW + 20; x += 20) {
      const waveY =
        baseY +
        Math.sin(x * frequency + phase) * amplitude +
        Math.sin(x * frequency * 2.3 + phase * 1.7) * (amplitude * 0.3);
      points.push(`${x === -20 ? 'M' : 'L'}${x},${waveY.toFixed(1)}`);
    }

    return { d: points.join(' '), opacity, strokeW };
  });
}

const WAVE_PATHS = generateWavePaths(40, 1400);

function WavesMotionOverlay() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const visibleRef = useRef(false);
  const startTimeRef = useRef(0);

  useEffect(() => {
    const svg = svgRef.current;
    const container = containerRef.current;
    if (!svg || !container) return undefined;

    const paths = svg.querySelectorAll('path');
    const seeds = Array.from({ length: paths.length }, (_, i) => ({
      baseY: -50 + i * 25 + (((i * 7919 + 104729) % 1000) / 1000 - 0.5) * 18,
      amplitude: 12 + (((i * 6271 + 32749) % 1000) / 1000) * 35,
      frequency: 0.003 + (((i * 3571 + 87671) % 1000) / 1000) * 0.004,
      phase: (((i * 7919 + 104729) % 1000) / 1000) * Math.PI * 4,
      speed: 0.5 + ((i * 6271 + 32749) % 1000) / 1000,
    }));

    function tick() {
      if (!visibleRef.current) {
        rafRef.current = 0;
        return;
      }

      const elapsed = (performance.now() - startTimeRef.current) / 1000;
      const phaseShift = elapsed * 0.4;

      for (let i = 0; i < paths.length; i += 1) {
        const seed = seeds[i];
        const phase = seed.phase + phaseShift * seed.speed;
        const pts: string[] = [];

        for (let x = -20; x <= 1420; x += 20) {
          const waveY =
            seed.baseY +
            Math.sin(x * seed.frequency + phase) * seed.amplitude +
            Math.sin(x * seed.frequency * 2.3 + phase * 1.7) * (seed.amplitude * 0.3);
          pts.push(`${x === -20 ? 'M' : 'L'}${x},${waveY.toFixed(1)}`);
        }

        paths[i].setAttribute('d', pts.join(' '));
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    function wake() {
      if (!rafRef.current) {
        startTimeRef.current = startTimeRef.current || performance.now();
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) wake();
      },
      { threshold: 0 },
    );
    observer.observe(container);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <WavesContainer ref={containerRef} aria-hidden="true">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 1400 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        {WAVE_PATHS.map((path, i) => (
          <path
            key={i}
            d={path.d}
            stroke={`rgba(255,255,255,${path.opacity.toFixed(3)})`}
            strokeWidth={path.strokeW.toFixed(2)}
            fill="none"
          />
        ))}
      </svg>
    </WavesContainer>
  );
}

export default function CTAFooter({
  title = 'Get in Touch',
  subtitle = 'Fill out the form and our team will get back to you within 24 hours.',
  description = 'The smarter way to find, book, and coordinate real estate closings.',
  brandName = 'Schedule Closings',
  logoSrc,
  logoAlt = 'Schedule Closings',
  contact,
  map,
  mapLabel = 'Raleigh, NC',
  submitLabel = 'Send Message',
  successMessage = "Message sent! We'll be in touch within 24 hours.",
  onSubmit,
  sx,
}: CTAFooterProps) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const resolvedContact = { ...DEFAULT_CONTACT, ...contact };
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [toastOpen, setToastOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const isValid = name.trim().length > 0 && email.trim().length > 0;

  const contactDetails = [
    { icon: <LocationOutlineIcon size={20} />, label: 'Address', value: resolvedContact.address },
    { icon: <EmailIcon size={20} />, label: 'Email', value: resolvedContact.email },
    { icon: <PhoneIcon size={20} />, label: 'Phone', value: resolvedContact.phone },
  ];

  async function handleSubmit() {
    if (!isValid || submitting) return;

    const values = {
      name: name.trim(),
      email: email.trim(),
      company: company.trim(),
      message: message.trim(),
    };

    setSubmitting(true);
    try {
      await onSubmit?.(values);
      setToastOpen(true);
      setName('');
      setEmail('');
      setCompany('');
      setMessage('');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <SectionRoot component="section" aria-label="Contact us" isDark={isDark} sx={sx}>
        <WavesMotionOverlay />

        <GridContainer>
          <LeftPanel isDark={isDark}>
            <DotPattern />

            <FormTitle>{title}</FormTitle>
            <FormSubtitle>{subtitle}</FormSubtitle>

            <DarkFormOverridesWrapper>
              <FormGrid>
                <TextInputField
                  label="Name"
                  placeholder="Your name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
                <TextInputField
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
                <FullWidthCell>
                  <TextInputField
                    label="Company"
                    placeholder="Your company name"
                    value={company}
                    onChange={(event) => setCompany(event.target.value)}
                  />
                </FullWidthCell>
                <FullWidthCell>
                  <TextareaField
                    label="Message"
                    placeholder="How can we help you?"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    minRows={4}
                  />
                </FullWidthCell>
              </FormGrid>

              <SubmitRow>
                <BaseButton
                  variant="filled"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={!isValid || submitting}
                  spinner={submitting}
                >
                  {submitLabel}
                </BaseButton>
              </SubmitRow>
            </DarkFormOverridesWrapper>
          </LeftPanel>

          <RightPanel isDark={isDark}>
            {logoSrc ? (
              <LogoImage src={logoSrc} alt={logoAlt} />
            ) : (
              <BrandText>{brandName}</BrandText>
            )}

            <RightPanelDescription isDark={isDark}>{description}</RightPanelDescription>

            <ContactDetailsList>
              {contactDetails.map((item) => (
                <ContactRow key={item.label}>
                  <ContactIconWrap isDark={isDark}>{item.icon}</ContactIconWrap>
                  <Box>
                    <ContactLabel isDark={isDark}>{item.label}</ContactLabel>
                    <ContactValue isDark={isDark}>{item.value}</ContactValue>
                  </Box>
                </ContactRow>
              ))}
            </ContactDetailsList>

            <PanelDivider />

            <MapWrapper>
              {map ?? (
                <DefaultMapBox>
                  <DefaultMapLabel>{mapLabel}</DefaultMapLabel>
                </DefaultMapBox>
              )}
            </MapWrapper>
          </RightPanel>
        </GridContainer>
      </SectionRoot>

      <Toast
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        message={successMessage}
        type="success"
      />
    </>
  );
}
