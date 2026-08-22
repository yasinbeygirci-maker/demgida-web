"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FDFBF7] pt-8 pb-16 lg:py-24 border-b border-[#2B170E]/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAEDCD] border border-[#D4A373]/30 text-[#2B170E] text-xs font-semibold tracking-wide">
              <Sparkles size={14} className="text-[#D4A373]" />
              <span>%100 Doğal İçerik & Taze Kavrulmuş Çekirdekler</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#2B170E] font-serif tracking-tight leading-[1.15]">
              Doğadan Sofranıza, <br />
              <span className="text-[#D4A373]">En Saf Deminde</span> Lezzet.
            </h1>

            <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Özenle seçilmiş yöresel çekirdek kahveler, katkısız gurme kahve şurupları ve Anadolu’nun bereketli topraklarından geleneksel doğal gıdalar Dem Gıda güvencesiyle kapınızda.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/kategori/kahveler"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#2B170E] text-[#FAEDCD] font-bold hover:bg-[#2B170E]/90 transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                Kahveleri Keşfet <ArrowRight size={18} />
              </Link>
              <Link
                href="/kategori/dogal-urunler"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#FAEDCD] text-[#2B170E] font-bold hover:bg-[#D4A373]/30 border border-[#2B170E]/10 transition flex items-center justify-center"
              >
                Doğal Ürünler
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-[#FAEDCD]/20 relative">
                <img
                  src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=900&auto=format&fit=crop"
                  alt="Dem Gıda Kahve ve Doğal Ürünler"
                  className="w-full h-full object-cover hover:scale-105 transition duration-700"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}