'use client';

import { useGetChannel } from '@/features/channels/api/use-get-channel';
import { useChannelId } from '@/hooks/use-channel-id';
import { LoaderCircle, TriangleAlert } from 'lucide-react';
import { ChatInput } from './components/chat-input';
import { Header } from './components/header';

const ChannelPage = () => {
  const channelId = useChannelId();
  const { data: channel, isLoading: channelLoading } = useGetChannel({
    channelId,
  });

  if (channelLoading) {
    return (
      <div className="h-full flex flex-1 flex-col items-center justify-center gap-2">
        <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="h-full flex flex-1 flex-col items-center justify-center gap-2">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Channel not found</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header title={channel.name} />
      <div className="flex-1" />
      <ChatInput />
    </div>
  );
};

export default ChannelPage;
