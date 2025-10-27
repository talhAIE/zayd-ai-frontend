import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import pointsidesmileSvg from "@/assets/images/landingpage/pointsidesmile.svg";

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      quote:
        "The voice-to-text feature is a game changer. I now brainstorm by speaking and get outstanding notes instantly. It helps me stay in the flow.",
      author: "JULIAN HART",
      role: "UX DESIGNER",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    },
    {
      id: 2,
      quote:
        "Lina AI completely changed the way I write. I went from spending hours drafting email campaigns to just minutes—with better results. It feels like having a creative partner who never sleeps.",
      author: "NATHAN ELLIS",
      role: "FREELANCE MARKETER",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
    {
      id: 3,
      quote:
        "We use Lina AI across our team for blog writing, image creation, and even meeting summaries. It's like having an extra teammate who's fast, smart, and always available.",
      author: "ASHER REID",
      role: "STARTUP FOUNDER",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    },
    {
      id: 4,
      quote:
        "The AI-powered content generation is phenomenal. It understands context and delivers exactly what I need every time.",
      author: "MAYA CHEN",
      role: "CONTENT STRATEGIST",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
    {
      id: 5,
      quote:
        "Switching to Lina AI was the best decision for our productivity. The automation features save us hours every week.",
      author: "DAVID RODRIGUEZ",
      role: "PRODUCT MANAGER",
      image:
        "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop",
    },
    {
      id: 6,
      quote:
        "The quality of AI-generated content is impressive. It's like having an expert copywriter on demand 24/7.",
      author: "SARAH WILLIAMS",
      role: "MARKETING DIRECTOR",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    },
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 1200,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    pauseOnHover: true,
    pauseOnFocus: true,
    cssEase: "cubic-bezier(0.16, 1, 0.3, 1)",
    arrows: false,
    rtl: false,
    swipeToSlide: true,
    touchThreshold: 10,
    adaptiveHeight: false,
    waitForAnimate: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 2500,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 2500,
        },
      },
    ],
  };

  return (
    <section id="testimonials" className="bg-[#050A13] text-white py-16">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="flex items-center justify-center mb-12 gap-8 text-center">
          <div className="flex-1">
            {/* Badge */}
            <div className="inline-block border border-gray-600 rounded-full px-4 py-2 mb-6">
              <span className="text-sm text-gray-300">
                Testimonials • Trustpilot
              </span>
            </div>

            {/* Main Heading */}
            <div className="flex items-center justify-center relative">
              <h2 className="text-4xl md:text-5xl font-semibold mb-6 z-50 relative">
                Hear from our
                <br />
                <span className="text-blue-400">community.</span>
                {/* Blue circle background */}
                <span
                  className="pointer-events-none absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden md:block"
                  aria-hidden="true"
                  style={{
                    width: 400,
                    height: 500,
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle, rgba(131, 190, 235, 0.33) 30%, transparent 100%)",
                    zIndex: -1,
                    filter: "blur(84px)",
                  }}
                ></span>
              </h2>

              <div className="hidden md:flex justify-center z-30 absolute left-[62%] top-[35%] transform -translate-x-1/2 -translate-y-1/2">
                <img
                  src={pointsidesmileSvg}
                  alt="Community"
                  width={200}
                  height={128}
                  className="ms-30 mb-2"
                />
              </div>
            </div>
            {/* Description */}
            <p className="text-white text-md tracking-wide max-w-lg mx-auto text-center">
              From small businesses to enterprises, users from various
              industries depend on our technology to streamline their content
              generation.
            </p>
          </div>
        </div>

        {/* Testimonials Slider */}
        <div className="relative">
          {/* Orange circle background at bottom */}
          <span
            className="pointer-events-none absolute left-1/2 bottom-[-50px] transform -translate-x-1/2 hidden md:block"
            aria-hidden="true"
            style={{
              width: 600,
              height: 500,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255, 156, 86, 0.5) 30%, transparent 70%)",
              zIndex: 0,
              filter: "blur(80px)",
            }}
          ></span>

          <div className="testimonials-slider relative z-10">
            <Slider {...sliderSettings}>
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="px-3">
                  <div className="bg-[#2451A2] border border-[#2451A2] rounded-2xl p-8 flex flex-col min-h-[280px] h-full relative z-20">
                    <p className="text-gray-200 text-sm tracking-wider leading-relaxed flex-1 mb-6">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>

                    <div className="border-t-2 border-gray-300 pt-4 flex items-center gap-4 mt-auto">
                      <img
                        src={testimonial.image}
                        alt={testimonial.author}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover object-center"
                      />
                      <div className="flex flex-col gap-2">
                        <p className="font-semibold tracking-wider text-white text-sm">
                          {testimonial.author}
                        </p>
                        <p className="text-blue-300 tracking-widest text-xs">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
