'use client'

import React, { useState } from 'react'
import {
  Car, Calendar, Gauge, MapPin, Palette,
  FileText, CircleCheck, CircleX, Info,
  Upload, ChevronDown, ArrowRight
} from 'lucide-react'

type FormDataType = {
  brand: string        // ✅ matches backend: brand
  model: string
  year: string
  mileage: string      // ✅ matches backend: mileage
  condition: string
  city: string         // ✅ matches backend: city
  status: string
  color: string
  description: string
  images: File[]       // ✅ multiple files
}

const inputCls =
  'w-full bg-white border border-slate-200 text-slate-800 placeholder-slate-400 rounded-lg px-3 py-2 pl-9 text-sm outline-none transition-all duration-150 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-slate-300'

const selectCls =
  'w-full bg-white border border-slate-200 text-slate-800 rounded-lg px-3 py-2 pl-9 pr-8 text-sm outline-none transition-all duration-150 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-slate-300 appearance-none cursor-pointer'

function Field({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="relative group">
      <Icon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors z-10 pointer-events-none" />
      {children}
    </div>
  )
}

function SelectField({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="relative group">
      <Icon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors z-10 pointer-events-none" />
      {children}
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
    </div>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-2.5">
      <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500">{children}</span>
      <div className="flex-1 h-px bg-blue-100" />
    </div>
  )
}

export default function NewAdd() {
  const [formData, setFormData] = useState<FormDataType>({
    brand: '', model: '', year: '', mileage: '',
    condition: '', city: '', status: '',
    color: '', description: '', images: [],
  })

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('');

    if (formData.images.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    const payload = new FormData();

    // ✅ Keys exactly match what backend destructures
    payload.append('brand',       formData.brand);
    payload.append('model',       formData.model);
    payload.append('year',        formData.year);
    payload.append('mileage',     formData.mileage);
    payload.append('condition',   formData.condition);
    payload.append('city',        formData.city);        // ✅ not 'location'
    payload.append('status',      formData.status);
    payload.append('color',       formData.color);
    payload.append('description', formData.description);

    // ✅ Append all images under same key — matches upload.array('vehicle_images')
    formData.images.forEach(img => {
      payload.append('vehicle_images', img);
    });

    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/users/addvehicle', {
//                                        
     method: 'POST',
      body: payload,
    credentials: 'include' 
        });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }

      alert('Vehicle listed successfully!');

    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">

      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-white shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center">
            <Car className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-800 leading-tight">New Car Listing</h2>
            <p className="text-[11px] text-slate-400">Fill in the details below</p>
          </div>
        </div>
      </div>

      {/* Scrollable form body */}
      <div className="flex-1 overflow-y-auto px-5 py-2 bg-slate-50">
        <form onSubmit={handleSubmit} className="space-y-0 max-w-2xl mx-auto">

          {/* Vehicle Identity */}
          <div>
            <SectionHeading>Vehicle identity</SectionHeading>
            <div className="grid grid-cols-2 gap-2">
              <Field icon={Car}>
                <input type="text" placeholder="Brand" className={inputCls}   // ✅ 'Make' → 'Brand' to match backend
                  onChange={e => setFormData({ ...formData, brand: e.target.value })} />
              </Field>
              <Field icon={Info}>
                <input type="text" placeholder="Model" className={inputCls}
                  onChange={e => setFormData({ ...formData, model: e.target.value })} />
              </Field>
              <Field icon={Calendar}>
                <input type="number" placeholder="Year" className={inputCls}
                  onChange={e => setFormData({ ...formData, year: e.target.value })} />
              </Field>
              <Field icon={Palette}>
                <input type="text" placeholder="Color" className={inputCls}
                  onChange={e => setFormData({ ...formData, color: e.target.value })} />
              </Field>
            </div>
          </div>

          {/* Specs & Location */}
          <div>
            <SectionHeading>Specs &amp; location</SectionHeading>
            <div className="grid grid-cols-2 gap-2">
              <Field icon={Gauge}>
                <input type="number" placeholder="Mileage (KM)" className={inputCls}
                  onChange={e => setFormData({ ...formData, mileage: e.target.value })} />  {/* ✅ mileage not mileage_km */}
              </Field>
              <Field icon={MapPin}>
                <input type="text" placeholder="City" className={inputCls}
                  onChange={e => setFormData({ ...formData, city: e.target.value })} />     {/* ✅ city not location_city */}
              </Field>
              <SelectField icon={CircleCheck}>
                <select className={selectCls} defaultValue=""
                  onChange={e => setFormData({ ...formData, condition: e.target.value })}>
                  <option value="" disabled>Condition</option>
                  <option value="new">New</option>
                  <option value="used">Used</option>
                </select>
              </SelectField>
              <SelectField icon={CircleX}>
                <select className={selectCls} defaultValue=""
                  onChange={e => setFormData({ ...formData, status: e.target.value })}>
                  <option value="" disabled>Status</option>
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                </select>
              </SelectField>
            </div>
          </div>

          {/* Media & Description */}
          <div>
            <SectionHeading>Media &amp; description</SectionHeading>
            <div className="space-y-2">

              {/* ✅ Multiple file upload */}
              <label className="flex items-center gap-3 bg-white border border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/40 rounded-lg px-4 py-3 cursor-pointer group transition-all duration-150">
                <div className="w-8 h-8 rounded-md bg-slate-100 group-hover:bg-blue-100 border border-slate-200 group-hover:border-blue-200 flex items-center justify-center shrink-0 transition-all duration-150">
                  <Upload className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">
                    {formData.images.length > 0
                      ? `${formData.images.length} image${formData.images.length > 1 ? 's' : ''} selected`
                      : 'Choose images'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {formData.images.length > 0
                      ? formData.images.map(f => f.name).join(', ')
                      : 'PNG, JPG, WEBP · max 10 MB · up to 5 images'}
                  </p>
                </div>
                {formData.images.length > 0 && (
                  <span className="shrink-0 text-[11px] bg-blue-50 text-blue-600 border border-blue-200 rounded-full px-2 py-0.5 font-medium">
                    {formData.images.length}/5 Ready
                  </span>
                )}
                {/* ✅ multiple attribute — matches upload.array() */}
                <input type="file" accept="image/*" multiple className="hidden" name="vehicle_images"
                  onChange={e => setFormData({ ...formData, images: Array.from(e.target.files || []) })} />
              </label>

              {/* Description */}
              <div className="relative group">
                <FileText className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
                <textarea
                  placeholder="Describe the car — condition, service history, extras…"
                  rows={3}
                  className="w-full bg-white border border-slate-200 text-slate-800 placeholder-slate-400 rounded-lg px-3 py-2 pl-9 text-sm outline-none transition-all duration-150 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-slate-300 resize-none"
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Error message */}
              {error && (
                <p className="text-xs text-red-500 font-medium">{error}</p>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg py-2.5 transition-all duration-150"
          >
            {loading ? 'Publishing...' : 'Publish Listing'}
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>
      </div>
    </div>
  )
}