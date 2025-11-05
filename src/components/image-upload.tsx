'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
    onImageSelect: (file: File, previewUrl: string) => void;
    onClear?: () => void;
    isLoading?: boolean;
    className?: string;
}

export function ImageUpload({
    onImageSelect,
    onClear,
    isLoading = false,
    className,
}: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = useCallback(
        (file: File) => {
            if (!file.type.startsWith('image/')) {
                alert('Vui lòng chỉ upload file ảnh!');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const previewUrl = reader.result as string;
                setPreview(previewUrl);
                onImageSelect(file, previewUrl);
            };
            reader.readAsDataURL(file);
        },
        [onImageSelect],
    );

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsDragging(false);

            const file = e.dataTransfer.files[0];
            if (file) {
                handleFileChange(file);
            }
        },
        [handleFileChange],
    );

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleClear = useCallback(() => {
        setPreview(null);
        onClear?.();
    }, [onClear]);

    return (
        <Card className={cn('relative overflow-hidden', className)}>
            <CardContent className="p-6">
                {!preview ? (
                    <div
                        className={cn(
                            'flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors',
                            isDragging
                                ? 'border-primary bg-primary/5'
                                : 'border-muted-foreground/25 hover:border-primary/50',
                            'min-h-[300px] cursor-pointer',
                        )}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onClick={() => document.getElementById('file-input')?.click()}
                    >
                        <input
                            id="file-input"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileChange(file);
                            }}
                        />
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="rounded-full bg-primary/10 p-4">
                                <Upload className="h-8 w-8 text-primary" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-medium">
                                    Kéo thả ảnh vào đây hoặc click để chọn
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Hỗ trợ: JPG, PNG, GIF, WebP (tối đa 10MB)
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="relative">
                        <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                            <img
                                src={preview}
                                alt="Preview"
                                className="h-full w-full object-contain"
                            />
                            {isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                    <div className="flex flex-col items-center gap-2 text-white">
                                        <Loader2 className="h-8 w-8 animate-spin" />
                                        <p className="text-sm">Đang phân tích ảnh...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        {!isLoading && (
                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute right-2 top-2"
                                onClick={handleClear}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
