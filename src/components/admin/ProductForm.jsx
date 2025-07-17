import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Scan } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

// Definir las notas olfativas disponibles con sus categorías y emojis
const FRAGRANCE_NOTES = {
  profile: [
    { id: 'fresh_spicy', label: 'Fresco especiado', emoji: '🌿', color: 'bg-amber-100 text-amber-800' },
    { id: 'citrus', label: 'Cítrico', emoji: '🍋', color: 'bg-green-100 text-green-800' },
    { id: 'floral', label: 'Floral', emoji: '🌺', color: 'bg-pink-100 text-pink-800' },
    { id: 'woody', label: 'Amaderado', emoji: '🌳', color: 'bg-brown-100 text-brown-800' },
    { id: 'oriental', label: 'Oriental', emoji: '🌙', color: 'bg-indigo-100 text-indigo-800' },
    { id: 'musky', label: 'Almizclado', emoji: '🧊', color: 'bg-blue-100 text-blue-800' },
    { id: 'aromatic', label: 'Aromático', emoji: '🌸', color: 'bg-purple-100 text-purple-800' },
    { id: 'aquatic', label: 'Acuático', emoji: '🌊', color: 'bg-cyan-100 text-cyan-800' }
  ],
  top: [
    'Bergamota', 'Limón', 'Naranja', 'Mandarina', 'Pomelo', 'Lima', 'Lavanda', 'Menta', 
    'Pimienta negra', 'Pimienta rosa', 'Cardamomo', 'Jengibre', 'Eucalipto', 'Romero', 
    'Albahaca', 'Petitgrain', 'Anís', 'Comino', 'Cilantro', 'Tomillo'
  ],
  middle: [
    'Rosa', 'Jazmín', 'Geranio', 'Neroli', 'Ylang-ylang', 'Lirio', 'Peonía', 'Magnolia',
    'Clavo', 'Canela', 'Nuez moscada', 'Pachulí', 'Vetiver', 'Cedro', 'Elemi', 'Orris',
    'Pimienta de Sichuan', 'Laurel', 'Salvia', 'Artemisa'
  ],
  base: [
    'Sándalo', 'Ámbar', 'Almizcle', 'Vainilla', 'Oud', 'Incienso', 'Musgo de roble', 'Haba tonka',
    'Cuero', 'Tabaco', 'Ládano', 'Ambroxan', 'Benjuí', 'Mirra', 'Cacao', 'Café',
    'Cashmeran', 'Iso E Super', 'Cedro de Virginia', 'Patchouli'
  ]
};

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
  image_url: data?.image_url || '',
  // Notas olfativas
  fragrance_profile: data?.fragrance_profile || [],
  fragrance_notes: {
    top: data?.fragrance_notes?.top || [],
    middle: data?.fragrance_notes?.middle || [],
    base: data?.fragrance_notes?.base || []
  }
});

