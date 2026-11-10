import React, { useState } from 'react';
import { Plus, ArrowUp, ArrowDown, Edit2, Trash2, Folder, Utensils, Wine, Layers } from 'lucide-react';
import { Category } from '../../types/menu';
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useReorderCategories,
} from '../../hooks/useMenu';
import { Button } from '../ui/Button';
import { Input, TextArea } from '../ui/Input';
import { Modal } from '../ui/Modal';

interface CategoryManagerProps {
  categories: Category[];
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({ categories }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Category | null>(null);

  // Parent Category Filter
  const [filterParent, setFilterParent] = useState<'ALL' | 'FOOD' | 'DRINKS'>('ALL');

  // Form states
  const [name, setName] = useState('');
  const [parentCategory, setParentCategory] = useState<'FOOD' | 'DRINKS'>('FOOD');
  const [description, setDescription] = useState('');

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();
  const reorderMutation = useReorderCategories();

  const handleOpenAdd = () => {
    setName('');
    setParentCategory(filterParent === 'DRINKS' ? 'DRINKS' : 'FOOD');
    setDescription('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setParentCategory(cat.parentCategory === 'DRINKS' ? 'DRINKS' : 'FOOD');
    setDescription(cat.description || '');
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await createMutation.mutateAsync({
      name: name.trim(),
      parentCategory,
      description: description.trim(),
    });

    setIsAddModalOpen(false);
    setName('');
    setDescription('');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !name.trim()) return;

    await updateMutation.mutateAsync({
      id: editingCategory.id,
      data: {
        name: name.trim(),
        parentCategory,
        description: description.trim(),
      },
    });

    setEditingCategory(null);
  };

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    await deleteMutation.mutateAsync(deleteCandidate.id);
    setDeleteCandidate(null);
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const newOrder = [...categories];
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(targetIndex, 0, moved);

    const orderedIds = newOrder.map((c) => c.id);
    await reorderMutation.mutateAsync(orderedIds);
  };

  const filteredCategories = categories.filter((cat) => {
    if (filterParent === 'ALL') return true;
    return (cat.parentCategory || 'FOOD') === filterParent;
  });

  const foodCount = categories.filter((c) => (c.parentCategory || 'FOOD') === 'FOOD').length;
  const drinkCount = categories.filter((c) => c.parentCategory === 'DRINKS').length;

