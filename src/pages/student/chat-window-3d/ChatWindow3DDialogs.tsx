import { Award, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import QuestionnaireModal from "@/components/ui/QuestionaireModal";

interface BadgeInfo {
  name: string;
  description: string;
  iconUrl: string;
  pointValue: number;
}

interface ContentFilterWarningData {
  message: string;
  violationType: string;
  severity: string;
  violationCount: number;
  remainingWarnings: number;
}

interface AccountBlockedData {
  message: string;
  violationCount: number;
  accountStatus: string;
}

interface ChatWindow3DDialogsProps {
  mode: string | null;
  showReplayPopup: boolean;
  setShowReplayPopup: (open: boolean) => void;
  isCompleteDialogOpen: boolean;
  onCompleteDialogOpenChange: (open: boolean) => void;
  onEndSession: () => void;
  onResetChat: () => void;
  isResetConfirmOpen: boolean;
  setIsResetConfirmOpen: (open: boolean) => void;
  onConfirmResetChat: () => void;
  isInactiveDialogOpen: boolean;
  onInactiveDialogOpenChange: (open: boolean) => void;
  onStillThere: (isContinuing: boolean) => void;
  isBadgeModalOpen: boolean;
  setIsBadgeModalOpen: (open: boolean) => void;
  unlockedBadgeInfo: BadgeInfo | null;
  isDuplicateConnectionModalOpen: boolean;
  setIsDuplicateConnectionModalOpen: (open: boolean) => void;
  onDuplicateGoToLogin: () => void;
  onDuplicateTryAgain: () => void;
  isContentFilterWarningOpen: boolean;
  onContentFilterWarningOpenChange: (open: boolean) => void;
  contentFilterWarningData: ContentFilterWarningData | null;
  onContentFilterWarningAcknowledge: () => void;
  isQuestionnaireOpen: boolean;
  onQuestionnaireClose: () => void;
  onQuestionnaireSubmit: (answers: { [questionId: string]: number }) => void;
  mcqs: any[];
  isAccountBlockedOpen: boolean;
  onAccountBlockedOpenChange: (open: boolean) => void;
  accountBlockedData: AccountBlockedData | null;
  onLogout: () => void;
}

export default function ChatWindow3DDialogs({
  mode,
  showReplayPopup,
  setShowReplayPopup,
  isCompleteDialogOpen,
  onCompleteDialogOpenChange,
  onEndSession,
  onResetChat,
  isResetConfirmOpen,
  setIsResetConfirmOpen,
  onConfirmResetChat,
  isInactiveDialogOpen,
  onInactiveDialogOpenChange,
  onStillThere,
  isBadgeModalOpen,
  setIsBadgeModalOpen,
  unlockedBadgeInfo,
  isDuplicateConnectionModalOpen,
  setIsDuplicateConnectionModalOpen,
  onDuplicateGoToLogin,
  onDuplicateTryAgain,
  isContentFilterWarningOpen,
  onContentFilterWarningOpenChange,
  contentFilterWarningData,
  onContentFilterWarningAcknowledge,
  isQuestionnaireOpen,
  onQuestionnaireClose,
  onQuestionnaireSubmit,
  mcqs,
  isAccountBlockedOpen,
  onAccountBlockedOpenChange,
  accountBlockedData,
  onLogout,
}: ChatWindow3DDialogsProps) {
  return (
    <>
      {mode === "listening-mode" && (
        <Dialog
          open={showReplayPopup}
          onOpenChange={(open) => {
            if (!open) setShowReplayPopup(false);
          }}
        >
          <DialogContent
            onPointerDownOutside={(e) => e.preventDefault()}
            onInteractOutside={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>That's not quite right</DialogTitle>
              <DialogDescription>
                Would you like to listen to the audio again for a hint before
                you try again?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:justify-center">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowReplayPopup(false);
                }}
              >
                OK
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Dialog
        open={isCompleteDialogOpen}
        onOpenChange={onCompleteDialogOpenChange}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {mode === "listening-mode"
                ? "Practice Complete"
                : "Chat Completed"}
            </DialogTitle>
            <DialogDescription>
              {mode === "listening-mode"
                ? "Great job! You've successfully completed the listening exercise."
                : "This conversation has ended. Would you like to start over?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={onEndSession}>
              End Session
            </Button>
            <Button onClick={onResetChat}>Reset Chat</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isResetConfirmOpen} onOpenChange={setIsResetConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Chat Session?</DialogTitle>
            <DialogDescription>
              This will clear all current messages and restart the chat from
              the beginning. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsResetConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={onConfirmResetChat}>Confirm Reset</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isInactiveDialogOpen}
        onOpenChange={onInactiveDialogOpenChange}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you still there?</DialogTitle>
            <DialogDescription>
              Your session was paused due to inactivity. Do you want to
              continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => onStillThere(false)}>
              No, End Session
            </Button>
            <Button onClick={() => onStillThere(true)}>Yes, I'm Here</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isBadgeModalOpen} onOpenChange={setIsBadgeModalOpen}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center justify-center gap-2">
              <Award className="h-7 w-7 text-yellow-500" />
              Badge Unlocked!
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              Congratulations! You've earned a new badge for your progress.
            </DialogDescription>
          </DialogHeader>
          {unlockedBadgeInfo && (
            <div className="flex flex-col items-center justify-center p-4 my-4 bg-gray-50 rounded-lg">
              <img
                src={unlockedBadgeInfo.iconUrl}
                alt={unlockedBadgeInfo.name}
                className="w-24 h-24 mb-4 drop-shadow-lg"
              />
              <h3 className="text-xl font-semibold text-primary">
                {unlockedBadgeInfo.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {unlockedBadgeInfo.description}
              </p>
              <p className="text-lg font-bold text-yellow-600 mt-4">
                +{unlockedBadgeInfo.pointValue} Points
              </p>
            </div>
          )}
          <DialogFooter className="sm:justify-center">
            <Button
              onClick={() => setIsBadgeModalOpen(false)}
              className="w-full"
            >
              Claim & Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDuplicateConnectionModalOpen}
        onOpenChange={setIsDuplicateConnectionModalOpen}
      >
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-600">
              Duplicate Session Detected
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              You are already connected from another session. Please logout
              from other sessions and try again.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4 my-4 bg-red-50 rounded-lg border border-red-200">
            <div className="w-16 h-16 mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <X className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-red-700 mb-2">
              Connection Blocked
            </h3>
            <p className="text-sm text-red-600 text-center">
              Only one active session is allowed per account. Please close
              other browser tabs or devices where you're logged in.
            </p>
          </div>
          <DialogFooter className="sm:justify-center space-y-2">
            <Button
              variant="outline"
              onClick={onDuplicateGoToLogin}
              className="w-full"
            >
              Go to Login
            </Button>
            <Button onClick={onDuplicateTryAgain} className="w-full">
              Try Again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isContentFilterWarningOpen}
        onOpenChange={onContentFilterWarningOpenChange}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <AlertTriangle className="h-7 w-7" />
              Content Policy Warning
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              Your message has been flagged for policy violation.
            </DialogDescription>
          </DialogHeader>
          {contentFilterWarningData && (
            <div className="flex flex-col gap-4 p-4 my-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-800">
                  {contentFilterWarningData.message}
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-orange-200">
                  <div>
                    <p className="text-xs text-gray-600 font-medium">
                      Violation Type
                    </p>
                    <p className="text-sm font-semibold text-orange-700">
                      {contentFilterWarningData.violationType}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium">
                      Severity
                    </p>
                    <p
                      className={`text-sm font-semibold ${
                        contentFilterWarningData.severity === "High"
                          ? "text-red-600"
                          : contentFilterWarningData.severity === "Medium"
                            ? "text-orange-600"
                            : "text-yellow-600"
                      }`}
                    >
                      {contentFilterWarningData.severity}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium">
                      Total Violations
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {contentFilterWarningData.violationCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium">
                      Warnings Remaining
                    </p>
                    <p className="text-sm font-semibold text-orange-700">
                      {contentFilterWarningData.remainingWarnings}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-2">
                <p className="text-xs text-yellow-800">
                  ⚠️ Please review our content policy. Continued violations
                  may result in account suspension.
                </p>
              </div>
            </div>
          )}
          <DialogFooter className="sm:justify-center">
            <Button
              onClick={onContentFilterWarningAcknowledge}
              className="w-full"
            >
              I Understand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <QuestionnaireModal
        open={isQuestionnaireOpen}
        onClose={onQuestionnaireClose}
        onSubmit={onQuestionnaireSubmit}
        mcqs={mcqs}
      />

      <Dialog
        open={isAccountBlockedOpen}
        onOpenChange={onAccountBlockedOpenChange}
      >
        <DialogContent className="sm:max-w-md [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-7 w-7" />
              Account Blocked
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              Your account has been suspended due to policy violations.
            </DialogDescription>
          </DialogHeader>
          {accountBlockedData && (
            <div className="flex flex-col gap-4 p-4 my-4 bg-red-50 rounded-lg border border-red-200">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-800">
                  {accountBlockedData.message}
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-red-200">
                  <div>
                    <p className="text-xs text-gray-600 font-medium">
                      Total Violations
                    </p>
                    <p className="text-sm font-semibold text-red-700">
                      {accountBlockedData.violationCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium">
                      Account Status
                    </p>
                    <p className="text-sm font-semibold text-red-700 uppercase">
                      {accountBlockedData.accountStatus}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-red-100 border border-red-300 rounded p-3 mt-2">
                <p className="text-xs text-red-800 font-medium">
                  â›” Your account access has been revoked. Please contact
                  support if you believe this is an error.
                </p>
              </div>
            </div>
          )}
          <DialogFooter className="sm:justify-center">
            <Button
              onClick={onLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
