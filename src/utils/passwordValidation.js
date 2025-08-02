// Utilidades para validación de contraseñas seguras

export const validatePassword = (password) => {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    symbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  };

  const passed = Object.values(requirements).filter(Boolean).length;
  const isValid = passed === 5;

  return {
    isValid,
    requirements,
    strength: passed,
    errors: getPasswordErrors(requirements)
  };
};

const getPasswordErrors = (requirements) => {
  const errors = [];
  
  if (!requirements.length) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }
  if (!requirements.uppercase) {
    errors.push('Debe incluir al menos una letra mayúscula (A-Z)');
  }
  if (!requirements.lowercase) {
    errors.push('Debe incluir al menos una letra minúscula (a-z)');
  }
  if (!requirements.number) {
    errors.push('Debe incluir al menos un número (0-9)');
  }
  if (!requirements.symbol) {
    errors.push('Debe incluir al menos un símbolo (!@#$%^&*)');
  }

  return errors;
};

export const getPasswordStrength = (password) => {
  const { strength } = validatePassword(password);
  
  if (strength <= 1) return { level: 'very-weak', text: 'Muy débil', color: 'red' };
  if (strength <= 2) return { level: 'weak', text: 'Débil', color: 'orange' };
  if (strength <= 3) return { level: 'fair', text: 'Regular', color: 'yellow' };
  if (strength <= 4) return { level: 'good', text: 'Fuerte', color: 'blue' };
  return { level: 'strong', text: 'Muy fuerte', color: 'green' };
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return {
    isValid: emailRegex.test(email),
    error: emailRegex.test(email) ? null : 'Por favor ingresa un email válido'
  };
};

export const validateFullName = (name) => {
  const trimmedName = name.trim();
  const isValid = trimmedName.length >= 2 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(trimmedName);
  
  return {
    isValid,
    error: isValid ? null : 'El nombre debe tener al menos 2 caracteres y solo contener letras'
  };
};