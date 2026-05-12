import { Gender } from '../types';

/**
 * Formula Source: US Navy Standard
 * Men: 495 / (1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)) - 450
 * Women: 495 / (1.29579 - 0.35004 * log10(waist + hip - neck) + 0.22100 * log10(height)) - 450
 */
export function calculateNavyBF(
  gender: Gender,
  height: number,
  neck: number,
  waist: number,
  hip?: number
): number {
  if (!height || !waist || !neck) return 0;
  
  if (gender === 'male') {
    // Official Metric Formula
    const diff = waist - neck;
    if (diff <= 0) return 0;
    const val = 1.0324 - 0.19077 * Math.log10(diff) + 0.15456 * Math.log10(height);
    return 495 / val - 450;
  } else {
    // Official Metric Formula
    if (!hip) return 0;
    const diff = waist + hip - neck;
    if (diff <= 0) return 0;
    const val = 1.29579 - 0.35004 * Math.log10(diff) + 0.22100 * Math.log10(height);
    return 495 / val - 450;
  }
}

export function formatValue(value: number | undefined, unit: string = ''): string {
  if (value === undefined || isNaN(value)) return '-';
  return `${value.toFixed(1)}${unit}`;
}

export function calculateBMI(weight: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return weight / (heightM * heightM);
}

export function calculateLeanMass(weight: number, bfPercent: number): number {
  return (weight * (1 - bfPercent / 100));
}

export function calculateFatMass(weight: number, bfPercent: number): number {
  return (weight * (bfPercent / 100));
}

export function getBFClassification(gender: Gender, bf: number): { label: string; color: string } {
  if (gender === 'male') {
    if (bf < 6) return { label: 'EXTREMAMENTE SECO', color: 'text-red-500' };
    if (bf < 14) return { label: 'ATLÉTICO', color: 'text-military-success' };
    if (bf < 18) return { label: 'FITNESS', color: 'text-military-accent' };
    if (bf < 25) return { label: 'NORMAL', color: 'text-slate-300' };
    return { label: 'ACIMA DO IDEAL', color: 'text-yellow-500' };
  } else {
    if (bf < 14) return { label: 'EXTREMAMENTE SECO', color: 'text-red-500' };
    if (bf < 21) return { label: 'ATLÉTICA', color: 'text-military-success' };
    if (bf < 25) return { label: 'FITNESS', color: 'text-military-accent' };
    if (bf < 32) return { label: 'NORMAL', color: 'text-slate-300' };
    return { label: 'ACIMA DO IDEAL', color: 'text-yellow-500' };
  }
}
