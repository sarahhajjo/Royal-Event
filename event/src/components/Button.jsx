import React from 'react';

function Button({ text, onClick, type = 'submit', className = '' }) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`w-full bg-gradient-to-r from-royal-gold to-royal-gold-dark hover:from-royal-gold-light hover:to-royal-gold text-[#302205] font-bold py-3.5 mt-2 rounded-[4px] shadow-lg transition-all duration-300 tracking-[0.15em] text-xs cursor-pointer active:scale-[0.99] ${className}`}
        >
            {text}
        </button>
    );
}

export default Button;