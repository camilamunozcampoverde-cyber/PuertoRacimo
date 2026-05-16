/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  disponible: string;
  categoria: string;
  masa?: 'Verde' | 'Pintón' | 'Maduro';
}

export interface CartItem extends Product {
  quantity: number;
}

export type PaymentMethod = 'Efectivo' | 'Transferencia';

export const CATEGORIES = [
  { id: 'tigrillos', label: 'Tigrillos', icon: '🍳' },
  { id: 'bolones', label: 'Bolones', icon: '🥯' },
  { id: 'extras', label: 'Extras', icon: '☕' },
];

export const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbzmgurmBtTB2Ozs0ecNoPQR-CNcK2LumzkMoYfPFzAntos7Z67kwZhZme-hoxD6k8LAdQ/exec";
