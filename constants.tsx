
import React from 'react';
import { Question } from './types';

export const QUESTIONS: Question[] = [
  {
    id: 'level',
    label: 'Livello Tecnico',
    options: ['Entry Level', 'Intermedio', 'Avanzato', 'Esperto / PRO', 'Freeride Specialist']
  },
  {
    id: 'physique',
    label: 'Parametri Biometrici',
    options: ['Lightweight (<70kg)', 'Medium (70-85kg)', 'Heavyweight (>85kg)', 'Specifico / Manuale']
  },
  {
    id: 'terrain',
    label: 'Ambiente d\'Uso',
    options: ['100% Pista', 'All-Mountain (70/30)', 'Freeride Oriented', 'Backcountry / Explorer']
  },
  {
    id: 'snowType',
    label: 'Consistenza Neve',
    options: ['Ghiacciata / Artificiale', 'Compatta / Millerighe', 'Trasformata / Pappa', 'Powder / Fresca']
  },
  {
    id: 'style',
    label: 'Dinamica di Sciata',
    options: ['Tecnico / Tradizionale', 'Moderno / Fluido', 'Potenza / Carving', 'Playful / Freestyle']
  },
  {
    id: 'speed',
    label: 'Regime di Velocità',
    options: ['Cruising / Relax', 'Sostenuta / Sportiva', 'High Speed / Race']
  },
  {
    id: 'turns',
    label: 'Geometria Curve',
    options: ['Corto Raggio / Slalom', 'Medio Raggio', 'Ampio Raggio / GS']
  },
  {
    id: 'typicalDay',
    label: 'Scenario Operativo',
    options: [
      'Mattina Pista / Pomeriggio Variabile',
      'Caccia alla Polvere',
      'Pista Perfetta / Carving Hard',
      'Esplorazione Totale'
    ]
  },
  {
    id: 'freerideInterest',
    label: 'Protocollo Freeride',
    options: ['Attivo (Uso Kit Sicurezza)', 'Occasionale (Bordopista)', 'Nessun Interesse']
  }
];

export const SAR_LOGO = (
  <svg viewBox="0 0 1000 700" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 450 L350 200 L550 400 L750 150 L950 450" fill="none" stroke="#8CC63F" strokeWidth="40" strokeLinecap="round" strokeLinejoin="round" />
    <text x="500" y="550" textAnchor="middle" fill="#8CC63F" style={{ fontSize: '180px', fontWeight: '900', fontStyle: 'italic' }}>SAR</text>
    <rect x="100" y="580" width="800" height="10" fill="#8CC63F" />
    <text x="500" y="650" textAnchor="middle" fill="#fff" style={{ fontSize: '60px', fontWeight: '800', letterSpacing: '5px' }}>SNOWRIDERS PRO</text>
  </svg>
);
