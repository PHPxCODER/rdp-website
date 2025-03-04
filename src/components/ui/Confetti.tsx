"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

export function ConfettiFireworks() {
  useEffect(() => {
    const hasSeenConfetti = localStorage.getItem("hasSeenConfetti");

    if (!hasSeenConfetti) {
      const effects = [
        fireworksEffect,
        sideCannonsEffect,
        rainfallEffect,
        explosionEffect,
        spiralEffect,
      ];
      const randomEffect = effects[Math.floor(Math.random() * effects.length)];

      randomEffect(); // Execute the chosen confetti effect
      localStorage.setItem("hasSeenConfetti", "true"); // Prevent re-trigger on refresh
    }
  }, []);

  // 🎆 Fireworks Confetti Effect
  const fireworksEffect = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  // 🎉 Side Cannons Confetti Effect
  const sideCannonsEffect = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 50, spread: 70, ticks: 60, zIndex: 0 };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 40 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: 0, y: 0.8 }, // Left side
        angle: 60,
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: 1, y: 0.8 }, // Right side
        angle: 120,
      });
    }, 300);
  };

  // 🎊 Rainfall Confetti Effect
  const rainfallEffect = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      confetti({
        particleCount: 5,
        startVelocity: 0,
        spread: 180,
        gravity: 0.5,
        origin: { x: Math.random(), y: 0 },
      });
    }, 100);
  };

  // 🚀 Explosion Confetti Effect
  const explosionEffect = () => {
    confetti({
      particleCount: 200,
      spread: 100,
      startVelocity: 60,
      ticks: 60,
      origin: { x: 0.5, y: 0.5 }, // Center of screen
    });
  };

  // 🌀 Spiral Confetti Effect
  const spiralEffect = () => {
    let angle = 0;
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      confetti({
        particleCount: 10,
        startVelocity: 30,
        spread: 10,
        angle: angle,
        origin: { x: 0.5, y: 0.5 }, // Center of screen
      });

      angle += 20; // Slowly rotates the confetti bursts
    }, 100);
  };

  return null; 
}
