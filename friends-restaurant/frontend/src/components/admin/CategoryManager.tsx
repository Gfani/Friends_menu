import React, { useState } from 'react';
import { Plus, ArrowUp, ArrowDown, Edit2, Trash2, Folder } from 'lucide-react';
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

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();
  const reorderMutation = useReorderCategories();

  const handleOpenAdd = () => {
    setName('');
    setDescription('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await createMutation.mutateAsync({
      name: name.trim(),
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

  return (
    <div className="bg-[#121212] border border-[#222222] rounded-2xl p-6 space-y-5 shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#222222]">
        <div>
          <h3 className="font-headline text-lg font-bold text-white flex items-center gap-2">
            <Folder className="w-5 h-5 text-white" />
            <span>Menu Sections &amp; Display Order</span>
          </h3>
          <p className="font-body text-xs text-[#A1A1AA] mt-1">
            Organize sections as they appear on the customer menu (e.g. PASTA, SALAD, RICE, SOUP).
          </p>
        </div>

        <Button
          variant="yellow"
          size="sm"
          onClick={handleOpenAdd}
          leftIcon={<Plus className="w-4 h-4 text-black font-extrabold" />}
        >
          Add Section
        </Button>
      </div>

      {/* Category List */}
      <div className="divide-y divide-[#1c1c1c] border border-[#222222] rounded-2xl overflow-hidden bg-[#0a0a0a]">
        {categories.map((cat, index) => {
          const itemCount = cat.items ? cat.items.length : cat._count?.items ?? 0;

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

                {/* Name & Count */}
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="font-headline text-base font-bold text-white tracking-wide truncate">
                      {cat.name}
                    </span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/5 text-[#d4d4d8] border border-white/10 font-headline font-semibold">
                      {itemCount} {itemCount === 1 ? 'dish' : 'dishes'}
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
                  title="Edit Section"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteCandidate(cat)}
                  className="p-2 rounded-lg text-[#71717A] hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                  title="Delete Section"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {categories.length === 0 && (
          <div className="py-14 text-center text-[#A1A1AA] font-medium">
            No menu sections found. Click &quot;Add Section&quot; to create one.
          </div>
        )}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New Menu Section"
        subtitle="This section will appear as a category tab on the customer digital menu"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Section Name"
            placeholder="e.g. PASTA, SALAD, RICE, SOUP, DESSERTS"
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
              Create Section
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        title={`Edit Section: ${editingCategory?.name}`}
        subtitle="Rename section or update description"
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          <Input
            label="Section Name"
            placeholder="Section Name"
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
        title="Delete Menu Section?"
        subtitle="This action cannot be undone"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#A1A1AA]">
            Are you sure you want to delete section{' '}
            <strong className="text-white font-bold">&ldquo;{deleteCandidate?.name}&rdquo;</strong>?
            Any dishes inside this section will also be removed.
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
