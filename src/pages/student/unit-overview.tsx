import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ArrowRight, FileText, Lightbulb, Zap, Star } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getCourses, getUnits, getLessons } from '@/redux/slices/learningSlice';
import { AppDispatch, RootState } from '@/redux/store';

export default function UnitOverview() {
  const { courseId, unitId } = useParams<{ courseId: string; unitId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { courses, units, lessons } = useSelector((state: RootState) => state.learning);

  useEffect(() => {
    if (courses.length === 0) {
      dispatch(getCourses());
    }
  }, [dispatch, courses.length]);

  useEffect(() => {
    if (courseId && units.length === 0) {
      dispatch(getUnits(courseId));
    }
  }, [dispatch, courseId, units.length]);

  useEffect(() => {
    if (unitId && lessons.length === 0) {
      dispatch(getLessons(unitId));
    }
  }, [dispatch, unitId, lessons.length]);

  const currentCourse = courses.find((c) => c.id === courseId);
  const currentUnit = units.find((u) => u.id === unitId);

  // Navigate to first lesson / reading mode
  const handleContinue = () => {
    const firstLesson = lessons[0];
    if (firstLesson) {
      navigate(`/student/courses/${courseId}/units/${unitId}/lessons/${firstLesson.id}`);
    } else {
      navigate(`/student/courses/${courseId}/units/${unitId}`);
    }
  };

  return (
    <div className="w-full max-w-[1037px] mx-auto bg-white rounded-none md:rounded-[24px] shadow-[0px_8px_24px_rgba(23,36,89,0.04)] border border-gray-100/80 p-4 md:p-[32px] flex flex-col gap-5 font-['Outfit',sans-serif]">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
        <button
          onClick={() => navigate(`/student/courses/${courseId}/units/${unitId}`)}
          className="w-10 h-10 rounded-full border border-[#E5E7EB] bg-white flex items-center justify-center text-[#282828] shadow-[0px_1px_4px_rgba(0,0,0,0.06)] hover:bg-gray-50 transition-all cursor-pointer"
          title="Back to Unit"
        >
          <ChevronLeft className="w-5 h-5 text-[#282828]" />
        </button>

        <h1 className="font-bold text-[20px] text-[#282828] tracking-[-0.3px]">
          {currentCourse?.subject || currentCourse?.title || currentUnit?.title || 'Overview'}
        </h1>

        <div className="w-10" />
      </div>

      {/* 1. Objective Card */}
      <div className="w-full bg-gradient-to-r from-[#0267B5] to-[#249CFF] rounded-[16px] p-5 md:p-[24px] flex flex-col gap-3.5 shadow-sm text-white">
        <div className="flex items-center gap-1.5">
          <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
          <span className="font-bold text-[11px] leading-[14px] tracking-[1.8px] text-white uppercase">
            OBJECTIVE
          </span>
        </div>
        <p className="font-bold text-[18px] md:text-[20px] leading-[26px] md:leading-[28px]">
          "I can correctly identify complex fractions and calculate unit rates."
        </p>
      </div>

      {/* 2. Definition Card */}
      <div className="w-full bg-white rounded-[16px] shadow-[0px_4px_16px_rgba(23,31,74,0.08)] border border-[#F1F5F9] flex flex-col sm:flex-row items-stretch overflow-hidden min-h-[90px]">
        {/* Left Icon Sidebar */}
        <div className="w-full sm:w-[76px] bg-[#5C9DFF]/[0.08] flex items-center justify-center p-4 sm:p-0 flex-shrink-0">
          <div className="w-10 h-10 rounded-[12px] bg-[#6EBDFB]/20 flex items-center justify-center text-[#3B82F6]">
            <FileText className="w-5 h-5 text-[#3B82F6]" />
          </div>
        </div>
        {/* Content */}
        <div className="p-4 sm:p-5 flex-1 flex items-center">
          <p className="text-[14px] leading-[24px] text-[#6E7496]">
            A <span className="font-bold text-[#282828]">complex fraction</span> is a fraction where the numerator, denominator, or both contain a fraction. We solve them using the <span className="font-bold underline text-[#282828]">Keep-Change-Flip</span> method.
          </p>
        </div>
      </div>

      {/* 3. Remember Card */}
      <div className="w-full bg-[#FFF8E7] rounded-[16px] flex flex-col sm:flex-row items-stretch overflow-hidden min-h-[80px] border border-[#FEF3C7]">
        {/* Left Icon Sidebar */}
        <div className="w-full sm:w-[76px] bg-[#F59E0B]/[0.12] flex items-center justify-center p-4 sm:p-0 flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-[#F6A620]/20 flex items-center justify-center text-[#D97706]">
            <Lightbulb className="w-5 h-5 text-[#D97706]" />
          </div>
        </div>
        {/* Content */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-center gap-1">
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-[#251808] fill-[#251808]" />
            <span className="font-bold text-[11px] leading-[14px] tracking-[1.4px] text-[#251808] uppercase">
              REMEMBER
            </span>
          </div>
          <p className="font-semibold text-[13px] md:text-[14px] leading-[20px] text-[#D44A06]">
            Always flip the second fraction before multiplying across!
          </p>
        </div>
      </div>

      {/* 4. Table / Examples Card */}
      <div className="w-full bg-white rounded-[16px] shadow-[0px_4px_16px_rgba(23,31,74,0.08)] border border-[#F1F5F9] flex flex-col sm:flex-row items-stretch overflow-hidden">
        {/* Left Icon Sidebar */}
        <div className="w-full sm:w-[76px] bg-[#6366F1]/[0.07] flex items-center justify-center p-4 sm:p-0 flex-shrink-0">
          <div className="grid grid-cols-3 gap-1 w-9 h-9">
            <div className="w-2.5 h-2.5 bg-[#6366F1] rounded-[2px]" />
            <div className="w-2.5 h-2.5 bg-[#6366F1] rounded-[2px]" />
            <div className="w-2.5 h-2.5 bg-[#6366F1] rounded-[2px]" />
            <div className="w-2.5 h-2.5 bg-[#6366F1]/40 rounded-[2px]" />
            <div className="w-2.5 h-2.5 bg-[#6366F1]/40 rounded-[2px]" />
            <div className="w-2.5 h-2.5 bg-[#6366F1]/40 rounded-[2px]" />
            <div className="w-2.5 h-2.5 bg-[#6366F1]/40 rounded-[2px]" />
            <div className="w-2.5 h-2.5 bg-[#6366F1]/40 rounded-[2px]" />
            <div className="w-2.5 h-2.5 bg-[#6366F1]/40 rounded-[2px]" />
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 md:p-6 flex-1 flex flex-col gap-3 overflow-hidden">
          <div className="flex items-center gap-2">
            <span className="text-base">💡</span>
            <h3 className="font-bold text-[14px] text-[#0F1450]">
              How Relative Pronouns Are Used in Text
            </h3>
          </div>
          <p className="text-[12px] text-[#6E748F]">
            Relative pronouns add extra information without starting a completely new sentence.
          </p>

          {/* Table */}
          <div className="w-full border border-[#E5E7EB] rounded-[8px] overflow-x-auto">
            <table className="w-full min-w-[540px] text-left border-collapse text-[11px] md:text-[12px]">
              <thead>
                <tr className="bg-[#6366F1]/[0.06] text-[#0F1450] font-semibold border-b border-[#E5E7EB]">
                  <th className="py-2.5 px-3 md:px-4 w-1/3">Short Sentences</th>
                  <th className="py-2.5 px-3 md:px-4 w-1/3">Better Sentence with a Relative Pronoun</th>
                  <th className="py-2.5 px-3 md:px-4 w-1/3">Why it works</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                <tr className="bg-white">
                  <td className="py-2.5 px-3 md:px-4 text-[#374151]">
                    Rajeet moved from Mumbai. He started school in Chicago.
                  </td>
                  <td className="py-2.5 px-3 md:px-4 text-[#374151]">
                    Rajeet is the student <span className="font-bold text-[#6366F1]">who</span> moved from Mumbai and started school in Chicago.
                  </td>
                  <td className="py-2.5 px-3 md:px-4 text-[#6366F1] font-bold">
                    <span className="font-bold text-[#6366F1]">Who</span> gives more information about a person.
                  </td>
                </tr>

                <tr className="bg-[#F9FAFB]">
                  <td className="py-2.5 px-3 md:px-4 text-[#374151]">
                    His mother bought a coat. The coat was heavy.
                  </td>
                  <td className="py-2.5 px-3 md:px-4 text-[#374151]">
                    The coat <span className="font-bold text-[#6366F1]">that</span> his mother bought was heavy and bulky.
                  </td>
                  <td className="py-2.5 px-3 md:px-4 text-[#6366F1] font-bold">
                    <span className="font-bold text-[#6366F1]">That</span> connects the important detail to the noun.
                  </td>
                </tr>

                <tr className="bg-white">
                  <td className="py-2.5 px-3 md:px-4 text-[#374151]">
                    Chicago has snowy winters. Chicago felt very different.
                  </td>
                  <td className="py-2.5 px-3 md:px-4 text-[#374151]">
                    Chicago, <span className="font-bold text-[#6366F1]">which</span> has snowy winters, felt very different from Mumbai.
                  </td>
                  <td className="py-2.5 px-3 md:px-4 text-[#6366F1] font-bold">
                    <span className="font-bold text-[#6366F1]">Which</span> adds extra information about a place or thing.
                  </td>
                </tr>

                <tr className="bg-[#F9FAFB]">
                  <td className="py-2.5 px-3 md:px-4 text-[#374151]">
                    Rajeet's father moved the family. His work was the reason.
                  </td>
                  <td className="py-2.5 px-3 md:px-4 text-[#374151]">
                    Rajeet is a student <span className="font-bold text-[#6366F1]">whose</span> father moved the family for work.
                  </td>
                  <td className="py-2.5 px-3 md:px-4 text-[#6366F1] font-bold">
                    <span className="font-bold text-[#6366F1]">Whose</span> shows belonging or connection.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Action Row */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleContinue}
          className="w-full sm:w-auto bg-[#5C9DFF] hover:bg-[#4A8DEF] active:scale-[0.98] text-white px-6 py-3 rounded-[8px] font-bold text-[14px] flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
