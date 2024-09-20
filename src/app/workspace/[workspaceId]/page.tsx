'use client';

import { useGetChannels } from '@/features/channels/api/use-get-channels';
import { useCreateChannelModal } from '@/features/channels/store/use-create-channel-modal';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { LoaderCircle, TriangleAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

const WorkspacePage = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [open, setOpen] = useCreateChannelModal();

  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    workspaceId,
  });
  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  });

  const channelId = useMemo(() => {
    return channels?.[0]?._id;
  }, [channels]);
  const isAdmin = useMemo(() => member?.role === 'admin', [member?.role]);

  useEffect(() => {
    if (
      workspaceLoading ||
      channelsLoading ||
      !workspace ||
      memberLoading ||
      !member
    ) {
      return;
    }
    if (typeof channelId !== 'undefined') {
      router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    } else if (!open && isAdmin) {
      setOpen(true);
    }
  }, [
    channelId,
    member,
    isAdmin,
    workspace,
    workspaceId,
    workspaceLoading,
    channelsLoading,
    memberLoading,
    open,
    setOpen,
    router,
  ]);

  if (workspaceLoading || channelsLoading || memberLoading) {
    return (
      <div className="h-full flex flex-1 flex-col items-center justify-center gap-2">
        <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className="h-full flex flex-1 flex-col items-center justify-center gap-2">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Workspace not found
        </span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-1 flex-col items-center justify-center gap-2">
      <TriangleAlert className="size-6 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">No channel found</span>
    </div>
  );
};

export default WorkspacePage;
