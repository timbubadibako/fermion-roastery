"use client"

export function PortfolioShowcase() {
  const portfolioItems = [
    {
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-6laqPMa8FuLJLGY15UqGeDduXqPTnL.png",
    },
    {
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-2SM27flFV2PAGevb0yGPlw5a1VO0Uc.png",
    },
    {
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-auovg1HaxuQFknmxHcpbfOBXQPjAWw.png",
    },
    {
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4-1SjePGsMFItZp8FKWs7dh9emmNImMD.png",
    },
    {
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5-mlczSZMqTq3CmnCXAs0oV6ITGeKdDV.png",
    },
  ]

  return (
    <section className="pt-4 pb-20 overflow-hidden">
      <div className="relative flex">
        {/* First set of images */}
        <div className="flex gap-6 animate-scroll-seamless">
          {portfolioItems.map((item, index) => (
            <div key={`set1-${index}`} className="flex-shrink-0 w-[600px]">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-lg">
                <img src={item.image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          ))}
        </div>
        {/* Duplicate set for seamless loop */}
        <div className="flex gap-6 animate-scroll-seamless ml-6" aria-hidden="true">
          {portfolioItems.map((item, index) => (
            <div key={`set2-${index}`} className="flex-shrink-0 w-[600px]">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-lg">
                <img src={item.image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
