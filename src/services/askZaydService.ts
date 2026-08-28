import apiClient from '@/config/ApiConfig';
import {
  AskZaydUnitContext,
  AskZaydCreateConversationResponse,
  AskZaydConversationDetailResponse,
  AskZaydTextMessageResponse,
  AskZaydAudioMessageResponse,
  AskZaydAttachmentResponse,
} from '@/types/askZayd';

export const askZaydService = {
  async getContext(unitId: string): Promise<AskZaydUnitContext> {
    const response = await apiClient.get<{ status: boolean; data: AskZaydUnitContext }>(
      `/learning/units/${unitId}/ask-zayd/context`
    );
    return response.data.data;
  },

  async createOrResumeConversation(
    unitId: string,
    launchLessonId?: string | null
  ): Promise<AskZaydCreateConversationResponse> {
    const payload: { launchLessonId?: string } = {};
    if (launchLessonId) {
      payload.launchLessonId = launchLessonId;
    }
    const response = await apiClient.post<{
      status: boolean;
      data: AskZaydCreateConversationResponse;
    }>(`/learning/units/${unitId}/ask-zayd/conversations`, payload);
    return response.data.data;
  },

  async getConversation(
    conversationId: string
  ): Promise<AskZaydConversationDetailResponse> {
    const response = await apiClient.get<{
      status: boolean;
      data: AskZaydConversationDetailResponse;
    }>(`/ask-zayd/conversations/${conversationId}`);
    return response.data.data;
  },

  async sendTextMessage(
    conversationId: string,
    question: string,
    attachmentIds?: string[]
  ): Promise<AskZaydTextMessageResponse> {
    const response = await apiClient.post<{
      status: boolean;
      data: AskZaydTextMessageResponse;
    }>(`/ask-zayd/conversations/${conversationId}/messages/text`, {
      question,
      attachmentIds,
    });
    return response.data.data;
  },

  async uploadAttachment(
    conversationId: string,
    file: File
  ): Promise<AskZaydAttachmentResponse> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<{
      status: boolean;
      data: AskZaydAttachmentResponse;
    }>(`/ask-zayd/conversations/${conversationId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  async sendAudioMessage(
    conversationId: string,
    file: File | Blob,
    fileName = 'voice_recording.webm'
  ): Promise<AskZaydAudioMessageResponse> {
    const formData = new FormData();
    formData.append('file', file, fileName);
    const response = await apiClient.post<{
      status: boolean;
      data: AskZaydAudioMessageResponse;
    }>(`/ask-zayd/conversations/${conversationId}/messages/audio`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },
};
