import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import BackendLayout from '@/layouts/backend/backend-layout';
import { Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import React, { useState } from 'react';

interface Tag {
  id: number;
  name: string;
}

interface Producer {
  id: number;
  name: string;
}

interface Props {
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    image?: string | null;
    tags: Tag[];
    producer_id?: number | null;
  };
  producers: Producer[];
}

interface ProductForm {
  name: string;
  description: string;
  price: number;
  stock: number;
  image: File | null;
  tags: string[];
  producer_id: number | '';
  _method: 'put';
  search: string;
  tag: string;
  page: number;
}

export default function Edit({ product, producers }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { props } = usePage<any>();
  const currentSearch = props.search || '';
  const currentTag = props.selectedTag || '';
  const currentPage = props.products?.current_page || 1;

  // Initialize form with proper types
  const { data, setData, post, processing, errors } = useForm<ProductForm>({
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    image: null, // correct type File | null
    tags: product.tags.map((t) => t.name),
    producer_id: product.producer_id || '',
    _method: 'put',
    search: currentSearch,
    tag: currentTag,
    page: currentPage,
  });

  const [preview, setPreview] = useState<string | null>(
    product.image ? `/storage/${product.image}` : null
  );
  const [tagInput, setTagInput] = useState('');

  // Image upload handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData('image', file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setData('image', file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Tag management
  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !data.tags.includes(trimmed)) {
      setData('tags', [...data.tags, trimmed]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setData('tags', data.tags.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/backend/products/${product.id}`, { preserveState: true });
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit Product</h1>
        <Link
          href={`/backend/products`}
          data={{ search: currentSearch, tag: currentTag, page: currentPage }}
          preserveState
        >
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Hidden inputs */}
            <input type="hidden" name="search" value={currentSearch} />
            <input type="hidden" name="tag" value={currentTag} />
            <input type="hidden" name="page" value={currentPage} />

            {/* Name */}
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                placeholder="Enter product name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                placeholder="Enter product description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            {/* Price & Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (₦)</Label>
                <Input
                  id="price"
                  type="number"
                  value={data.price}
                  onChange={(e) => setData('price', Number(e.target.value))}
                  placeholder="0.00"
                />
                {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
              </div>
              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={data.stock}
                  onChange={(e) => setData('stock', Number(e.target.value))}
                  placeholder="0"
                />
                {errors.stock && <p className="mt-1 text-sm text-red-500">{errors.stock}</p>}
              </div>
            </div>

            {/* Producer */}
            <div>
              <Label htmlFor="producer_id">Producer</Label>
              <select
                id="producer_id"
                value={data.producer_id}
                onChange={(e) => setData('producer_id', Number(e.target.value))}
                className="mt-1 w-full rounded-md border border-gray-300 p-2 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="">Select a producer</option>
                {producers.map((producer) => (
                  <option key={producer.id} value={producer.id}>
                    {producer.name}
                  </option>
                ))}
              </select>
              {errors.producer_id && (
                <p className="mt-1 text-sm text-red-500">{errors.producer_id}</p>
              )}
            </div>

            {/* Tags */}
            <div>
              <Label htmlFor="tags">Tags</Label>
              <div className="mb-2 flex flex-wrap gap-2">
                {data.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center rounded-full bg-cyan-100 px-3 py-1 text-sm text-cyan-700"
                  >
                    {tag}
                    <X
                      className="ml-2 h-4 w-4 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </span>
                ))}
              </div>
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Type a tag and press Enter"
              />
            </div>

            {/* Image Upload */}
            <div>
              <Label>Product Image</Label>
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="cursor-pointer rounded-md border-2 border-dashed border-gray-300 p-6 text-center hover:bg-gray-50"
                onClick={() => document.getElementById('imageUpload')?.click()}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="mx-auto h-48 w-48 rounded-md object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="mb-2 h-6 w-6 text-gray-500" />
                    <p className="text-gray-500">Drag & drop or click to upload</p>
                  </div>
                )}
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Leave empty to keep the current image
              </p>
            </div>

            {/* Submit */}
            <Button type="submit" disabled={processing}>
              {processing ? 'Updating...' : 'Update Product'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

Edit.layout = (page: React.ReactNode) => <BackendLayout>{page}</BackendLayout>;
