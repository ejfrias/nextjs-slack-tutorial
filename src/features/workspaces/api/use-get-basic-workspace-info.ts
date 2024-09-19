import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

interface useGetBasicWorkspaceInfoProps {
  workspaceId: Id<'workspaces'>;
}

export const useGetBasicWorkspaceInfo = ({
  workspaceId: workspaceId,
}: useGetBasicWorkspaceInfoProps) => {
  const data = useQuery(api.workspaces.getBasicInfoById, { workspaceId });
  const isLoading: boolean = typeof data === 'undefined';

  return { data, isLoading };
};