  return (
    <div className="bg-[#121212] border border-[#222222] rounded-2xl p-6 space-y-5 shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#222222]">
        <div>
          <h3 className="font-headline text-lg font-bold text-white flex items-center gap-2">
            <Folder className="w-5 h-5 text-white" />
            <span>Menu Categories &amp; Main Sections</span>
          </h3>
          <p className="font-body text-xs text-[#A1A1AA] mt-1">
            Organize main sections (FOOD vs DRINKS) and their subcategories (Pasta, Pizza, Cocktails, Beers).
          </p>
        </div>

        <Button
          variant="yellow"
          size="sm"
          onClick={handleOpenAdd}
          leftIcon={<Plus className="w-4 h-4 text-black font-extrabold" />}
        >
          Add Category
        </Button>
      </div>

      {/* Main Section Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1c1c1c] pb-3">
        <button
          type="button"
          onClick={() => setFilterParent('ALL')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-headline font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
            filterParent === 'ALL'
              ? 'bg-white text-black'
              : 'bg-[#181818] text-[#A1A1AA] hover:text-white border border-[#262626]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All ({categories.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterParent('FOOD')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-headline font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
            filterParent === 'FOOD'
              ? 'bg-[#FFBD18] text-black font-extrabold shadow-[0_0_12px_rgba(255,189,24,0.3)]'
              : 'bg-[#181818] text-[#A1A1AA] hover:text-white border border-[#262626]'
          }`}
        >
          <Utensils className="w-3.5 h-3.5" />
          <span>Food ({foodCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterParent('DRINKS')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-headline font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
            filterParent === 'DRINKS'
              ? 'bg-[#16B9E8] text-black font-extrabold shadow-[0_0_12px_rgba(22,185,232,0.3)]'
              : 'bg-[#181818] text-[#A1A1AA] hover:text-white border border-[#262626]'
          }`}
        >
          <Wine className="w-3.5 h-3.5" />
          <span>Drinks ({drinkCount})</span>
        </button>
      </div>

      {/* Category List */}
      <div className="divide-y divide-[#1c1c1c] border border-[#222222] rounded-2xl overflow-hidden bg-[#0a0a0a]">
        {filteredCategories.map((cat, index) => {
          const itemCount = cat.items ? cat.items.length : cat._count?.items ?? 0;
          const isDrink = cat.parentCategory === 'DRINKS';

          return (
            <div
              key={cat.id}
              className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-[#141414] transition-colors"
            >
              <div className="flex items-center gap-4 min-w-0">
                {/* Reorder Up/Down */}
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    disabled={index === 0 || reorderMutation.isPending}
                    onClick={() => handleMove(index, 'up')}
                    className="p-1.5 rounded-lg bg-[#181818] hover:bg-[#222222] text-[#A1A1AA] hover:text-white disabled:opacity-20 cursor-pointer transition-colors"
                    title="Move Section Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === categories.length - 1 || reorderMutation.isPending}
                    onClick={() => handleMove(index, 'down')}
                    className="p-1.5 rounded-lg bg-[#181818] hover:bg-[#222222] text-[#A1A1AA] hover:text-white disabled:opacity-20 cursor-pointer transition-colors"
                    title="Move Section Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Name, Badge & Count */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-headline text-base font-bold text-white tracking-wide truncate">
                      {cat.name}
                    </span>

                    {/* Main Parent Section Badge */}
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-headline font-bold uppercase tracking-wider border ${
                        isDrink
                          ? 'bg-[#16B9E8]/10 text-[#16B9E8] border-[#16B9E8]/30'
                          : 'bg-[#FFBD18]/10 text-[#FFBD18] border-[#FFBD18]/30'
                      }`}
                    >
                      {isDrink ? '🍹 Drinks' : '🍽️ Food'}
                    </span>

                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/5 text-[#d4d4d8] border border-white/10 font-headline font-semibold">
                      {itemCount} {itemCount === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  {cat.description && (
                    <p className="font-body text-xs text-[#A1A1AA] truncate max-w-md mt-1">
                      {cat.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(cat)}
                  className="p-2 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                  title="Edit Category"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteCandidate(cat)}
                  className="p-2 rounded-lg text-[#71717A] hover:text-red-400 hover:bg-white/5 transition-all cursor-pointer"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredCategories.length === 0 && (
          <div className="py-14 text-center text-[#A1A1AA] font-medium">
            No categories found in this section. Click &quot;Add Category&quot; to create one.
          </div>
        )}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create Menu Category"
        subtitle="This category will appear under Food or Drinks on the customer digital menu"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          {/* Main Category Selection (FOOD vs DRINKS) */}
          <div className="space-y-1.5">
            <label className="block font-headline text-[11px] uppercase tracking-wider font-bold text-white">
              Main Department / Section
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setParentCategory('FOOD')}
                className={`py-3 px-4 rounded-xl border font-headline text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  parentCategory === 'FOOD'
                    ? 'bg-[#FFBD18] text-black border-[#FFBD18] shadow-[0_0_15px_rgba(255,189,24,0.3)]'
                    : 'bg-[#181818] text-[#A1A1AA] border-[#262626] hover:text-white'
                }`}
              >
                <Utensils className="w-4 h-4" />
                <span>FOOD (Meals, Pasta...)</span>
              </button>

              <button
                type="button"
                onClick={() => setParentCategory('DRINKS')}
                className={`py-3 px-4 rounded-xl border font-headline text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  parentCategory === 'DRINKS'
                    ? 'bg-[#16B9E8] text-black border-[#16B9E8] shadow-[0_0_15px_rgba(22,185,232,0.3)]'
                    : 'bg-[#181818] text-[#A1A1AA] border-[#262626] hover:text-white'
                }`}
              >
                <Wine className="w-4 h-4" />
                <span>DRINKS (Cocktails, Soft...)</span>
              </button>
            </div>
          </div>

          <Input
            label="Category Name"
            placeholder={parentCategory === 'FOOD' ? 'e.g. Pasta, Burgers, Pizza, Soups, Ethiopian Specials' : 'e.g. Soft Drinks, Mojitos, Cold Drinks, Draft Beers'}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />

          <TextArea
            label="Description (Optional)"
            placeholder="Brief description to display for this menu section..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex justify-end gap-2.5 pt-2">
            <Button variant="secondary" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="yellow" type="submit" isLoading={createMutation.isPending}>
              Create Category
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        title={`Edit Category: ${editingCategory?.name}`}
        subtitle="Rename category, switch between Food and Drinks, or update description"
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          {/* Main Category Selection */}
          <div className="space-y-1.5">
            <label className="block font-headline text-[11px] uppercase tracking-wider font-bold text-white">
              Main Department / Section
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setParentCategory('FOOD')}
                className={`py-3 px-4 rounded-xl border font-headline text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  parentCategory === 'FOOD'
                    ? 'bg-[#FFBD18] text-black border-[#FFBD18] shadow-[0_0_15px_rgba(255,189,24,0.3)]'
                    : 'bg-[#181818] text-[#A1A1AA] border-[#262626] hover:text-white'
                }`}
              >
                <Utensils className="w-4 h-4" />
                <span>FOOD</span>
              </button>

              <button
                type="button"
                onClick={() => setParentCategory('DRINKS')}
                className={`py-3 px-4 rounded-xl border font-headline text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  parentCategory === 'DRINKS'
                    ? 'bg-[#16B9E8] text-black border-[#16B9E8] shadow-[0_0_15px_rgba(22,185,232,0.3)]'
                    : 'bg-[#181818] text-[#A1A1AA] border-[#262626] hover:text-white'
                }`}
              >
                <Wine className="w-4 h-4" />
                <span>DRINKS</span>
              </button>
            </div>
          </div>

          <Input
            label="Category Name"
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />

          <TextArea
            label="Description"
            placeholder="Brief description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex justify-end gap-2.5 pt-2">
            <Button variant="secondary" type="button" onClick={() => setEditingCategory(null)}>
              Cancel
            </Button>
            <Button variant="yellow" type="submit" isLoading={updateMutation.isPending}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteCandidate}
        onClose={() => setDeleteCandidate(null)}
        title="Delete Menu Category?"
        subtitle="This action cannot be undone"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#A1A1AA]">
            Are you sure you want to delete category{' '}
            <strong className="text-white font-bold">&ldquo;{deleteCandidate?.name}&rdquo;</strong>?
            Any dishes inside this category will also be removed.
          </p>
          <div className="flex justify-end gap-2.5 pt-2">
            <Button variant="secondary" onClick={() => setDeleteCandidate(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={deleteMutation.isPending}
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
