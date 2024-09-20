import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useRemoveChannel } from '@/features/channels/api/use-remove-channel';
import { useUpdateChannel } from '@/features/channels/api/use-update-channel';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useChannelId } from '@/hooks/use-channel-id';
import { useConfirm } from '@/hooks/use-confirm';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { DialogClose } from '@radix-ui/react-dialog';
import { TrashIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { toast } from 'sonner';

interface HeaderProps {
  title: string;
}

export const Header = ({ title }: HeaderProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();

  const [ConfirmDialog, confirm] = useConfirm({
    title: 'Delete channel',
    message: `Are you sure you want to delete "${title}" channel? This action cannot be undone.`,
    confirmText: 'Delete',
    isDestructive: true,
  });

  const [name, setName] = useState(title);
  const [editOpen, setEditOpen] = useState(false);

  const { data: member } = useCurrentMember({ workspaceId });
  const { mutate: updateChannel, isPending: isUpdatingChannel } =
    useUpdateChannel();
  const { mutate: removeChannel, isPending: isRemovingChannel } =
    useRemoveChannel();

  const handleEditOpen = (value: boolean) => {
    if (member?.role !== 'admin') {
      return;
    }

    setEditOpen(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, '-').toLowerCase();
    setName(value);
  };

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateChannel(
      {
        channelId,
        name,
      },
      {
        onSuccess: () => {
          toast.success('Channel updated successfully!');
          setEditOpen(false);
        },
        onError: () => {
          toast.error('Failed to update channel.');
        },
      }
    );
  };

  const handleRemove = async () => {
    const confirmedRemove = await confirm();
    if (!confirmedRemove) {
      return;
    }

    removeChannel(
      { channelId },
      {
        onSuccess: () => {
          toast.success('Channel deleted!');
          router.replace(`/workspace/${workspaceId}`);
        },
        onError: () => {
          toast.error('Failed to delete channel.');
        },
      }
    );
  };

  return (
    <>
      <ConfirmDialog />
      <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-lg font-semibold px-2 overflow-hidden w-auto"
            >
              <span className="truncate"># {title}</span>
              <FaChevronDown className="size-2.5 ml-2" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle># {title}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-y-2">
              <Dialog open={editOpen} onOpenChange={handleEditOpen}>
                <DialogTrigger asChild>
                  <div className="px-5 py-4 bg-gray-50 hover:bg-gray-100 rounded-lg border cursor-pointer">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">Channel name</p>
                      {member?.role === 'admin' && (
                        <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                          Edit
                        </p>
                      )}
                    </div>
                    <p className="text-sm"># {title}</p>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Rename this channel</DialogTitle>
                  </DialogHeader>
                  <form className="space-y-4" onSubmit={handleEdit}>
                    <Input
                      value={name}
                      disabled={isUpdatingChannel}
                      onChange={handleChange}
                      minLength={3}
                      maxLength={80}
                      placeholder="e.g. plan-budget"
                      required
                      autoFocus
                    />
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" disabled={isUpdatingChannel}>
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button disabled={isUpdatingChannel} type="submit">
                        Rename
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              {member?.role === 'admin' && (
                <Button
                  disabled={isUpdatingChannel || isRemovingChannel}
                  onClick={handleRemove}
                  className="flex items-center gap-x-2 px-5 py-5 bg-gray-50 hover:bg-gray-100 rounded-lg border cursor-pointer text-rose-600"
                >
                  <TrashIcon className="size-4" />
                  <p className="text-sm font-semibold">Delete channel</p>
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};
