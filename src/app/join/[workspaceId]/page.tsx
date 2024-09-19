'use client';

import { Button } from '@/components/ui/button';
import { useGetBasicWorkspaceInfo } from '@/features/workspaces/api/use-get-basic-workspace-info';
import { useJoinWorkspace } from '@/features/workspaces/api/use-join-workspace';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { cn } from '@/lib/utils';
import { LoaderCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import VerificationInput from 'react-verification-input';
import { toast } from 'sonner';

const JoinPage = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useJoinWorkspace();
  const { data: workspace, isLoading } = useGetBasicWorkspaceInfo({
    workspaceId,
  });
  const isMember = useMemo(() => workspace?.isMember, [workspace?.isMember]);

  useEffect(() => {
    if (isMember) {
      router.replace(`/workspace/${workspaceId}`);
    }
  }, [isMember, router, workspaceId]);

  const handleComplete = (value: string) => {
    mutate(
      { workspaceId, joinCode: value },
      {
        onSuccess: (workspaceId) => {
          toast.success('Successfully joined workspace');
          router.replace(`/workspace/${workspaceId}`);
        },
        onError: () => {
          toast.error('Failed to join workspace');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md">
      <Image src="/logo.webp" alt="Logo" width={80} height={80} />
      <div className="flex flex-col gap-y-4 items-center justify center max-w-md my-2">
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <h1 className="text-2xl font-bold">
            Join {workspace?.name} workspace
          </h1>
          <p className="text-md text-muted-foreground">
            Enter the workspace code to join
          </p>
        </div>
        <VerificationInput
          onComplete={handleComplete}
          classNames={{
            container: cn(
              'flex gap-x-2',
              isPending && 'opacity-50 cursor-not-allowed'
            ),
            character:
              'uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-500',
            characterInactive: 'bg-muted',
            characterSelected: 'bg-white text-black',
            characterFilled: 'bg-white text-black',
          }}
          length={6}
          autoFocus
        />
      </div>
      <div className="flex gap-x-4">
        <Button variant="outline" size="lg" disabled={isPending} asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
};

export default JoinPage;
