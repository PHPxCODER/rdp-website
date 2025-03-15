"use client"
import createGlobe from "cobe"
import { FunctionComponent, useEffect, useRef } from "react"
import { useTheme } from "next-themes";
import { ShinyText } from "@/components/magicui/ShinyText"

export const CloudGlobe: FunctionComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    let phi = 4.7

    const globe = createGlobe(canvasRef.current!, {
      devicePixelRatio: 2,
      width: 800* 2,
      height: 800 * 2,
      phi: 0,
      theta: -0.3,
      dark: theme === "dark" ? 1 : 0,
      diffuse: 1.2,
      mapSamples: 20000,
      mapBrightness: theme === "dark" ? 13 : 1.5,
      mapBaseBrightness: theme === "dark" ? 0.05 : 0.2,
      baseColor: theme === "dark" ? [0.3, 0.3, 0.3] : [1, 1, 1],
      glowColor: theme === "dark" ? [0.15, 0.15, 0.15] : [0.9, 0.9, 0.9],
      markerColor: theme === "dark" ? [100, 100, 100] : [50, 50, 50],
      markers: [
        { location: [19.07283, 72.88261], size: 0.03 }, // Mumbai
        { location: [17.360589, 78.4740613], size: 0.03 }, // Hyderabad
        { location: [17.6935526, 83.2921297], size: 0.03 }, // Visaakhapatnam
        { location: [28.7041, 77.1025], size: 0.03 }, // Delhi
      ],
      onRender: (state: { phi?: number }) => {
        state.phi = phi
        phi += 0.0002
      },
    })

    return () => {
      globe.destroy()
    }
  }, [theme])

  const features = [
    {
      name: "Instant Deployment",
      description: "We provide seamless, one-click deployments for your apps.",
    },
    {
      name: "Auto Scaling",
      description: "We automatically scale your infrastructure based on demand.",
    },
    {
      name: "Zero Downtime",
      description: "We ensure smooth updates with zero downtime deployment.",
    },
  ];

  return (
      <section
        aria-labelledby="global-datacenter-title"
        className="relative mx-auto flex w-full flex-col items-center justify-center overflow-hidden pt-16 shadow-xl shadow-black/30 dark:shadow-gray-900/40 bg-background"
      >
        <div className="absolute top-[17rem] size-[40rem] rounded-full bg-gradient-to-b from-indigo-800 to-background blur-3xl md:top-[20rem]" />
        <ShinyText />
        <h2
          className="z-10 mt-6 inline-block bg-gradient-to-b from-gray-900 to-gray-700 dark:from-white dark:to-indigo-100 bg-clip-text px-2 text-center text-5xl font-bold tracking-tighter text-transparent md:text-8xl"
        >
          The Global <br /> Cloud Datacenter
        </h2>
        <canvas
          className="absolute top-[7.1rem] z-20 aspect-square size-full max-w-fit md:top-[12rem]"
          ref={canvasRef}
          style={{ width: 800, height: 800 }}
        />
        <div className="z-20 -mt-32 h-[36rem] w-full overflow-hidden md:-mt-36">
          <div className="absolute bottom-0 h-4/6 w-full bg-gradient-to-b from-transparent via-gray-100 to-background dark:via-black dark:to-background" />
          <div className="absolute inset-x-6 bottom-12 m-auto max-w-4xl md:top-2/3">
            <div className="grid grid-cols-1 gap-x-10 gap-y-6 rounded-lg border border-white/[3%] bg-white/[1%] px-6 py-6 shadow-xl backdrop-blur md:grid-cols-3 md:p-8">
              {features.map((item) => (
                <div key={item.name} className="flex flex-col gap-2">
                  <h3 className="whitespace-nowrap bg-gradient-to-b from-indigo-700 to-indigo-500 dark:from-indigo-300 dark:to-indigo-500 bg-clip-text text-lg font-semibold text-transparent md:text-xl">
                    {item.name}
                  </h3>
                  <p className="text-sm leading-6 text-gray-700 dark:text-indigo-200/40">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
  )
}
