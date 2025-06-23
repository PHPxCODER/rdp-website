"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import * as THREE from "three";

// Utility: Convert HSL string (from CSS var) to RGB array
function hslStringToRgb(hslString: string): [number, number, number] {
  // hslString: "240 10% 3.9%"
  const [h, s, l] = hslString
    .split(" ")
    .map((v, i) => (i === 0 ? parseFloat(v) : parseFloat(v) / 100));
  const a = s * Math.min(l, 1 - l);
  function f(n: number) {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  }
  return [
    Math.round(255 * f(0)),
    Math.round(255 * f(8)),
    Math.round(255 * f(4)),
  ];
}

type Uniforms = {
  [key: string]: {
    value: number[] | number[][] | number;
    type: string;
  };
};

interface ShaderProps {
  source: string;
  uniforms: Uniforms;
}

interface SignInPageProps {
  className?: string;
}

export const CanvasRevealEffect = ({
  animationSpeed = 10,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  containerClassName,
  dotSize,
  showGradient = true,
  reverse = false,
}: {
  animationSpeed?: number;
  opacities?: number[];
  colors?: number[][];
  containerClassName?: string;
  dotSize?: number;
  showGradient?: boolean;
  reverse?: boolean;
}) => {
  return (
    <div className={cn("h-full relative w-full", containerClassName)}>
      <div className="h-full w-full">
        <DotMatrix
          colors={colors ?? [[0, 255, 255]]}
          dotSize={dotSize ?? 3}
          opacities={
            opacities ?? [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1]
          }
          shader={`
            ${reverse ? "u_reverse_active" : "false"}_;
            animation_speed_factor_${animationSpeed.toFixed(1)}_;
          `}
          center={["x", "y"]}
        />
      </div>
      {showGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      )}
    </div>
  );
};

interface DotMatrixProps {
  colors?: number[][];
  opacities?: number[];
  totalSize?: number;
  dotSize?: number;
  shader?: string;
  center?: ("x" | "y")[];
}

const DotMatrix: React.FC<DotMatrixProps> = ({
  colors = [[0, 0, 0]],
  opacities = [0.04, 0.04, 0.04, 0.04, 0.04, 0.08, 0.08, 0.08, 0.08, 0.14],
  totalSize = 20,
  dotSize = 2,
  shader = "",
  center = ["x", "y"],
}) => {
  const uniforms = React.useMemo(() => {
    let colorsArray = [
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0],
    ];
    if (colors.length === 2) {
      colorsArray = [
        colors[0],
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[1],
      ];
    } else if (colors.length === 3) {
      colorsArray = [
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[2],
        colors[2],
      ];
    }
    return {
      u_colors: {
        value: colorsArray.map((color) => [
          color[0] / 255,
          color[1] / 255,
          color[2] / 255,
        ]),
        type: "uniform3fv",
      },
      u_opacities: {
        value: opacities,
        type: "uniform1fv",
      },
      u_total_size: {
        value: totalSize,
        type: "uniform1f",
      },
      u_dot_size: {
        value: dotSize,
        type: "uniform1f",
      },
      u_reverse: {
        value: shader.includes("u_reverse_active") ? 1 : 0,
        type: "uniform1i",
      },
    };
  }, [colors, opacities, totalSize, dotSize, shader]);

  return (
    <Shader
      source={`
        precision mediump float;
        in vec2 fragCoord;

        uniform float u_time;
        uniform float u_opacities[10];
        uniform vec3 u_colors[6];
        uniform float u_total_size;
        uniform float u_dot_size;
        uniform vec2 u_resolution;
        uniform int u_reverse;

        out vec4 fragColor;

        float PHI = 1.61803398874989484820459;
        float random(vec2 xy) {
            return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x);
        }
        float map(float value, float min1, float max1, float min2, float max2) {
            return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
        }

        void main() {
            vec2 st = fragCoord.xy;
            ${
              center.includes("x")
                ? "st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));"
                : ""
            }
            ${
              center.includes("y")
                ? "st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));"
                : ""
            }

            float opacity = step(0.0, st.x);
            opacity *= step(0.0, st.y);

            vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));

            float frequency = 5.0;
            float show_offset = random(st2);
            float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency));
            opacity *= u_opacities[int(rand * 10.0)];
            opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
            opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));

            vec3 color = u_colors[int(show_offset * 6.0)];

            float animation_speed_factor = 0.5;
            vec2 center_grid = u_resolution / 2.0 / u_total_size;
            float dist_from_center = distance(center_grid, st2);

            float timing_offset_intro = dist_from_center * 0.01 + (random(st2) * 0.15);
            float max_grid_dist = distance(center_grid, vec2(0.0, 0.0));
            float timing_offset_outro = (max_grid_dist - dist_from_center) * 0.02 + (random(st2 + 42.0) * 0.2);

            float current_timing_offset;
            if (u_reverse == 1) {
                current_timing_offset = timing_offset_outro;
                opacity *= 1.0 - step(current_timing_offset, u_time * animation_speed_factor);
                opacity *= clamp((step(current_timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
            } else {
                current_timing_offset = timing_offset_intro;
                opacity *= step(current_timing_offset, u_time * animation_speed_factor);
                opacity *= clamp((1.0 - step(current_timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
            }

            fragColor = vec4(color, opacity);
            fragColor.rgb *= fragColor.a;
        }`}
      uniforms={uniforms}
    />
  );
};

