import React, { useState } from 'react';
import {
  Edit2,
  Trash2,
  Search,
  Check,
  X,
  Utensils,
  Plus,
} from 'lucide-react';
import { Category, MenuItem } from '../../types/menu';
import { useToggleItemStatus, useUpdateItem, useDeleteItem } from '../../hooks/useMenu';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface ItemListTableProps {
  items: MenuItem[];
  categories: Category[];
  onEditItem: (item: MenuItem) => void;
  onAddNew: () => void;
}

export const ItemListTable: React.FC<ItemListTableProps> = ({
  items,
  categories,
  onEditItem,
  onAddNew,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [deleteCandidate, setDeleteCandidate] = useState<MenuItem | null>(null);

  // Quick inline price editing state
  const [quickPriceId, setQuickPriceId] = useState<string | null>(null);
  const [quickPriceVal, setQuickPriceVal] = useState<string>('');

  const toggleStatusMutation = useToggleItemStatus();
  const updateItemMutation = useUpdateItem();
  const deleteItemMutation = useDeleteItem();

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.categoryId === selectedCategory;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const handleToggleStatus = (item: MenuItem) => {
    toggleStatusMutation.mutate({
      id: item.id,
      isAvailable: !item.isAvailable,
    });
  };

  const handleStartQuickPrice = (item: MenuItem) => {
    setQuickPriceId(item.id);
    setQuickPriceVal(item.price !== null && item.price !== undefined ? String(item.price) : '');
  };

  const handleSaveQuickPrice = async (item: MenuItem) => {
    const newPrice = quickPriceVal.trim() === '' ? null : parseFloat(quickPriceVal);
    await updateItemMutation.mutateAsync({
      id: item.id,
      data: { price: newPrice },
    });
    setQuickPriceId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCandidate) return;
    await deleteItemMutation.mutateAsync(deleteCandidate.id);
    setDeleteCandidate(null);
  };

  return (
    <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl overflow-hidden shadow-card-elevated space-y-4">
      {/* Table Toolbar */}
      <div className="p-4 sm:p-5 border-b border-outline-variant/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-headline text-lg font-bold text-primary flex items-center gap-2">
              <Utensils className="w-5 h-5 text-primary-container" />
              <span>Menu Inventory &amp; Live Pricing</span>
            </h3>
            <p className="font-body text-xs text-on-surface-variant mt-0.5">
              Instant dish editing, stock toggle, and market price adjustments.
            </p>
          </div>

          <Button
            variant="yellow"
            size="md"
            onClick={onAddNew}
            leftIcon={<Plus className="w-4 h-4 text-on-primary-container" />}
          >
            Add New Dish
          </Button>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
            <input
              type="text"
              placeholder="Search by dish name or ingredient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface-container text-on-surface placeholder:text-outline text-xs sm:text-sm rounded border border-outline-variant/30 pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary-container"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <span className="font-headline text-xs font-semibold uppercase text-outline shrink-0">
              Category:
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-surface-container text-on-surface text-xs sm:text-sm rounded border border-outline-variant/30 px-3 py-2.5 focus:outline-none focus:border-primary-container"
            >
              <option value="all">All Categories ({items.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-outline-variant/20 bg-surface-container-lowest/60 text-outline uppercase font-headline text-[10px] font-semibold tracking-wider">
              <th className="py-3 px-4">Dish</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Price (ETB)</th>
              <th className="py-3 px-4 text-center">Live Availability</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/15">
            {filteredItems.map((item) => (
              <tr
                key={item.id}
                className={`hover:bg-surface-container-high/40 transition-colors ${
                  !item.isAvailable ? 'bg-black/30 opacity-70' : ''
                }`}
              >
                {/* Dish column */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded overflow-hidden bg-surface-container border border-outline-variant/30 shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-outline">
                          <Utensils className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="font-headline font-semibold text-on-surface tracking-wide truncate max-w-xs">
                        {item.name}
                      </div>
                      {item.tags && (
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {item.tags.split(',').slice(0, 2).map((t, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] font-headline uppercase font-semibold px-1.5 py-0.2 rounded bg-surface-container-high text-outline"
                            >
                              {t.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="px-2.5 py-1 rounded text-[11px] font-headline uppercase font-semibold bg-surface-container-high text-on-surface-variant border border-outline-variant/30">
                    {item.category?.name || 'Uncategorized'}
                  </span>
                </td>

                {/* Price (with quick edit support) */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  {quickPriceId === item.id ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        step="any"
                        placeholder="Mkt"
                        value={quickPriceVal}
                        onChange={(e) => setQuickPriceVal(e.target.value)}
                        className="w-20 bg-surface-container text-white text-xs px-2 py-1 rounded border border-primary-container focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveQuickPrice(item)}
                        className="p-1 rounded bg-primary-container text-on-primary-container hover:brightness-110"
                        title="Save price"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setQuickPriceId(null)}
                        className="p-1 rounded bg-surface-container-high text-outline hover:text-white"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      className="group/price flex items-center gap-1.5 cursor-pointer"
                      onClick={() => handleStartQuickPrice(item)}
                      title="Click to quick-edit price"
                    >
                      <span
                        className={`font-headline font-bold ${
                          item.price === null ? 'text-tertiary-container text-xs' : 'text-primary-container'
                        }`}
                      >
                        {item.price !== null && item.price !== undefined
                          ? `${item.price.toLocaleString()} ETB`
                          : 'Market Price'}
                      </span>
                      <Edit2 className="w-3 h-3 text-outline opacity-0 group-hover/price:opacity-100 transition-opacity" />
                    </div>
                  )}
                </td>

                {/* Status Toggle (Live Available / Sold Out) */}
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(item)}
                    disabled={toggleStatusMutation.isPending}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-headline font-semibold uppercase tracking-wider transition-all ${
                      item.isAvailable
                        ? 'bg-primary-container/15 text-primary-container border border-primary-container/30 hover:bg-primary-container/25'
                        : 'bg-secondary-container/15 text-secondary border border-secondary-container/30 hover:bg-secondary-container/25'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        item.isAvailable ? 'bg-primary-container' : 'bg-secondary-container'
                      }`}
                    />
                    <span>{item.isAvailable ? 'Available' : 'Sold Out'}</span>
                  </button>
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onEditItem(item)}
                      className="p-2 rounded text-outline hover:text-primary hover:bg-surface-container-high transition-colors"
                      title="Edit Dish"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteCandidate(item)}
                      className="p-2 rounded text-outline hover:text-secondary hover:bg-secondary-container/15 transition-colors"
                      title="Delete Dish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-outline">
                  No dishes found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Item Modal */}
      <Modal
        isOpen={!!deleteCandidate}
        onClose={() => setDeleteCandidate(null)}
        title="Remove Menu Item?"
        subtitle="This will permanently delete the dish from the restaurant menu"
      >
        <div className="space-y-4">
          <p className="text-body-sm text-on-surface-variant">
            Are you sure you want to remove{' '}
            <strong className="text-primary">&ldquo;{deleteCandidate?.name}&rdquo;</strong> from the
            menu?
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setDeleteCandidate(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              isLoading={deleteItemMutation.isPending}
            >
              Delete Dish
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
