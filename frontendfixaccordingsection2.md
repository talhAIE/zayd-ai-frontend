# Frontend Fix Plan — Alignment with Section 2 Backend

## Purpose

Bring `zayd-ai-frontend` into full alignment with the implemented Section 2 backend before client testing and deployment.

This is an implementation plan, not a replacement for backend validation. The backend remains the source of truth for visibility, ordering, locking, grading, attempt limits, completion, and answer-key protection.

## Rules the frontend must follow

1. Never create learner content in the UI when the backend returns no content. Empty activities must stay hidden or show a controlled unavailable state.
2. Render modes and components in the backend-provided `orderIndex`; do not use a fixed mode count, fixed component count, or fixed screen layout.
3. Treat `isLocked`, `status`, `isRequired`, `navigation`, `launchBehavior`, `directLaunchMode`, `canStart`, `canSubmit`, and `isComplete` as server-owned state.
4. Never rely on `isCorrect` in learner-facing options. The backend intentionally does not return answer keys. Show only feedback returned for the learner attempt.
5. Never mark a component or mode complete locally until the backend response confirms it.
6. Do not expose a generic “complete mode” button for a mode whose required components have not been completed through its supported backend workflow.
7. Keep the existing Reading, Listening, and Roleplay session flows, but consume the new backend configuration/progress fields.

## Backend contract reference

### Course response: `GET /api/v1/learning/courses`

Use:

- `curriculum`: `american` or `saudi`
- `navigation`: `lesson_list` or `unit_activity_sequence`
- `progressPct`, `progressStatus`, `isLocked`

### Unit response: `GET /api/v1/learning/courses/:courseId/units`

Use:

- `curriculum`, `navigation`
- `activityContainerLessonId` for Saudi activity routing
- `progressPct`, `status`, `isLocked`

### Lesson response: `GET /api/v1/learning/units/:unitId/lessons`

Use:

- `lessonType`
- `launchBehavior`: `modes_list` or `direct_mode`
- `directLaunchMode`
- `status`, `progressPct`, `isLocked`

### Lesson-mode response: `GET /api/v1/learning/lessons/:lessonId/modes`

Use:

- `id`, `modeKey`, `modeSource`, `orderIndex`
- `isRequired`, `isLocked`, `status`
- `speaking.requiredTurns`, `speaking.guidedSteps` when present

### Component response: `GET /api/v1/learning/lesson-modes/:lessonModeId/components`

Use:

- `componentType`, `content`, `options`, `matchingLeftItems`, `matchingRightItems`, `resources`
- `isRequired`, `orderIndex`, `completionRule`, `feedbackPolicy`, `maxAttempts`
- `attempt` — not `myAttempt`
- `canStart`, `canSubmit`, `isComplete`

Relevant component routes:

- `POST /learning/components/:componentId/start`
- `POST /learning/components/:componentId/attempt`
- `POST /learning/components/:componentId/submit`
- `POST /learning/components/:componentId/reveal-answer`
- `GET /learning/resources/lesson-modes/:lessonModeId`
- `POST /learning/resources/:resourceId/interact`
- `POST /learning/reflections/:componentId/submit`

## Phase 1 — Contract types and shared API layer

### Goal

Replace the old Section 1-shaped frontend types with accurate Section 2 contracts, without altering the UI design yet.

### Work

- Update `learningService.ts` interfaces to include all Course, Unit, Lesson, LessonMode, Component, ComponentAttempt, Resource, and reflection fields returned by the backend.
- Replace `myAttempt` with `attempt` everywhere.
- Add typed request/response helpers for component start, save, submit, answer reveal, resource interaction, reflection submit, direct project, and direct assessment workflows.
- Make nullable backend fields nullable in TypeScript (`description`, `content`, `legacyTopicId`, `contentId`, and `attempt`).
- Remove `any` from the new Section 2 learning interfaces where practical.
- Ensure API helpers return the inner backend DTO correctly, for example `response.data.data.component` for a component attempt response.

### Acceptance criteria

- No Section 2 screen reads `myAttempt`.
- Course/unit/lesson types include navigation and direct-launch fields.
- Component types include `attempt`, `canStart`, `canSubmit`, `isComplete`, `resources`, and matching item fields.
- No answer-key field is added to learner types.

## Phase 2 — Curriculum-aware navigation and optional content — Complete

### Goal

Implement the backend’s American and Saudi navigation behavior, including optional Unit Overview, Project, and Assessment items.

### Work

