import React, { useState } from "react";
import { useForm, Link, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Upload, X } from "lucide-react";
import BackendLayout from "@/layouts/backend/backend-layout";

export default function Create() {
  const { producers } = usePage().props as unknown as { producers: { id: number; name: string }[] };

  const { data, setData, post, processing, errors } = useForm({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: null as File | null,
    tags: [] as string[],
    producer_id: "",
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");

  // Handle image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData("image", file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Drag-and-drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setData("image", file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Tags
  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !data.tags.includes(trimmed)) {
      setData("tags", [...data.tags, trimmed]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setData("tags", data.tags.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/backend/products");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Add New Product</h1>
        <Link href="/backend/products">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Product Name */}
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                placeholder="Enter product name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Producer */}
            <div>
              <Label htmlFor="producer">Producer</Label>
              <select
                id="producer"
                value={data.producer_id}
                onChange={(e) => setData("producer_id", e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm dark:bg-cyan-950 dark:border-cyan-700 dark:text-gray-100 p-2"
              >
                <option value="">Select Producer</option>
                {producers.map((producer) => (
                  <option key={producer.id} value={producer.id}>
                    {producer.name}
                  </option>
                ))}
              </select>
              {errors.producer_id && (
                <p className="text-red-500 text-sm mt-1">{errors.producer_id}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={data.description}
                onChange={(e) => setData("description", e.target.value)}
                placeholder="Enter product description"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Price & Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (₦)</Label>
                <Input
                  id="price"
                  type="number"
                  value={data.price}
                  onChange={(e) => setData("price", e.target.value)}
                  placeholder="0.00"
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>

              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={data.stock}
                  onChange={(e) => setData("stock", e.target.value)}
                  placeholder="0"
                />
                {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
              </div>
            </div>

            {/* Tags */}
            <div>
              <Label htmlFor="tags">Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {data.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                    <X className="ml-2 w-4 h-4 cursor-pointer" onClick={() => removeTag(tag)} />
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
              {errors.tags && <p className="text-red-500 text-sm mt-1">{errors.tags}</p>}
            </div>

            {/* Image Upload */}
            <div>
              <Label>Product Image</Label>
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:bg-gray-50 cursor-pointer"
                onClick={() => document.getElementById("imageUpload")?.click()}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="mx-auto w-48 h-48 object-cover rounded-md"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-6 h-6 mb-2 text-gray-500" />
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
              {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
            </div>

            <Button type="submit" disabled={processing}>
              {processing ? "Saving..." : "Save Product"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

Create.layout = (page: React.ReactNode) => <BackendLayout>{page}</BackendLayout>;
