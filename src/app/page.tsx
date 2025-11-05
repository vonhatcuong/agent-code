import { Client } from './client';
import { Suspense } from 'react';

const Page = async () => {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                    <p className="text-muted-foreground">Đang tải...</p>
                </div>
            </div>
        }>
            <Client />
        </Suspense>
    );
};

export default Page;
