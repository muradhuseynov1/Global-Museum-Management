import React from 'react';

const MapContainer = ({ children, center, zoom, style }) => (
  <div data-testid="map-container" style={style}>
    {children}
  </div>
);

const TileLayer = () => <div data-testid="tile-layer">TileLayer</div>;

const Marker = ({ position, icon, children }) => (
  <div data-testid="marker" data-position={position} data-icon={icon}>
    {children}
  </div>
);

const Popup = ({ children }) => <div data-testid="popup">{children}</div>;

export { MapContainer, TileLayer, Marker, Popup };
