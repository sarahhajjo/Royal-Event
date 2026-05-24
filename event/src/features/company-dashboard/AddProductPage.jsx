import React, { useState } from 'react';
import InputField from '../../components/InputField';
import Button from '../../components/Button';

function AddProductPage() {
    // 1. الحالات التفاعلية لإدارة محتوى الاستمارة وبدائل الألوان
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [material, setMaterial] = useState('');
    const [hasVariants, setHasVariants] = useState('yes'); // 'yes' or 'no'
    const [colorCount, setColorCount] = useState('1');
    const [secondaryContact, setSecondaryContact] = useState('');
    const [publishStatus, setPublishStatus] = useState('public'); // 'public' or 'draft'

    // مصفوفة ديناميكية لإدارة كروت البدائل المضافة (Variants) كما في الصورة
    const [variants, setVariants] = useState([
        { id: 1, name: 'e.g. Onyx', price: '0.00', stock: '0', date: '' },
        { id: 2, name: 'e.g. Ivory', price: '0.00', stock: '0', date: '' },
        { id: 3, name: 'e.g. Gold', price: '0.00', stock: '0', date: '' }
    ]);

    const handleAddVariant = () => {
        const newId = variants.length + 1;
        setVariants([...variants, { id: newId, name: '', price: '0.00', stock: '0', date: '' }]);
    };

    const handleVariantChange = (id, field, value) => {
        setVariants(variants.map(v => v.id === id ? { ...v, [field]: value } : v));
    };

    return (
        <div className="w-full h-screen min-h-screen bg-royal-bg flex overflow-hidden font-sans select-none text-royal-text">

            {/* ----------------- الشطر الأيسر: القائمة الجانبية (Sidebar) من الصورة ----------------- */}
            <div className="w-64 bg-royal-dark border-r border-royal-border h-full p-6 flex flex-col justify-between">
                <div className="space-y-8">
                    {/* رأس القائمة */}
                    <div>
                        <h2 className="text-sm font-bold tracking-wider text-royal-text" style={{ fontFamily: "'Playfair Display', serif" }}>Editorial Gala</h2>
                        <p className="text-[10px] text-royal-muted uppercase tracking-widest mt-1">Concierge Portal</p>
                    </div>

                    {/* الروابط وأقسام العمل */}
                    <nav className="space-y-4">
                        <div className="text-[10px] font-semibold text-royal-gold uppercase tracking-[0.2em] mb-2">Addition Section</div>
                        <a href="#" className="flex items-center space-x-3 text-xs bg-royal-field-focus text-royal-gold p-2.5 rounded-[4px] border-r-2 border-royal-gold">
                            <span>📦</span> <span className="font-medium">Product</span>
                        </a>
                        <a href="#" className="flex items-center space-x-3 text-xs text-royal-muted hover:text-royal-text p-2.5 transition-colors">
                            <span>🏰</span> <span>Hall for Rent</span>
                        </a>

                        <div className="text-[10px] font-semibold text-royal-gold uppercase tracking-[0.2em] pt-4 mb-2">Requests Section</div>
                        <a href="#" className="flex items-center space-x-3 text-xs text-royal-muted hover:text-royal-text p-2 transition-colors">
                            <span>📥</span> <span>Requests Section</span>
                        </a>
                    </nav>
                </div>

                {/* أسفل القائمة الجانبية */}
                <div className="space-y-3 border-t border-royal-border pt-4">
                    <button className="w-full bg-royal-field border border-royal-border text-royal-gold text-[10px] font-bold py-2 rounded-[4px] tracking-widest hover:bg-royal-field-focus transition-colors">
                        + NEW EVENT
                    </button>
                    <div className="text-[11px] text-royal-muted flex justify-between px-1">
                        <span className="hover:text-royal-text cursor-pointer">Support</span>
                        <span className="hover:text-royal-text cursor-pointer">Account</span>
                    </div>
                </div>
            </div>

            {/* ----------------- الشطر الأيمن: استمارة إضافة منتج ومحتوى الجاليري ----------------- */}
            <div className="flex-grow h-full bg-royal-bg flex flex-col overflow-y-auto p-10">

                {/* مسار الصفحة والعنوان الرئيسي */}
                <div className="mb-6">
                    <div className="text-[10px] text-royal-muted space-x-2 uppercase tracking-widest mb-2">
                        <span>Catalog</span> <span className="text-royal-gold">›</span> <span>Add New Product</span>
                    </div>
                    <h1 className="text-3xl font-medium text-royal-text" style={{ fontFamily: "'Playfair Display', serif" }}>Add New Product</h1>
                    <p className="text-xs text-royal-muted mt-1">Curate your next exclusive product offering for the Editorial Gala catalog.</p>
                </div>

                {/* الحاوية الرئيسية للاستمارة الهندسية */}
                <div className="space-y-6 max-w-4xl w-full pb-16">

                    {/* SECTION 1: Core Details */}
                    <div className="bg-royal-dark border border-royal-border p-6 rounded-[4px] space-y-4">
                        <div className="flex items-center space-x-2 text-royal-gold text-xs font-semibold uppercase tracking-wider mb-2">
                            <span>📋</span> <span>Core Details</span>
                        </div>
                        <InputField
                            label="Product Name"
                            placeholder="e.g., Signature Silk Gala Gown"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                        />

                        {/* حقل الوصف التفصيلي المسكوب */}
                        <div className="flex flex-col space-y-1.5">
                            <label className="text-[10px] font-semibold text-royal-gold uppercase tracking-[0.2em]">Detailed Description</label>
                            <textarea
                                placeholder="Describe the craftsmanship and narrative behind this piece..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="w-full bg-royal-field text-royal-text border-b-2 border-transparent focus:border-royal-gold focus:bg-royal-field-focus outline-none rounded-[4px] p-3 text-sm transition-all duration-300 placeholder-[#4e4639] resize-none"
                            />
                        </div>

                        <InputField
                            label="Material / Composition"
                            placeholder="e.g., 100% Mulberry Silk, 24k Gold Threading"
                            value={material}
                            onChange={(e) => setMaterial(e.target.value)}
                        />
                    </div>

                    {/* SECTION 2: Variant Options */}
                    <div className="bg-royal-dark border border-royal-border p-6 rounded-[4px] space-y-6">
                        <div className="flex items-center space-x-2 text-royal-gold text-xs font-semibold uppercase tracking-wider">
                            <span>🎨</span> <span>Variant Options</span>
                        </div>

                        {/* الراديو كرت التفاعلي للسؤال عن ألوان متعددة */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-semibold text-royal-gold uppercase tracking-[0.2em]">Add variants with different colors?</label>
                                <div className="flex space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => setHasVariants('yes')}
                                        className={`flex-1 py-2 text-xs font-bold rounded-[4px] border transition-all ${hasVariants === 'yes' ? 'bg-royal-field-focus border-royal-gold text-royal-text' : 'bg-royal-field border-royal-border text-royal-muted'}`}
                                    >
                                        ● Yes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setHasVariants('no')}
                                        className={`flex-1 py-2 text-xs font-bold rounded-[4px] border transition-all ${hasVariants === 'no' ? 'bg-royal-field-focus border-royal-gold text-royal-text' : 'bg-royal-field border-royal-border text-royal-muted'}`}
                                    >
                                        ○ No
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-semibold text-royal-gold uppercase tracking-[0.2em]">How many colors would you like to add?</label>
                                <input
                                    type="number"
                                    value={colorCount}
                                    onChange={(e) => setColorCount(e.target.value)}
                                    className="w-full bg-royal-field text-royal-text border-b-2 border-transparent focus:border-royal-gold focus:bg-royal-field-focus outline-none rounded-[4px] p-2.5 text-sm transition-all duration-300"
                                />
                            </div>
                        </div>

                        {/* شبكة كروت البدائل الديناميكية (Variant Cards Grid) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {variants.map((variant, index) => (
                                <div key={variant.id} className="bg-royal-field border border-royal-border p-4 rounded-[4px] space-y-3 relative">
                                    <div className="text-[9px] uppercase tracking-widest text-royal-muted flex justify-between">
                                        <span>Variant {index + 1}</span>
                                        <span className="cursor-pointer hover:text-red-400">🗑</span>
                                    </div>

                                    {/* مساحة رفع الصورة المصغرة */}
                                    <div className="w-full h-24 bg-royal-dark border border-dashed border-royal-border hover:border-royal-gold rounded-[4px] flex flex-col items-center justify-center cursor-pointer transition-colors">
                                        <span className="text-lg">📷</span>
                                        <span className="text-[9px] uppercase tracking-wider text-royal-muted mt-1">Upload Image</span>
                                    </div>

                                    <InputField
                                        label="Color Name/Hex"
                                        placeholder={variant.name}
                                        value={variant.name.startsWith('e.g.') ? '' : variant.name}
                                        onChange={(e) => handleVariantChange(variant.id, 'name', e.target.value)}
                                    />
                                    <InputField
                                        label="Price (USD)"
                                        placeholder="0.00"
                                        value={variant.price}
                                        onChange={(e) => handleVariantChange(variant.id, 'price', e.target.value)}
                                    />
                                    <InputField
                                        label="Stock Quantity"
                                        placeholder="0"
                                        value={variant.stock}
                                        onChange={(e) => handleVariantChange(variant.id, 'stock', e.target.value)}
                                    />
                                    <div className="flex flex-col space-y-1">
                                        <label className="text-[9px] font-semibold text-royal-gold uppercase tracking-wider">Availability Date</label>
                                        <input type="date" className="bg-royal-dark text-royal-text text-xs p-2 rounded-[4px] border border-royal-border outline-none focus:border-royal-gold" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* زر إضافة كرت جديد ناعم */}
                        <div className="text-center pt-2">
                            <button
                                type="button"
                                onClick={handleAddVariant}
                                className="border border-royal-gold/40 text-royal-gold text-[10px] font-bold px-4 py-2 rounded-[4px] tracking-widest hover:bg-royal-field transition-colors"
                            >
                                ＋ ADD ANOTHER VARIANT
                            </button>
                        </div>
                    </div>

                    {/* SECTION 3: Logistic & Visibility */}
                    <div className="bg-royal-dark border border-royal-border p-6 rounded-[4px] space-y-5">
                        <div className="flex items-center space-x-2 text-royal-gold text-xs font-semibold uppercase tracking-wider">
                            <span>🚛</span> <span>Logistic & Visibility</span>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <InputField
                                label="Secondary Contact Number (Optional)"
                                placeholder="+1 (555) 000-0000"
                                value={secondaryContact}
                                onChange={(e) => setSecondaryContact(e.target.value)}
                            />

                            {/* سياسة الإلغاء وحقوق الملكية */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-semibold text-royal-gold uppercase tracking-[0.2em]">Cancellation Policy</label>
                                <div className="space-y-2 pt-1">
                                    {['Cancellation before acceptance', 'Cancellation after acceptance', 'Cancellation before payment'].map((policy, i) => (
                                        <label key={i} className="flex items-center space-x-3 text-xs text-royal-muted cursor-pointer select-none">
                                            <input type="checkbox" className="rounded bg-royal-field border-royal-border text-royal-gold accent-royal-gold" />
                                            <span>{policy}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* خيارات حالة النشر النهائي */}
                        <div className="pt-2 border-t border-royal-border/40">
                            <label className="text-[10px] font-semibold text-royal-gold uppercase tracking-[0.2em] block mb-2">Publishing Status</label>
                            <div className="flex space-x-6">
                                <label className="flex items-center space-x-2 text-xs text-royal-text cursor-pointer">
                                    <input type="radio" checked={publishStatus === 'public'} onChange={() => setPublishStatus('public')} className="accent-royal-gold" />
                                    <span>Display to public</span>
                                </label>
                                <label className="flex items-center space-x-2 text-xs text-royal-muted cursor-pointer">
                                    <input type="radio" checked={publishStatus === 'draft'} onChange={() => setPublishStatus('draft')} className="accent-royal-gold" />
                                    <span>Save as private draft</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* أزرار الحفظ والإرسال المزدوجة بأسفل الاستمارة */}
                    <div className="flex space-x-4 pt-4">
                        <Button text="PUBLISH PRODUCT ▻" className="flex-1" />
                        <button type="button" className="flex-1 border border-royal-border text-royal-muted hover:text-royal-text font-bold text-xs tracking-widest rounded-[4px] hover:bg-royal-field transition-colors">
                            SAVE FOR LATER
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default AddProductPage;