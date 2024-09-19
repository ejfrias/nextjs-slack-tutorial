import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { useGetWorkspaces } from '@/features/workspaces/api/use-get-workspaces';
import { useCreateWorkspaceModal } from '@/features/workspaces/store/use-create-workspace-modal';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { LoaderCircle, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const WorkspaceSwitcher = () => {
  const router = useRouter();
  const [_open, setOpen] = useCreateWorkspaceModal();

  const workspaceId = useWorkspaceId();
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    workspaceId: workspaceId,
  });
  const initial = workspace?.name.charAt(0).toUpperCase();

  const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspaces();
  const filteredWorkspaces = workspaces?.filter(
    (workspace) => workspace._id !== workspaceId
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-8 overflow-hidden bg-[#ABABAD] hover:bg-[#ABABAD]/80 text-slate-800 font-semibold text-xl">
          {workspaceLoading ? (
            <LoaderCircle className="size-5 animate-spin shrink-0" />
          ) : (
            initial
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className="w-64">
        <DropdownMenuItem
          onClick={() => router.push(`/workspace/${workspaceId}`)}
          className="cursor-pointer flex-col justify-start items-start capitalize font-semibold"
        >
          {workspace?.name}
          <span className="text-xs text-muted-foreground font-normal">
            Active workspace
          </span>
        </DropdownMenuItem>
        {filteredWorkspaces?.length ? <DropdownMenuSeparator /> : null}
        {filteredWorkspaces?.map((filteredWorkspace) => (
          <DropdownMenuItem
            key={filteredWorkspace._id}
            onClick={() => router.push(`/workspace/${filteredWorkspace._id}`)}
            className="cursor-pointer capitalize overflow-hidden"
          >
            <div className="shrink-0 size-8 relative overflow-hidden bg-[#8D8D8D] text-white rounded-md flex items-center justify-center mr-2">
              {filteredWorkspace.name.charAt(0).toUpperCase()}
            </div>
            <div className="truncate">{filteredWorkspace?.name}</div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setOpen(true)}
          className="cursor-pointer"
        >
          <div className="size-8 relative overflow-hidden bg-[#F2F2F2] text-slate-600 rounded-md flex items-center justify-center mr-2">
            <Plus size="20" />
          </div>
          Create a new workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
