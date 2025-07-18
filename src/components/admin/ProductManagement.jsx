import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Package, Loader2, Star } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import ProductForm from '@/components/admin/ProductForm';
import { productService } from '@/lib/productService';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
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

  const handleAddProduct = async (newProductData) => {
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
      // 1. Actualizar los detalles del producto (sin la imagen)
      const detailsToUpdate = {
        ...updatedProductData,
        price: parseFloat(updatedProductData.price),
        stock_quantity: parseInt(updatedProductData.stock_quantity) || 0,
        in_stock: (parseInt(updatedProductData.stock_quantity) || 0) > 0,
      };

      let updatedProduct = await productService.updateProductDetails(updatedProductData.id, detailsToUpdate);

      // 2. Si hay un nuevo archivo de imagen, subirlo y actualizar la URL
      if (imageFile) {
        const imageUrl = await productService.uploadProductImage(imageFile, updatedProduct.id);
        updatedProduct = await productService.updateProductImage(updatedProduct.id, imageUrl);
      }
      
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="admin-title text-2xl font-bold">Gestión de Productos</h2>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="admin-button" onClick={openAddForm}>
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

      {products.length === 0 ? (
        <div className="text-center py-12">
          <Package className="admin-icon h-16 w-16 opacity-50 mx-auto mb-4" />
          <p className="admin-text text-lg mb-2">No hay productos en el catálogo</p>
          <p className="admin-text-muted">Agrega tu primer producto para comenzar</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {products.map((product) => (
            <Card key={product.id} className="admin-panel">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-lg admin-panel flex items-center justify-center">
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name} 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Package className="admin-icon h-8 w-8" />
                      )}
                    </div>
                    <div>
                      <h3 className="admin-text font-semibold text-lg">{product.name}</h3>
                      <p className="admin-text-muted">{product.brand} • {product.category}</p>
                      <p className="admin-text-muted text-sm">
                        SKU: {product.sku} • Stock: {product.stock_quantity} • 
                        {product.in_stock ? ' En Stock' : ' Agotado'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="admin-text font-bold text-xl">${product.price}</span>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleFeatured(product)}
                        className={`${product.is_featured ? 'text-yellow-400' : 'text-muted-foreground'} hover:bg-yellow-500/10 h-10 w-10`}
                        title={product.is_featured ? 'Quitar de destacados' : 'Destacar producto'}
                      >
                        <Star className={`h-5 w-5 ${product.is_featured ? 'fill-current' : ''}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditForm(product)}
                        className="text-blue-400 hover:bg-blue-500/10 h-10 w-10"
                        title="Editar producto"
                      >
                        <Edit className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (window.confirm(`¿Estás seguro de eliminar ${product.name}?`)) {
                            handleDeleteProduct(product.id);
                          }
                        }}
                        className="text-destructive hover:bg-destructive/10 h-10 w-10"
                        title="Eliminar producto"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};

export default ProductManagement;