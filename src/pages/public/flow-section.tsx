import repairImg from "@/assets/images/landingpage/repair.svg";
import { Link } from "react-router-dom";

export default function FlowSection() {
  return (
    <section id="how-it-works" className="bg-white py-24 px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Top Section with Bird Illustration and Pill Button */}
        <div className="flex flex-col gap-4 items-center justify-between mb-8">
          {/* Pill Button */}
          <div className="flex-1 flex justify-center">
            <button className="border border-gray-300 text-black px-6 py-2 rounded-full text-sm font-medium">
              How it works
            </button>
          </div>

          {/* Main Heading */}
          <div className="text-center ">
            <h2 className="text-2xl font-semibold text-[#666666] mb-4">
              So, how does it work?
            </h2>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-12 relative">
          {/* Bird SVG above the progress bar */}
          <div className="absolute -left-4 -top-[310%] z-10 hidden md:block">
            <img
              src={repairImg}
              alt="Bird illustration"
              width={160}
              height={160}
              className="w-40 h-40 transform scale-x-[-1]"
            />
          </div>

          <div className="relative">
            {/* Gradient Background Bar with fading ends */}
            <div className="h-12 bg-linear-to-r from-transparent via-blue-400 to-transparent rounded-full"></div>

            {/* Numbered Circles */}
            <div className="absolute top-2 px-8 left-0 w-full flex justify-between ">
              {[1, 2, 3, 4].map((number) => (
                <div
                  key={number}
                  className="w-8 h-8 border border-slate-300 rounded-full flex items-center justify-center"
                >
                  <span className="text-black font-semibold text-sm">
                    {number}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Steps Grid */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Step 1 */}
          <div className="text-center lg:text-start">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Sign Up for Free
            </h3>
            <p className="text-gray-600">Create your account in seconds</p>
          </div>

          {/* Step 2 */}
          <div className="text-center ">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Choose Your Learning Path
            </h3>
            <p className="text-gray-600">Beginner to advanced levels (A1-C1)</p>
          </div>

          {/* Step 3 */}
          <div className="text-center ">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Start Practicing
            </h3>
            <p className="text-gray-600">
              Speak, listen, debate, and play games with AI.
            </p>
          </div>

          {/* Step 4 */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Track Results
            </h3>
            <p className="text-gray-600">
              See progress charts and get certificates.
            </p>
          </div>
        </div>

        {/* Call to Action Button */}
        <div className="text-center">
          <Link to="/login">
            <button className="border border-gray-300 text-black px-8 py-3 rounded-full text-lg font-normal hover:bg-gray-300 transition-colors">
              Want to see?{" "}
              <span className="text-[#058BF4] font-normal">Try Zayd AI</span>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
