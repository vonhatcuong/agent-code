import { getQueryClient } from '@/trpc/server';
import { trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Client } from './client';
import { Suspense } from 'react';

const Page = async () => {
    const queryClient = getQueryClient();
    await queryClient.prefetchQuery(
        trpc.createAI.queryOptions({ text: 'Cuong 1 PREFETCH' }),
    );

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<p>Loading...</p>}>
                <Client />
            </Suspense>
        </HydrationBoundary>
    );
};

export default Page;
