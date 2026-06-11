import { TestimonialSlider, type Testimonial } from "@/components/ui/testimonial-slider"

const testimonials: Testimonial[] = [
  {
    image: "/placeholder.svg?height=400&width=400",
    quote:
      "Spark transformed our agency's web presence completely. The conversion-focused design they delivered increased our client inquiries by 85% in just three months. Their attention to detail and understanding of agency needs is unmatched.",
    name: "Sarah Mitchell",
    role: "Founder, Digital Growth Agency",
    rating: 5,
  },
  {
    image: "/placeholder.svg?height=400&width=400",
    quote:
      "Working with Spark has been a game-changer for our white-label services. They deliver consistently high-quality work that we're proud to present to our clients. The partnership has allowed us to scale faster than we ever thought possible.",
    name: "James Rodriguez",
    role: "Creative Director, Brand Studio",
    rating: 5,
  },
  {
    image: "/placeholder.svg?height=400&width=400",
    quote:
      "The team at Spark doesn't just build websites—they build growth engines. Their strategic approach to conversion optimization has helped us achieve a 3x ROI on our web investment. Highly recommend for any agency looking to scale.",
    name: "Emily Chen",
    role: "CEO, Marketing Solutions Co.",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-32 px-4 bg-background overflow-visible">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-balance">What Our Partners Say</h2>
          <p className="font-sans text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it—hear from the agencies we've helped grow.
          </p>
        </div>
        <TestimonialSlider testimonials={testimonials} />
      </div>
    </section>
  )
}
