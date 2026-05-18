import React from 'react';

function InputField({ label, type = 'text', placeholder, value, onChange, children }) {
    return (
        <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] font-semibold text-royal-gold uppercase tracking-[0.2em]">
                {label}
            </label>
            <div className="relative w-full bg-royal-field rounded-[4px] flex items-center">
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="w-full bg-transparent text-royal-text border-b-2 border-transparent focus:border-royal-gold focus:bg-royal-field-focus outline-none rounded-[4px] p-3 text-sm transition-all duration-300 placeholder-[#4e4639]"
                />
                {children}
            </div>
        </div>
    );
}

export default InputField;