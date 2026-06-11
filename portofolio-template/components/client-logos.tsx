export function ClientLogos() {
  const logos = [
    { name: "logoipsum-254", src: "/logos/logoipsum-254.svg" },
    { name: "logoipsum-257", src: "/logos/logoipsum-257.svg" },
    { name: "logoipsum-251", src: "/logos/logoipsum-251.svg" },
    { name: "logoipsum-242", src: "/logos/logoipsum-242.svg" },
    { name: "logoipsum-258", src: "/logos/logoipsum-258.svg" },
  ]

  return (
    <section className="py-12 px-6 border-t border-border">
      <div className="container mx-auto">
        <h2 className="font-serif text-2xl md:text-3xl text-center mb-8 text-foreground/60">Trusted By</h2>
        <div className="flex items-center justify-center gap-12 flex-wrap opacity-40 grayscale">
          {logos.map((logo) => (
            <div key={logo.name} className="flex items-center justify-center h-10">
              <img src={logo.src || "/placeholder.svg"} alt={logo.name} className="h-full w-auto" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
