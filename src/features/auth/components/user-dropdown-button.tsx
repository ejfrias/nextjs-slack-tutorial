'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthActions } from '@convex-dev/auth/react';
import { LoaderCircle, LogOut } from 'lucide-react';
import { useCurrentUser } from '../api/use-current-user';

export const UserDropdownButton = () => {
  const { data, isLoading } = useCurrentUser();
  const { signOut } = useAuthActions();

  if (isLoading) {
    return (
      <div className="size-10 p-3 rounded-full bg-sky-500">
        <LoaderCircle className="size-4 animate-spin text-white" />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { name, image, email } = data;
  const initials = name!.charAt(0).toUpperCase();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className="rounded-md size-8 hover:opacity-80 transition">
          <AvatarImage className="rounded-md" alt={name} src={image} />
          <AvatarFallback className="rounded-md bg-sky-500 text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" side="right" className="w-60">
        <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
          <LogOut className="size-4 mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
