"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function NewsletterSignupSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setSubmitted(true);
    setEmail("");
  }

  return (
    <section className="w-full max-w-xl mx-auto py-16 px-4 flex flex-col items-center">
      <motion.div
        className="bg-zinc-900/90 rounded-2xl shadow-2xl border border-zinc-800 p-8 flex flex-col items-center w-full animate-in fade-in"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <Sparkles className="w-10 h-10 text-primary mb-2 animate-bounce" />
        <h2 className="text-2xl md:text-3xl font-extrabold text-orange-100 mb-2 text-center drop-shadow-lg">
          Get the Best Recipes in Your Inbox
        </h2>
        <p className="text-orange-200 text-center mb-6 text-base max-w-md">
          Subscribe for new recipes, exclusive content, and tasty inspiration. No spam, ever.
        </p>
        {submitted ? (
          <div className="text-green-400 font-semibold text-center py-4">
            🎉 Thanks for subscribing! Check your inbox for a welcome email.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md items-center">
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-1 px-4 py-2 rounded-md border"
              aria-label="Email address"
              required
              disabled={submitted}
            />
            <Button type="submit" className="px-6 py-2 font-semibold" disabled={submitted}>
              Subscribe
            </Button>
          </form>
        )}
        {error && <div className="text-red-400 mt-2 text-sm">{error}</div>}
      </motion.div>
    </section>
  );
} 