const ProductForm = ({ onSubmit, initialData, onCancel }) => {
  // Estado persistente que se recupera del localStorage
  const [productData, setProductData] = useState(() => {
    if (typeof window !== 'undefined' && !initialData) {
      const savedData = localStorage.getItem('admin-form-data');
      if (savedData) {
        try {
          return JSON.parse(savedData);
        } catch (e) {
          console.warn('Error parsing saved form data:', e);
        }
      }
    }
    return getInitialState(initialData);
  });
  
  const [imageFile, setImageFile] = useState(null); // Para el archivo de imagen real
  const [imagePreview, setImagePreview] = useState(() => {
    if (typeof window !== 'undefined' && !initialData) {
      return localStorage.getItem('admin-form-image-preview') || '';
    }
    return initialData?.image_url || '';
  });
  const [barcodeScanning, setBarcodeScanning] = useState(false);

  // Efecto para guardar datos del formulario en localStorage
  useEffect(() => {
    if (!initialData) { // Solo guardar si no estamos editando un producto existente
      localStorage.setItem('admin-form-data', JSON.stringify(productData));
    }
  }, [productData, initialData]);

  // Efecto para guardar preview de imagen en localStorage
  useEffect(() => {
    if (!initialData && imagePreview) {
      localStorage.setItem('admin-form-image-preview', imagePreview);
    }
  }, [imagePreview, initialData]);

  useEffect(() => {
    if (initialData) {
      const initialState = getInitialState(initialData);
      setProductData(initialState);
      setImagePreview(initialData?.image_url || '');
      setImageFile(null);
    }
  }, [initialData]);

  // Prevenir cierre accidental del formulario
  useEffect(() => {
    const hasUnsavedChanges = () => {
      // Verificar si hay datos en el formulario que no sean los valores iniciales
      const initialState = getInitialState(initialData);
      return JSON.stringify(productData) !== JSON.stringify(initialState) || 
             imageFile !== null || 
             (imagePreview && imagePreview !== (initialData?.image_url || ''));
    };

    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges()) {
        e.preventDefault();
        e.returnValue = ''; // Chrome requiere esto
        return '¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.';
      }
    };

    // Solo agregar el listener de beforeunload, remover visibilitychange
    // ya que puede estar causando interferencias
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [productData, imageFile, imagePreview, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  // Manejar selección de perfil de fragancia
  const handleProfileToggle = (profileId) => {
    setProductData(prev => ({
      ...prev,
      fragrance_profile: prev.fragrance_profile.includes(profileId)
        ? prev.fragrance_profile.filter(id => id !== profileId)
        : [...prev.fragrance_profile, profileId]
    }));
  };

  // Manejar selección de notas olfativas
  const handleNoteToggle = (noteType, note) => {
    setProductData(prev => ({
      ...prev,
      fragrance_notes: {
        ...prev.fragrance_notes,
        [noteType]: prev.fragrance_notes[noteType].includes(note)
          ? prev.fragrance_notes[noteType].filter(n => n !== note)
          : [...prev.fragrance_notes[noteType], note]
      }
    }));
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
    
    // Limpiar localStorage al guardar exitosamente
    if (!initialData) {
      localStorage.removeItem('admin-form-data');
      localStorage.removeItem('admin-form-image-preview');
    }
    
    onSubmit(productData, imageFile);
  };

  const handleCancel = () => {
    // Limpiar localStorage al cancelar
    if (!initialData) {
      localStorage.removeItem('admin-form-data');
      localStorage.removeItem('admin-form-image-preview');
    }
    onCancel();
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

      {/* Sección de Notas Olfativas */}
      <div className="space-y-4 p-4 bg-card/30 rounded-lg border border-sillage-gold-dark/20">
        <div>
          <Label className="admin-text font-medium text-base mb-3 block text-sillage-gold-dark">🌸 Perfil de Fragancia</Label>
          <p className="admin-text-muted text-xs mb-3">Selecciona las características principales del perfume</p>
          
          {/* Perfil de Fragancia - Más compacto */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
            {FRAGRANCE_NOTES.profile.map((profile) => (
              <button
                key={profile.id}
                type="button"
                onClick={() => handleProfileToggle(profile.id)}
                className={`
                  flex items-center justify-center px-2 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border
                  ${productData.fragrance_profile.includes(profile.id)
                    ? `${profile.color} border-current shadow-sm`
                    : 'bg-muted/40 text-muted-foreground border-border hover:border-sillage-gold-dark hover:bg-sillage-gold/10'
                  }
                `}
              >
                <span className="mr-1 text-xs">{profile.emoji}</span>
                <span className="truncate">{profile.label}</span>
              </button>
            ))}
          </div>

          {/* Línea divisoria dorada más sutil */}
          <div className="border-t border-sillage-gold-dark/30 my-4"></div>

          {/* Notas Olfativas Detalladas - Más compactas */}
          <div className="space-y-4">
            {/* Notas de Salida */}
            <div>
              <Label className="admin-text font-medium mb-2 block text-sm">Notas de Salida</Label>
              <p className="admin-text-muted text-xs mb-2">Primeras notas percibidas</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
                {FRAGRANCE_NOTES.top.map((note) => (
                  <label
                    key={note}
                    className={`
                      flex items-center space-x-1.5 p-1.5 rounded cursor-pointer transition-all duration-200 border text-xs
                      ${productData.fragrance_notes.top.includes(note)
                        ? 'bg-sillage-gold/15 border-sillage-gold/50 text-sillage-gold-dark'
                        : 'bg-muted/20 border-border/50 hover:border-sillage-gold-dark/50 hover:bg-sillage-gold/5'
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={productData.fragrance_notes.top.includes(note)}
                      onChange={() => handleNoteToggle('top', note)}
                      className="sr-only"
                    />
                    <div className={`
                      w-3 h-3 rounded border flex items-center justify-center transition-all
                      ${productData.fragrance_notes.top.includes(note)
                        ? 'bg-sillage-gold border-sillage-gold'
                        : 'border-muted-foreground/50'
                      }
                    `}>
                      {productData.fragrance_notes.top.includes(note) && (
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="font-medium truncate">{note}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notas de Corazón */}
            <div>
              <Label className="admin-text font-medium mb-2 block text-sm">Notas de Corazón</Label>
              <p className="admin-text-muted text-xs mb-2">Cuerpo principal del perfume</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
                {FRAGRANCE_NOTES.middle.map((note) => (
                  <label
                    key={note}
                    className={`
                      flex items-center space-x-1.5 p-1.5 rounded cursor-pointer transition-all duration-200 border text-xs
                      ${productData.fragrance_notes.middle.includes(note)
                        ? 'bg-sillage-gold/15 border-sillage-gold/50 text-sillage-gold-dark'
                        : 'bg-muted/20 border-border/50 hover:border-sillage-gold-dark/50 hover:bg-sillage-gold/5'
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={productData.fragrance_notes.middle.includes(note)}
                      onChange={() => handleNoteToggle('middle', note)}
                      className="sr-only"
                    />
                    <div className={`
                      w-3 h-3 rounded border flex items-center justify-center transition-all
                      ${productData.fragrance_notes.middle.includes(note)
                        ? 'bg-sillage-gold border-sillage-gold'
                        : 'border-muted-foreground/50'
                      }
                    `}>
                      {productData.fragrance_notes.middle.includes(note) && (
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="font-medium truncate">{note}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notas de Base */}
            <div>
              <Label className="admin-text font-medium mb-2 block text-sm">Notas de Base</Label>
              <p className="admin-text-muted text-xs mb-2">Notas finales duraderas</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
                {FRAGRANCE_NOTES.base.map((note) => (
                  <label
                    key={note}
                    className={`
                      flex items-center space-x-1.5 p-1.5 rounded cursor-pointer transition-all duration-200 border text-xs
                      ${productData.fragrance_notes.base.includes(note)
                        ? 'bg-sillage-gold/15 border-sillage-gold/50 text-sillage-gold-dark'
                        : 'bg-muted/20 border-border/50 hover:border-sillage-gold-dark/50 hover:bg-sillage-gold/5'
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={productData.fragrance_notes.base.includes(note)}
                      onChange={() => handleNoteToggle('base', note)}
                      className="sr-only"
                    />
                    <div className={`
                      w-3 h-3 rounded border flex items-center justify-center transition-all
                      ${productData.fragrance_notes.base.includes(note)
                        ? 'bg-sillage-gold border-sillage-gold'
                        : 'border-muted-foreground/50'
                      }
                    `}>
                      {productData.fragrance_notes.base.includes(note) && (
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="font-medium truncate">{note}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
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
        <Button type="button" variant="outline" onClick={handleCancel} className="admin-button-outline">
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;