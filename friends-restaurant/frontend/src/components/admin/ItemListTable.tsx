import React, { useState } from 'react';
import {
  Edit2,
  Trash2,
  Search,
  Check,
  X,
  Utensils,
  Plus,
  Eye,
  EyeOff,
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
    <div className="bg-[#16161b] border border-[#2b2b34] rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5)] space-y-4">
      {/* Table Toolbar */}
      <div className="p-4 sm:p-5 border-b border-[#2b2b34] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-headline text-lg font-bold text-white flex items-center gap-2">
              <Utensils className="w-5 h-5 text-[#FFBD18]" />
              <span>Menu Dishes &amp; Live Pricing</span>
            </h3>
            <p className="font-body text-xs text-zinc-300 mt-1">
              Instant dish editing, price updates, and customer menu visibility toggles.
            </p>
          </div>

          <Button
            variant="yellow"
            size="md"
            onClick={onAddNew}
            leftIcon={<Plus className="w-4 h-4 text-black font-bold" />}
          >
            Add New Dish
          </Button>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by dish name or ingredient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#18181f] text-white placeholder:text-zinc-500 text-xs sm:text-sm rounded-lg border border-[#383844] pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#FFBD18] focus:ring-1 focus:ring-[#FFBD18] transition-all"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2.5">
            <span className="font-headline text-xs font-bold uppercase tracking-wider text-zinc-300 shrink-0">
              Section:
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#18181f] text-white text-xs sm:text-sm rounded-lg border border-[#383844] px-3.5 py-2.5 focus:outline-none focus:border-[#FFBD18] focus:ring-1 focus:ring-[#FFBD18] cursor-pointer"
            >
              <option value="all" className="bg-[#18181f] text-white">All Sections ({items.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#18181f] text-white">
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
            <tr className="border-b border-[#2b2b34] bg-[#111115] text-zinc-300 uppercase font-headline text-[11px] font-bold tracking-wider">
              <th className="py-3 px-4">Dish</th>
              <th className="py-3 px-4">Section</th>
              <th className="py-3 px-4">Price (ETB)</th>
              <th className="py-3 px-4 text-center">Menu Visibility</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2b2b34]/80">
            {filteredItems.map((item) => (
              <tr
                key={item.id}
                className={`hover:bg-[#1e1e26] transition-colors ${
                  !item.isAvailable ? 'bg-black/40 opacity-70' : ''
                }`}
              >
                {/* Dish column */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#202028] border border-[#383844] shrink-0">
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
                        <div className="w-full h-full flex items-center justify-center text-zinc-400">
                          <Utensils className="w-5 h-5 text-zinc-500" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="font-headline font-bold text-white text-base tracking-wide truncate max-w-xs sm:max-w-md">
                        {item.name}
                      </div>
                      {item.description && (
                        <p className="text-xs text-zinc-400 truncate max-w-xs sm:max-w-md mt-0.5">
                          {item.description}
                        </p>
                      )}
                      {item.tags && (
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {item.tags.split(',').slice(0, 3).map((t, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-headline uppercase font-bold px-2 py-0.5 rounded-full bg-[#FFBD18]/15 text-[#FFBD18] border border-[#FFBD18]/30"
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
                  <span className="px-2.5 py-1 rounded-full text-xs font-headline uppercase font-bold bg-[#20202a] text-zinc-200 border border-[#383844]">
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
                        className="w-20 bg-[#18181f] text-white text-xs px-2.5 py-1 rounded border border-[#FFBD18] focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveQuickPrice(item)}
                        className="p-1 rounded bg-[#FFBD18] text-black hover:brightness-110 font-bold"
                        title="Save price"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setQuickPriceId(null)}
                        className="p-1 rounded bg-[#202028] text-zinc-400 hover:text-white"
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
                        className={`font-headline font-bold font-mono text-base ${
                          item.price === null ? 'text-[#16B9E8] text-xs' : 'text-[#FFBD18]'
                        }`}
                      >
                        {item.price !== null && item.price !== undefined
                          ? `${item.price.toLocaleString()} ETB`
                          : 'Market Price'}
                      </span>
                      <Edit2 className="w-3.5 h-3.5 text-zinc-400 opacity-0 group-hover/price:opacity-100 transition-opacity" />
                    </div>
                  )}
                </td>

                {/* Status Toggle (Visible on Menu / Hidden) */}
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(item)}
                    disabled={toggleStatusMutation.isPending}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-headline font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      item.isAvailable
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/25'
                        : 'bg-rose-500/15 text-rose-300 border border-rose-500/40 hover:bg-rose-500/25'
                    }`}
                    title={item.isAvailable ? 'Click to temporarily hide from customer menu' : 'Click to make visible on customer menu'}
                  >
                    {item.isAvailable ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Visible on Menu</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-rose-400" />
                        <span>Hidden / Paused</span>
                      </>
                    )}
                  </button>
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onEditItem(item)}
                      className="p-2 rounded-lg text-zinc-300 hover:text-[#FFBD18] hover:bg-[#FFBD18]/15 border border-transparent hover:border-[#FFBD18]/30 transition-all cursor-pointer"
                      title="Edit Dish Details"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteCandidate(item)}
                      className="p-2 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/15 border border-transparent hover:border-rose-500/30 transition-all cursor-pointer"
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
                <td colSpan={5} className="py-12 text-center text-zinc-400 font-medium">
                  No dishes found matching your search.
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
        subtitle="This will permanently delete the dish from the digital menu"
      >
        <div className="space-y-4">
          <p className="text-sm text-zinc-200">
            Are you sure you want to remove{' '}
            <strong className="text-white font-bold">&ldquo;{deleteCandidate?.name}&rdquo;</strong> from the
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
