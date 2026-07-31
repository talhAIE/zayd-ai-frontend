import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export interface ContentFilterWarningData {
  message: string;
  violationType: string;
  severity: string;
  violationCount: number;
  remainingWarnings: number;
}

export function ContentPolicyWarningModal({
  open,
  data,
  onAcknowledge
}: {
  open: boolean;
  data: ContentFilterWarningData | null;
  onAcknowledge: () => void;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        // Prevent closing the modal by clicking outside or pressing ESC
        // Only allow closing via the "I Understand" button
        if (!isOpen) {
          return;
        }
      }}
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
        {data && (
          <div className="flex flex-col gap-4 p-4 my-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-800">
                {data.message}
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-orange-200">
                <div>
                  <p className="text-xs text-gray-600 font-medium">
                    Violation Type
                  </p>
                  <p className="text-sm font-semibold text-orange-700">
                    {data.violationType}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">Severity</p>
                  <p
                    className={`text-sm font-semibold ${
                      data.severity === "High"
                        ? "text-red-600"
                        : data.severity === "Medium"
                          ? "text-orange-600"
                          : "text-yellow-600"
                    }`}
                  >
                    {data.severity}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">
                    Total Violations
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    {data.violationCount}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">
                    Warnings Remaining
                  </p>
                  <p className="text-sm font-semibold text-orange-700">
                    {data.remainingWarnings}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-2">
              <p className="text-xs text-yellow-800 flex items-start gap-2">
                <span>⚠️</span>
                <span>
                  Please review our content policy. Continued violations may
                  result in account suspension.
                </span>
              </p>
            </div>
          </div>
        )}
        <DialogFooter className="sm:justify-center">
          <Button onClick={onAcknowledge} className="w-full">
            I Understand
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
