'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import { ChevronLeft, ChevronRight, MessageCircle, Signal, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/components/language-provider';
import { motion } from 'framer-motion';
import shiekhImage from '@/assets/images/landingpage/shiekh hero.png';
import zaydMascot from '@/assets/images/landingpage/zaydMascot.svg';
import Leaderboard from '@/assets/images/landingpage/Leaderboard.svg';
import chat from '@/assets/svgs/chat.svg';
import lightning from '@/assets/svgs/lightning.svg';
import communication from '@/assets/svgs/communication.svg';
import slabWithStar from '@/assets/svgs/slab with star.svg';

export default function LandingCarousel() {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    const [isMobile, setIsMobile] = useState(() =>
        typeof window !== 'undefined' ? window.matchMedia('(max-width: 881px)').matches : false
    );
    const { language } = useLanguage();
    const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [slideHeights, setSlideHeights] = useState<number[]>([0, 0, 0]);

    useEffect(() => {
        const mql = window.matchMedia('(max-width: 881px)');
        setIsMobile(mql.matches);
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mql.addEventListener('change', handler);
        return () => mql.removeEventListener('change', handler);
    }, []);

    useEffect(() => {
        if (!api) return;

        const onSelect = () => {
            setCurrent(api.selectedScrollSnap());
            setCanScrollPrev(api.canScrollPrev());
            setCanScrollNext(api.canScrollNext());
        };

        onSelect();
        api.on('select', onSelect);
        api.on('reInit', onSelect);
    }, [api]);

    // Measure slide heights
    useEffect(() => {
        const measureHeights = () => {
            const heights = slideRefs.current.map(ref => ref?.offsetHeight || 0);
            setSlideHeights(heights);
        };

        // Measure after a short delay to ensure content is rendered
        const timer = setTimeout(measureHeights, 100);
        
        // Re-measure on window resize
        window.addEventListener('resize', measureHeights);
        
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', measureHeights);
        };
    }, [isMobile]);

    const slides = [
        <HeroSlide key="hero" onStart={() => window.location.href = "https://nihao.waaha.ai/"} language={language} />,
        <FeaturesSlide key="features" language={language} />,
        <GamificationSlide key="gamification" language={language} />,
    ];

    return (
        <motion.div
            className="relative top-20 w-full max-w-7xl mx-auto px-4 py-8 md:py-12 mb-20"
            dir="ltr"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            {/* Navigation Arrows (Top Right for LTR, Top Left for RTL) */}
            <motion.div
                className={cn(
                    "absolute top-0 flex gap-2 sm:gap-3 z-10 right-4 sm:right-8"
                )}
                dir="ltr"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            >
                <button
                    onClick={() => api?.scrollPrev()}
                    className={cn(
                        "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors",
                        canScrollPrev
                            ? "bg-white border-2 border-[#E5E5E5] shadow-sm hover:bg-gray-50"
                            : "bg-[#E5E5E5] opacity-50 cursor-not-allowed"
                    )}
                    disabled={!canScrollPrev}
                    aria-label="Previous slide"
                >
                    <ChevronLeft className={cn("w-5 h-5 sm:w-6 sm:h-6", canScrollPrev ? "text-[#35AB4E]" : "text-[#A0A0A0]")} />
                </button>
                <button
                    onClick={() => api?.scrollNext()}
                    className={cn(
                        "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors",
                        canScrollNext
                            ? "bg-white border-2 border-[#E5E5E5] shadow-sm hover:bg-gray-50"
                            : "bg-[#E5E5E5] opacity-50 cursor-not-allowed"
                    )}
                    disabled={!canScrollNext}
                    aria-label="Next slide"
                >
                    <ChevronRight className={cn("w-5 h-5 sm:w-6 sm:h-6", canScrollNext ? "text-[#35AB4E]" : "text-[#A0A0A0]")} />
                </button>
            </motion.div>

            <div className="relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                >
                    <Carousel
                        setApi={setApi}
                        className="w-full"
                        dir="ltr"
                        opts={{ direction: "ltr" }}
                    >
                        <CarouselContent className={cn(isMobile && "items-start")}>
                            {slides.map((slide, index) => (
                                <CarouselItem key={index}>
                                    <div ref={el => slideRefs.current[index] = el}>
                                        {slide}
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </motion.div>

                {/* Dots (Dynamically positioned underneath carousel content based on current slide height) */}
                <motion.div
                    className="absolute left-0 right-0 flex justify-center items-center gap-2 transition-all duration-300"
                    style={{ 
                        top: slideHeights[current] ? `${slideHeights[current] + 24}px` : 'auto'
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                >
                    {[0, 1, 2].map((index) => (
                        <button
                            key={index}
                            onClick={() => api?.scrollTo(index)}
                            className={cn(
                                "transition-all duration-300",
                                current === index
                                    ? "w-6 h-1.5 sm:w-8 sm:h-2 bg-[#35AB4E] rounded-full"
                                    : "w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#D9D9D9] rounded-full hover:bg-gray-400"
                            )}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </motion.div>
            </div>
        </motion.div>
    );
}

function HeroSlide({ onStart, language }: { onStart: () => void; language: "ar" | "en" }) {
    const direction = language === "ar" ? "rtl" : "ltr";
    const isArabic = language === "ar";

    return (
        <div className={cn("flex flex-col min-[620px]:flex-row items-center justify-between gap-8 min-[620px]:gap-12 py-6 sm:py-10")} dir={direction}>
            {/* Text Content */}
            <div className={cn(
                "w-full min-[620px]:w-1/2 flex flex-col px-2 sm:px-0",
                isArabic ? "items-start text-right" : "items-start text-left",
                "order-1"
            )}>
                {!isArabic && (
                    <motion.div
                        className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-1.5 sm:py-2 rounded-full border border-[#F0F0F0] shadow-[0_2px_10px_rgba(0,0,0,0.03)] mb-4 sm:mb-6 lg:mb-8 bg-white"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 bg-[#FFFBEB] rounded-lg flex items-center justify-center border border-[#FEF3C7]">
                            <img src={zaydMascot} alt="Zayd mascot" className="object-contain w-3 sm:w-4 lg:w-5" />
                        </div>
                        <span className="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-bold text-gray-700 leading-none">Powered by</span>
                        <span className="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-black text-[#F6AD55] leading-none">Zayd AI</span>
                    </motion.div>
                )}

                {isArabic && (
                    <motion.div
                        className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-1.5 sm:py-2 rounded-full border border-[#F0F0F0] shadow-[0_2px_10px_rgba(0,0,0,0.03)] mb-4 sm:mb-6 lg:mb-8 bg-white"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 bg-[#FFFBEB] rounded-lg flex items-center justify-center border border-[#FEF3C7]">
                            <img src={zaydMascot} alt="Zayd mascot" className="object-contain w-3 sm:w-4 lg:w-5" />
                        </div>
                        <span className="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-bold text-gray-700 leading-none font-almarai">مدعوم بواسطة</span>
                        <span className="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-black text-[#F6AD55] leading-none font-almarai">Zayd AI</span>
                    </motion.div>
                )}

                <motion.h1
                    className="text-[20px] sm:text-[28px] md:text-[40px] lg:text-[56px] xl:text-[64px] font-[800] text-gray-900 leading-[1.3] sm:leading-[1.2] md:leading-[1.1] mb-3 sm:mb-4 md:mb-6"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                >
                    {isArabic ? (
                        <>
                            <span className="block font-almarai">ممتعة مع تعلّم اللغة الصينية بطريقة</span>
                            <span className="text-[#35AB4E] block font-almarai">Zayd AI</span>
                        </>
                    ) : (
                        <>
                            <span className="block">Learn Chinese Language the Fun Way with</span>
                            <span className="text-[#35AB4E] block">Zayd AI</span>
                        </>
                    )}
                </motion.h1>

                <motion.p
                    className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] text-gray-600 mb-6 sm:mb-8 md:mb-10 max-w-lg leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                >
                    <span className={isArabic ? "font-almarai" : ""}>
                        {isArabic
                            ? "ابدأ التحدث باللغة الصينية من اليوم الأول مع رفيقك الشخصي لتعلم اللغة بالذكاء الاصطناعي"
                            : "Start speaking Chinese from day one with your personal AI language learning companion"
                        }
                    </span>
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button
                        onClick={onStart}
                        className="w-full sm:w-auto h-[44px] sm:h-[52px] md:h-[64px] px-4 sm:px-8 md:px-12 text-[13px] sm:text-[15px] md:text-[18px] lg:text-[22px] font-extrabold rounded-[12px] sm:rounded-[16px] bg-[#35AB4E] hover:bg-[#2E9643] text-white shadow-[0_4px_0_#20672F] active:shadow-none active:translate-y-1 transition-all"
                    >
                        <span className={isArabic ? "font-almarai" : ""}>
                            {isArabic ? "ابدأ التعلّم مجانًا" : "Start Learning for Free"}
                        </span>
                    </Button>
                </motion.div>
            </div>

            {/* Character Image */}
            <motion.div
                className="hidden min-[620px]:flex w-full min-[620px]:w-1/2 justify-center relative order-2 mt-4 min-[620px]:mt-0"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            >
                <div className="relative w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] md:w-[320px] md:h-[320px] lg:w-[400px] lg:h-[400px] xl:w-[500px] xl:h-[500px]">
                    <img
                        src={shiekhImage}
                        alt="Shiekh character"
                        className="object-contain p-2 relative z-10 w-full h-full"
                    />
                </div>
            </motion.div>
        </div>
    );
}

function FeaturesSlide({ language }: { language: "ar" | "en" }) {
    const direction = language === "ar" ? "rtl" : "ltr";
    const isArabic = language === "ar";

    const cards = isArabic ? [
        {
            title: "محادثات من الحياة الواقعية",
            description: "تدرب على محادثات الحياة اليومية مثل التحيات، والطعام، والسفر، والمدرسة",
            icon: <MessageCircle className="w-6 h-6 sm:w-8 h-8 md:w-9 h-9 text-[#35AB4E]" />,
            iconColor: "bg-[#F0FDF4]",
            borderColor: "border-[#F0FDF4]",
        },
        {
            title: "ملاحظات على النطق",
            description: "يستمع الذكاء الاصطناعي ويساعدك على التحدث بشكل أكثر طبيعية - خطوة بخطوة",
            icon: <Signal className="w-6 h-6 sm:w-8 h-8 md:w-9 h-9 text-[#F6AD55]" />,
            iconColor: "bg-[#FFFBEB]",
            borderColor: "border-[#FFFBEB]",
        },
        {
            title: "تصحيحات فورية",
            description: "احصل على ملاحظات وتصحيحات فورية في الوقت الحقيقي لتحسين مستواك بشكل أسرع",
            icon: <Zap className="w-6 h-6 sm:w-8 h-8 md:w-9 h-9 text-[#F687B3]" />,
            iconColor: "bg-[#FDF2F8]",
            borderColor: "border-[#FDF2F8]",
        },
    ] : [
        {
            title: "Real-life Conversations",
            description: "Practice everyday conversations like greetings, food, travel, and school",
            icon: <img src={chat} className="w-6 h-6 sm:w-8 h-8 md:w-9 h-9 text-[#35AB4E]" />,
            iconColor: "bg-[#F0FDF4]",
            borderColor: "border-[#F0FDF4]",
        },
        {
            title: "Pronunciation Feedback",
            description: "AI listens and helps you speak more naturally - step by step",
            icon: <img src={communication} className="w-6 h-6 sm:w-8 h-8 md:w-9 h-9 text-[#F6AD55]" />,
            iconColor: "bg-[#FFFBEB]",
            borderColor: "border-[#FFFBEB]",
        },
        {
            title: "Instant Corrections",
            description: "Get real-time feedback and corrections to improve your level faster",
            icon: <img src={lightning} className="w-6 h-6 sm:w-8 h-8 md:w-9 h-9 text-[#F687B3]" />,
            iconColor: "bg-[#FDF2F8]",
            borderColor: "border-[#FDF2F8]",
        },
    ];

    return (
        <div className="flex flex-col items-center py-6 sm:py-10" dir={direction}>
            <motion.h2
                className="text-[20px] sm:text-[28px] md:text-[36px] lg:text-[48px] font-[800] text-gray-900 text-center mb-3 sm:mb-4 md:mb-6 leading-tight px-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                {isArabic ? (
                    <>
                        <span className="block font-almarai">تعلم اللغة الصينية مثلما</span>
                        <span className="block hidden sm:block font-almarai">تفعل في الحياة الواقعية</span>
                        <span className="block sm:hidden font-almarai">تفعل في الحياة الواقعية</span>
                    </>
                ) : (
                    <>
                        <span className="block">Learn Chinese Like</span>
                        <span className="block hidden sm:block">You'd in Real Life</span>
                        <span className="block sm:hidden">You'd in Real Life</span>
                    </>
                )}
            </motion.h2>
            <motion.p
                className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] text-gray-600 text-center max-w-4xl mb-6 sm:mb-8 md:mb-12 lg:mb-16 leading-relaxed px-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
                {isArabic ? (
                    <>
                        <span className="block font-bold font-almarai">تدرب على محادثات الحياة اليومية مثل التحيات، والطعام، والسفر، والمدرسة</span>
                        <span className="block hidden sm:block mt-2 font-almarai">يستمع الذكاء الاصطناعي إليك، ويصححك فورًا، ويساعدك على التحدث بشكل أكثر طبيعية — خطوة بخطوة</span>
                        <span className="block sm:hidden mt-2 font-almarai">يستمع الذكاء الاصطناعي إليك، ويصححك فورًا، ويساعدك على التحدث بشكل أكثر طبيعية</span>
                    </>
                ) : (
                    <>
                        <span className="block font-bold">Practice everyday conversations like greetings, food, travel, and school</span>
                        <span className="block hidden sm:block mt-2">AI listens to you, corrects you instantly, and helps you speak more naturally — step by step</span>
                        <span className="block sm:hidden mt-2">AI listens to you, corrects you instantly, and helps you speak more naturally</span>
                    </>
                )}
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 w-full max-w-6xl px-4 sm:px-6">
                {cards.map((card, index) => (
                    <motion.div
                        key={index}
                        className={cn(
                            "p-4 sm:p-6 md:p-8 lg:p-10 rounded-[20px] sm:rounded-[30px] md:rounded-[40px] border-2 bg-white flex flex-col items-center text-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-transform hover:scale-[1.02]",
                            card.borderColor
                        )}
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 + index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                    >
                        <div className={cn("w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-[16px] sm:rounded-[20px] md:rounded-[24px] flex items-center justify-center mb-4 sm:mb-6 md:mb-8", card.iconColor)}>
                            {card.icon}
                        </div>
                        <h3 className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-[800] text-gray-900 mb-2 sm:mb-3 md:mb-4">{card.title}</h3>
                        <p className="text-[12px] sm:text-[14px] md:text-[16px] text-gray-600 leading-relaxed">
                            {card.description}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

function GamificationSlide({ language }: { language: "ar" | "en" }) {
    const direction = language === "ar" ? "rtl" : "ltr";
    const isArabic = language === "ar";

    return (
        <div className={cn("flex flex-col min-[620px]:flex-row items-center justify-between gap-8 min-[620px]:gap-12 py-6 sm:py-10")} dir={direction}>
            {/* Text Content */}
            <div className={cn(
                "w-full min-[620px]:w-1/2 px-4 sm:px-0",
                isArabic ? "text-right" : "text-left",
                "order-1"
            )}>
                <div className="relative">
                    {/* Decorative slab with star above text */}
                    <motion.img
                        src={slabWithStar}
                        alt=""
                        className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-2 sm:mb-3"
                        initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                    />
                    <motion.h2
                        className="text-[20px] sm:text-[28px] md:text-[40px] lg:text-[52px] font-[800] text-gray-900 leading-[1.3] sm:leading-[1.2] md:leading-[1.1] mb-3 sm:mb-4 md:mb-6"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        {isArabic ? (
                            <>
                                <span className="block font-almarai">تعلم يوميًا</span>
                                <span className="text-[#FF5C5C] block font-almarai">تقدم في المستوى بشكل أسرع</span>
                            </>
                        ) : (
                            <>
                                <span className="block">Learn Daily</span>
                                <span className="text-[#FF5C5C] block">Level Up Faster</span>
                            </>
                        )}
                    </motion.h2>
                </div>

                <motion.p
                    className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] text-gray-600 mb-6 sm:mb-8 md:mb-12 leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                >
                    {isArabic ? (
                        <>
                            <span className="block font-bold font-almarai">تتبع سلاسل تعلمك وشاهد تحسنك مع مرور الوقت</span>
                            <span className="block font-regular hidden sm:block mt-2 font-almarai">افتح الإنجازات، واحصل على الشارات، وتنافس مع الأصدقاء لتبقى متحفزًا ومواظبًا</span>
                            <span className="block font-regular sm:hidden mt-2 font-almarai">افتح الإنجازات، واحصل على الشارات، وتنافس مع الأصدقاء</span>
                        </>
                    ) : (
                        <>
                            <span className="font-bold block">Track your learning streaks and watch your progress over time</span>
                            <span className="block hidden sm:block mt-2">Unlock achievements, earn badges, and compete with friends to stay motivated and consistent</span>
                            <span className="block sm:hidden mt-2">Unlock achievements, earn badges, and compete with friends</span>
                        </>
                    )}
                </motion.p>
            </div>

            {/* Visual Mockups */}
            <motion.div
                className="w-full min-[620px]:w-1/2 relative flex justify-center order-2 mt-4 min-[620px]:mt-0"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            >
                <img
                    src={Leaderboard}
                    alt="Leaderboard"
                    className="rounded-[12px] sm:rounded-[16px] md:rounded-[24px] w-full h-auto"
                />
            </motion.div>
        </div>
    );
}

