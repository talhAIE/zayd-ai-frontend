import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, ChevronLeft, CircleAlert, Eye } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getLessonModes, 
  startLessonMode, 
  completeLessonMode
} from '@/redux/slices/learningSlice';
import { 
  fetchLessonModeComponents, 
  submitComponentAttempt,
  saveComponentAttempt,
  startLearningComponent,
  fetchModeResources,
  interactWithResource,
  submitReflection,
  revealApprovedAnswers,
  LearningResource,
  ResourceInteractionType,
  LearningComponent 
} from '@/services/learningService';
import { AppDispatch, RootState } from '@/redux/store';
import { toast } from 'sonner';
import { getLearningModePath } from '@/utils/learning-navigation';
import { useLearningProgressRefresh } from '@/hooks/useLearningProgressRefresh';

import {
  DropdownComponent,
  MCQComponent,
  MatchComponent,
  SemanticReviewComponent,
  TrueFalseComponent,
  TextVariationComponent,
  MediaComponent,
  FlashcardsComponent,
  FillInTheBlankComponent,
  ReflectionComponent,
  ResourceComponent,
  TextComponent,
  UnavailableComponent,
  WritingTableComponent,
} from '@/components/learning/modes';

export default function ComponentModePlay() {
  const { courseId, unitId, lessonId, modeId } = useParams<{
    courseId: string;
    unitId: string;
    lessonId: string;
    modeId: string;
  }>();

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { modes, lessons, units } = useSelector((state: RootState) => state.learning);
  const [components, setComponents] = useState<LearningComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmittingMode, setIsSubmittingMode] = useState(false);
  const [localResponses, setLocalResponses] = useState<Record<string, any>>({});
  const [, setCompletedComponentIds] = useState<Set<string>>(new Set());
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, Array<{ id: string; value: string }>>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const refreshLearningProgress = useLearningProgressRefresh();

  const currentUnit = units.find((u) => u.id === unitId);
  const currentLesson = lessons.find((l) => l.id === lessonId);
  const currentMode = modes.find((m) => m.id === modeId);

  const refreshModeState = useCallback(async () => {
    if (!modeId || !lessonId) return [];

    const mode = modes.find((m) => m.id === modeId);
    
    const [modeComponents, modeResources, refreshedModes] = await Promise.all([
      fetchLessonModeComponents(modeId),
      mode?.modeKey === 'resource' ? fetchModeResources(modeId).catch(() => [] as LearningResource[]) : Promise.resolve([] as LearningResource[]),
      dispatch(getLessonModes(lessonId)).unwrap(),
    ]);
    const resourcesByComponent = new Map<string, LearningResource[]>();
    modeResources.forEach((resource) => {
      if (!resource.componentId) return;
      resourcesByComponent.set(resource.componentId, [
        ...(resourcesByComponent.get(resource.componentId) || []),
        resource,
      ]);
    });
    const onlyResourceComponent = modeComponents.filter((component) => component.componentType === 'resource');
    setComponents(modeComponents.sort((left, right) => left.orderIndex - right.orderIndex).map((component) => ({
      ...component,
      resources: resourcesByComponent.get(component.id)
        || (onlyResourceComponent.length === 1 && component.componentType === 'resource' ? modeResources : component.resources),
    })));
    await refreshLearningProgress(lessonId, { unitId, courseId });
    return refreshedModes;
  }, [courseId, dispatch, lessonId, modeId, refreshLearningProgress, unitId]);

  // Load components & initialize mode session
  useEffect(() => {
    async function loadData() {
      if (!modeId) return;
      setLoading(true);
      setError(null);
      try {
        // Attempt to start lesson mode (non-blocking if already in progress or server transient 500)
        const startPromise = dispatch(startLessonMode({ lessonModeId: modeId }))
          .unwrap()
          .catch((startErr) => {
            console.warn('startLessonMode non-critical error:', startErr);
          });

        const mode = modes.find((m) => m.id === modeId);
        const [data, resources] = await Promise.all([
          fetchLessonModeComponents(modeId),
          mode?.modeKey === 'resource' ? fetchModeResources(modeId).catch(() => [] as LearningResource[]) : Promise.resolve([] as LearningResource[]),
          startPromise
        ]);
        // Start on-view components as they become visible. The backend then owns
        // acknowledgement completion instead of the UI inventing it locally.
        const initialized = [...data].sort((a, b) => a.orderIndex - b.orderIndex);
        const resourcesByComponent = new Map<string, LearningResource[]>();
        resources.forEach((resource) => {
          if (!resource.componentId) return;
          resourcesByComponent.set(resource.componentId, [
            ...(resourcesByComponent.get(resource.componentId) || []),
            resource,
          ]);
        });
        const resourceComponents = initialized.filter((component) => component.componentType === 'resource');
        const sorted = initialized.sort((a, b) => a.orderIndex - b.orderIndex).map((component) => ({
          ...component,
          resources: resourcesByComponent.get(component.id)
            || (resourceComponents.length === 1 && component.componentType === 'resource' ? resources : component.resources),
        }));
        setComponents(sorted);

        // Pre-fill completed components from attempt status
        const completedIds = new Set<string>();
        let firstIncomplete = -1;
        sorted.forEach((c, index) => {
          if (c.isComplete || c.attempt?.completedAt) {
            completedIds.add(c.id);
          } else if (firstIncomplete === -1) {
            firstIncomplete = index;
          }
        });
        setCompletedComponentIds(completedIds);
        
        // Jump to first uncompleted component, or the last one if all are complete
        if (sorted.length > 0) {
          setCurrentIndex(firstIncomplete === -1 ? sorted.length - 1 : firstIncomplete);
        } else {
          setCurrentIndex(0);
        }
      } catch (err: any) {
        console.error('Failed to load components:', err);
        setError(err.response?.data?.message || 'Failed to load lesson mode components.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [dispatch, modeId]);

  // Handle component answer submissions
  const handleComponentSubmit = async (componentId: string, response: any) => {
    try {
      const formattedResponse =
        typeof response === 'object' && response !== null ? response : { value: response };

      const result = await submitComponentAttempt(componentId, {
        response: formattedResponse,
        finalResponse: formattedResponse,
      });

      setComponents((currentComponents) =>
        currentComponents.map((component) => component.id === componentId ? result : component),
      );
      setCompletedComponentIds((previousIds) => {
        const nextIds = new Set(previousIds);
        if (result.isComplete || result.attempt?.completedAt) {
          nextIds.add(componentId);
        } else {
          nextIds.delete(componentId);
        }
        return nextIds;
      });
      toast.success(result.isComplete ? 'Activity completed!' : 'Response submitted.');
      return result;
    } catch (err: any) {
      console.error('Failed to submit component response:', err);
      toast.error(err.response?.data?.message || 'Failed to submit response.');
      throw err;
    }
  };

  const handleComponentChange = async (componentId: string, response: any) => {
    setLocalResponses((current) => ({ ...current, [componentId]: response }));
    try {
      const result = await saveComponentAttempt(componentId, { response });
      setComponents((currentComponents) => currentComponents.map((component) => component.id === componentId ? result : component));
    } catch {
      // Draft saving is best-effort; the final submit still validates server-side.
    }
  };

  const handleRevealAnswer = async (component: LearningComponent) => {
    if (component.attempt?.status !== 'exhausted' || component.attempt?.feedback?.canRevealAnswer !== true) return;
    try {
      const answers = await revealApprovedAnswers(component.id);
      setRevealedAnswers((current) => ({ ...current, [component.id]: answers }));
    } catch (revealError: any) {
      toast.error(revealError.response?.data?.message || 'Answers are not available for this activity.');
    }
  };

  const handleResourceInteraction = async (resource: LearningResource, interactionType: ResourceInteractionType) => {
    try {
      const updatedResources = await interactWithResource(resource.id, interactionType);
      setComponents((currentComponents) => currentComponents.map((component) =>
        component.resources.some((item) => item.id === resource.id)
          ? { ...component, resources: updatedResources }
          : component,
      ));
      await refreshModeState();
    } catch {
      toast.error('Unable to record this resource interaction.');
    }
  };

  const handleReflectionSubmit = async (componentId: string, response: Record<string, unknown>) => {
    try {
      const result = await submitReflection(componentId, response);
      setComponents((currentComponents) => currentComponents.map((component) =>
        component.id === componentId ? { ...component, isComplete: result.isComplete } : component,
      ));
      setCompletedComponentIds((previousIds) => {
        const nextIds = new Set(previousIds);
        if (result.isComplete) nextIds.add(componentId);
        return nextIds;
      });
      await refreshModeState();
      toast.success('Reflection submitted.');
      return result;
    } catch (submitError: any) {
      toast.error(submitError.response?.data?.message || 'Unable to submit reflection.');
      throw submitError;
    }
  };

  // Complete the entire mode and progress to next mode or lesson roadmap
  const handleCompleteMode = async () => {
    if (!modeId || !lessonId) return;
    const modeAlreadyComplete = currentMode?.status === 'completed' || requiredComponentsComplete;
    if (!modeAlreadyComplete && !requiredComponentsComplete) {
      toast.error('Complete the required activities before moving on.');
      return;
    }
    setIsSubmittingMode(true);
    try {
      const updatedModes = modeAlreadyComplete
        ? await dispatch(getLessonModes(lessonId)).unwrap()
        : await dispatch(completeLessonMode({ lessonModeId: modeId })).unwrap().then(() => dispatch(getLessonModes(lessonId)).unwrap());
      await refreshLearningProgress(lessonId, { unitId, courseId });

      // Find next sequential mode
      const currentModeIndex = updatedModes.findIndex((m: any) => m.id === modeId);
      const nextMode = currentModeIndex !== -1 && currentModeIndex < updatedModes.length - 1 
        ? updatedModes[currentModeIndex + 1] 
        : null;

      toast.success('Mode completed successfully!');

      if (nextMode && !nextMode.isLocked && courseId && unitId) {
        navigate(getLearningModePath({ courseId, unitId, lessonId }, nextMode));
      } else {
        navigate(`/student/courses/${courseId}/units/${unitId}`);
      }
    } catch (err: any) {
      console.error('Failed to complete mode:', err);
      toast.error('Failed to complete mode.');
    } finally {
      setIsSubmittingMode(false);
    }
  };

  const visibleComponents = components.filter((comp) => {
    const isUnitOverviewVariation = comp.componentType === 'text_variation' && comp.content?.presentation === 'unit_overview';
    const overviewVariations = components.filter((item) => item.componentType === 'text_variation' && item.content?.presentation === 'unit_overview');
    if (isUnitOverviewVariation && overviewVariations[0]?.id !== comp.id) {
      return false;
    }
    return true;
  });

  const totalCount = visibleComponents.length;
  const currentComp = visibleComponents[currentIndex];
  
  const completedCount = visibleComponents.filter((component) => component.isComplete || Boolean(component.attempt?.completedAt)).length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  const canAdvanceFromCurrent = Boolean(currentComp ? (!currentComp.isRequired || currentComp.isComplete || Boolean(currentComp.attempt?.completedAt) || currentComp.attempt?.status === 'exhausted' || (currentComp.componentType === 'open_input' && Boolean(currentComp.attempt?.response))) : true);
  const requiredComponentsComplete = visibleComponents
    .filter((component) => component.isRequired)
    .every((component) => component.isComplete || Boolean(component.attempt?.completedAt) || component.attempt?.status === 'exhausted' || (component.componentType === 'open_input' && Boolean(component.attempt?.response)));
  const canAdvanceMode = Boolean(currentMode?.status === 'completed' || requiredComponentsComplete);

  useEffect(() => {
    if (currentComp && currentComp.completionRule === 'on_view' && !currentComp.isComplete) {
      startLearningComponent(currentComp.id)
        .then((result) => {
          setComponents((currentComponents) =>
            currentComponents.map((c) => (c.id === result.id ? result : c))
          );
          setCompletedComponentIds((prev) => {
            const next = new Set(prev);
            if (result.isComplete || result.attempt?.completedAt) next.add(result.id);
            return next;
          });
        })
        .catch((err) => {
          console.warn('Unable to start component view', err);
        });
    }
  }, [currentComp?.id]);

  return (
    <div className="w-full max-w-[1040px] mx-auto pb-16 flex flex-col gap-6 font-['Outfit',sans-serif]">
      {/* Mode Header Card with Back Button */}
      <div className="w-full bg-white rounded-none md:rounded-[20px] border border-[#E2E8F0] shadow-sm p-4 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              navigate(`/student/courses/${courseId}/units/${unitId}/lessons/${lessonId}`)
            }
            className="w-10 h-10 rounded-full border border-[#E2E8F0] bg-white flex items-center justify-center text-[#282828] hover:bg-gray-50 transition-all cursor-pointer shadow-sm flex-shrink-0"
            title="Back to Lesson"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-[20px] md:text-[24px] font-extrabold text-[#0F172A] tracking-[-0.3px]">
              {currentMode?.title || 'Learning Mode'}
            </h1>

            <span className="text-[13px] font-semibold text-[#64748B]">
              {currentUnit?.title || 'Unit'}
              {currentLesson ? ` • ${currentLesson.title}` : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Top Progress Bar */}
      {!loading && !error && totalCount > 0 && (
        <div className="w-full flex flex-col gap-1.5 px-1">
          <div className="w-full h-2.5 bg-[#E2E8F0] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#10B981] rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-[13px] font-bold text-[#10B981]">{progressPct}% Complete</span>
        </div>
      )}

      {/* Loading & Error States */}
      {loading && (
        <div className="w-full bg-white rounded-[20px] p-12 border border-[#E2E8F0] flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-[#4F8DFB] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#64748B] font-medium text-[14px]">Loading interactive mode components...</p>
        </div>
      )}

      {error && !loading && (
        <div className="w-full bg-red-50 rounded-[20px] p-6 border border-red-200 text-red-700 text-center">
          <p className="font-bold">{error}</p>
        </div>
      )}

      {/* Components List */}
      {!loading && !error && components.length === 0 && (
        <div className="w-full bg-white rounded-[20px] p-8 border border-[#E2E8F0] text-center text-[#64748B]">
          No components available in this mode.
        </div>
      )}

      {!loading && !error && (
        <div className="flex flex-col gap-6">
          {currentComp && (() => {
            const comp = currentComp;
            const isCompleted = comp.isComplete || Boolean(comp.attempt?.completedAt);
            const isTerminal = isCompleted || comp.attempt?.status === 'exhausted';
            const isDisabled = !comp.canSubmit || isTerminal;
            const overviewVariations = components.filter((item) => item.componentType === 'text_variation' && item.content?.presentation === 'unit_overview');

            switch (comp.componentType) {
              case 'dropdown':
                return (
                  <DropdownComponent
                    key={comp.id}
                    component={comp}
                    onAnswerChange={(ans) => handleComponentChange(comp.id, ans)}
                    isSubmitted={isTerminal}
                    disabled={isDisabled}
                  />
                );

              case 'mcq':
                return (
                  <MCQComponent
                    key={comp.id}
                    component={comp}
                    onAnswerChange={(val) => handleComponentChange(comp.id, { optionId: val })}
                    isSubmitted={isTerminal}
                    disabled={isDisabled}
                  />
                );

              case 'match_column':
                return (
                  <MatchComponent
                    key={comp.id}
                    component={comp}
                    onAnswerChange={(pairs) => handleComponentChange(comp.id, { matches: Object.entries(pairs).map(([leftValue, rightValue]) => ({ leftValue, rightValue })) })}
                    isSubmitted={isTerminal}
                    disabled={isDisabled}
                  />
                );

              case 'open_input': {
                let defaultText = '';
                if (comp.content?.presentation === 'compiled_paragraph') {
                  const tableComp = components.find(c => c.componentType === 'writing_table');
                  if (tableComp && tableComp.attempt?.response?.rows) {
                    const rows = tableComp.attempt.response.rows as any[];
                    defaultText = rows.map(r => String(r.sentence || '')).filter(s => s.trim().length > 0).join(' ');
                  }
                }
                return (
                  <SemanticReviewComponent
                    key={comp.id}
                    component={comp}
                    onAnswerChange={(val) => handleComponentChange(comp.id, comp.content?.presentation === 'compiled_paragraph' ? { paragraph: val } : { text: val })}
                    onSubmit={(val) => handleComponentSubmit(comp.id, comp.content?.presentation === 'compiled_paragraph' ? { paragraph: val } : { text: val })}
                    isSubmitted={isTerminal || (comp.componentType === 'open_input' && Boolean(comp.attempt?.status === 'submitted'))}
                    disabled={isDisabled}
                    defaultText={defaultText}
                  />
                );
              }

              case 'true_false':
                return (
                  <TrueFalseComponent
                    key={comp.id}
                    component={comp}
                    onAnswerChange={(val) => handleComponentChange(comp.id, { optionId: val })}
                    isSubmitted={isTerminal}
                    disabled={isDisabled}
                  />
                );

              case 'flashcards':
                return (
                  <FlashcardsComponent
                    key={comp.id}
                    component={comp}
                    onSubmit={(response) => handleComponentSubmit(comp.id, response)}
                    isSubmitted={isTerminal}
                  />
                );

              case 'media':
                return <MediaComponent key={comp.id} component={comp} />;

              case 'text':
                return <TextComponent key={comp.id} component={comp} />;

              case 'text_variation':
                return <TextVariationComponent key={comp.id} component={comp} groupedComponents={comp.content?.presentation === 'unit_overview' ? overviewVariations : undefined} />;

              case 'fill_in_the_blank':
                return <FillInTheBlankComponent key={comp.id} component={comp} onAnswerChange={(response) => handleComponentChange(comp.id, response)} isSubmitted={isTerminal} />;

              case 'writing_table':
                return <WritingTableComponent key={comp.id} component={comp} onAnswerChange={(response) => handleComponentChange(comp.id, response)} isSubmitted={isTerminal} />;

              case 'resource':
                return <ResourceComponent key={comp.id} component={comp} onInteract={handleResourceInteraction} />;

              case 'reflection':
                return <ReflectionComponent key={comp.id} component={comp} onSubmit={(response) => handleReflectionSubmit(comp.id, response)} isSubmitted={isTerminal} />;

              default:
                return <UnavailableComponent key={comp.id} component={comp} />;
            }
          })()}

          <div className="flex flex-col gap-3">
            {currentComp && (
              <ComponentAttemptFeedback
                key={`feedback-${currentComp.id}`}
                component={currentComp}
                answers={revealedAnswers[currentComp.id] || []}
                onReveal={() => handleRevealAnswer(currentComp)}
              />
            )}
          </div>

          {/* Bottom Action Bar */}
          <div className="w-full bg-white rounded-[18px] border border-[#E2E8F0] shadow-sm p-4 md:px-6 md:py-4 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
            <button
              type="button"
              onClick={() => setCurrentIndex((curr) => Math.max(0, curr - 1))}
              disabled={currentIndex === 0 || isSubmittingMode}
              className="w-full sm:w-auto bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-gray-50 disabled:opacity-50 px-7 py-3 rounded-full font-bold text-[14px] transition-all cursor-pointer"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={async () => {
                if (isSubmittingMode) return;
                
                if (!canAdvanceFromCurrent && currentComp) {
                  let currentResponse = localResponses[currentComp.id] ?? currentComp.attempt?.response;
                  const isInput = ['mcq', 'dropdown', 'open_input', 'true_false', 'fill_in_the_blank', 'writing_table', 'reflection'].includes(currentComp.componentType);
                  
                  if (isInput) {
                    if (!currentResponse || (typeof currentResponse === 'object' && Object.keys(currentResponse).length === 0)) {
                      toast.error('Please answer the question before submitting.');
                      return;
                    }
                  } else {
                    currentResponse = currentResponse || {};
                  }
                  setIsSubmittingMode(true);
                  try {
                    if (currentComp.componentType === 'reflection') {
                      await handleReflectionSubmit(currentComp.id, currentResponse);
                    } else {
                      await handleComponentSubmit(currentComp.id, currentResponse);
                    }
                  } catch {
                    // Handled in submit helpers
                  } finally {
                    setIsSubmittingMode(false);
                  }
                  return;
                }

                if (currentIndex < totalCount - 1) {
                  setCurrentIndex((curr) => curr + 1);
                } else {
                  handleCompleteMode();
                }
              }}
              disabled={isSubmittingMode || (!canAdvanceMode && currentIndex === totalCount - 1 && canAdvanceFromCurrent)}
              className={`
                w-full sm:w-auto bg-[#4F8DFB] hover:bg-[#3B82F6] active:scale-[0.98] text-white px-7 py-3 rounded-full font-bold text-[14px] flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer
                ${isSubmittingMode ? 'opacity-70 cursor-not-allowed' : ''}
              `}
            >
              {isSubmittingMode ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : null}
              <span>
                {!canAdvanceFromCurrent
                  ? isSubmittingMode
                    ? 'Submitting...'
                    : (currentComp && !['mcq', 'dropdown', 'open_input', 'true_false', 'fill_in_the_blank', 'writing_table', 'reflection'].includes(currentComp.componentType) ? 'Continue' : 'Check Answer')
                  : currentIndex < totalCount - 1
                  ? 'Next'
                  : isSubmittingMode
                  ? 'Completing...'
                  : 'Finish Mode →'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ComponentAttemptFeedback({
  component,
  answers,
  onReveal,
}: {
  component: LearningComponent;
  answers: Array<{ id: string; value: string }>;
  onReveal: () => void;
}) {
  const attempt = component.attempt;
  const feedback = attempt?.feedback;
  const fieldResults = Array.isArray(feedback?.fieldResults) ? feedback.fieldResults : [];
  const canReveal = attempt?.status === 'exhausted' && feedback?.canRevealAnswer === true;
  const message = typeof feedback?.message === 'string'
    ? feedback.message
    : typeof feedback?.scoreMessage === 'string'
      ? feedback.scoreMessage
      : null;
  const hint = typeof feedback?.hint === 'string' ? feedback.hint : null;

  if (!attempt || (!feedback && !answers.length)) return null;

  const successful = component.isComplete || Boolean(attempt.completedAt);
  return (
    <section className={`rounded-[14px] border p-4 text-sm ${successful ? 'border-emerald-200 bg-emerald-50' : attempt.status === 'exhausted' ? 'border-amber-200 bg-amber-50' : 'border-blue-200 bg-blue-50'}`}>
      <div className="flex items-start gap-2">
        {successful ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" /> : <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />}
        <div className="min-w-0">
          <p className="font-bold text-[#0F172A]">{component.title || 'Activity feedback'}</p>
          <p className="mt-1 text-[#475569]">Attempt {attempt.attemptNumber}{component.maxAttempts ? ` of ${component.maxAttempts}` : ''} · {attempt.status.replace('_', ' ')}</p>
          {message && <p className="mt-2 text-[#166534]">{message}</p>}
          {hint && <p className="mt-2 text-[#92400E]">Hint: {hint}</p>}
          {fieldResults.length > 0 && <ul className="mt-3 space-y-1">{fieldResults.map((result) => {
            const field = result as Record<string, unknown>;
            const textSuffix = typeof field.feedback === 'string' && field.feedback 
              ? field.feedback 
              : typeof field.hint === 'string' && field.hint 
                ? field.hint 
                : '';
            return <li key={String(field.id)} className="text-xs text-[#475569]">{field.isCorrect === true ? 'Correct' : 'Review'}{textSuffix ? `: ${textSuffix}` : ''}</li>;
          })}</ul>}
          {canReveal && !answers.length && <button type="button" onClick={onReveal} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#92400E] px-3 py-2 text-xs font-bold text-white"><Eye className="h-4 w-4" />Show Answer</button>}
          {answers.length > 0 && <div className="mt-3 rounded-lg border border-amber-200 bg-white p-3"><p className="font-bold text-amber-900">Approved answers</p>{answers.map((answer) => <p key={answer.id} className="mt-1 text-[#475569]">{answer.value}</p>)}</div>}
        </div>
      </div>
    </section>
  );
}
