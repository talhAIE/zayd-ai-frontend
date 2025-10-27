import dashPng from "@/assets/images/landingpage/dash.png";

type Feature = {
  name: string;
  values: boolean[];
};

export default function PricingTable() {
  const plans = ["Free Plan", "School", "Premium"];

  const features: Feature[] = [
    { name: "AI Feedback", values: [true, true, true] },
    { name: "Personalized Lessons", values: [true, true, true] },
    { name: "Certificates", values: [false, true, true] },
    { name: "Support", values: [false, true, true] },
    { name: "Classroom Management", values: [false, true, true] },
    { name: "First Month Free", values: [false, false, true] },
    { name: "Access to All Features", values: [false, false, true] },
  ];

  return (
    <section
      id="pricing"
      className="relative w-full flex flex-col items-center py-24 px-6 md:px-20 bg-linear-to-r from-[#F6FAFF] to-white overflow-hidden"
    >
      {/* Decorative Blur Circles */}
      <div className="absolute top-[-200px] right-[150px] w-[500px] h-[500px] bg-[#3764B452] rounded-full blur-[240px] opacity-80" />
      <div className="absolute bottom-[-150px] left-[-250px] w-[500px] h-[500px] bg-[#3764B452] rounded-full blur-[240px] opacity-80" />

      {/* Table */}
      <div className="overflow-x-auto w-full max-w-5xl relative z-10 rounded-xl border border-[#058BF4]">
        <table className="min-w-full rounded-xl overflow-hidden text-center bg-white shadow-sm">
          {/* Header */}
          <thead>
            <tr className="bg-white">
              <th className="py-6 px-6 text-left text-gray-900 font-semibold text-lg w-1/2"></th>
              {plans.map((plan, i) => (
                <th
                  key={i}
                  className={`py-6 px-6 text-gray-900 font-semibold text-base whitespace-nowrap ${
                    plan === "Premium" ? "text-[#4CB1FF17]" : ""
                  }`}
                >
                  {plan}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {features.map((feature, rowIndex) => (
              <tr
                key={feature.name}
                className={`${
                  rowIndex % 2 === 0 ? "bg-[#F9FBFF]" : "bg-white"
                } border-t border-[#D6E6FF]`}
              >
                <td className="py-4 px-6 text-left text-gray-800 text-base font-medium">
                  {feature.name}
                </td>

                {feature.values.map((available, i) => (
                  <td
                    key={i}
                    className={`py-4 px-6 text-center ${
                      i === 2 ? "font-semibold text-[#058BF4]" : ""
                    }`}
                  >
                    {available ? (
                      <>
                        <div className="inline-block">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M1.66311 7.30713C1.3482 7.30804 1.03997 7.40038 0.774083 7.57349C0.508199 7.7466 0.295525 7.99339 0.160666 8.28532C0.0258074 8.57725 -0.025725 8.90238 0.0120309 9.22309C0.0497867 9.54383 0.175288 9.84703 0.374015 10.0976L4.61041 15.4212C4.76145 15.6136 4.95507 15.7662 5.17518 15.8664C5.39529 15.9667 5.63553 16.0116 5.87595 15.9974C6.39016 15.9691 6.8544 15.6869 7.15038 15.223L15.9504 0.684523C15.9519 0.682113 15.9534 0.679702 15.9549 0.677332C16.0375 0.547272 16.0107 0.289543 15.8403 0.127633C15.7935 0.0831715 15.7383 0.0490115 15.6781 0.0272585C15.6179 0.00550547 15.5541 -0.00337951 15.4904 0.00114949C15.4268 0.00567749 15.3647 0.0235255 15.308 0.0535925C15.2513 0.0836595 15.2013 0.125308 15.1609 0.175976C15.1577 0.179959 15.1545 0.183883 15.1511 0.187746L6.27615 10.4741C6.24238 10.5132 6.20137 10.5451 6.15549 10.5678C6.10961 10.5906 6.05978 10.6037 6.0089 10.6066C5.95802 10.6094 5.9071 10.6018 5.8591 10.5843C5.8111 10.5667 5.76697 10.5396 5.72928 10.5044L2.78384 7.75485C2.47793 7.46718 2.0781 7.30745 1.66311 7.30713Z"
                              fill="url(#paint0_linear_1_505)"
                            />
                            <defs>
                              <linearGradient
                                id="paint0_linear_1_505"
                                x1="0"
                                y1="8"
                                x2="16"
                                y2="8"
                                gradientUnits="userSpaceOnUse"
                              >
                                <stop stopColor="#76ABF8" />
                                <stop offset="0.485577" stopColor="#058BF4" />
                                <stop offset="0.8" stopColor="#63B3F6" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>
                      </>
                    ) : (
                      // Dash icon inside a small gray circle
                      <div className="w-6 h-6 mx-auto flex items-center justify-center bg-gray-200 rounded-full relative">
                        <img
                          src={dashPng}
                          alt="Not Available"
                          width={8}
                          height={21}
                          className="opacity-90"
                          style={{
                            position: "absolute",
                            top: "10px",
                            left: "8.38px",
                            transform: "rotate(0deg)",
                          }}
                        />
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
