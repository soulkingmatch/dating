import React, { useState } from 'react';
import { Sliders, MapPin } from 'lucide-react';
import type { SearchFilters } from '../../services/searchService';

interface Props {
  onFiltersChange: (filters: SearchFilters) => void;
}

export function SearchFilters({ onFiltersChange }: Props) {
  const [filters, setFilters] = useState<SearchFilters>({
    ageRange: { min: 18, max: 50 },
    gender: [],
    interests: []
  });

  const handleChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleLocationAccess = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          handleChange('location', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            maxDistance: 50 // Default 50km radius
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <Sliders className="w-5 h-5 text-purple-600 mr-2" />
        <h2 className="text-lg font-semibold">Search Filters</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age Range
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              min="18"
              max={filters.ageRange?.max}
              value={filters.ageRange?.min}
              onChange={(e) => handleChange('ageRange', {
                ...filters.ageRange,
                min: parseInt(e.target.value)
              })}
              className="w-24 px-3 py-2 border rounded-md"
            />
            <span>to</span>
            <input
              type="number"
              min={filters.ageRange?.min}
              max="100"
              value={filters.ageRange?.max}
              onChange={(e) => handleChange('ageRange', {
                ...filters.ageRange,
                max: parseInt(e.target.value)
              })}
              className="w-24 px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <select
            multiple
            value={filters.gender}
            onChange={(e) => handleChange('gender', 
              Array.from(e.target.selectedOptions, option => option.value)
            )}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            <option value="other">Other</option>
          </select>
        </div>

        <button
          onClick={handleLocationAccess}
          className="flex items-center justify-center w-full px-4 py-2 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50"
        >
          <MapPin className="w-4 h-4 mr-2" />
          {filters.location ? 'Update Location' : 'Use My Location'}
        </button>

        {filters.location && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Distance (km)
            </label>
            <input
              type="number"
              min="1"
              max="500"
              value={filters.location.maxDistance}
              onChange={(e) => handleChange('location', {
                ...filters.location,
                maxDistance: parseInt(e.target.value)
              })}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        )}
      </div>
    </div>
  );
}