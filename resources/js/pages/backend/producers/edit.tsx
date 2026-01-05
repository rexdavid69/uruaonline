import React, { useState } from "react";
import { useForm, Link, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import BackendLayout from "@/layouts/backend/backend-layout";
import { PageProps as InertiaPageProps } from "@inertiajs/core";

interface Producer {
  id: number;
  name: string;
  description?: string;
  logo?: string | null;
}

interface PageProps extends InertiaPageProps {
  producer: Producer;
}

export default function Edit() {
  const { producer } = usePage<PageProps>().props;

  const [preview, setPreview] = useState<string | null>(
    producer.logo ? `/storage/${producer.logo}` : null
  );

  // ✅ Include `_method: 'put'` in form data
  const { data, setData, post, processing, errors } = useForm({
    name: producer.name || "",
    description: producer.description || "",
    logo: null as File | null,
    _method: "put",
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setData("logo", file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(producer.logo ? `/storage/${producer.logo}` : null);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // ✅ Use `post()` instead of `put()` because we are spoofing PUT with _method
    post(`/backend/producers/${producer.id}`, {
      forceFormData: true, // required for file uploads
      preserveScroll: true,
    });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Edit Producer</h1>
        <Link href="/backend/producers">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="name">Producer Name</Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                placeholder="Enter producer name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={data.description}
                onChange={(e) => setData("description", e.target.value)}
                placeholder="Enter producer description"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="logo">Logo</Label>
              {preview && (
                <img
                  src={preview}
                  alt="Producer logo"
                  className="w-24 h-24 object-cover rounded-md mb-2 border"
                />
              )}
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {errors.logo && (
                <p className="text-red-500 text-sm mt-1">{errors.logo}</p>
              )}
            </div>

            <Button type="submit" disabled={processing}>
              {processing ? "Updating..." : "Update Producer"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

Edit.layout = (page: React.ReactNode) => <BackendLayout>{page}</BackendLayout>;
