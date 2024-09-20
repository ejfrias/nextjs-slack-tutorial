import { useParams } from 'next/navigation';
import { Id } from '../../convex/_generated/dataModel';

export const useWorkspaceId = (): Id<'workspaces'> => {
  const { workspaceId } = useParams();

  return workspaceId as Id<'workspaces'>;
};
