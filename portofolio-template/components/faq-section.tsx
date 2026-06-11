"use client"

import { useState } from "react"
import { IconChevronDown } from "@tabler/icons-react"
import { motion } from "framer-motion"

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "What's your typical project timeline?",
      answer:
        "Most projects take 2-4 weeks from kickoff to launch, depending on scope. We provide detailed timelines during our discovery phase and keep you updated throughout the process.",
    },
    {
      question: "Do you offer white-label services?",
      answer:
        "Yes! Our Enterprise plan includes white-label solutions where we work behind the scenes as an extension of your agency. Your clients will only see your branding.",
    },
    {
      question: "What if I need revisions after launch?",
      answer:
        "All our plans include post-launch support. Professional plans get 30 days of support, while Enterprise clients receive ongoing maintenance and updates as part of their package.",
    },
    {
      question: "Can you work with our existing tech stack?",
      answer:
        "Absolutely. We're experienced with all major platforms and frameworks. During discovery, we'll assess your current setup and recommend the best approach for integration.",
    },
    {
      question: "How do you ensure high conversion rates?",
      answer:
        "We use data-driven design principles, A/B testing, and proven conversion optimization techniques. Every design decision is backed by research and best practices from thousands of successful projects.",
    },
    {
      question: "What's included in ongoing support?",
      answer:
        "Ongoing support includes bug fixes, security updates, performance monitoring, content updates, and monthly strategy calls to ensure your site continues to perform at its best.",
    },
  ]

  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="font-serif text-4xl md:text-5xl font-bold mb-4"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            Everything you need to know about working with Spark.
          </motion.p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="border border-border rounded-xl overflow-hidden bg-secondary"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-background/50 transition-colors"
              >
                <span className="font-semibold text-lg pr-8">{faq.question}</span>
                <IconChevronDown
                  className={`w-5 h-5 flex-shrink-0 transition-transform ${openIndex === index ? "rotate-180" : ""}`}
                />
              </button>
              {openIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-5 text-muted-foreground leading-relaxed"
                >
                  {faq.answer}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
