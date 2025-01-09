import React from 'react';

interface Props {
  children: React.ReactNode;
}

const backgroundImages = [
  'https://images.unsplash.com/photo-1517292987719-0369a794ec0f?auto=format&fit=crop&q=80', // Couple silhouette
  'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80', // Abstract hearts
  'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80', // Romantic sunset
  'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?auto=format&fit=crop&q=80'  // Love lock bridge
];

export function PageBackground({ children }: Props) {
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-purple-500 to-pink-600">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-repeat" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
        }} />
      </div>

      {/* Background Images */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-2 h-full">
          {backgroundImages.map((image, index) => (
            <div key={index} className="relative">
              <img 
                src={image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}