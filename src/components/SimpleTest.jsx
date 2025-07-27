import React from 'react';

const SimpleTest = () => {
  return (
    <div className="min-h-screen bg-red-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-black mb-4">
          🧪 Test Simple - La App Funciona
        </h1>
        <p className="text-gray-700 mb-4">
          Si ves esto, el problema no está en React sino en los contextos o componentes específicos.
        </p>
        <div className="space-y-2 text-sm">
          <div>✅ React renderiza correctamente</div>
          <div>✅ CSS funciona</div>
          <div>✅ Componentes básicos funcionan</div>
        </div>
      </div>
    </div>
  );
};

export default SimpleTest;