- Use `course.navigation` and `unit.navigation` rather than assumptions based on screen names.
- American (`lesson_list`): show the content-backed Unit Overview when it exists, standard lesson cards, and only published/returned Project or Assessment cards.
- Saudi (`unit_activity_sequence`): use `activityContainerLessonId` and open its ordered mode sequence. Do not show artificial separate lesson cards.
- Remove the permanently rendered Unit Overview card when no overview content is returned.
- Route a `direct_mode` lesson directly through `directLaunchMode`; do not show a mode list first.
- Remove hard-coded totals such as “2 of 5 modules completed.”
- Preserve backend-provided order and lock state exactly.

### Acceptance criteria

- Saudi Grade 7 Unit 1 displays Unit Overview followed by its activity sequence, without separate lesson cards.
- American courses display only available Overview, Project, and Assessment content.
- A hidden/unpublished/empty backend activity never produces a frontend card.

### Implemented

- Saudi units now route through `activityContainerLessonId` and never expose the internal container as a separate lesson card.
- American unit cards are rendered exactly in the backend-provided lesson order; no artificial Unit Overview is created.
- Unit Overview, Project, and Assessment cards are present only when the backend returns their published lesson records.
- `direct_mode` lessons route directly to `directLaunchMode`; normal lessons retain their ordered mode list.
- Course and unit progress labels no longer use fixed completion totals.

## Phase 3 — Content-backed Unit Overview and activity launcher

### Goal

Replace hard-coded Unit Overview curriculum content and completion shortcuts with API-driven content.

### Work

- Remove all fixed fraction/relative-pronoun text from `unit-overview.tsx`.
- Render the Unit Overview lesson mode(s) using the normal component/mode player and content returned by the backend.
- Do not call the complete-mode or complete-lesson endpoint merely because the learner clicked Continue.
- Only advance after the actual overview completion rule is satisfied and the backend responds with completion.
- Create one shared “open mode” routing function that routes by `modeSource`, `modeKey`, and current route context.
- Use this launcher from Unit Overview, lesson lists, unit activity sequence, and post-completion navigation.

### Acceptance criteria

- Grade 7 Unit 1 uses its stored Saudi Unit Overview content.
- Clicking Continue cannot skip required overview components.
- The next activity is chosen from the refreshed backend sequence and lock state.

## Phase 4 — Complete dynamic component renderer coverage

### Goal

Render all 13 supported backend component types from backend data, in any valid order and count.

### Required component types

1. `text`
2. `text_variation`
3. `media`
4. `flashcards`
5. `mcq`
6. `dropdown`
7. `fill_in_the_blank`
8. `match_column`
9. `true_false`
10. `open_input`
11. `writing_table`
12. `resource`
13. `reflection`

### Work

- Replace the `default` renderer fallback with an explicit unsupported-component state. It must not display invented learner content.
- Add a grouped `fill_in_the_blank` renderer for Vocabulary writing practice, including per-field input, hints, feedback, retries, and the group grade action.
- Add `writing_table` for Close Read and writing workflows, using the backend content/configuration structure.
- Add a Resource renderer with the backend `resources` list, metadata, completion state, and open/download controls.
- Add a Reflection renderer based on backend-defined reflection fields.
- Make Flashcards submit/record their completion through the supported backend component flow instead of local state only.
- Render `text` and `text_variation` separately where their payload presentations differ.
- Remove all fallback flashcards, fallback MCQ choices, and fallback dropdown rows/options.

### Acceptance criteria

- Every component in `FRONTEND-COMPONENT-CATALOG-001` renders using a dedicated supported renderer.
- Grade 7 Vocabulary `fill_in_the_blank` and Close Read `writing_table` are usable.
- Components display only API content and maintain returned `orderIndex`.

## Phase 5 — Attempt lifecycle, feedback, retries, and answer reveal

### Goal

Make the UI accurately follow the backend attempt lifecycle.

### Work

- Keep the latest returned `component` after start/save/submit and update its `attempt`, `canSubmit`, and `isComplete` state.
- A submission with `attempt.status = submitted` is not complete and must allow the permitted retry.
- An `exhausted` attempt must display the backend feedback and only show Show Answer when the backend permits it.
- Call `POST /learning/components/:componentId/reveal-answer` only after exhaustion; render only returned approved answers.
- Display sanitized backend feedback according to `feedbackPolicy`; do not calculate correct answers in the browser.
- Respect `maxAttempts`, `completionRule`, and `canStart`/`canSubmit`.
- Use the returned attempt response to restore a learner who refreshes the page.
- Ensure local progress counts only `component.isComplete === true` or returned `attempt.completedAt`.

