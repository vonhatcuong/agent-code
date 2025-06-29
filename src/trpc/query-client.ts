import {
    defaultShouldDehydrateQuery,
    QueryClient,
} from '@tanstack/react-query';
import { cache } from 'react';
import superjson from 'superjson';

/**
 * Creates a new React Query client instance with custom serialization and hydration settings.
 *
 * The client uses SuperJSON for serializing and deserializing query data, sets a default query stale time of 30 seconds, and customizes dehydration to include queries with a 'pending' status.
 *
 * @returns A configured `QueryClient` instance.
 */
export function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 30 * 1000,
            },
            dehydrate: {
                serializeData: superjson.serialize,
                shouldDehydrateQuery: (query) =>
                    defaultShouldDehydrateQuery(query) ||
                    query.state.status === 'pending',
            },
            hydrate: {
                deserializeData: superjson.deserialize,
            },
        },
    });
}

export const getQueryClient = cache(makeQueryClient);
