import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useNewJoinCode } from '@/features/workspaces/api/use-new-join-code';
import { useConfirm } from '@/hooks/use-confirm';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { DialogClose, DialogDescription } from '@radix-ui/react-dialog';
import { CopyIcon, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';

interface InviteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  joinCode: string;
}

export const InviteModal = ({
  open,
  setOpen,
  name,
  joinCode,
}: InviteModalProps) => {
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useNewJoinCode();
  const [ConfirmDialog, confirm] = useConfirm({
    title: 'Are you sure you want to generate a new invite code?',
    message:
      'The old invite code will be invalidated and a new one will be generated.',
  });

  const handleNewJoinCode = async () => {
    const confirmed = await confirm();
    if (!confirmed) return;

    await mutate(
      { workspaceId },
      {
        onSuccess: () => {
          toast.success('New invite code generated!');
        },
        onError: () => {
          toast.error('Failed to generate a new invite code!');
        },
      }
    );
  };

  const handleCopy = async () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`;

    await navigator.clipboard.writeText(inviteLink);
    toast.success('Invite link copied!');
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite people to {name} workspace</DialogTitle>
            <DialogDescription className="text-sm">
              Use the code below to invite people to your workspace
            </DialogDescription>
          </DialogHeader>
          <div className="pt-10 pb-12 flex flex-col gap-y-4 items-center justify-center">
            <p className="text-4xl font-bold tracking-widest uppercase">
              {joinCode}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={isPending}
            >
              <CopyIcon className="size-4 mr-2" />
              Copy link
            </Button>
          </div>
          <div className="flex items-center justify-between w-full">
            <Button onClick={handleNewJoinCode} disabled={isPending}>
              <RefreshCcw className="size-4 mr-2" />
              Generate a new code
            </Button>
            <DialogClose asChild>
              <Button variant="outline" disabled={isPending}>
                Close
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
