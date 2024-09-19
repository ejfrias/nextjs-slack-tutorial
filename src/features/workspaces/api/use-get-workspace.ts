import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

interface useGetWorkspaceProps {
  workspaceId: Id<'workspaces'>;
}

export const useGetWorkspace = ({
  workspaceId: workspaceId,
}: useGetWorkspaceProps) => {
  const data = useQuery(api.workspaces.getById, { workspaceId });
  const isLoading: boolean = typeof data === 'undefined';

  return { data, isLoading };
};
