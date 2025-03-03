"use client";

import React, { useEffect, useState } from "react";

const GreetingMessage = () => {
  const [greeting, setGreeting] = useState("Good ");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good Morning ☀️");
    } else if (hour < 18) {
      setGreeting("Good Afternoon 🌤");
    } else {
      setGreeting("Good Evening 🌙");
    }
  }, []);

  return <h2 className="text-xl font-semibold">{greeting}</h2>;
};

export default GreetingMessage;
