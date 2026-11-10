import React, { useState, useEffect } from 'react';
import { Upload, Link as LinkIcon, Eye, EyeOff, X } from 'lucide-react';
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
      subtitle="Configure dish details, section, pricing, and photo for the digital menu"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <label className="block font-headline text-[11px] uppercase tracking-wider font-bold text-white">
              Menu Category &amp; Department
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-[#0a0a0a] text-white text-sm rounded-xl border border-[#222222] px-3.5 py-2.5 focus:outline-none focus:border-[#FFBD18] cursor-pointer"
              required
            >
              {(() => {
                const foodCats = categories.filter((c) => (c.parentCategory || 'FOOD') === 'FOOD');
                const drinkCats = categories.filter((c) => c.parentCategory === 'DRINKS');
                return (
                  <>
                    {foodCats.length > 0 && (
                      <optgroup label="🍽️ FOOD CATEGORIES" className="bg-[#181818] text-[#FFBD18] font-bold">
                        {foodCats.map((c) => (
                          <option key={c.id} value={c.id} className="bg-[#121212] text-white font-normal">
                            {c.name}
                          </option>
                        ))}
                      </optgroup>
                    )}
                    {drinkCats.length > 0 && (
                      <optgroup label="🍹 DRINKS CATEGORIES" className="bg-[#181818] text-[#16B9E8] font-bold">
                        {drinkCats.map((c) => (
                          <option key={c.id} value={c.id} className="bg-[#121212] text-white font-normal">
                            {c.name}
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </>
                );
              })()}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block font-headline text-[11px] uppercase tracking-wider font-bold text-white">
              Customer Visibility
            </label>
            <button
              type="button"
              onClick={() => setIsAvailable(!isAvailable)}
              className={`w-full py-2.5 px-3.5 rounded-xl border text-xs font-headline uppercase font-bold flex items-center justify-between transition-all cursor-pointer ${
                isAvailable
                  ? 'bg-white/5 border-white/10 text-white'
                  : 'bg-white/5 border-white/10 text-[#71717A]'
              }`}
            >
              <div className="flex items-center gap-2">
                {isAvailable ? (
                  <>
                    <Eye className="w-4 h-4 text-white" />
                    <span>Visible on Menu</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4 text-[#71717A]" />
                    <span>Hidden</span>
                  </>
                )}
              </div>
              <span
                className={`w-2 h-2 rounded-full ${
                  isAvailable ? 'bg-white' : 'bg-[#71717A]'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Pricing */}
        <div className="p-4 bg-[#0a0a0a] border border-[#222222] rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-headline text-[11px] uppercase tracking-wider font-bold text-white">
              Price (ETB)
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-[#A1A1AA] select-none">
              <input
                type="checkbox"
                checked={isMarketPrice}
                onChange={(e) => {
                  setIsMarketPrice(e.target.checked);
                  if (e.target.checked) setPrice('');
                }}
                className="w-4 h-4 rounded border-[#222222] bg-[#121212] text-[#FFBD18] focus:ring-[#FFBD18] cursor-pointer"
              />
              <span className="font-medium">Market / Variable Price</span>
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
              rightIcon={<span className="text-xs font-headline font-bold text-[#FFBD18]">ETB</span>}
            />
          ) : (
            <p className="text-xs text-[#A1A1AA] font-medium p-2.5 bg-white/5 rounded-lg border border-white/10">
              This item will display as &ldquo;Price on Request&rdquo; on the customer menu.
            </p>
          )}
        </div>

        {/* Description */}
        <TextArea
          label="Dish Description"
          placeholder="Aromatic ingredients, preparation style, and notes..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Tags */}
        <Input
          label="Highlight Badges (Comma-separated)"
          placeholder="e.g., Signature, Chef Pick, Popular, Spicy"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          helperText="Badges appear as sleek translucent tags on the dish card."
        />

        {/* Image Mode & Upload/URL */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block font-headline text-[11px] uppercase tracking-wider font-bold text-white">
              Dish Photography
            </label>
            <div className="flex bg-[#0a0a0a] p-0.5 rounded-xl border border-[#222222] text-xs font-headline uppercase font-bold">
              <button
                type="button"
                onClick={() => setImageMode('url')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  imageMode === 'url' ? 'bg-[#FFBD18] text-black font-extrabold' : 'text-[#A1A1AA] hover:text-white'
                }`}
              >
                Photo URL
              </button>
              <button
                type="button"
                onClick={() => setImageMode('file')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  imageMode === 'file' ? 'bg-[#FFBD18] text-black font-extrabold' : 'text-[#A1A1AA] hover:text-white'
                }`}
              >
                Upload File
              </button>
            </div>
          </div>

          {imageMode === 'url' ? (
            <Input
              placeholder="https://images.unsplash.com/... or image link"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setPreviewUrl(e.target.value);
              }}
              leftIcon={<LinkIcon className="w-4 h-4 text-[#71717A]" />}
            />
          ) : (
            <div className="border-2 border-dashed border-[#222222] hover:border-[#333333] rounded-xl p-5 text-center cursor-pointer transition-colors relative bg-[#0a0a0a]">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Upload className="w-6 h-6 text-[#71717A] mx-auto mb-2" />
              <p className="font-headline text-xs font-bold text-white">
                {selectedFile ? selectedFile.name : 'Tap or drop image file here'}
              </p>
              <p className="text-[11px] text-[#A1A1AA] mt-1 font-mono">PNG, JPG, WEBP up to 10MB</p>
            </div>
          )}

          {/* Preview */}
          {previewUrl && (
            <div className="relative w-full h-36 rounded-xl overflow-hidden border border-[#222222] bg-[#0a0a0a]">
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
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/80 text-white hover:bg-black transition-colors"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2.5 pt-3 border-t border-[#222222]">
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
