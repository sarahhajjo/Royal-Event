import React from 'react';

function HeroSection() {
    return (
        <div className="hidden md:flex md:w-1/2 relative h-full p-12 flex-col justify-between items-start z-10">
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
                style={{
                    backgroundImage: `linear-gradient(to right, rgba(24, 18, 15, 0.4), rgba(24, 18, 15, 0.85)), url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200')`
                }}
            />

            <div className="relative z-20">
                <h1 className="text-3xl font-bold tracking-wide text-royal-text" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Royal Events
                </h1>
                <div className="w-12 h-[2px] bg-royal-gold mt-2"></div>
            </div>

            <div className="relative z-20 max-w-lg mb-8">
        <span className="text-[10px] uppercase tracking-[0.3em] text-royal-gold font-semibold block mb-3">
          Heritage & Excellence
        </span>
                <h2 className="text-4xl lg:text-5xl font-medium text-royal-text leading-[1.25] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                    A portal to refined experiences and bespoke luxury.
                </h2>
                <p className="text-sm text-royal-muted leading-relaxed">
                    Join an exclusive collective where meticulous craftsmanship meets timeless elegance.
                </p>
            </div>
        </div>
    );
}

export default HeroSection;