type PreparedUniform =
  | { value: number; type: "1f" | "1i" }
  | { value: THREE.Vector3; type: "3f" }
  | { value: number[]; type: "1fv" }
  | { value: THREE.Vector3[]; type: "3fv" }
  | { value: THREE.Vector2; type: "2f" };

type PreparedUniforms = Record<
  string,
  PreparedUniform | { value: number; type: "1f" } | { value: THREE.Vector2 }
>;

const ShaderMaterial = ({
  source,
  uniforms,
}: {
  source: string;
  hovered?: boolean;
  uniforms: Uniforms;
}) => {
  const { size } = useThree();
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const timestamp = clock.getElapsedTime();

    const material = ref.current.material as THREE.ShaderMaterial;
    const timeLocation = material.uniforms.u_time;
    timeLocation.value = timestamp;
  });

  // Inline getUniforms logic here to avoid React Hook dependency warning
  const material = useMemo(() => {
    const preparedUniforms: PreparedUniforms = {};

    for (const uniformName in uniforms) {
      const uniform = uniforms[uniformName];

      switch (uniform.type) {
        case "uniform1f":
          preparedUniforms[uniformName] = {
            value: uniform.value as number,
            type: "1f",
          };
          break;
        case "uniform1i":
          preparedUniforms[uniformName] = {
            value: uniform.value as number,
            type: "1i",
          };
          break;
        case "uniform3f":
          preparedUniforms[uniformName] = {
            value: new THREE.Vector3().fromArray(uniform.value as number[]),
            type: "3f",
          };
          break;
        case "uniform1fv":
          preparedUniforms[uniformName] = {
            value: uniform.value as number[],
            type: "1fv",
          };
          break;
        case "uniform3fv":
          preparedUniforms[uniformName] = {
            value: (uniform.value as number[][]).map((v) =>
              new THREE.Vector3().fromArray(v)
            ),
            type: "3fv",
          };
          break;
        case "uniform2f":
          preparedUniforms[uniformName] = {
            value: new THREE.Vector2().fromArray(uniform.value as number[]),
            type: "2f",
          };
          break;
        default:
          console.error(`Invalid uniform type for '${uniformName}'.`);
          break;
      }
    }

    preparedUniforms["u_time"] = { value: 0, type: "1f" };
    preparedUniforms["u_resolution"] = {
      value: new THREE.Vector2(size.width * 2, size.height * 2),
    };

    const materialObject = new THREE.ShaderMaterial({
      vertexShader: `
      precision mediump float;
      in vec2 coordinates;
      uniform vec2 u_resolution;
      out vec2 fragCoord;
      void main(){
        float x = position.x;
        float y = position.y;
        gl_Position = vec4(x, y, 0.0, 1.0);
        fragCoord = (position.xy + vec2(1.0)) * 0.5 * u_resolution;
        fragCoord.y = u_resolution.y - fragCoord.y;
      }
      `,
      fragmentShader: source,
      uniforms: preparedUniforms,
      glslVersion: THREE.GLSL3,
      blending: THREE.CustomBlending,
      blendSrc: THREE.SrcAlphaFactor,
      blendDst: THREE.OneFactor,
    });

    return materialObject;
  }, [size.width, size.height, source, uniforms]);

  return (
    <mesh ref={ref}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

const Shader: React.FC<ShaderProps> = ({ source, uniforms }) => {
  return (
    <Canvas className="absolute inset-0 h-full w-full">
      <ShaderMaterial source={source} uniforms={uniforms} />
    </Canvas>
  );
};

export const AuthFlow = ({ className }: SignInPageProps) => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "code" | "success">("email");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [initialCanvasVisible, setInitialCanvasVisible] = useState(true);
  const [reverseCanvasVisible, setReverseCanvasVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // --- THEME-AWARE DOT COLOR ---
  const [dotColor, setDotColor] = useState<[number, number, number]>([0, 0, 0]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hsl = getComputedStyle(document.documentElement)
        .getPropertyValue("--foreground")
        .trim();
      if (hsl) {
        setDotColor(hslStringToRgb(hsl));
      }
    }
  }, []);
  // -----------------------------

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email before proceeding.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if user exists
      const checkUserResponse = await fetch("/api/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (checkUserResponse.status === 429) {
        toast({
          title: "Slow Down",
          description: "You're making too many requests. Please wait a minute.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const data = await checkUserResponse.json();
      if (!data.exists) {
        toast({
          title: "User Not Registered",
          description:
            "The email you entered is not registered. Please sign up first.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Send OTP via NextAuth
      const response = await signIn("email", {
        email,
        redirect: false,
        callbackUrl: "/dash",
      });

      if (response?.error) {
        toast({
          title: "Error",
          description: `Failed to send OTP: ${response.error}`,
          variant: "destructive",
        });
      } else {
        setStep("code");
        toast({
          title: "OTP Sent",
          description:
            "An OTP has been sent to your email. Please check your inbox.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error during email submission:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Focus first input when code screen appears
  useEffect(() => {
    if (step === "code") {
      setTimeout(() => {
        codeInputRefs.current[0]?.focus();
      }, 500);
    }
  }, [step]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Focus next input if value is entered
      if (value && index < 5) {
        codeInputRefs.current[index + 1]?.focus();
      }

      // Check if code is complete
      if (index === 5 && value) {
        const isComplete = newCode.every((digit) => digit.length === 1);
        if (isComplete) {
          // Trigger reverse animation
          setReverseCanvasVisible(true);

          setTimeout(() => {
            setInitialCanvasVisible(false);
          }, 50);

          // Verify OTP
          handleOtpSubmit(newCode.join(""));
        }
      }
    }
  };

  const handleOtpSubmit = async (otpCode: string) => {
    setIsSubmitting(true);
    const formattedEmail = encodeURIComponent(email.toLowerCase().trim());
    const formattedCode = encodeURIComponent(otpCode);
    const formattedCallback = encodeURIComponent("/dash");
    const otpRequestURL = `/api/auth/callback/email?email=${formattedEmail}&token=${formattedCode}&callbackUrl=${formattedCallback}`;

    const response = await fetch(otpRequestURL, { cache: "no-store" });

    if (response.ok) {
      setTimeout(() => {
        setStep("success");
        toast({
          title: "Login Successful",
          description: "You have successfully logged in.",
          variant: "default",
        });
        setTimeout(() => {
          router.push("/dash");
        }, 2000);
      }, 2000);
    } else {
      toast({
        title: "Error",
        description: "Invalid OTP. Please try again.",
        variant: "destructive",
      });
      // Reset animations on error
      setReverseCanvasVisible(false);
      setInitialCanvasVisible(true);
      setCode(["", "", "", "", "", ""]);
    }

    setIsSubmitting(false);
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handleBackClick = () => {
    setStep("email");
    setCode(["", "", "", "", "", ""]);
    setReverseCanvasVisible(false);
    setInitialCanvasVisible(true);
  };

  return (
    <div
      className={cn(
        "flex w-[100%] flex-col min-h-screen bg-background relative",
        className
      )}
    >
      <div className="absolute inset-0 z-0">
        {/* Initial canvas (forward animation) */}
        {initialCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={3}
              containerClassName="bg-background"
              colors={[dotColor, dotColor]}
              dotSize={6}
              reverse={false}
            />
          </div>
        )}

        {/* Reverse canvas (appears when code is complete) */}
        {reverseCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={4}
              containerClassName="bg-background"
              colors={[dotColor, dotColor]}
              dotSize={6}
              reverse={true}
            />
          </div>
        )}

        {/* Radial gradient using theme background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_hsl(var(--background))_0%,_transparent_100%)]" />
        {/* Top gradient using theme background */}
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-background to-transparent" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Main content container */}
        <div className="flex flex-1 flex-col lg:flex-row">
          {/* Left side (form) */}
          <div className="flex-1 flex flex-col justify-center items-center min-h-screen px-4">
            <div className="w-full max-w-sm">
              <AnimatePresence mode="wait">
                {step === "email" ? (
                  <motion.div
                    key="email-step"
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="space-y-6 text-center"
                  >
                    <div className="space-y-1">
                      <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-foreground">
                        Welcome Back
                      </h1>
                      <p className="text-[1.8rem] text-muted-foreground font-light">
                        Sign in to continue
                      </p>
                    </div>

                    <div className="space-y-4">
                      <button
                        onClick={() => signIn("google", { callbackUrl: "/dash" })}
                        className="backdrop-blur-[2px] w-full flex items-center justify-center gap-2 bg-foreground/5 hover:bg-foreground/10 text-foreground border border-border rounded-full py-3 px-4 transition-colors"
                      >
                        <span className="text-lg">G</span>
                        <span>Sign in with Google</span>
                      </button>

                      <div className="flex items-center gap-4">
                        <div className="h-px bg-border flex-1" />
                        <span className="text-muted-foreground text-sm">or</span>
                        <div className="h-px bg-border flex-1" />
                      </div>

                      <form onSubmit={handleEmailSubmit}>
                        <div className="relative">
                          <input
                            type="email"
                            placeholder="info@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full backdrop-blur-[1px] text-foreground border border-border rounded-full py-3 px-4 focus:outline-none focus:border focus:border-foreground/30 text-center bg-transparent"
                            required
                          />
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="absolute right-1.5 top-1.5 text-foreground w-9 h-9 flex items-center justify-center rounded-full bg-foreground/10 hover:bg-foreground/20 transition-colors group overflow-hidden disabled:opacity-50"
                          >
                            <span className="relative w-full h-full block overflow-hidden">
                              <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-full">
                                →
                              </span>
                              <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 -translate-x-full group-hover:translate-x-0">
                                →
                              </span>
                            </span>
                          </button>
                        </div>
                      </form>
                    </div>

                    <p className="text-xs text-muted-foreground pt-10">
                      By signing up, you agree to the{" "}
                      <Link
                        href="/T%26Cs"
                        className="underline text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Terms
                      </Link>
                      ,{" "}
                      <Link
                        href="/Privacy"
                        className="underline text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </p>
                  </motion.div>
                ) : step === "code" ? (
                  <motion.div
                    key="code-step"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="space-y-6 text-center"
                  >
                    <div className="space-y-1">
                      <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-foreground">
                        We sent you a code
                      </h1>
                      <p className="text-[1.25rem] text-muted-foreground font-light">
                        Please enter it
                      </p>
                    </div>

                    <div className="w-full">
                      <div className="relative rounded-full py-4 px-5 border border-border bg-transparent">
                        <div className="flex items-center justify-center">
                          {code.map((digit, i) => (
                            <div key={i} className="flex items-center">
                              <div className="relative">
                                <input
                                  ref={(el) => {
                                    codeInputRefs.current[i] = el;
                                  }}
                                  type="text"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  maxLength={1}
                                  value={digit}
                                  onChange={(e) =>
                                    handleCodeChange(i, e.target.value)
                                  }
                                  onKeyDown={(e) => handleKeyDown(i, e)}
                                  className="w-8 text-center text-xl bg-transparent text-foreground border-none focus:outline-none focus:ring-0 appearance-none"
                                  style={{ caretColor: "transparent" }}
                                />
                                {!digit && (
                                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                                    <span className="text-xl text-muted-foreground">
                                      0
                                    </span>
                                  </div>
                                )}
                              </div>
                              {i < 5 && (
                                <span className="text-muted-foreground text-xl">|</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <motion.p
                        className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-sm"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        Resend code
                      </motion.p>
                    </div>

                    <div className="flex w-full gap-3">
                      <motion.button
                        onClick={handleBackClick}
                        className="rounded-full bg-foreground text-background font-medium px-8 py-3 hover:bg-foreground/90 transition-colors w-[30%]"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                      >
                        Back
                      </motion.button>
                      <motion.button
                        className={`flex-1 rounded-full font-medium py-3 border transition-all duration-300 ${
                          code.every((d) => d !== "")
                            ? "bg-foreground text-background border-transparent hover:bg-foreground/90 cursor-pointer"
                            : "bg-background text-muted-foreground border-border cursor-not-allowed"
                        }`}
                        disabled={!code.every((d) => d !== "") || isSubmitting}
                      >
                        {isSubmitting ? "Verifying..." : "Continue"}
                      </motion.button>
                    </div>

                    <div className="pt-16">
                      <p className="text-xs text-muted-foreground">
                        By signing up, you agree to the{" "}
                        <Link
                          href="/T%26Cs"
                          className="underline text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Terms
                        </Link>
                        ,{" "}
                        <Link
                          href="/Privacy"
                          className="underline text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Privacy Policy
                        </Link>
                        .
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success-step"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      ease: "easeOut",
                      delay: 0.3,
                    }}
                    className="space-y-6 text-center"
                  >
                    <div className="space-y-1">
                      <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-foreground">
                        You&apos;re in!
                      </h1>
                      <p className="text-[1.25rem] text-muted-foreground font-light">
                        Welcome back
                      </p>
                    </div>

                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="py-10"
                    >
                      <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-foreground to-foreground/70 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-background"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </motion.div>

                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="w-full rounded-full bg-foreground text-background font-medium py-3 hover:bg-foreground/90 transition-colors"
                      onClick={() => router.push("/dash")}
                    >
                      Continue to Dashboard
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};