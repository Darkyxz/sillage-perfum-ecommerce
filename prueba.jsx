import React, { useState } from 'react';
import { Search, Heart, ShoppingCart, Menu, Star, ChevronLeft, ChevronRight, User, Mail, Phone, MapPin } from 'lucide-react';

const SillageDemo = () => {
  const [currentPalette, setCurrentPalette] = useState('palette1');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Paletas de colores del sistema de diseño
  const palettes = {
    palette1: {
      name: "Golden Elegance",
      light: {
        primary: "#D4AF37",
        secondary: "#F4E4BC",
        accent: "#B8860B",
        background: "#FEFEFE",
        surface: "#F8F6F0",
        text: "#2C2C2C",
        textSecondary: "#666666",
        border: "#E8E8E8"
      },
      dark: {
        primary: "#FFD700",
        secondary: "#3A3A3A",
        accent: "#DAA520",
        background: "#1A1A1A",
        surface: "#2D2D2D",
        text: "#F5F5F5",
        textSecondary: "#CCCCCC",
        border: "#404040"
      }
    },
    palette2: {
      name: "Silver Sophistication",
      light: {
        primary: "#C0C0C0",
        secondary: "#F0F0F0",
        accent: "#A0A0A0",
        background: "#FFFFFF",
        surface: "#F8F8F8",
        text: "#333333",
        textSecondary: "#666666",
        border: "#E0E0E0"
      },
      dark: {
        primary: "#E5E5E5",
        secondary: "#404040",
        accent: "#B8B8B8",
        background: "#1E1E1E",
        surface: "#2A2A2A",
        text: "#F0F0F0",
        textSecondary: "#BBBBBB",
        border: "#444444"
      }
    },
    palette3: {
      name: "Champagne Luxury",
      light: {
        primary: "#B8860B",
        secondary: "#E8D5B7",
        accent: "#D4AF37",
        background: "#FEFCF7",
        surface: "#F5F2ED",
        text: "#3C3C3C",
        textSecondary: "#7A7A7A",
        border: "#E6E1D6"
      },
      dark: {
        primary: "#D4AF37",
        secondary: "#4A4A4A",
        accent: "#F7E7CE",
        background: "#1F1F1F",
        surface: "#2E2E2E",
        text: "#F0F0F0",
        textSecondary: "#C0C0C0",
        border: "#454545"
      }
    }
  };

  const currentColors = palettes[currentPalette][isDarkMode ? 'dark' : 'light'];

  // Productos de ejemplo
  const products = [
    {
      id: 1,
      name: "Sillage Noir",
      brand: "Sillage Perfum",
      price: "$120",
      rating: 4.8,
      image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMkMyQzJDIi8+CjxyZWN0IHg9IjkwIiB5PSI2MCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxODAiIHJ4PSI4IiBmaWxsPSIjMzMzMzMzIi8+CjxyZWN0IHg9IjEyMCIgeT0iNDAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI0MCIgcng9IjQiIGZpbGw9IiNENEFGMzciLz4KPGVsbGlwc2UgY3g9IjE1MCIgY3k9IjE1MCIgcng9IjQwIiByeT0iNjAiIGZpbGw9IiMxQTFBMUEiLz4KPHR5cGUgaWQ9InRleHQiIGZpbGw9IiNENEFGMzciIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgeD0iMTUwIiB5PSIyNzAiPlNpbGxhZ2UgTm9pcjwvdHlwZT4KPC9zdmc+"
    },
    {
      id: 2,
      name: "Golden Essence",
      brand: "Sillage Perfum",
      price: "$95",
      rating: 4.9,
      image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRkZENzAwIi8+CjxyZWN0IHg9IjkwIiB5PSI2MCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxODAiIHJ4PSI4IiBmaWxsPSIjRkZGRkZGIi8+CjxyZWN0IHg9IjEyMCIgeT0iNDAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI0MCIgcng9IjQiIGZpbGw9IiNENEFGMzciLz4KPGVsbGlwc2UgY3g9IjE1MCIgY3k9IjE1MCIgcng9IjQwIiByeT0iNjAiIGZpbGw9IiNGRkQ3MDAiLz4KPHR5cGUgaWQ9InRleHQiIGZpbGw9IiNGRkZGRkYiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgeD0iMTUwIiB5PSIyNzAiPkdvbGRlbiBFc3NlbmNlPC90eXBlPgo8L3N2Zz4="
    },
    {
      id: 3,
      name: "Silver Mist",
      brand: "Sillage Perfum",
      price: "$85",
      rating: 4.7,
      image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjQzBDMEMwIi8+CjxyZWN0IHg9IjkwIiB5PSI2MCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxODAiIHJ4PSI4IiBmaWxsPSIjRkZGRkZGIi8+CjxyZWN0IHg9IjEyMCIgeT0iNDAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI0MCIgcng9IjQiIGZpbGw9IiNBMEEwQTAiLz4KPGVsbGlwc2UgY3g9IjE1MCIgY3k9IjE1MCIgcng9IjQwIiByeT0iNjAiIGZpbGw9IiNDMEMwQzAiLz4KPHR5cGUgaWQ9InRleHQiIGZpbGw9IiMzMzMzMzMiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgeD0iMTUwIiB5PSIyNzAiPlNpbHZlciBNaXN0PC90eXBlPgo8L3N2Zz4="
    },
    {
      id: 4,
      name: "Champagne Dreams",
      brand: "Sillage Perfum",
      price: "$110",
      rating: 4.6,
      image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjdFN0NFIi8+CjxyZWN0IHg9IjkwIiB5PSI2MCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxODAiIHJ4PSI4IiBmaWxsPSIjRkZGRkZGIi8+CjxyZWN0IHg9IjEyMCIgeT0iNDAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI0MCIgcng9IjQiIGZpbGw9IiNENEFGMzciLz4KPGVsbGlwc2UgY3g9IjE1MCIgY3k9IjE1MCIgcng9IjQwIiByeT0iNjAiIGZpbGw9IiNGN0U3Q0UiLz4KPHR5cGUgaWQ9InRleHQiIGZpbGw9IiMzQzNDM0MiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgeD0iMTUwIiB5PSIyNzAiPkNoYW1wYWduZSBEcmVhbXM8L3R5cGU+Cjwvc3ZnPg=="
    }
  ];

  const styles = {
    container: {
      backgroundColor: currentColors.background,
      color: currentColors.text,
      minHeight: '100vh',
      fontFamily: 'system-ui, sans-serif',
      transition: 'all 0.3s ease'
    },
    header: {
      backgroundColor: currentColors.surface,
      borderBottom: `1px solid ${currentColors.border}`,
      padding: '1rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 100
    },
    nav: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1rem'
    },
    logo: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: currentColors.primary,
      fontFamily: 'serif'
    },
    navMenu: {
      display: 'flex',
      gap: '2rem',
      listStyle: 'none',
      margin: 0,
      padding: 0
    },
    navItem: {
      color: currentColors.text,
      textDecoration: 'none',
      fontSize: '0.9rem',
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      transition: 'color 0.3s ease'
    },
    navActions: {
      display: 'flex',
      gap: '1rem',
      alignItems: 'center'
    },
    iconButton: {
      padding: '0.5rem',
      borderRadius: '50%',
      border: 'none',
      backgroundColor: 'transparent',
      color: currentColors.text,
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    hero: {
      display: 'flex',
      minHeight: '70vh',
      alignItems: 'center',
      background: `linear-gradient(135deg, ${currentColors.surface} 0%, ${currentColors.secondary} 100%)`
    },
    heroContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1rem',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '4rem',
      alignItems: 'center'
    },
    heroText: {
      textAlign: 'center'
    },
    heroSubtitle: {
      fontSize: '0.9rem',
      color: currentColors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: '2px',
      marginBottom: '1rem'
    },
    heroTitle: {
      fontSize: '3rem',
      fontWeight: 'bold',
      color: currentColors.text,
      marginBottom: '1rem',
      fontFamily: 'serif'
    },
    heroDescription: {
      fontSize: '1.1rem',
      color: currentColors.textSecondary,
      marginBottom: '2rem'
    },
    button: {
      backgroundColor: currentColors.primary,
      color: isDarkMode ? currentColors.background : '#FFFFFF',
      border: 'none',
      padding: '0.75rem 2rem',
      borderRadius: '0.25rem',
      fontSize: '1rem',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: `0 2px 4px rgba(0, 0, 0, 0.1)`
    },
    buttonSecondary: {
      backgroundColor: 'transparent',
      color: currentColors.primary,
      border: `2px solid ${currentColors.primary}`,
      padding: '0.75rem 2rem',
      borderRadius: '0.25rem',
      fontSize: '1rem',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    heroImage: {
      width: '100%',
      height: '400px',
      objectFit: 'cover',
      borderRadius: '0.5rem'
    },
    section: {
      padding: '4rem 0',
      maxWidth: '1200px',
      margin: '0 auto',
      paddingLeft: '1rem',
      paddingRight: '1rem'
    },
    sectionTitle: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '3rem',
      color: currentColors.text,
      fontFamily: 'serif'
    },
    productGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '2rem',
      marginTop: '2rem'
    },
    productCard: {
      backgroundColor: currentColors.surface,
      borderRadius: '0.5rem',
      overflow: 'hidden',
      boxShadow: `0 4px 6px rgba(0, 0, 0, 0.1)`,
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer'
    },
    productImage: {
      width: '100%',
      height: '200px',
      objectFit: 'cover'
    },
    productInfo: {
      padding: '1rem'
    },
    productName: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: currentColors.text,
      marginBottom: '0.5rem'
    },
    productBrand: {
      fontSize: '0.9rem',
      color: currentColors.textSecondary,
      marginBottom: '0.5rem'
    },
    productPrice: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      color: currentColors.primary,
      marginBottom: '0.5rem'
    },
    rating: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '1rem'
    },
    controlPanel: {
      position: 'fixed',
      top: '100px',
      right: '20px',
      backgroundColor: currentColors.surface,
      padding: '1rem',
      borderRadius: '0.5rem',
      boxShadow: `0 4px 12px rgba(0, 0, 0, 0.2)`,
      border: `1px solid ${currentColors.border}`,
      zIndex: 1000,
      minWidth: '200px'
    },
    controlTitle: {
      fontSize: '1rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      color: currentColors.text
    },
    controlGroup: {
      marginBottom: '1rem'
    },
    controlLabel: {
      display: 'block',
      fontSize: '0.9rem',
      fontWeight: '500',
      marginBottom: '0.5rem',
      color: currentColors.text
    },
    select: {
      width: '100%',
      padding: '0.5rem',
      borderRadius: '0.25rem',
      border: `1px solid ${currentColors.border}`,
      backgroundColor: currentColors.background,
      color: currentColors.text,
      fontSize: '0.9rem'
    },
    toggleButton: {
      width: '100%',
      padding: '0.5rem',
      borderRadius: '0.25rem',
      border: `1px solid ${currentColors.border}`,
      backgroundColor: isDarkMode ? currentColors.primary : currentColors.background,
      color: isDarkMode ? '#FFFFFF' : currentColors.text,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontWeight: '600'
    },
    colorPreview: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '0.5rem',
      marginTop: '1rem'
    },
    colorSwatch: {
      height: '20px',
      borderRadius: '0.25rem',
      border: `1px solid ${currentColors.border}`,
      fontSize: '0.7rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: currentColors.text
    },
    newsletter: {
      backgroundColor: currentColors.surface,
      padding: '3rem 0',
      textAlign: 'center'
    },
    newsletterForm: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginTop: '2rem'
    },
    input: {
      padding: '0.75rem 1rem',
      borderRadius: '0.25rem',
      border: `1px solid ${currentColors.border}`,
      backgroundColor: currentColors.background,
      color: currentColors.text,
      fontSize: '1rem',
      minWidth: '250px'
    },
    footer: {
      backgroundColor: currentColors.surface,
      borderTop: `1px solid ${currentColors.border}`,
      padding: '3rem 0 1rem',
      marginTop: '4rem'
    },
    footerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1rem',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '2rem'
    },
    footerSection: {
      color: currentColors.textSecondary
    },
    footerTitle: {
      fontSize: '1.1rem',
      fontWeight: '600',
      marginBottom: '1rem',
      color: currentColors.text
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        fill={i < Math.floor(rating) ? currentColors.primary : 'none'}
        stroke={currentColors.primary}
      />
    ));
  };

  return (
    <div style={styles.container}>
      {/* Panel de Control */}
      <div style={styles.controlPanel}>
        <div style={styles.controlTitle}>Controles de Demo</div>
        
        <div style={styles.controlGroup}>
          <label style={styles.controlLabel}>Paleta de Colores:</label>
          <select
            style={styles.select}
            value={currentPalette}
            onChange={(e) => setCurrentPalette(e.target.value)}
          >
            <option value="palette1">Golden Elegance</option>
            <option value="palette2">Silver Sophistication</option>
            <option value="palette3">Champagne Luxury</option>
          </select>
        </div>

        <div style={styles.controlGroup}>
          <button
            style={styles.toggleButton}
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
          </button>
        </div>

        <div style={styles.controlGroup}>
          <label style={styles.controlLabel}>Colores Actuales:</label>
          <div style={styles.colorPreview}>
            <div style={{...styles.colorSwatch, backgroundColor: currentColors.primary}}>Primary</div>
            <div style={{...styles.colorSwatch, backgroundColor: currentColors.secondary}}>Secondary</div>
            <div style={{...styles.colorSwatch, backgroundColor: currentColors.accent}}>Accent</div>
            <div style={{...styles.colorSwatch, backgroundColor: currentColors.surface}}>Surface</div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header style={styles.header}>
        <nav style={styles.nav}>
          <div style={styles.logo}>SILLAGE PERFUM</div>
          <ul style={styles.navMenu}>
            <li><a href="#" style={styles.navItem}>Home</a></li>
            <li><a href="#" style={styles.navItem}>Fragancias</a></li>
            <li><a href="#" style={styles.navItem}>Marcas</a></li>
            <li><a href="#" style={styles.navItem}>Sobre Nosotros</a></li>
            <li><a href="#" style={styles.navItem}>Contacto</a></li>
          </ul>
          <div style={styles.navActions}>
            <button style={styles.iconButton}>
              <Search size={20} />
            </button>
            <button style={styles.iconButton}>
              <Heart size={20} />
            </button>
            <button style={styles.iconButton}>
              <ShoppingCart size={20} />
            </button>
            <button style={styles.iconButton}>
              <Menu size={20} />
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.heroText}>
            <div style={styles.heroSubtitle}>Nueva Fragancia</div>
            <h1 style={styles.heroTitle}>FLORAL AROMAS</h1>
            <p style={styles.heroDescription}>
              Descubre nuestra colección exclusiva de fragancias que capturan la esencia de la elegancia
            </p>
            <button style={styles.button}>Explorar Ahora</button>
          </div>
          <div>
            <img 
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDUwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0Y3RTdDRSIvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNFOEQ1QjciLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8cmVjdCB3aWR0aD0iNTAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0idXJsKCNiZykiLz4KPGNpcmNsZSBjeD0iMjUwIiBjeT0iMjAwIiByPSIxMDAiIGZpbGw9IiNGRkZGRkYiIGZpbGwtb3BhY2l0eT0iMC4yIi8+CjxyZWN0IHg9IjIwMCIgeT0iMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjIwMCIgcng9IjEwIiBmaWxsPSIjRkZGRkZGIi8+CjxyZWN0IHg9IjIyNSIgeT0iNzAiIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgcng9IjUiIGZpbGw9IiNENEFGMzciLz4KPGVsbGlwc2UgY3g9IjI1MCIgY3k9IjIwMCIgcng9IjMwIiByeT0iNzAiIGZpbGw9IiNGN0U3Q0UiLz4KPHR5cGUgaWQ9InRleHQiIGZpbGw9IiMzQzNDM0MiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC1zaXplPSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgeD0iMjUwIiB5PSIzNTAiPkZMT1JBTCBBUk9NQVM8L3R5cGU+Cjwvc3ZnPg=="
              alt="Perfume"
              style={styles.heroImage}
            />
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Productos Destacados</h2>
        <div style={styles.productGrid}>
          {products.map((product) => (
            <div 
              key={product.id} 
              style={styles.productCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = `0 8px 20px rgba(0, 0, 0, 0.15)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 4px 6px rgba(0, 0, 0, 0.1)`;
              }}
            >
              <img src={product.image} alt={product.name} style={styles.productImage} />
              <div style={styles.productInfo}>
                <div style={styles.productBrand}>{product.brand}</div>
                <div style={styles.productName}>{product.name}</div>
                <div style={styles.productPrice}>{product.price}</div>
                <div style={styles.rating}>
                  {renderStars(product.rating)}
                  <span style={{fontSize: '0.9rem', color: currentColors.textSecondary}}>
                    ({product.rating})
                  </span>
                </div>
                <div style={{display: 'flex', gap: '0.5rem'}}>
                  <button style={styles.button}>Agregar al Carrito</button>
                  <button style={styles.buttonSecondary}>♡</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section style={styles.newsletter}>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Mantente Actualizado</h2>
          <p style={{color: currentColors.textSecondary, marginBottom: '2rem'}}>
            Suscríbete a nuestro newsletter para recibir las últimas novedades y ofertas exclusivas
          </p>
          <div style={styles.newsletterForm}>
            <input 
              type="email" 
              placeholder="Tu email" 
              style={styles.input}
            />
            <button style={styles.button}>Suscribirse</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerSection}>
            <div style={styles.footerTitle}>Sillage Perfum</div>
            <p>Fragancias exclusivas que definen tu personalidad única.</p>
          </div>
          <div style={styles.footerSection}>
            <div style={styles.footerTitle}>Enlaces Rápidos</div>
            <ul style={{listStyle: 'none', padding: 0}}>
              <li style={{marginBottom: '0.5rem'}}>
                <a href="#" style={{color: currentColors.textSecondary, textDecoration: 'none'}}>
                  Fragancias
                </a>
              </li>
              <li style={{marginBottom: '0.5rem'}}>
                <a href="#" style={{color: currentColors.textSecondary, textDecoration: 'none'}}>
                  Marcas
                </a>
              </li>
              <li style={{marginBottom: '0.5rem'}}>
                <a href="#" style={{color: currentColors.textSecondary, textDecoration: 'none'}}>
                  Ofertas
                </a>
              </li>
            </ul>
          </div>
          <div style={styles.footerSection}>
            <div style={styles.footerTitle}>Contacto</div>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem'}}>
              <Mail size={16} />
              <span>info@sillageperfum.com</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem'}}>
              <Phone size={16} />
              <span>+1 (555) 123-4567</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <MapPin size={16} />
              <span>123 Fragrance Ave, NY</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SillageDemo;