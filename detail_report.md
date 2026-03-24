# 3D Avatar Mode Implementation Detail

## Frontend payload expectations
- `ChatWindow` now treats `ChatEvents.CONTENT_PAYLOAD` as the single source of truth for narration. The handler in `src/pages/student/ChatWindow.tsx` keeps the `content`, `contentAudioUrl`, and `narrationVideoUrl` exactly as the backend sent them, with no hard-coded fallback videos or extra media toggles.
- When the payload includes `narrationVideoUrl`, the reading passage card and avatar layout update immediately. `ReadingPassageCard` renders the text/audio (line 1794 in `ChatWindow.tsx`) while `ChatPage` forwards the same payload through `onContentPayload` so `AvatarModeLayout` receives the video URL.
- `AvatarModeLayout` (and by extension `AvatarStage` in `src/components/3d/AvatarStage.tsx`) only wraps the `<video>` element in `rounded-2xl overflow-hidden` containers; there are no `bg-*` or `backdrop-blur-*` layers. The `<video>` flips horizontally via `className="-scale-x-100"`, uses the `compact` height rules (360px/440px), and defaults to the placeholder loop video (`'/avatar/placeholder.mp4'`) only when `narrationVideoUrl` is missing. Audio playback controls in `ChatWindow` drive `isAvatarSyncPlaying`, which toggles video playback so the 3D avatar follows the narration in tandem with the TTS/audio stream.

## Backend payload logic
- `ChatGateway` (`backend-ai-tutor-app/src/modules/chat/gateways/chat.gateway.ts`) loads topics and emits `contentPayload` through `ChatEvents.PAYLOAD`. The JSON payload is parsed into the existing `ContentPayload` DTO (`content`, optional `contentAudioUrl`, and optional `narrationVideoUrl`).
- The gateway now initializes a `Set` of demo school-category names from the new `DEMO_AVATAR_SCHOOL_NAMES` environment variable (defaulting to `demo-flow,Bave AI`). The helper `isDemoAccount(user?: User | null)` uses the authenticated user’s `schoolCategory.name` to determine whether to keep `narrationVideoUrl` in the emitted payload.
- Non-demo accounts receive the same payload minus `narrationVideoUrl`, so the frontend falls back to the looping placeholder quietly and never renders the narration video unless the backend explicitly provides it. This decision depends only on `schoolCategory`, which exists in both the MSSQL (Azure/ROW) and Postgres (Saudi) schemas, so the feature works across both regions without schema changes.

## Topic data expectations
- The three 3D avatar topics (e.g., "The True Story of a Boy and His Horn" for the American curriculum and "Someone Has to Do It!" for the Saudi curriculum) already exist in the database. The only data augmentation they need is a `narrationVideoUrl` inserted into the `payload` JSON so the backend can forward the video link to the frontend.
- Update the `payload` field of each topic with the existing `content` and `contentAudioUrl` plus the new `narrationVideoUrl` (for example, a cloud-hosted MP4 path from the `/NEW MODE/3D Avatar Mode/...` assets). No additional scripts, migrations, or new content creation is required for this change.
- Because the backend emits whatever is stored in `payload`, once the demo account receives those topics, `ChatWindow` will render the narration text/audio and the avatar video without any other wiring.

## Deployment & post-deploy actions
1. **Create a demo school** (e.g., `Demo School` with its own `schoolCategory`) and add a few student users under that school so you can test the experience end-to-end.
2. **Assign the three existing 3D avatar topics** to the demo school.
3. **Update the `payload` JSON** for each topic in both database regions (Azure/MSSQL and Saudi/Postgres) to include the correct `narrationVideoUrl`.
4. **Set `DEMO_AVATAR_SCHOOL_NAMES`** in the backend environment (e.g., `.env` or secrets) to include every `schoolCategory.name` that should see the video. The value is comma-separated and case-insensitive (`DEMO_AVATAR_SCHOOL_NAMES="demo-flow,Bave AI,My Demo School"`), so switching to a new demo school only requires adding its category name—no code changes.
5. **Restart/deploy the backend** after updating the env var so the new `Set` is rebuilt.
6. **Ensure the frontend deployment still serves the placeholder loop video** (the placeholder file remains in `public/avatar/placeholder.mp4`) and that `AvatarPage` still renders `AvatarModeLayout` only when `variant=3d`.

## Post-deploy validation
- Log in as a demo-school user, start the 3D reading mode, and confirm that `ChatEvents.CONTENT_PAYLOAD` includes `narrationVideoUrl`, the avatar video loads immediately, and the video stays flipped horizontally due to `-scale-x-100`.
- Log in as a regular (non-demo) user and confirm the backend response omits `narrationVideoUrl`, so only the looping placeholder is rendered and no video is requested from the CDN.
- Verify the backend works in both regions by switching the authenticated user’s region (Azure vs. Saudi), because the `UserRepository` already resolves the correct `DatabaseRegion` before `ChatGateway` runs.
- After every deployment, re-check that the three topics still point to the correct `narrationVideoUrl` in the database so the payload is always complete for demo accounts.
