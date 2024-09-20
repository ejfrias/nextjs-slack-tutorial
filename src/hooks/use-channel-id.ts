import { useParams } from 'next/navigation';
import { Id } from '../../convex/_generated/dataModel';

export const useChannelId = (): Id<'channels'> => {
  const { channelId } = useParams();

  return channelId as Id<'channels'>;
};
