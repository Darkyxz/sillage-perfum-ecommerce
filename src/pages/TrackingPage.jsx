import React from 'react';
import CourierTracking from '@/components/CourierTracking';

const TrackingPage = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const trackingNumber = queryParams.get('tracking') || '';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Seguimiento de Envío</h1>
      <CourierTracking trackingNumber={trackingNumber} />
    </div>
  );
};

export default TrackingPage;