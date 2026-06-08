"use client";

export function ValuePropositionSection() {
  const values = [
    {
      number: "01",
      title: "Price Competitive",
      description: "Beat market rates without sacrificing quality. Direct sourcing means savings passed to you.",
    },
    {
      number: "02",
      title: "Micro-Batch Precision",
      description: "Every roast is engineered to peak freshness. Science-driven consistency in every bag.",
    },
    {
      number: "03",
      title: "Direct Partnership",
      description: "Work with roasters, not brokers. Exclusive access to rare lots and custom profiles.",
    },
  ];

  return (
    <section className="bg-background">
      <div className="px-6 py-20 md:px-12 md:py-28 lg:px-20 lg:py-36">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-20 space-y-4">
            <p className="text-[10px] font-black text-fermion-blue tracking-[0.4em] uppercase">
              Why Fermion
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-foreground uppercase italic">
              Precision Coffee
              <br />
              Without Compromise.
            </h2>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div
                key={value.number}
                className="relative bg-fermion-soft rounded-3xl p-8 md:p-10 border border-fermion-blue/10 hover:shadow-lg hover:shadow-fermion-blue/10 transition-all duration-500"
              >
                {/* Number */}
                <span className="absolute top-6 right-8 text-6xl font-black text-fermion-blue/5 italic">
                  {value.number}
                </span>

                {/* Content */}
                <div className="relative z-10 space-y-4">
                  <h3 className="text-2xl font-black tracking-tighter text-foreground uppercase">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
