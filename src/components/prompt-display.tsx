'use client';

import { useState } from 'react';
import { Copy, Check, Sparkles, Clock, Video, Camera } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface VideoPromptData {
    id: string;
    prompt: string;
    style?: string | null;
    duration?: string | null;
    motion?: string | null;
    cameraAngle?: string | null;
    description?: string | null;
    createdAt: Date;
    image: {
        url: string;
        filename: string;
    };
}

interface PromptDisplayProps {
    promptData: VideoPromptData;
}

export function PromptDisplay({ promptData }: PromptDisplayProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(promptData.prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            {/* Main Prompt Card */}
            <Card className="border-2 border-primary/20">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary" />
                                Video Prompt đã được tạo
                            </CardTitle>
                            <CardDescription>
                                Sử dụng prompt này với các công cụ AI tạo video như Runway, Pika Labs, hoặc
                                Stable Video Diffusion
                            </CardDescription>
                        </div>
                        <Button onClick={handleCopy} variant="outline" size="sm">
                            {copied ? (
                                <>
                                    <Check className="mr-2 h-4 w-4" />
                                    Đã copy!
                                </>
                            ) : (
                                <>
                                    <Copy className="mr-2 h-4 w-4" />
                                    Copy Prompt
                                </>
                            )}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="rounded-lg bg-muted p-4">
                        <p className="font-mono text-sm leading-relaxed">{promptData.prompt}</p>
                    </div>

                    <Separator />

                    {/* Prompt Details */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        {promptData.style && (
                            <div className="flex items-start gap-3">
                                <div className="rounded-lg bg-primary/10 p-2">
                                    <Sparkles className="h-4 w-4 text-primary" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Phong cách
                                    </p>
                                    <Badge variant="secondary" className="capitalize">
                                        {promptData.style}
                                    </Badge>
                                </div>
                            </div>
                        )}

                        {promptData.duration && (
                            <div className="flex items-start gap-3">
                                <div className="rounded-lg bg-primary/10 p-2">
                                    <Clock className="h-4 w-4 text-primary" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Thời lượng
                                    </p>
                                    <Badge variant="secondary">{promptData.duration}</Badge>
                                </div>
                            </div>
                        )}

                        {promptData.motion && (
                            <div className="flex items-start gap-3">
                                <div className="rounded-lg bg-primary/10 p-2">
                                    <Video className="h-4 w-4 text-primary" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Chuyển động
                                    </p>
                                    <Badge variant="secondary" className="capitalize">
                                        {promptData.motion}
                                    </Badge>
                                </div>
                            </div>
                        )}

                        {promptData.cameraAngle && (
                            <div className="flex items-start gap-3">
                                <div className="rounded-lg bg-primary/10 p-2">
                                    <Camera className="h-4 w-4 text-primary" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Góc camera
                                    </p>
                                    <Badge variant="secondary" className="capitalize">
                                        {promptData.cameraAngle}
                                    </Badge>
                                </div>
                            </div>
                        )}
                    </div>

                    {promptData.description && (
                        <>
                            <Separator />
                            <div className="space-y-2">
                                <p className="text-sm font-medium">Mô tả:</p>
                                <p className="text-sm text-muted-foreground">
                                    {promptData.description}
                                </p>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Usage Tips */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Hướng dẫn sử dụng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                        <p className="font-medium">Bước 1:</p>
                        <p className="text-muted-foreground">
                            Click nút "Copy Prompt" để sao chép prompt vào clipboard
                        </p>
                    </div>
                    <div className="space-y-2 text-sm">
                        <p className="font-medium">Bước 2:</p>
                        <p className="text-muted-foreground">
                            Mở công cụ AI tạo video của bạn (Runway Gen-3, Pika 1.5, Luma Dream Machine, etc.)
                        </p>
                    </div>
                    <div className="space-y-2 text-sm">
                        <p className="font-medium">Bước 3:</p>
                        <p className="text-muted-foreground">
                            Upload ảnh gốc và paste prompt đã copy vào ô text prompt
                        </p>
                    </div>
                    <div className="space-y-2 text-sm">
                        <p className="font-medium">Bước 4:</p>
                        <p className="text-muted-foreground">
                            Điều chỉnh các thông số nếu cần và bắt đầu tạo video!
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
