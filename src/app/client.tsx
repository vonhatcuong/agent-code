'use client';

import { useState } from 'react';
import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';
import { ImageUpload } from '@/components/image-upload';
import { PromptDisplay } from '@/components/prompt-display';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sparkles, History, ArrowRight } from 'lucide-react';

export const Client = () => {
    const trpc = useTRPC();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedPrompt, setGeneratedPrompt] = useState<any>(null);

    // Fetch recent prompts
    const { data: recentPrompts } = useQuery(
        trpc.getVideoPrompts.queryOptions({ limit: 5 }),
    );

    const handleImageSelect = (file: File, preview: string) => {
        setSelectedFile(file);
        setPreviewUrl(preview);
        setGeneratedPrompt(null); // Reset previous prompt
    };

    const handleClear = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setGeneratedPrompt(null);
    };

    const handleGeneratePrompt = async () => {
        if (!selectedFile || !previewUrl) return;

        setIsGenerating(true);
        try {
            // In a real app, you would upload to a cloud storage (S3, Cloudinary, etc.)
            // For demo, we'll use the base64 preview URL
            const imageData = {
                imageUrl: previewUrl,
                filename: selectedFile.name,
                mimeType: selectedFile.type,
                size: selectedFile.size,
            };

            const result = await trpc.analyzeImageAndGeneratePrompt.mutate(imageData);
            setGeneratedPrompt(result);
        } catch (error) {
            console.error('Error generating prompt:', error);
            alert('Có lỗi xảy ra khi tạo prompt. Vui lòng thử lại!');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="mb-4 flex items-center justify-center gap-2">
                        <Sparkles className="h-8 w-8 text-primary" />
                        <h1 className="text-4xl font-bold tracking-tight">
                            Image to Video Prompt Builder
                        </h1>
                    </div>
                    <p className="text-lg text-muted-foreground">
                        Biến ảnh của bạn thành video AI với các prompt chuyên nghiệp
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Left Column - Upload & Generate */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Bước 1: Upload Ảnh</CardTitle>
                                <CardDescription>
                                    Chọn ảnh bạn muốn chuyển thành video
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ImageUpload
                                    onImageSelect={handleImageSelect}
                                    onClear={handleClear}
                                    isLoading={isGenerating}
                                />

                                {selectedFile && !generatedPrompt && (
                                    <div className="mt-4 flex items-center justify-between rounded-lg border bg-muted/50 p-4">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">
                                                {selectedFile.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {(selectedFile.size / 1024).toFixed(2)} KB
                                            </p>
                                        </div>
                                        <Button
                                            onClick={handleGeneratePrompt}
                                            disabled={isGenerating}
                                            size="lg"
                                        >
                                            {isGenerating ? (
                                                'Đang tạo...'
                                            ) : (
                                                <>
                                                    Tạo Prompt
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Recent Prompts */}
                        {recentPrompts && recentPrompts.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <History className="h-5 w-5" />
                                        Prompts Gần Đây
                                    </CardTitle>
                                    <CardDescription>
                                        Các prompt bạn đã tạo trước đó
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {recentPrompts.map((prompt, index) => (
                                            <div
                                                key={prompt.id}
                                                className="cursor-pointer rounded-lg border p-3 transition-colors hover:bg-muted/50"
                                                onClick={() => setGeneratedPrompt(prompt)}
                                            >
                                                <div className="flex gap-3">
                                                    <img
                                                        src={prompt.image.url}
                                                        alt={prompt.image.filename}
                                                        className="h-16 w-16 rounded object-cover"
                                                    />
                                                    <div className="flex-1 space-y-1">
                                                        <p className="line-clamp-2 text-sm font-medium">
                                                            {prompt.prompt}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {new Date(
                                                                prompt.createdAt,
                                                            ).toLocaleDateString('vi-VN')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column - Generated Prompt */}
                    <div className="space-y-6">
                        {generatedPrompt ? (
                            <PromptDisplay promptData={generatedPrompt} />
                        ) : (
                            <Card className="border-dashed">
                                <CardContent className="flex min-h-[400px] items-center justify-center p-6">
                                    <div className="text-center">
                                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                                            <Sparkles className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Upload ảnh và click "Tạo Prompt" để bắt đầu
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-12">
                    <Separator className="mb-6" />
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="text-center">
                            <h3 className="mb-2 font-semibold">🎬 Công cụ AI Video</h3>
                            <p className="text-sm text-muted-foreground">
                                Sử dụng với Runway Gen-3, Pika Labs, Luma Dream Machine, và nhiều
                                công cụ khác
                            </p>
                        </div>
                        <div className="text-center">
                            <h3 className="mb-2 font-semibold">⚡ Nhanh & Dễ dàng</h3>
                            <p className="text-sm text-muted-foreground">
                                Tạo prompt chuyên nghiệp chỉ trong vài giây với AI phân tích thông
                                minh
                            </p>
                        </div>
                        <div className="text-center">
                            <h3 className="mb-2 font-semibold">💾 Lưu trữ</h3>
                            <p className="text-sm text-muted-foreground">
                                Tất cả prompts được lưu lại để bạn có thể sử dụng lại bất cứ lúc
                                nào
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
