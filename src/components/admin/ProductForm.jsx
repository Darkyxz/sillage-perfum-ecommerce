import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Scan } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const getInitialState = (data = null) => ({
  id: data?.id || null,
  name: data?.name || '',
  brand: data?.brand || '',
  price: data?.price || '',
  category: data?.category || 'unisex',
  description: data?.description || '',
  sku: data?.sku || '',
  stock_quantity: data?.stock_quantity || '',
  size: data?.size || '100ml',
  concentration: data?.concentration || 'Eau de Parfum',
  image_url: data?.image_url || ''
});

const ProductForm = ({ onSubmit, initialData, onCancel }) => {
  const [productData, setProductData] = useState(getInitialState(initialData));
  const [imageFile, setImageFile] = useState(null); // Para el archivo de imagen real
  const [imagePreview, setImagePreview] = useState(''); // Para la vista previa
  const [barcodeScanning, setBarcodeScanning] = useState(false);

  useEffect(() => {
    const initialState = getInitialState(initialData);
    setProductData(initialState);
    setImagePreview(initialData?.image_url || '');
    setImageFile(null);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  const handleBarcodeScanner = () => {
    setBarcodeScanning(true);
    setTimeout(() => {
      const mockBarcode = `EL${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      setProductData(prev => ({ ...prev, sku: mockBarcode }));
      setBarcodeScanning(false);
      toast({ title: "¡Código escaneado!", description: `SKU: ${mockBarcode}` });
    }, 2000);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Guardar el archivo real
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Actualizar la vista previa
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!productData.name || !productData.price || !productData.sku) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios (*)",
        variant: "destructive",
      });
      return;
    }
    onSubmit(productData, imageFile);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="admin-text font-medium">Nombre del Producto *</Label>
          <Input name="name" value={productData.name} onChange={handleChange} className="admin-input" placeholder="Ej: Midnight Elegance" />
        </div>
        <div className="space-y-2">
          <Label className="admin-text font-medium">Marca</Label>
          <Input name="brand" value={productData.brand} onChange={handleChange} className="admin-input" placeholder="Ej: Essence Luxe" />
        </div>
        <div className="space-y-2">
          <Label className="admin-text font-medium">Precio *</Label>
          <Input name="price" type="number" step="0.01" value={productData.price} onChange={handleChange} className="admin-input" placeholder="89.99" />
        </div>
        <div className="space-y-2">
          <Label className="admin-text font-medium">Categoría</Label>
          <select name="category" value={productData.category} onChange={handleChange} className="admin-input w-full h-10">
            <option value="men">Hombres</option>
            <option value="women">Mujeres</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label className="admin-text font-medium flex items-center">SKU *
            <Button type="button" variant="outline" size="sm" onClick={handleBarcodeScanner} disabled={barcodeScanning} className="ml-2 admin-button-outline">
              <Scan className="h-3 w-3 mr-1" />{barcodeScanning ? 'Escaneando...' : 'Escanear'}
            </Button>
          </Label>
          <Input name="sku" value={productData.sku} onChange={handleChange} className={`admin-input ${barcodeScanning ? 'barcode-scanner' : ''}`} placeholder="EL001" disabled={barcodeScanning} />
        </div>
        <div className="space-y-2">
          <Label className="admin-text font-medium">Stock</Label>
          <Input name="stock_quantity" type="number" value={productData.stock_quantity} onChange={handleChange} className="admin-input" placeholder="15" />
        </div>
        <div className="space-y-2">
          <Label className="admin-text font-medium">Tamaño</Label>
          <select name="size" value={productData.size} onChange={handleChange} className="admin-input w-full h-10">
            <option value="50ml">50ml</option>
            <option value="100ml">100ml</option>
            <option value="150ml">150ml</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label className="admin-text font-medium">Concentración</Label>
          <select name="concentration" value={productData.concentration} onChange={handleChange} className="admin-input w-full h-10">
            <option value="Eau de Toilette">Eau de Toilette</option>
            <option value="Eau de Parfum">Eau de Parfum</option>
            <option value="Parfum">Parfum</option>
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <Label className="admin-text font-medium">Descripción</Label>
        <textarea name="description" value={productData.description} onChange={handleChange} className="admin-input w-full h-20 resize-none" placeholder="Descripción del producto..." />
      </div>
      <div className="space-y-2">
        <Label className="admin-text font-medium flex items-center">Imagen del Producto <Camera className="ml-2 h-4 w-4" /></Label>
        <Input type="file" accept="image/*" onChange={handleImageUpload} className="admin-input file:bg-transparent file:text-current file:border-0" />
        {imagePreview && (
          <div className="mt-2">
            <img src={imagePreview} alt="Vista previa" className="h-20 w-20 object-cover rounded-md admin-panel p-1"/>
            <p className="admin-text-muted text-xs mt-1">
              {imageFile ? 'Vista previa de la nueva imagen.' : 'Imagen actual.'}
            </p>
          </div>
        )}
      </div>
      <div className="flex space-x-4 pt-4">
        <Button type="submit" className="flex-1 admin-button">
          {initialData ? 'Guardar Cambios' : 'Agregar Producto'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="admin-button-outline">
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;