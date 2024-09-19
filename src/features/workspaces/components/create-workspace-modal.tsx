import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { useCreateWorkspace } from '../api/use-create-workspace';
import { useCreateWorkspaceModal } from '../store/use-create-workspace-modal';

export const CreateWorkspaceModal = () => {
  const router = useRouter();
  const [open, setOpen] = useCreateWorkspaceModal();
  const [name, setName] = useState<string>('');

  const { mutate, isPending } = useCreateWorkspace();

  const handleClose = () => {
    setName('');
    setOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(
      { name },
      {
        onSuccess: (workspaceId) => {
          toast.success('Workspace created successfully!');
          router.push(`/workspace/${workspaceId}`);
          handleClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="p-0 pb-2 bg-gray-50 overflow-hidden">
        <DialogHeader className="p-4 border-border bg-white">
          <DialogTitle>Add workspace</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2 px-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
            placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
            minLength={3}
            maxLength={80}
            required
            autoFocus
          />
          <div className="flex justify-end">
            <Button disabled={isPending} type="submit">
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
