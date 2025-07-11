import { Injectable, Signal, signal } from '@angular/core';
import { InventoryItem } from './remote-inventory.model';
import { TableLazyLoadEvent } from 'primeng/table';

@Injectable({ providedIn: 'root' })
export class RemoteInventoryLocationStore {
  private _inventory = signal<InventoryItem[]>([]);
  private _selectedItem = signal<InventoryItem | null>(null);
  private _total = signal(0);
  private _isLoading = signal(false);
  private _first = signal(0);

  inventory(): Signal<InventoryItem[]> {
    return this._inventory.asReadonly();
  }

  selectedItem(): Signal<InventoryItem | null> {
    return this._selectedItem.asReadonly();
  }

  total(): Signal<number> {
    return this._total.asReadonly();
  }

  isLoading(): Signal<boolean> {
    return this._isLoading.asReadonly();
  }

  first(): Signal<number> {
    return this._first.asReadonly();
  }

  selectItem(item: InventoryItem) {
    this._selectedItem.set(item);
  }

  deleteSelected() {
    const selected = this._selectedItem();
    if (!selected) return;
    if (!confirm(`Delete item ${selected.medName}?`)) return;

    const updated = this._inventory().filter(i => i.id !== selected.id);
    this._inventory.set(updated);
    this._total.set(updated.length);
    this._selectedItem.set(null);
  }

  addItem(item: InventoryItem) {
    const current = this._inventory();
    this._inventory.set([...current, item]);
    this._total.set(current.length + 1);
  }

  loadInventory(event: TableLazyLoadEvent) {
    this._isLoading.set(true);

    setTimeout(() => {
      const allItems = Array.from({ length: 20 }).map((_, i) => ({
        id: `${i + 1}`,
        medName: `Drug ${i + 1}`,
        unit: '1 TAB',
        bin: `B-${i + 1}`,
        qtyLoaded: `${Math.floor(Math.random() * 100)}`,
        lastLoaded: new Date().toLocaleDateString(),
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90).toLocaleDateString(),
      }));

      const first = event.first ?? 0;
      const rows = event.rows ?? 10;
      const pagedData = allItems.slice(first, first + rows);

      this._inventory.set(pagedData);
      this._total.set(allItems.length);
      this._first.set(first);
      this._isLoading.set(false);
    }, 500);
  }
}
