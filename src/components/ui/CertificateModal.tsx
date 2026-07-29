import React, { useRef } from "react";
import { X, Award, Download } from "lucide-react";
import html2canvas from "html2canvas";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: any;
  user: any;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  course,
  user,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !course) return null;

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    try {
      await document.fonts.ready;
      const canvas = await html2canvas(certificateRef.current, { scale: 2 });
      const link = document.createElement("a");
      link.download = `${course.title.replace(/\s+/g, "_")}_Certificate.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Failed to download certificate", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div
        className="relative w-full max-w-[800px] flex flex-col gap-4 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Actions - Floating Above Certificate */}
        <div className="flex justify-end items-center gap-2 w-full">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-[#0F1450] font-semibold rounded-full shadow-lg transition-all"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">Download</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-700 rounded-full shadow-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Container with Padding */}
        <div
          ref={certificateRef}
          className="bg-white p-6 sm:p-10 shadow-2xl shrink-0 w-full"
        >
          {/* Certificate Inner Frame */}
          <div
            className="relative w-full aspect-[1.414/1] border-[12px] border-double border-[#0F1450] p-10 flex flex-col items-center text-center justify-center gap-6"
            style={{
              backgroundImage:
                "radial-gradient(circle at center, #ffffff 0%, #f8fafc 100%)",
              boxShadow: "inset 0 0 40px rgba(0,0,0,0.05)",
            }}
          >
            {/* Watermark / Background accents */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
              <Award className="w-96 h-96 text-[#0F1450]" />
            </div>

            <div className="w-20 h-20 bg-[#EFF6FF] rounded-full flex items-center justify-center border-4 border-white shadow-lg z-10 mb-2">
              <Award className="w-10 h-10 text-[#5C9DFF]" />
            </div>

            <div className="z-10">
              <h2 className="text-[#6E748F] font-['Outfit'] font-semibold tracking-widest uppercase text-sm mb-2">
                Certificate of Completion
              </h2>
              <h1 className="text-4xl sm:text-5xl font-serif text-[#0F1450] mb-8 font-bold">
                Achievement Award
              </h1>
            </div>

            <div className="z-10 flex flex-col items-center text-center">
              <p className="text-[#6E748F] text-sm mb-4">
                This is to proudly certify that
              </p>

              <div className="border-b-2 border-[#5C9DFF]/30 px-12 pb-4 mb-4">
                <h3 className="text-3xl sm:text-4xl font-['Outfit'] font-bold text-[#5C9DFF] leading-normal mt-2">
                  {user?.name || user?.username || "Student Name"}
                </h3>
              </div>

              <p className="text-[#6E748F] text-sm max-w-lg mx-auto mb-2">
                has successfully completed all requirements for the course
              </p>
              <h4 className="text-2xl font-['Outfit'] font-bold text-[#282828]">
                {course.title}
              </h4>
            </div>

            <div className="z-10 mt-12 flex justify-between w-full max-w-lg items-end border-t border-gray-200 pt-6">
              <div className="flex flex-col items-center">
                <span className="text-sm font-semibold text-[#0F1450] mb-1">
                  {new Date().toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="text-xs text-[#6E748F] uppercase tracking-wider">
                  Date
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-32 h-12 flex items-center justify-center mb-1">
                  <span className="font-['Outfit'] italic font-bold text-[#0F1450] text-xl opacity-80">
                    Zayd AI
                  </span>
                </div>
                <span className="text-xs text-[#6E748F] uppercase tracking-wider border-t border-gray-300 pt-1 w-full text-center">
                  Organization
                </span>
              </div>
            </div>

            {/* Decorative Corner Elements */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-[#0F1450] opacity-20"></div>
            <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-[#0F1450] opacity-20"></div>
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-[#0F1450] opacity-20"></div>
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-[#0F1450] opacity-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
