import { Hint } from '@/components/hint';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDownIcon, ListFilter, SquarePen } from 'lucide-react';
import { useState } from 'react';
import { Doc } from '../../../../../convex/_generated/dataModel';
import { InviteModal } from './invite-modal';
import { PreferencesModal } from './preferences-modal';

interface WorkspaceHeaderProps {
  workspace: Doc<'workspaces'>;
  isAdmin: boolean;
}

export const WorkspaceHeader = ({
  workspace,
  isAdmin,
}: WorkspaceHeaderProps) => {
  const [preferencesOpen, preferencesSetOpen] = useState(false);
  const [inviteOpen, inviteSetOpen] = useState(false);

  return (
    <>
      <InviteModal
        open={inviteOpen}
        setOpen={inviteSetOpen}
        name={workspace.name}
        joinCode={workspace.joinCode}
      />
      <PreferencesModal
        open={preferencesOpen}
        setOpen={preferencesSetOpen}
        initialValue={workspace.name}
      />
      <div className="flex items-center justify-between px-4 pt-1.5 h-[49px] gap=0.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="transparent"
              size="sm"
              className="font-semibold text-lg w-auto p-1.5 overflow-hidden"
            >
              <span className="truncate">{workspace.name}</span>
              <ChevronDownIcon className="size-4 ml-1 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="start" className="w-80">
            <DropdownMenuItem className="cursor-pointer capitalize">
              <div className="size-8 relative overflow-hidden bg-[#616061] text-white font-semibold text-xl rounded-md flex items-center justify-center shrink-0 mr-2">
                {workspace.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col items-start">
                <p className="font-bold">{workspace.name}</p>
                <p className="text-xs text-muted-foreground">
                  Active workspace
                </p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {isAdmin && (
              <>
                <DropdownMenuItem
                  className="cursor-pointer font-medium py-2"
                  onClick={() => inviteSetOpen(true)}
                >
                  Invite people to {workspace.name} workspace
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer font-medium py-2"
                  onClick={() => preferencesSetOpen(true)}
                >
                  Preferences
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center gap-0.5">
          <Hint label="Filter" side="top">
            <Button variant="transparent" size="iconSm">
              <ListFilter className="size-4" />
            </Button>
          </Hint>
          <Hint label="New message" side="top">
            <Button variant="transparent" size="iconSm">
              <SquarePen className="size-4" />
            </Button>
          </Hint>
        </div>
      </div>
    </>
  );
};
