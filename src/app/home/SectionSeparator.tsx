"use client";
import { motion } from "framer-motion";

export default function SectionSeparator() {
  return (
    <motion.div
      className="w-full flex justify-center my-8"
      initial={{ opacity: 0, scaleX: 0.8 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      aria-hidden="true"
    >
      <div className="h-1 w-2/3 bg-gradient-to-r from-primary/0 via-primary/60 to-primary/0 rounded-full blur-[1px] shadow-lg" />
    </motion.div>
  );
} 