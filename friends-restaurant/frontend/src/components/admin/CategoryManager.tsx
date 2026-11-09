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
    <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-5 space-y-4 shadow-card-elevated">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant/20">
        <div>
          <h3 className="font-headline text-lg font-bold text-primary flex items-center gap-2">
            <Folder className="w-5 h-5 text-tertiary" />
            <span>Category Hierarchy &amp; Ordering</span>
          </h3>
          <p className="font-body text-xs text-on-surface-variant mt-0.5">
            Organize dishes into sections visible on the mobile customer menu.
          </p>
        </div>

        <Button
          variant="yellow"
          size="sm"
          onClick={handleOpenAdd}
          leftIcon={<Plus className="w-4 h-4 text-on-primary-container" />}
        >
          Add Category
        </Button>
      </div>

      {/* Category List */}
      <div className="divide-y divide-outline-variant/15 border border-outline-variant/25 rounded overflow-hidden bg-surface-container">
        {categories.map((cat, index) => {
          const itemCount = cat.items ? cat.items.length : cat._count?.items ?? 0;

          return (
            <div
              key={cat.id}
              className="p-3.5 flex items-center justify-between gap-3 hover:bg-surface-container-high/40 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Reorder Up/Down */}
                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    disabled={index === 0 || reorderMutation.isPending}
                    onClick={() => handleMove(index, 'up')}
                    className="p-1 rounded hover:bg-surface-container-highest text-outline hover:text-white disabled:opacity-20"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === categories.length - 1 || reorderMutation.isPending}
                    onClick={() => handleMove(index, 'down')}
                    className="p-1 rounded hover:bg-surface-container-highest text-outline hover:text-white disabled:opacity-20"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Name & Count */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-headline text-base font-bold text-on-surface tracking-wide truncate">
                      {cat.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-surface-container-high text-outline font-headline font-semibold">
                      {itemCount} {itemCount === 1 ? 'dish' : 'dishes'}
                    </span>
                  </div>
                  {cat.description && (
                    <p className="font-body text-xs text-on-surface-variant truncate max-w-sm mt-0.5">
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
                  className="p-2 rounded text-outline hover:text-primary hover:bg-surface-container-high transition-colors"
                  title="Edit Category"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteCandidate(cat)}
                  className="p-2 rounded text-outline hover:text-secondary hover:bg-secondary-container/15 transition-colors"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New Category"
        subtitle="New section will appear as a category tab on the menu"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Category Name"
            placeholder="e.g., Desserts, Cocktails, Burgers"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
          <TextArea
            label="Description (Optional)"
            placeholder="Brief aromatic description to display at the top of this category section..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-2">
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
        subtitle="Rename or update description"
      >
        <form onSubmit={handleUpdate} className="space-y-4">
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
          <div className="flex justify-end gap-2 pt-2">
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
        title="Delete Category?"
        subtitle="This action cannot be undone"
      >
        <div className="space-y-4">
          <p className="text-body-sm text-on-surface-variant">
            Are you sure you want to delete category{' '}
            <strong className="text-primary">&ldquo;{deleteCandidate?.name}&rdquo;</strong>?
            Any dishes inside this category will also be removed.
          </p>
          <div className="flex justify-end gap-2 pt-2">
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