### Acceptance criteria

- A wrong Vocabulary answer can be retried until its allowed attempts are used.
- Show Answer appears only after the second incorrect attempt where configured.
- Correct/wrong feedback works without receiving answer keys in `options`.
- Refreshing the page preserves submitted/completed component state.

## Phase 6 — Mode completion, specialized activities, and progress refresh

### Goal

Prevent completion bypasses and integrate specialized backend activity endpoints.

### Work

- Disable/omit the generic Next Activity control until all required component completion conditions are met.
- Refresh components, modes, lessons, units, and course progress after backend-confirmed completion.
- Resource mode: load with `GET /learning/resources/lesson-modes/:lessonModeId`, call the resource interaction endpoint when a learner opens/downloads an item, then use returned completion state.
- Reflection mode: submit through `POST /learning/reflections/:componentId/submit`; do not use the generic component submit route.
- Wire dedicated backend routes for writing review, Unit Project, and Assessment/Quiz when those direct modes are returned.
- Respect `launchBehavior = direct_mode` instead of forcing these activities through the generic lesson-mode list/player.
- Replace local “component submitted = completed” behavior with backend-confirmed state.

### Acceptance criteria

- Learners cannot advance from a required mode until the backend marks it complete.
- Resource interactions and reflections produce correct backend progress.
- Optional Project/Assessment can open and complete using their dedicated backend contracts when published.

## Phase 7 — Reading, Listening, and configurable Speaking/Roleplay

### Goal

Keep existing legacy/AI activities working while consuming the updated Section 2 session contract.

### Work

- Extend `useModeSession` to store and return `roleplayProgress` from `mode_session_started`, streaming responses, and other session events.
- In Roleplay, remove the fixed `/15` calculation. Render `completedTurns`, `requiredTurns`, `remainingTurns`, and current guided-step information from backend `roleplayProgress`.
- Continue to let the backend decide whether a learner turn is meaningful; the frontend must not award turns itself.
- Add Listening support for the backend `transcript` stage. Display the returned transcript/retry content and allow the server’s next-stage workflow to control progression.
- Do not assume Listening has only `initial`, `question`, and `quiz` stages.
- Keep Reading’s server-owned sentence/quiz progress and handle any returned retry state without hard-coded completion.
- Verify correct navigation back to the parent Saudi activity sequence after completion.

### Acceptance criteria

- Speaking displays the Grade 7 Unit 1 configured turn total, not 15.
- Listening transcript retry works after a failed quiz.
- Reading, Listening, and Roleplay session completion refreshes the correct lesson/unit sequence.

## Phase 8 — QA, accessibility, cleanup, and deployment readiness

### Goal

Verify the complete learner experience against the seeded Azure test data and make the frontend deployment-ready.

### Work

- Test every component type using `qa.section1.01` through `qa.section1.05` and `FRONTEND-COMPONENT-CATALOG-001`.
- Test Grade 7 Unit 1 with `client.g7u1.01` through `client.g7u1.04`.
- Test fresh, in-progress, completed, retry, exhausted, locked, optional, and no-content states.
- Test Saudi navigation and an American-course navigation path.
- Confirm answer keys are never displayed in network responses or UI state.
- Fix lint errors before release:
  - irregular whitespace in `TopicCompletionModal.tsx`
  - empty catch blocks in `unit-overview.tsx`
- Reduce lint warnings introduced by the new Section 2 work, particularly `any` types and missing hook dependencies.
- Split the large production bundle where practical and update Browserslist data separately from functional changes.
- Run `npm run build`, `npm run lint`, and manual end-to-end checks before deployment.

### Acceptance criteria

- `npm run build` passes.
- `npm run lint` has zero errors.
- All seeded catalog component types and Grade 7 Unit 1 activities can be completed according to backend rules.
- No hard-coded curriculum text, fake component data, or fixed completion count remains in the Section 2 learner flow.

## Recommended implementation order

Implement and verify phases strictly in this order:

1. Phase 1 — contracts
2. Phase 2 — navigation
3. Phase 3 — overview/activity launcher
4. Phase 4 — renderers
5. Phase 5 — attempts and feedback
6. Phase 6 — completion/specialized modes
7. Phase 7 — AI modes
8. Phase 8 — release QA

Do not begin a later phase when an earlier phase’s acceptance criteria are failing. This prevents the frontend from building UI behavior on an incorrect backend interpretation.
