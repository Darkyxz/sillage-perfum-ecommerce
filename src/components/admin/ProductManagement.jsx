import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Package, Loader2, Star, Filter } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import ProductForm from '@/components/admin/ProductForm';
import { productService } from '@/lib/productService';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProductsNoPagination();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: "Error al cargar productos",
        description: "No se pudieron cargar los productos. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filtrar productos por categoría
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === selectedCategory));
    }
  }, [products, selectedCategory]);

  const handleAddProduct = async (newProductData, imageFile) => {
    try {
      const product = await productService.createProduct({
        ...newProductData,
        price: parseFloat(newProductData.price),
        stock_quantity: parseInt(newProductData.stock_quantity) || 0,
        in_stock: (parseInt(newProductData.stock_quantity) || 0) > 0
      });

      setProducts(prev => [product, ...prev]);
      setIsFormOpen(false);
      toast({
        title: "¡Producto agregado!",
        description: `${product.name} ha sido agregado al catálogo`,
      });
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Error al agregar producto",
        description: "No se pudo agregar el producto. Intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = async (updatedProductData, imageFile) => {
    try {
      // Preparar los datos para actualizar
      const detailsToUpdate = {
        ...updatedProductData,
        price: parseFloat(updatedProductData.price),
        stock_quantity: parseInt(updatedProductData.stock_quantity) || 0,
        in_stock: (parseInt(updatedProductData.stock_quantity) || 0) > 0,
      };

      // Si hay una nueva URL de imagen en los datos, usarla
      // (El ProductForm ahora maneja URLs directamente en lugar de archivos)
      if (updatedProductData.image_url) {
        detailsToUpdate.image_url = updatedProductData.image_url;
      }

      const updatedProduct = await productService.updateProduct(updatedProductData.id, detailsToUpdate);

      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      setIsFormOpen(false);
      setEditingProduct(null);
      toast({
        title: "¡Producto actualizado!",
        description: `${updatedProduct.name} ha sido actualizado.`,
      });
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error al actualizar producto",
        description: error.message || "No se pudo actualizar el producto. Intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleToggleFeatured = async (product) => {
    try {
      const updatedProduct = await productService.toggleFeaturedStatus(product.id, product.is_featured);
      setProducts(prev => prev.map(p => p.id === product.id ? updatedProduct : p));
      toast({
        title: `Producto ${updatedProduct.is_featured ? 'destacado' : 'no destacado'}`,
        description: `${updatedProduct.name} ha sido actualizado.`,
      });
    } catch (error) {
      console.error('Error toggling featured status:', error);
      toast({
        title: "Error al cambiar estado de destacado",
        description: "No se pudo actualizar el producto. Intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await productService.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado del catálogo",
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error al eliminar producto",
        description: "No se pudo eliminar el producto. Intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const openAddForm = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="admin-icon h-12 w-12 animate-spin mx-auto mb-4" />
          <p className="admin-text-muted">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header con título y botón agregar */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="admin-title text-xl sm:text-2xl font-bold">Gestión de Productos</h2>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="admin-button w-full sm:w-auto" onClick={openAddForm}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="admin-dialog max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="admin-text font-semibold text-lg">{editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}</DialogTitle>
              <DialogDescription className="admin-text-muted">
                Completa los detalles del producto. Haz clic en guardar cuando termines.
              </DialogDescription>
            </DialogHeader>
            <ProductForm
              onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
              initialData={editingProduct}
              onCancel={() => { setIsFormOpen(false); setEditingProduct(null); }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros por categoría */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="admin-text text-sm font-medium">Filtrar por categoría:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'Todos', count: products.length },
            { value: 'Mujer', label: 'Mujeres', count: products.filter(p => p.category === 'Mujer').length },
            { value: 'Hombre', label: 'Hombres', count: products.filter(p => p.category === 'Hombre').length },
            { value: 'Unisex', label: 'Unisex', count: products.filter(p => p.category === 'Unisex').length },
            { value: 'Hogar', label: 'Hogar', count: products.filter(p => p.category === 'Hogar').length },
            { value: 'Body Mist', label: 'Body Mist', count: products.filter(p => p.category === 'Body Mist').length }
          ].map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedCategory === category.value
                ? 'bg-sillage-gold text-black'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
            >
              {category.label} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <Package className="admin-icon h-16 w-16 opacity-50 mx-auto mb-4" />
          <p className="admin-text text-lg mb-2">No hay productos en el catálogo</p>
          <p className="admin-text-muted">Agrega tu primer producto para comenzar</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <Package className="admin-icon h-16 w-16 opacity-50 mx-auto mb-4" />
          <p className="admin-text text-lg mb-2">No hay productos en esta categoría</p>
          <p className="admin-text-muted">Selecciona otra categoría o agrega productos</p>
        </div>
      ) : (
        <>
          {/* Contador de productos */}
          <div className="mb-4">
            <p className="admin-text-muted text-sm">
              Mostrando {filteredProducts.length} de {products.length} productos
            </p>
          </div>

          {/* Grid responsive de productos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="admin-panel group hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  {/* Imagen del producto */}
                  <div className="aspect-square mb-3 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <Package className="admin-icon h-12 w-12 opacity-50" />
                    )}
                  </div>

                  {/* Información del producto */}
                  <div className="space-y-2">
                    <div>
                      <h3 className="admin-text font-semibold text-sm leading-tight line-clamp-2" title={product.name}>
                        {product.name}
                      </h3>
                      <p className="admin-text-muted text-xs">
                        {product.brand}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="admin-text font-bold text-lg">
                        ${product.price ? Math.round(product.price).toLocaleString('es-CL') : '0'}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${product.category === 'Mujer' ? 'bg-pink-100 text-pink-700' :
                        product.category === 'Hombre' ? 'bg-blue-100 text-blue-700' :
                          product.category === 'Hogar' ? 'bg-green-100 text-green-700' :
                            product.category === 'Body Mist' ? 'bg-orange-100 text-orange-700' :
                              'bg-purple-100 text-purple-700'
                        }`}>
                        {product.category}
                      </span>
                    </div>

                    <div className="text-xs admin-text-muted">
                      <div>SKU: {product.sku}</div>
                      <div className="flex items-center justify-between">
                        <span>Stock: {product.stock_quantity}</span>
                        <span className={`${product.in_stock ? 'text-green-600' : 'text-red-600'}`}>
                          {product.in_stock ? 'En Stock' : 'Agotado'}
                        </span>
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleFeatured(product)}
                        className={`${product.is_featured ? 'text-yellow-500' : 'text-muted-foreground'} hover:bg-yellow-500/10 h-8 w-8 p-0`}
                        title={product.is_featured ? 'Quitar de destacados' : 'Destacar producto'}
                      >
                        <Star className={`h-4 w-4 ${product.is_featured ? 'fill-current' : ''}`} />
                      </Button>

                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditForm(product)}
                          className="text-blue-500 hover:bg-blue-500/10 h-8 w-8 p-0"
                          title="Editar producto"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (window.confirm(`¿Estás seguro de eliminar ${product.name}?`)) {
                              handleDeleteProduct(product.id);
                            }
                          }}
                          className="text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                          title="Eliminar producto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default ProductManagement;