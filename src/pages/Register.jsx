import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Mail, Lock, Eye, EyeOff, Loader2, User, Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import PasswordStrengthMeter from '@/components/ui/PasswordStrengthMeter';
import { validatePassword, validateEmail, validateFullName } from '@/utils/passwordValidation';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar errores cuando el usuario empiece a escribir
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }

    // Validación en tiempo real
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = null;

    switch (name) {
      case 'fullName':
        const nameValidation = validateFullName(value);
        error = nameValidation.error;
        break;
      case 'email':
        const emailValidation = validateEmail(value);
        error = emailValidation.error;
        break;
      case 'password':
        const passwordValidation = validatePassword(value);
        if (!passwordValidation.isValid && value.length > 0) {
          error = 'La contraseña no cumple con todos los requisitos de seguridad';
        }
        break;
      case 'confirmPassword':
        if (value !== formData.password && value.length > 0) {
          error = 'Las contraseñas no coinciden';
        }
        break;
    }

    if (error) {
      setFormErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar todos los campos
    const nameValidation = validateFullName(formData.fullName);
    const emailValidation = validateEmail(formData.email);
    const passwordValidation = validatePassword(formData.password);

    const errors = {};

    if (!nameValidation.isValid) {
      errors.fullName = nameValidation.error;
    }

    if (!emailValidation.isValid) {
      errors.email = emailValidation.error;
    }

    if (!passwordValidation.isValid) {
      errors.password = 'La contraseña debe cumplir con todos los requisitos de seguridad';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!acceptTerms) {
      errors.terms = 'Debes aceptar los términos y condiciones para continuar';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast({
        title: "Error de validación",
        description: "Por favor corrige los errores en el formulario",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await signup(formData.email, formData.password, formData.fullName);
      if (!result.error) {
        toast({
          title: "¡Registro exitoso!",
          description: "Tu cuenta ha sido creada correctamente. ¡Bienvenido a Sillage Perfum!"
        });
        // Registro exitoso, redirigir al perfil
        navigate('/perfil');
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    toast({
      title: "Función no disponible",
      description: "El registro con Google no está disponible en este momento",
      variant: "destructive"
    });
    setIsGoogleLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <Helmet>
        <title>Registrarse - Sillage-Perfum</title>
        <meta name="description" content="Crea tu cuenta para acceder a ofertas exclusivas y gestionar tus pedidos." />
      </Helmet>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md mx-auto"
        >
          <Card className="bg-background/80 border-border/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-display font-bold text-foreground mb-2">
                Crear Cuenta
              </CardTitle>
              <p className="text-muted-foreground">
                Únete a Sillage Perfum y descubre fragancias únicas
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-foreground">
                    Nombre Completo *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`bg-background/50 border-border/50 text-foreground pl-10 placeholder:text-muted-foreground/50 ${formErrors.fullName ? 'border-red-500 focus:border-red-500' : ''
                        }`}
                      placeholder="Ej: María González Pérez"
                      required
                      autoComplete="name"
                    />
                  </div>
                  {formErrors.fullName && (
                    <div className="flex items-center space-x-1 text-red-600">
                      <AlertCircle className="h-3 w-3" />
                      <span className="text-xs">{formErrors.fullName}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    Correo Electrónico *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`bg-background/50 border-border/50 text-foreground pl-10 placeholder:text-muted-foreground/50 ${formErrors.email ? 'border-red-500 focus:border-red-500' : ''
                        }`}
                      placeholder="maria.gonzalez@ejemplo.com"
                      required
                      autoComplete="email"
                    />
                  </div>
                  {formErrors.email && (
                    <div className="flex items-center space-x-1 text-red-600">
                      <AlertCircle className="h-3 w-3" />
                      <span className="text-xs">{formErrors.email}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground flex items-center space-x-1">
                    <Shield className="h-4 w-4" />
                    <span>Contraseña Segura *</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`bg-background/50 border-border/50 text-foreground pl-10 pr-10 placeholder:text-muted-foreground/50 ${formErrors.password ? 'border-red-500 focus:border-red-500' : ''
                        }`}
                      placeholder="Ej: MiContra$eña123!"
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {formErrors.password && (
                    <div className="flex items-center space-x-1 text-red-600">
                      <AlertCircle className="h-3 w-3" />
                      <span className="text-xs">{formErrors.password}</span>
                    </div>
                  )}
                  <PasswordStrengthMeter password={formData.password} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground">
                    Confirmar Contraseña *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`bg-background/50 border-border/50 text-foreground pl-10 pr-10 placeholder:text-muted-foreground/50 ${formErrors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''
                        }`}
                      placeholder="Repite la misma contraseña"
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {formErrors.confirmPassword && (
                    <div className="flex items-center space-x-1 text-red-600">
                      <AlertCircle className="h-3 w-3" />
                      <span className="text-xs">{formErrors.confirmPassword}</span>
                    </div>
                  )}
                </div>

                {/* Checkbox de términos y condiciones */}
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg border border-border/30">
                    <Checkbox
                      id="acceptTerms"
                      checked={acceptTerms}
                      onCheckedChange={setAcceptTerms}
                      className="mt-0.5"
                    />
                    <div className="space-y-1">
                      <Label
                        htmlFor="acceptTerms"
                        className="text-sm text-foreground cursor-pointer leading-relaxed"
                      >
                        Acepto los{' '}
                        <Link to="/terminos" className="text-muted-foreground hover:underline font-medium">
                          Términos y Condiciones
                        </Link>{' '}
                        y la{' '}
                        <Link to="/privacidad" className="text-muted-foreground hover:underline font-medium">
                          Política de Privacidad
                        </Link>
                      </Label>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Al registrarte, aceptas que podemos usar tus datos para mejorar nuestros servicios,
                        personalizar tu experiencia de compra y enviarte comunicaciones de marketing relevantes.
                        Puedes cambiar tus preferencias en cualquier momento desde tu perfil.
                      </p>
                    </div>
                  </div>
                  {formErrors.terms && (
                    <div className="flex items-center space-x-1 text-red-600">
                      <AlertCircle className="h-3 w-3" />
                      <span className="text-xs">{formErrors.terms}</span>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full floating-button text-primary-foreground font-semibold py-3"
                  disabled={isLoading || !acceptTerms}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? 'Creando cuenta...' : 'Crear Cuenta Segura'}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-transparent text-muted-foreground">O regístrate con</span>
                </div>
              </div>

              <Button
                onClick={handleGoogleSignup}
                disabled={isGoogleLoading}
                variant="outline"
                className="w-full glass-effect border-border/50 text-foreground hover:bg-accent/50 py-3"
              >
                {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                {isGoogleLoading ? 'Redirigiendo...' : 'Continuar con Google'}
              </Button>

              <div className="text-center">
                <p className="text-center text-muted-foreground text-sm">
                  ¿Ya tienes una cuenta?{' '}
                  <Link
                    to="/login"
                    className="text-foreground hover:text-primary/80 font-medium transition-colors"
                  >
                    Inicia sesión
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Register; 