import React from 'react';
import { Check, X, AlertCircle } from 'lucide-react';

const PasswordStrengthMeter = ({ password }) => {
  const requirements = [
    {
      id: 'length',
      label: 'Al menos 8 caracteres',
      test: (pwd) => pwd.length >= 8
    },
    {
      id: 'uppercase',
      label: 'Una letra mayúscula (A-Z)',
      test: (pwd) => /[A-Z]/.test(pwd)
    },
    {
      id: 'lowercase',
      label: 'Una letra minúscula (a-z)',
      test: (pwd) => /[a-z]/.test(pwd)
    },
    {
      id: 'number',
      label: 'Un número (0-9)',
      test: (pwd) => /\d/.test(pwd)
    },
    {
      id: 'symbol',
      label: 'Un símbolo (!@#$%^&*)',
      test: (pwd) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)
    }
  ];

  const passedRequirements = requirements.filter(req => req.test(password));
  const strength = passedRequirements.length;

  const getStrengthColor = () => {
    if (strength <= 1) return 'bg-red-500';
    if (strength <= 2) return 'bg-orange-500';
    if (strength <= 3) return 'bg-yellow-500';
    if (strength <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (strength <= 1) return 'Muy débil';
    if (strength <= 2) return 'Débil';
    if (strength <= 3) return 'Regular';
    if (strength <= 4) return 'Fuerte';
    return 'Muy fuerte';
  };

  const getStrengthTextColor = () => {
    if (strength <= 1) return 'text-red-600';
    if (strength <= 2) return 'text-orange-600';
    if (strength <= 3) return 'text-yellow-600';
    if (strength <= 4) return 'text-blue-600';
    return 'text-green-600';
  };

  if (!password) return null;

  return (
    <div className="mt-3 space-y-3">
      {/* Barra de progreso */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Seguridad de la contraseña:</span>
          <span className={`text-sm font-medium ${getStrengthTextColor()}`}>
            {getStrengthText()}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${(strength / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Lista de requisitos */}
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground mb-2">Tu contraseña debe contener:</p>
        {requirements.map((req) => {
          const passed = req.test(password);
          return (
            <div key={req.id} className="flex items-center space-x-2">
              {passed ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <X className="h-3 w-3 text-red-500" />
              )}
              <span className={`text-xs ${passed ? 'text-green-600' : 'text-muted-foreground'}`}>
                {req.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mensaje de seguridad */}
      {strength < 5 && (
        <div className="flex items-start space-x-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-amber-700">
            <p className="font-medium">Recomendación de seguridad:</p>
            <p>Una contraseña fuerte protege mejor tu cuenta. Incluye todos los elementos requeridos.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;