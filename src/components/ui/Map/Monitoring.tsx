import { Icons } from "@/components/Icons2";
import {
  RiBaseStationFill,
  RiHome9Fill,
  RiPlaneLine,
  RiSignalTowerFill,
  RiTruckFill,
} from "@remixicon/react";
import { SVGMap } from "./SVGMap";

export const Monitoring = () => {
  return (
    <section
      id="farm-management"
      aria-labelledby="management-title"
      className="relative grid w-full scroll-my-24 grid-cols-1 items-center justify-between gap-10 overflow-hidden bg-gray-950 px-10 py-16 shadow-2xl shadow-black/50 sm:px-16 md:grid-cols-2 lg:mx-auto lg:py-24"
    >
      {/* Left Content: Text */}
      <div className="text-left">
        <div className="text-base font-semibold tracking-tight text-orange-400 sm:text-lg">
          Farm Management
        </div>
        <h2
          id="management-title"
          className="mt-6 max-w-[700px] text-2xl font-semibold tracking-tight text-white md:text-5xl"
        >
          Monitoring & Control for Precision Agriculture
        </h2>
        <p className="mt-4 max-w-2xl text-base text-gray-400 sm:mt-8 sm:text-xl">
          Complete oversight of your farming operations across fields,
          irrigation systems, and aerial monitoring, delivering insights even in
          remote rural locations.
        </p>
      </div>

      {/* Right Content: SVG Map */}
      <div className="relative mx-auto mt-10 md:mt-0">
        <SVGMap className="w-[50rem] shrink-0" />

        {/* Scanning (Plane) */}
        <div className="absolute -top-3 left-[130px]">
          <div className="relative flex items-center justify-center">
            <div className="absolute h-10 w-10 rounded-full bg-gray-950 ring-1 ring-white/15"></div>
            <div className="absolute -top-4 -right-[3.7rem] flex w-fit items-center justify-center rounded-full bg-gray-950 px-1.5 py-0.5 text-xs text-white ring-1 ring-white/15">
              Scanning
            </div>
            <RiPlaneLine className="relative h-5 w-5 rotate-90 text-white" />
            <div
              style={{
                animationDelay: "3.5s",
              }}
              className="absolute h-10 w-10 animate-[ping_5s_ease_infinite] rounded-full ring-1 ring-orange-500/50"
            ></div>
          </div>
        </div>

        {/* Irrigating (Quadcopter) */}
        <div className="absolute top-[73px] left-[243px]">
          <div className="relative flex items-center justify-center">
            <div className="absolute h-10 w-10 rounded-full bg-gray-950 ring-1 ring-white/15"></div>
            <div className="absolute -top-4 -right-[3.7rem] flex w-fit items-center justify-center rounded-full bg-gray-950 px-1.5 py-0.5 text-xs text-white ring-1 ring-white/15">
              Irrigating
            </div>
            <Icons.QuadCopter className="relative h-5 w-5 rotate-90 text-white" />
            <div
              style={{
                animationDelay: "3.5s",
              }}
              className="absolute h-10 w-10 animate-[ping_5s_ease_infinite] rounded-full ring-1 ring-orange-500/50"
            ></div>
          </div>
        </div>

        {/* Scanning (Base Station) */}
        <div className="absolute top-32 right-[300px]">
          <div className="relative flex items-center justify-center">
            <div className="absolute h-10 w-10 rounded-full bg-gray-950 ring-1 ring-white/15"></div>
            <div className="absolute -top-4 -right-[3.7rem] flex w-fit items-center justify-center rounded-full bg-gray-950 px-1.5 py-0.5 text-xs text-white ring-1 ring-white/15">
              Scanning
            </div>
            <RiBaseStationFill className="relative h-5 w-5 text-white" />
            <div
              style={{
                animationDelay: "3.5s",
              }}
              className="absolute h-10 w-10 animate-[ping_5s_ease_infinite] rounded-full ring-1 ring-orange-500/50"
            ></div>
          </div>
        </div>

        {/* Home */}
        <div className="absolute top-20 right-[390px]">
          <div className="relative flex items-center justify-center">
            <div className="absolute h-10 w-10 rounded-full bg-gray-950 ring-1 ring-white/15"></div>
            <RiHome9Fill className="relative h-5 w-5 text-white" />
          </div>
        </div>

        {/* Idle (Truck) */}
        <div className="absolute top-12 right-[430px]">
          <div className="relative flex items-center justify-center">
            <div className="absolute h-10 w-10 rounded-full bg-gray-950 ring-1 ring-white/15"></div>
            <div className="absolute -top-4 -right-7 flex w-fit items-center justify-center rounded-full bg-gray-950 px-1.5 py-0.5 text-xs text-white ring-1 ring-white/15">
              Idle
            </div>
            <RiTruckFill className="relative h-5 w-5 text-white" />
          </div>
        </div>

        {/* Signal Tower */}
        <div className="absolute top-9 right-56">
          <div className="relative flex items-center justify-center">
            <RiSignalTowerFill className="z-10 h-5 w-5 text-white" />
            <div className="absolute h-10 w-10 rounded-full bg-gray-950 ring-1 ring-white/15 backdrop-blur-sm"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
