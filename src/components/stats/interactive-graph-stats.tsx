"use client";

import NumberFlow from "@number-flow/react";
import { motion, useInView } from "motion/react";
import { ArrowLeftRight, Info } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

const InteractiveGraphStats = () => {
  const [showUsageStats, setShowUsageStats] = useState(false);
  const [stats, setStats] = useState({
    performance: {
      RSquare: 0,
      RMSE: 0,
      Coverage: 0,
      ProcessingTime: 0,
    },
    usage: {
      DatasetsProcessed: 0,
      DataDownscaled: 0,
      Institutions: 0,
      Studies: 0,
    },
  });

  const ref = useRef(null);
  const isInView = useInView(ref);

  const finalStats = useMemo(
    () => ({
      performance: {
        RSquare: 87,
        RMSE: 2.3,
        Coverage: 95,
        ProcessingTime: 3,
      },
      usage: {
        DatasetsProcessed: 10000,
        DataDownscaled: 50,
        Institutions: 25,
        Studies: 15,
      },
    }),
    []
  );

  useEffect(() => {
    if (isInView) {
      setStats(finalStats);
    }
  }, [isInView, finalStats]);

  return (
    <section className="py-32 bg-background">
      <div className="container flex justify-center">
        <div className="flex w-full flex-col justify-between gap-4 lg:flex-row">
          <div className="w-full lg:w-1/3">
            <h1 className="w-full font-display text-6xl font-medium text-foreground">
              Proven Performance Across Global Datasets
            </h1>
            <div className="mt-10 lg:w-[115%]">
              <Graph />
            </div>
          </div>
          <div ref={ref} className="flex w-full flex-col items-end lg:w-1/2">
            <h1 className="font-display text-8xl leading-0 lg:text-[10rem] text-primary">
              <NumberFlow
                value={
                  showUsageStats
                    ? stats.usage.DatasetsProcessed
                    : stats.performance.RSquare
                }
                suffix={showUsageStats ? "+" : "%"}
                className="font-display"
              />
            </h1>
            <div className="mb-6 flex flex-col items-center justify-center gap-6 lg:flex-row lg:gap-17">
              <p className="text-muted-foreground">Advanced ML models delivering precise environmental data analysis</p>
              <Button
                variant="secondary"
                className="group text-md flex w-fit items-center justify-center gap-2 rounded-full px-6 py-1 tracking-tight shadow-none transition-all duration-300 ease-out active:scale-95"
                onClick={() => setShowUsageStats(!showUsageStats)}
              >
                <span>{showUsageStats ? "Model Performance" : "Usage Statistics"}</span>
                <ArrowLeftRight className="size-4 -rotate-45 transition-all ease-out group-hover:ml-3 group-hover:rotate-0" />
              </Button>
            </div>
            <div className="mt-auto mb-10 grid w-full grid-cols-2 gap-14">
              <div className="text-left group relative">
                <h2 className="text-4xl font-medium lg:text-6xl text-foreground">
                  <NumberFlow
                    value={
                      showUsageStats
                        ? stats.usage.DataDownscaled
                        : stats.performance.RMSE
                    }
                    suffix={showUsageStats ? "TB+" : " μg/m³"}
                    prefix={showUsageStats ? "" : ""}
                  />
                </h2>
                <div className="flex items-center gap-1">
                  <p className="text-muted-foreground">{showUsageStats ? "Data downscaled" : "Root mean square error"}</p>
                  <Info className="size-3 text-muted-foreground/50" />
                </div>
              </div>
              <div className="text-right group relative">
                <h2 className="text-4xl font-medium lg:text-6xl text-foreground">
                  <NumberFlow
                    value={
                      showUsageStats
                        ? stats.usage.Institutions
                        : stats.performance.Coverage
                    }
                    suffix={showUsageStats ? "+" : "%"}
                  />
                </h2>
                <div className="flex items-center justify-end gap-1">
                  <p className="text-muted-foreground">{showUsageStats ? "Research institutions" : "Global data coverage"}</p>
                  <Info className="size-3 text-muted-foreground/50" />
                </div>
              </div>
              <div className="text-left group relative">
                <h2 className="text-4xl font-medium lg:text-6xl text-foreground">
                  <NumberFlow
                    value={
                      showUsageStats
                        ? stats.usage.Studies
                        : stats.performance.ProcessingTime
                    }
                    suffix={showUsageStats ? "+" : "min"}
                  />
                </h2>
                <div className="flex items-center gap-1">
                  <p className="text-muted-foreground">{showUsageStats ? "Published studies" : "Average processing time"}</p>
                  <Info className="size-3 text-muted-foreground/50" />
                </div>
              </div>
              <div className="text-right group relative">
                <h2 className="text-4xl font-medium lg:text-6xl text-foreground">
                  <span className="text-2xl lg:text-4xl">R²</span>
                  {showUsageStats ? (
                    <NumberFlow
                      value={stats.usage.DatasetsProcessed / 1000}
                      suffix="K+"
                    />
                  ) : (
                    <NumberFlow
                      value={stats.performance.RSquare}
                      prefix="0."
                    />
                  )}
                </h2>
                <div className="flex items-center justify-end gap-1">
                  <p className="text-muted-foreground">{showUsageStats ? "Datasets processed" : "Model accuracy correlation"}</p>
                  <Info className="size-3 text-muted-foreground/50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { InteractiveGraphStats };

function Graph() {
  return (
    <div className="wrapper">
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 644 388"
        initial={{
          clipPath: "inset(0px 100% 0px 0px)",
        }}
        animate={{
          clipPath: "inset(0px 0% 0px 0px)",
        }}
        transition={{
          duration: 1,
          type: "spring",
          damping: 18,
        }}
      >
        <g clipPath="url(#grad)">
          <path
            d="M1 350C1 350 83.308 320 114.735 280C146.162 240 189.504 200 235.952 160C273.548 120 294.469 100 329.733 80C409.879 50 452.946 40 483.874 30C514.802 25 635.97 15 644 10"
            stroke="#16a34a"
            strokeWidth="2"
          />
          <path
            d="M113.912 280C82.437 320 1 350 1 350V388H644V10C635.957 15 514.601 25 483.625 30C452.649 40 409.515 50 329.245 80C293.926 100 272.973 120 235.318 160C188.798 200 145.388 240 113.912 280Z"
            fill="url(#grad)"
          />
        </g>
        <defs>
          <linearGradient
            id="grad"
            x1="321.5"
            y1="0.476773"
            x2="321.5"
            y2="387.477"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#16a34a" stopOpacity="0.4" />
            <stop offset="1" stopColor="#16a34a" stopOpacity="0" />
          </linearGradient>
        </defs>
      </motion.svg>
    </div>
  );
}