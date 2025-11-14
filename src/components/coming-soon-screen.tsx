import React from "react";
import { MainNavigation } from "./main-navigation";
import { type LucideIcon } from "lucide-react";

interface ComingSoonScreenProps {
  title: string;
  titleEn: string;
  description: string;
  icon: LucideIcon;
  features?: string[];
}

export function ComingSoonScreen({
  title,
  titleEn,
  description,
  icon: Icon,
  features,
}: ComingSoonScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#023047] to-[#001219] pr-20">
      <MainNavigation />

      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="max-w-2xl w-full">
          <div className="bg-gradient-to-b from-[#1a1c1e] via-[#1d2222] to-[#42474e] rounded-3xl p-12 border border-[#42474e] text-center">
            {/* Icon */}
            <div className="inline-flex p-6 rounded-full bg-gradient-to-b from-[#22d3ee] to-[#006399] mb-6">
              <Icon className="w-16 h-16 text-[#00373a]" />
            </div>

            {/* Title */}
            <h1
              className="text-3xl font-['Almarai'] font-bold text-[#e2e2e6] mb-2"
              dir="auto"
            >
              {title}
            </h1>
            <p className="text-lg text-[#c2c7ce] font-['Inter'] mb-6">
              {titleEn}
            </p>

            {/* Description */}
            <p
              className="text-base text-[#c2c7ce] font-['Almarai'] mb-8"
              dir="auto"
            >
              {description}
            </p>

            {/* Features List */}
            {features && features.length > 0 && (
              <div className="bg-[rgba(255,255,255,0.05)] rounded-2xl p-6 mb-8">
                <h3
                  className="text-lg font-['Almarai'] font-bold text-[#e2e2e6] mb-4"
                  dir="auto"
                >
                  المميزات القادمة
                </h3>
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 text-right"
                    >
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                      <p
                        className="text-sm font-['Almarai'] text-[#e2e2e6]"
                        dir="auto"
                      >
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[rgba(34,211,238,0.1)] to-[rgba(0,99,153,0.1)] border border-cyan-400/30 rounded-full px-6 py-3">
              <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
              <span
                className="text-sm font-['Almarai'] font-bold text-cyan-400"
                dir="auto"
              >
                قيد التطوير
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
