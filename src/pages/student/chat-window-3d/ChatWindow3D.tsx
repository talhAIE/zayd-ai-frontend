import React from "react";
import { ChevronLeft, Clock, RotateCcw, Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatWindow3DDialogs from "./ChatWindow3DDialogs";
import {
  ListeningNextButton,
  ListeningPanel,
  ListeningQuiz,
} from "./ChatWindow3DListening";
import ChatWindow3DMessages from "./ChatWindow3DMessages";
import { useChatWindow3DController } from "./useChatWindow3DController";
import { formatTime } from "./chat3d.shared";
import type { ChatWindowProps } from "./chat3d.shared";

const ChatWindow: React.FC<ChatWindowProps> = (props) => {
  const {
    accountBlockedData,
    audioDuration,
    audioProgress,
    avatarVideoSrc,
    chatCompleted,
    chatLocked,
    contentFilterWarningData,
    contentPayload,
    contentRef,
    currentMcqIndex,
    handleContentFilterWarningAcknowledge,
    handleKbAudioEnd,
    handleListeningAnswerSelect,
    handleListeningContinueToQuiz,
    handleListeningNextClick,
    handleListeningReplayAvatarVideo,
    handleLogout,
    handleQuestionnaireSubmit,
    handleResetChat,
    handleShowAssessment,
    handleStillThere,
    handleSubmit,
    isAccountBlockedOpen,
    isAvatar3D,
    isAvatar3DContext,
    isBadgeModalOpen,
    isCompleteDialogOpen,
    isContentExpanded,
    isContentFilterWarningOpen,
    isCurrentlyPlaying,
    isDuplicateConnectionModalOpen,
    isInactiveDialogOpen,
    isListeningNextDisabled,
    isListeningStepTransitioning,
    isQueationnaireOpen,
    isRecording,
    isResetConfirmOpen,
    isSessionExpired,
    isSocketConnected,
    isTranscriptExpanded,
    isWaitingForResponse,
    listeningAvatarSeed,
    listeningData,
    listeningHintText,
    listeningStage,
    loadingAudioId,
    mcqList,
    message,
    messages,
    messagesEndRef,
    mode,
    navigate,
    onContentAudioComplete,
    onShowFeedback,
    playingAudioId,
    readingHeroActive,
    recordTime,
    resetInactivityTimer,
    selectedAnswer,
    sessionTimeRemaining,
    setIsBadgeModalOpen,
    setIsContentExpanded,
    setIsDuplicateConnectionModalOpen,
    setIsQuestionnaireOpen,
    setIsResetConfirmOpen,
    setIsTranscriptExpanded,
    setMessage,
    setShowReplayPopup,
    shouldShowExpandButton,
    shouldShowListeningHint,
    shouldShowListeningIntro,
    shouldShowModeTitle,
    shouldShowTranscriptExpandButton,
    showListeningCompletionCard,
    showReplayPopup,
    startRecording,
    stopRecording,
    topicImage,
    toggleAudio,
    transcriptRef,
    unlockedBadgeInfo,
  } = useChatWindow3DController(props);
  return (
    <>
      <ChatWindow3DDialogs
        mode={mode}
        showReplayPopup={showReplayPopup}
        setShowReplayPopup={setShowReplayPopup}
        isCompleteDialogOpen={isCompleteDialogOpen}
        onCompleteDialogOpenChange={(open) => !open && navigate(-1)}
        onEndSession={() => navigate(-1)}
        onResetChat={handleResetChat}
        isResetConfirmOpen={isResetConfirmOpen}
        setIsResetConfirmOpen={setIsResetConfirmOpen}
        onConfirmResetChat={() => {
          setIsResetConfirmOpen(false);
          handleResetChat();
        }}
        isInactiveDialogOpen={isInactiveDialogOpen}
        onInactiveDialogOpenChange={(open) => !open && handleStillThere(false)}
        onStillThere={handleStillThere}
        isBadgeModalOpen={isBadgeModalOpen}
        setIsBadgeModalOpen={setIsBadgeModalOpen}
        unlockedBadgeInfo={unlockedBadgeInfo}
        isDuplicateConnectionModalOpen={isDuplicateConnectionModalOpen}
        setIsDuplicateConnectionModalOpen={setIsDuplicateConnectionModalOpen}
        onDuplicateGoToLogin={() => {
          setIsDuplicateConnectionModalOpen(false);
          navigate("/login");
        }}
        onDuplicateTryAgain={() => {
          setIsDuplicateConnectionModalOpen(false);
          window.location.reload();
        }}
        isContentFilterWarningOpen={isContentFilterWarningOpen}
        onContentFilterWarningOpenChange={(open) => {
          if (!open) {
            return;
          }
        }}
        contentFilterWarningData={contentFilterWarningData}
        onContentFilterWarningAcknowledge={handleContentFilterWarningAcknowledge}
        isQuestionnaireOpen={isQueationnaireOpen}
        onQuestionnaireClose={() => setIsQuestionnaireOpen(false)}
        onQuestionnaireSubmit={handleQuestionnaireSubmit}
        mcqs={mcqList}
        isAccountBlockedOpen={isAccountBlockedOpen}
        onAccountBlockedOpenChange={(open) => {
          if (!open) {
            return;
          }
        }}
        accountBlockedData={accountBlockedData}
        onLogout={handleLogout}
      />

      {listeningStage === "quiz" && mcqList.length > 0 && (
        <ListeningQuiz
          mcqList={mcqList}
          currentMcqIndex={currentMcqIndex}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={handleListeningAnswerSelect}
        />
      )}

      {listeningStage !== "quiz" && (
        <div
          className={`flex flex-col w-full max-w-none lg:max-w-[1000px] mx-auto bg-gray-100 rounded-xl overflow-hidden shadow-2xl ${
            mode === "listening-mode"
              ? isAvatar3DContext
                ? "h-full max-h-full lg:h-[calc(100dvh-9.5rem)] lg:max-h-[calc(100dvh-9.5rem)]"
                : "min-h-[70svh] max-h-[80svh]"
              : readingHeroActive
                ? "min-h-[calc(100dvh-340px)] max-h-[calc(100dvh-340px)] md:h-full md:max-h-full md:min-h-0"
                : `h-full max-h-full ${!isAvatar3DContext ? "lg:min-h-[74vh] lg:max-h-[74vh]" : ""}`
          }`}
        >
          {mode === "listening-mode" && (
            <header className="grid grid-cols-[auto,1fr,auto] items-center gap-3 px-4 md:px-6 py-4 border-b bg-white">
              <div className="flex items-center gap-2 justify-self-start">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(-1)}
                  className="lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(-1)}
                  className="hidden lg:inline-flex"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </div>
              <h2 className="min-w-0 truncate text-center text-base lg:text-lg font-semibold">
                Listening Mode
              </h2>
              <div className="flex items-center gap-2 justify-self-end">
                <div className="hidden lg:flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border-2 border-[#3EA4F9] bg-white text-gray-500">
                  <Clock className="h-5 w-5 text-[#3EA4F9]" />
                  <span>
                    {sessionTimeRemaining !== null
                      ? formatTime(sessionTimeRemaining)
                      : "..."}
                  </span>
                </div>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Bell className="h-5 w-5" />
                </Button>
              </div>
            </header>
          )}
          {mode !== "listening-mode" && !isAvatar3DContext && (
            <header className="flex justify-between items-center px-6 py-4 border-b bg-white">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              {shouldShowModeTitle ? (
                <h2 className="text-lg font-semibold">
                  {mode === "photo-mode"
                    ? "Photo Mode"
                    : mode === "reading-mode"
                      ? "Reading Mode"
                      : mode === "roleplay-mode"
                        ? "Roleplay Mode"
                        : mode === "debate-mode"
                          ? "Debate Mode"
                          : mode === "curriculum-mode"
                            ? "Curriculum Mode"
                            : "Chat Mode"}
                </h2>
              ) : (
                <div className="min-w-[120px]" />
              )}
              <div className="flex items-center gap-4">
                {mode === "curriculum-mode" && (
                  <Button
                    variant="outline"
                    onClick={() => setIsResetConfirmOpen(true)}
                    className="flex items-center gap-2 px-4 py-0 w-[132px] h-[40px] border-[#06CCB5] text-[#06CCB5] hover:text-[#06CCB5] hover:bg-[#06CCB5]/10 rounded-[10px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] border-[1px]"
                    style={{
                      height: "40px",
                      boxSizing: "border-box",
                    }}
                  >
                    <RotateCcw className="h-5 w-5" />
                    <span className="font-medium">Reset Chat</span>
                  </Button>
                )}
                {!isAvatar3DContext && (
                  <div className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border-2 border-[#3EA4F9] bg-white text-gray-500">
                    <Clock className="h-6 w-6 text-[#3EA4F9]" />
                    <span>
                      {sessionTimeRemaining !== null
                        ? formatTime(sessionTimeRemaining)
                        : "..."}
                    </span>
                  </div>
                )}
              </div>
            </header>
          )}

          <div className="md:hidden">
            {mode === "photo-mode" && topicImage && (
              <div className="p-4">
                <img
                  src={topicImage}
                  alt="Topic context"
                  className="w-full rounded-lg object-top object-cover max-h-48"
                />
              </div>
            )}
          </div>
          {isSessionExpired && (
            <div className="bg-yellow-500 text-white text-center p-2 text-sm font-semibold">
              You have reached your session limit.
            </div>
          )}
          {chatCompleted && !isCompleteDialogOpen && (
            <div className="bg-primary/80 backdrop-blur-sm text-white text-center p-2 text-sm font-semibold">
              This conversation has ended.
            </div>
          )}
          {mode === "listening-mode" ? (
            <ListeningPanel
              isListeningStepTransitioning={isListeningStepTransitioning}
              sessionTimeRemaining={sessionTimeRemaining}
              isAvatar3D={isAvatar3D}
              listeningAvatarSeed={listeningAvatarSeed}
              playingAudioId={playingAudioId}
              isCurrentlyPlaying={isCurrentlyPlaying}
              avatarVideoSrc={avatarVideoSrc}
              listeningData={listeningData}
              audioProgress={audioProgress}
              audioDuration={audioDuration}
              toggleAudio={toggleAudio}
              handleKbAudioEnd={handleKbAudioEnd}
              shouldShowListeningIntro={shouldShowListeningIntro}
              shouldShowListeningHint={shouldShowListeningHint}
              listeningHintText={listeningHintText}
              listeningStage={listeningStage}
              showListeningCompletionCard={showListeningCompletionCard}
              transcriptRef={transcriptRef}
              isTranscriptExpanded={isTranscriptExpanded}
              setIsTranscriptExpanded={setIsTranscriptExpanded}
              shouldShowTranscriptExpandButton={shouldShowTranscriptExpandButton}
              onContinueToQuiz={handleListeningContinueToQuiz}
              onReplayAvatarVideo={handleListeningReplayAvatarVideo}
            />
          ) : (
            <ChatWindow3DMessages
              mode={mode}
              contentPayload={contentPayload}
              contentRef={contentRef}
              isContentExpanded={isContentExpanded}
              setIsContentExpanded={setIsContentExpanded}
              shouldShowExpandButton={shouldShowExpandButton}
              playingAudioId={playingAudioId}
              loadingAudioId={loadingAudioId}
              isCurrentlyPlaying={isCurrentlyPlaying}
              toggleAudio={toggleAudio}
              onContentAudioComplete={onContentAudioComplete}
              chatLocked={chatLocked}
              messages={messages}
              messagesEndRef={messagesEndRef}
              handleShowAssessment={handleShowAssessment}
              onShowFeedback={onShowFeedback}
              resetInactivityTimer={resetInactivityTimer}
              message={message}
              setMessage={setMessage}
              isRecording={isRecording}
              recordTime={recordTime}
              chatCompleted={chatCompleted}
              isSocketConnected={isSocketConnected}
              isWaitingForResponse={isWaitingForResponse}
              handleSubmit={handleSubmit}
              stopRecording={stopRecording}
              startRecording={startRecording}
            />
          )}
        </div>
      )}
      {mode === "listening-mode" && !showListeningCompletionCard && (
        <ListeningNextButton
          listeningStage={listeningStage}
          disabled={isListeningNextDisabled}
          onClick={handleListeningNextClick}
        />
      )}
    </>
  );
};

export default React.memo(ChatWindow);
