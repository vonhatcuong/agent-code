'use client';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';

export const Client = () => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(
        trpc.createAI.queryOptions({ text: 'PREFETCH' }),
    );

    return (
        <div>
            <h1>Client Component</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};
