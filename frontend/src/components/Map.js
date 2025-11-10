import React, { useEffect, useRef } from 'react';

const Map = ({ latitude, longitude }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: latitude || 0, lng: longitude || 0 },
      zoom: 12,
    });

    if (latitude && longitude) {
      new window.google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
        title: 'Need Location',
      });
    }
  }, [latitude, longitude]);

  return <div ref={mapRef} style={{ height: '400px', width: '100%' }}></div>;
};

export default Map;
