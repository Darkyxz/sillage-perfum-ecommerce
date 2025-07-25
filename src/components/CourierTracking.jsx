import React from 'react';
import { FaTruck, FaSearch, FaBoxOpen } from 'react-icons/fa';

const CourierTracking = ({ trackingNumber }) => {
  // Verificar si hay número de seguimiento
  if (!trackingNumber) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FaBoxOpen className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Este producto aún no tiene número de seguimiento asignado.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Couriers disponibles
  const couriers = [
    {
      name: 'Starken',
      url: `https://www.starken.cl/seguimiento?codigo=${trackingNumber}`,
      icon: <FaTruck className="text-blue-600" />,
      color: 'bg-blue-50 hover:bg-blue-100'
    },
    {
      name: 'Chilexpress',
      url: `https://www.chilexpress.cl/Views/ChilexpressCL/Resultado-busqueda.aspx?DATA=${trackingNumber}`,
      icon: <FaTruck className="text-red-600" />,
      color: 'bg-red-50 hover:bg-red-100'
    },
    {
      name: 'CorreosChile',
      url: `https://www.correos.cl/SitePages/seguimiento/seguimiento.aspx?envio=${trackingNumber}`,
      icon: <FaTruck className="text-green-600" />,
      color: 'bg-green-50 hover:bg-green-100'
    }
  ];

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900 flex items-center">
        <FaSearch className="mr-2" /> Seguimiento de tu envío
      </h3>
      <p className="text-sm text-gray-500 mt-1 mb-3">
        Haz clic en la empresa de envío correspondiente para rastrear tu paquete.
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {couriers.map((courier, index) => (
          <a
            key={index}
            href={courier.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${courier.color} rounded-md p-4 flex items-center justify-start border border-gray-200 transition-colors duration-200`}
          >
            <div className="flex-shrink-0 mr-3 text-xl">
              {courier.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{courier.name}</p>
              <p className="text-xs text-gray-500">N°: {trackingNumber}</p>
            </div>
          </a>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-3">
        * Si no estás seguro de qué empresa está gestionando tu envío, prueba con cada una.
      </p>
    </div>
  );
};

export default CourierTracking;