export type AskZaydLauncherPlacement =
  | 'unit_lessons'
  | 'lesson_modes'
  | 'unsupported';

export type AskZaydUnavailableReason =
  | 'no_published_documents'
  | 'unsupported_curriculum'
  | null;

export type AskZaydDecision =
  | 'grounded_guidance'
  | 'outside_unit'
  | 'anti_cheating_redirect'
  | 'unsafe_or_blocked';

export interface AskZaydUnitContext {
  unit: {
    id: string;
    courseId: string;
    title: string;
    curriculum: string | null;
  };
  launcherPlacement: AskZaydLauncherPlacement;
  available: boolean;
  unavailableReason: AskZaydUnavailableReason;
  documentCount: number;
  documentSetVersion: string | null;
}

export interface AskZaydCitation {
  chunkId: string;
  lessonTitle: string;
  pageNumber: number;
  heading: string | null;
}

export interface AskZaydAnswer {
  decision: AskZaydDecision;
  message: string;
  guidanceQuestion: string | null;
  citations: AskZaydCitation[];
}

export interface AskZaydConversationSummary {
  id: string;
  unitId: string;
  launchLessonId: string | null;
  documentSetVersion: string;
  status: 'active' | string;
  createdAt: string;
  updatedAt: string;
}

export interface AskZaydAttachment {
  id: string;
  inputType: 'image' | 'pdf' | 'audio';
  fileName: string;
  mimeType: string;
  scanStatus?: 'clean';
  extractionStatus?: 'pending' | 'completed' | 'failed';
  transcript?: string | null;
  expiresAt: string;
  deletedAt?: string | null;
  createdAt?: string;
}

export interface AskZaydMessage {
  id: string;
  sender: 'learner' | 'assistant' | 'system';
  inputType: 'text' | 'audio' | 'attachment' | string;
  content: string;
  decision: AskZaydDecision | null;
  citationsJson: string | null;
  createdAt: string;
  attachments?: AskZaydAttachment[];
}

export interface AskZaydConversation extends AskZaydConversationSummary {
  messages: AskZaydMessage[];
}

export interface AskZaydCreateConversationResponse {
  context: AskZaydUnitContext;
  conversation: AskZaydConversationSummary;
  resumed: boolean;
}

export interface AskZaydConversationDetailResponse {
  context: AskZaydUnitContext;
  conversation: AskZaydConversation;
}

export interface AskZaydTextMessageResponse {
  context: AskZaydUnitContext;
  conversationId: string;
  answer: AskZaydAnswer;
}

export interface AskZaydAudioMessageResponse {
  attachment: AskZaydAttachment;
  context: AskZaydUnitContext;
  conversationId: string;
  answer: AskZaydAnswer;
}

export interface AskZaydAttachmentResponse {
  attachment: AskZaydAttachment;
}
