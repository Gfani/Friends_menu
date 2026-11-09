import React, { useState, useEffect } from 'react';
import { Upload, Link as LinkIcon, Image as ImageIcon, X } from 'lucide-react';
import { Category, MenuItem } from '../../types/menu';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, TextArea } from '../ui/Input';

interface ItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit: MenuItem | null;
  categories: Category[];
  onSave: (formData: FormData) => Promise<void>;
  isSaving: boolean;
}

export const ItemFormModal: React.FC<ItemFormModalProps> = ({
  isOpen,
  onClose,
  itemToEdit,
  categories,
  onSave,
  isSaving,
}) => {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState<string>('');
  const [isMarketPrice, setIsMarketPrice] = useState(false);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  // Image tab: 'file' | 'url'
  const [imageMode, setImageMode] = useState<'file' | 'url'>('url');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (itemToEdit) {
      setName(itemToEdit.name);
      setCategoryId(itemToEdit.categoryId);
      if (itemToEdit.price !== null && itemToEdit.price !== undefined) {
        setPrice(String(itemToEdit.price));
        setIsMarketPrice(false);
      } else {
        setPrice('');
        setIsMarketPrice(true);
      }
      setDescription(itemToEdit.description || '');
      setTags(itemToEdit.tags || '');
      setIsAvailable(itemToEdit.isAvailable ?? true);
      setImageUrl(itemToEdit.image || '');
      setPreviewUrl(itemToEdit.image || '');
      setSelectedFile(null);
      setImageMode(itemToEdit.image?.startsWith('/uploads/') ? 'file' : 'url');
    } else {
      setName('');
      setCategoryId(categories[0]?.id || '');
      setPrice('');
      setIsMarketPrice(false);
      setDescription('');
      setTags('');
      setIsAvailable(true);
      setImageUrl('');
      setSelectedFile(null);
      setPreviewUrl('');
      setImageMode('url');
    }
  }, [itemToEdit, categories, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !categoryId) return;

    const fd = new FormData();
    fd.append('name', name.trim());
    fd.append('categoryId', categoryId);
    fd.append('price', isMarketPrice || price === '' ? 'null' : price);
    fd.append('description', description.trim());
    fd.append('tags', tags.trim());
    fd.append('isAvailable', String(isAvailable));

    if (imageMode === 'file' && selectedFile) {
      fd.append('image', selectedFile);
    } else if (imageMode === 'url' && imageUrl.trim()) {
      fd.append('imageUrl', imageUrl.trim());
    }

    await onSave(fd);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={itemToEdit ? `Edit Dish: ${itemToEdit.name}` : 'Add New Dish'}
      subtitle="Configure dish presentation, pricing, and garden ingredients"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <Input
          label="Dish Name"
          placeholder="e.g. Spaghetti with carbonara sauce"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Category & Availability */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block font-headline text-[11px] uppercase tracking-wider font-semibold text-on-surface-variant">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-surface-container text-on-surface text-body-sm rounded border border-outline-variant/30 px-3.5 py-2.5 focus:outline-none focus:border-primary-container"
              required
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-surface-container">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block font-headline text-[11px] uppercase tracking-wider font-semibold text-on-surface-variant">
              Menu Status
            </label>
            <button
              type="button"
              onClick={() => setIsAvailable(!isAvailable)}
              className={`w-full py-2.5 px-3.5 rounded border text-body-sm font-headline uppercase font-semibold flex items-center justify-between transition-all ${
                isAvailable
                  ? 'bg-primary-container/15 border-primary-container/40 text-primary-container'
                  : 'bg-secondary-container/15 border-secondary-container/40 text-secondary'
              }`}
            >
              <span>{isAvailable ? 'In Stock (Available)' : 'Sold Out (Unavailable)'}</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  isAvailable ? 'bg-primary-container shadow-glow-yellow' : 'bg-secondary-container shadow-glow-red'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Pricing */}
        <div className="p-3.5 bg-surface-container border border-outline-variant/30 rounded space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-headline text-[11px] uppercase tracking-wider font-semibold text-on-surface-variant">
              Price (ETB)
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-on-surface-variant select-none">
              <input
                type="checkbox"
                checked={isMarketPrice}
                onChange={(e) => {
                  setIsMarketPrice(e.target.checked);
                  if (e.target.checked) setPrice('');
                }}
                className="rounded border-outline-variant bg-surface-container-high text-primary-container focus:ring-primary-container"
              />
              <span>Market / Variable Price</span>
            </label>
          </div>

          {!isMarketPrice ? (
            <Input
              type="number"
              step="any"
              min="0"
              placeholder="e.g. 280"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required={!isMarketPrice}
              rightIcon={<span className="text-xs font-headline font-bold text-outline">ETB</span>}
            />
          ) : (
            <p className="text-xs text-tertiary-container font-medium p-2 bg-tertiary-container/10 rounded border border-tertiary-container/30">
              This item will display as &ldquo;Price on Request&rdquo; on the customer menu.
            </p>
          )}
        </div>

        {/* Description */}
        <TextArea
          label="Gourmet Description"
          placeholder="Mouth-watering garden recipe details, aromatic herbs, sauces, and cooking style..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Tags */}
        <Input
          label="Dietary & Feature Badges (Comma-separated)"
          placeholder="e.g., Bestseller, Chef Pick, Signature, Vegetarian"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          helperText="These badges display stylishly on the dish photo and details."
        />

        {/* Image Mode & Upload/URL */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block font-headline text-[11px] uppercase tracking-wider font-semibold text-on-surface-variant">
              Dish Photography
            </label>
            <div className="flex bg-surface-container p-0.5 rounded border border-outline-variant/30 text-xs font-headline uppercase font-semibold">
              <button
                type="button"
                onClick={() => setImageMode('url')}
                className={`px-2.5 py-1 rounded transition-all ${
                  imageMode === 'url' ? 'bg-primary-container text-on-primary-container' : 'text-outline hover:text-white'
                }`}
              >
                Photo URL
              </button>
              <button
                type="button"
                onClick={() => setImageMode('file')}
                className={`px-2.5 py-1 rounded transition-all ${
                  imageMode === 'file' ? 'bg-primary-container text-on-primary-container' : 'text-outline hover:text-white'
                }`}
              >
                Upload File
              </button>
            </div>
          </div>

          {imageMode === 'url' ? (
            <Input
              placeholder="https://images.unsplash.com/... or https://lh3.googleusercontent.com/..."
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setPreviewUrl(e.target.value);
              }}
              leftIcon={<LinkIcon className="w-4 h-4 text-outline" />}
            />
          ) : (
            <div className="border-2 border-dashed border-outline-variant/40 hover:border-primary-container rounded p-4 text-center cursor-pointer transition-colors relative bg-surface-container">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Upload className="w-6 h-6 text-outline mx-auto mb-2" />
              <p className="font-headline text-xs font-semibold text-on-surface">
                {selectedFile ? selectedFile.name : 'Tap or drop image file here'}
              </p>
              <p className="text-[10px] text-outline mt-1 font-mono">PNG, JPG, WEBP up to 10MB</p>
            </div>
          )}

          {/* Preview */}
          {previewUrl && (
            <div className="relative w-full h-32 rounded overflow-hidden border border-outline-variant/30 bg-surface-container">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={() => setPreviewUrl('')}
              />
              <button
                type="button"
                onClick={() => {
                  setPreviewUrl('');
                  setImageUrl('');
                  setSelectedFile(null);
                }}
                className="absolute top-2 right-2 p-1 rounded-full bg-black/70 text-white hover:bg-black"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant/20">
          <Button variant="secondary" type="button" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button variant="yellow" type="submit" isLoading={isSaving}>
            {itemToEdit ? 'Save Changes' : 'Create Dish'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
