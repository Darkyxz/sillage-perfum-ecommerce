import React from 'react';
import { FaTruck, FaSearch, FaBoxOpen } from 'react-icons/fa';

const CourierTracking = ({ trackingNumber = '' }) => {
  const couriers = [
    {
      name: 'Starken',
      url: trackingNumber ? 
        `https://www.starken.cl/seguimiento?codigo=${trackingNumber}` : 
        'https://www.starken.cl/seguimiento',
      icon: <FaTruck className="text-blue-600" />,
      color: 'bg-blue-50 hover:bg-blue-100',
      description: 'Sistema de seguimiento de Starken'
    },
    {
      name: 'Chilexpress',
      url: trackingNumber ? 
        `https://centrodeayuda.chilexpress.cl/home` : 
        'https://centrodeayuda.chilexpress.cl/home',
      icon: <FaTruck className="text-red-600" />,
      color: 'bg-red-50 hover:bg-red-100',
      description: 'Centro de ayuda Chilexpress'
    },
    {
      name: 'CorreosChile',
      url: trackingNumber ? 
        `https://www.correos.cl/seguimiento-en-linea` : 
        'https://www.correos.cl/seguimiento-en-linea',
      icon: <FaTruck className="text-green-600" />,
      color: 'bg-green-50 hover:bg-green-100',
      description: 'Seguimiento en línea Correos Chile'
    }
  ];

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900 flex items-center">
        <FaSearch className="mr-2" /> Seguimiento de envíos
      </h3>
      
      {!trackingNumber && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaBoxOpen className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                {trackingNumber 
                  ? "Utiliza los siguientes enlaces para rastrear tu envío:" 
                  : "Este producto no tiene número de seguimiento asignado. Puedes usar los siguientes enlaces para rastrear tu envío cuando lo tengas."}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 mt-4">
        {couriers.map((courier, index) => (
          <div 
            key={index} 
            className={`${courier.color} rounded-md p-4 border border-gray-200 transition-colors duration-200`}
          >
            <div className="flex items-center mb-2">
              <div className="flex-shrink-0 mr-3 text-xl">
                {courier.icon}
              </div>
              <h4 className="text-sm font-medium text-gray-900">{courier.name}</h4>
            </div>
            
            {trackingNumber && (
              <p className="text-xs text-gray-500 mb-2">N° de seguimiento: {trackingNumber}</p>
            )}
            
            <a
              href={courier.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-amber-900 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:via-amber-600 hover:to-amber-700 py-2 px-4 rounded-md inline-block mt-1 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Rastrear envío
            </a>
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p><strong>Nota:</strong> El número de seguimiento debe ser proporcionado por la empresa de envíos.</p>
        <p className="mt-1">Si tienes problemas con tu envío, contacta directamente con la empresa correspondiente.</p>
      </div>
    </div>
  );
};

export default CourierTracking;