"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Truck, Sparkles } from "lucide-react";
import { motion, Variants } from "framer-motion";

export default function Hero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    },
  };

  return (
    <section className="relative overflow-hidden bg-brand-neutral pt-12 pb-20 lg:pt-24 lg:pb-32 border-b border-brand-navy/5">
      {/* Arka Plan Dekorasyonu */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-brand-accent/5 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-10 text-center lg:text-left"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-brand-navy/5 border border-brand-navy/10 text-brand-navy text-[13px] font-bold tracking-wide uppercase">
              <Sparkles size={16} className="text-brand-accent animate-pulse" />
              <span>%100 Doğal İçerik & Taze Seçkiler</span>
            </motion.div>

            <div className="space-y-6">
              <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl lg:text-7xl font-serif font-medium text-brand-navy tracking-premium-tight leading-[1.1]">
                Doğadan Sofranıza <br />
                <span className="italic relative inline-block">
                  En Saf Deminde
                  <motion.svg
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1, delay: 1.5 }}
                    className="absolute -bottom-2 left-0 w-full h-3 text-brand-accent/30" viewBox="0 0 100 10" preserveAspectRatio="none"
                  >
                    <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
                  </motion.svg>
                </span> Lezzet.
              </motion.h1>

              <motion.p variants={itemVariants} className="text-lg sm:text-xl text-brand-muted max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed tracking-tight">
                Özenle seçilmiş yöresel kahveler, katkısız gurme şuruplar ve Anadolu’nun bereketli topraklarından geleneksel lezzetler Dem Gıda kalitesiyle kapınızda.
              </motion.p>
            </div>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-4">
              <Link
                href="/kategori/kahveler"
                className="group w-full sm:w-auto px-10 py-5 rounded-2xl bg-brand-navy text-brand-neutral font-black hover:bg-brand-dark transition-all shadow-2xl shadow-brand-navy/30 hover:-translate-y-1 flex items-center justify-center gap-3 tracking-wider uppercase text-sm"
              >
                Kahveleri Keşfet
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/kategori/dogal-urunler"
                className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white text-brand-navy font-black hover:bg-brand-navy/5 border border-brand-navy/10 transition-all shadow-sm flex items-center justify-center tracking-wider uppercase text-sm"
              >
                Doğal Ürünler
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center justify-center lg:justify-start gap-8 pt-8 border-t border-brand-navy/5">
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-black text-brand-navy">500+</span>
                <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">Mutlu Müşteri</span>
              </div>
              <div className="w-px h-10 bg-brand-navy/10" />
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-black text-brand-navy">24s</span>
                <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">Hızlı Teslimat</span>
              </div>
              <div className="w-px h-10 bg-brand-navy/10" />
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-black text-brand-navy">100%</span>
                <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">Doğal Garanti</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none group">
              <div className="absolute -inset-4 bg-brand-accent/20 rounded-[40px] blur-2xl group-hover:bg-brand-accent/30 transition-colors duration-500" />

              <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl border-8 border-white bg-white">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=900&auto=format&fit=crop"
                  alt="Dem Gıda Kahve ve Doğal Ürünler"
                  className="w-full h-full object-cover"
                />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="absolute bottom-6 left-6 right-6 bg-brand-navy/90 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-2xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-accent/20 flex items-center justify-center text-brand-accent">
                      <Truck size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-brand-accent uppercase tracking-widest">Ücretsiz Kargo</p>
                      <p className="text-sm font-bold text-brand-neutral">500 TL ve Üzeri Siparişlerde</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
