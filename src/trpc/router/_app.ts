import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { prisma } from '@/lib/prisma';

export const appRouter = createTRPCRouter({
    createAI: baseProcedure
        .input(
            z.object({
                text: z.string(),
            }),
        )
        .query((opts) => {
            return {
                greeting: `${opts.input.text}`,
            };
        }),

    // Image to Video Prompt procedures
    analyzeImageAndGeneratePrompt: baseProcedure
        .input(
            z.object({
                imageUrl: z.string().url(),
                filename: z.string(),
                mimeType: z.string(),
                size: z.number(),
                width: z.number().optional(),
                height: z.number().optional(),
                userId: z.number().optional(),
            }),
        )
        .mutation(async ({ input }) => {
            // Save image to database
            const image = await prisma.image.create({
                data: {
                    url: input.imageUrl,
                    filename: input.filename,
                    mimeType: input.mimeType,
                    size: input.size,
                    width: input.width,
                    height: input.height,
                    userId: input.userId,
                },
            });

            // Generate video prompt using AI analysis
            const promptData = await generateVideoPrompt(input.imageUrl);

            // Save video prompt to database
            const videoPrompt = await prisma.videoPrompt.create({
                data: {
                    imageId: image.id,
                    prompt: promptData.prompt,
                    style: promptData.style,
                    duration: promptData.duration,
                    motion: promptData.motion,
                    cameraAngle: promptData.cameraAngle,
                    description: promptData.description,
                    userId: input.userId,
                },
                include: {
                    image: true,
                },
            });

            return videoPrompt;
        }),

    getVideoPrompts: baseProcedure
        .input(
            z.object({
                userId: z.number().optional(),
                limit: z.number().min(1).max(100).default(10),
            }),
        )
        .query(async ({ input }) => {
            const prompts = await prisma.videoPrompt.findMany({
                where: input.userId ? { userId: input.userId } : {},
                include: {
                    image: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                take: input.limit,
            });

            return prompts;
        }),

    getVideoPromptById: baseProcedure
        .input(
            z.object({
                id: z.string(),
            }),
        )
        .query(async ({ input }) => {
            const prompt = await prisma.videoPrompt.findUnique({
                where: { id: input.id },
                include: {
                    image: true,
                },
            });

            return prompt;
        }),

    deleteVideoPrompt: baseProcedure
        .input(
            z.object({
                id: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            await prisma.videoPrompt.delete({
                where: { id: input.id },
            });

            return { success: true };
        }),
});

// AI-powered prompt generation function
async function generateVideoPrompt(imageUrl: string) {
    // This is a placeholder for AI analysis
    // In production, you would integrate with OpenAI Vision API, Anthropic Claude, or similar

    // For now, we'll generate a structured prompt based on common video generation patterns
    const styles = [
        'cinematic',
        'documentary',
        'dreamy',
        'energetic',
        'dramatic',
        'calm',
        'vibrant',
        'nostalgic',
    ];

    const motions = [
        'slow zoom in',
        'slow zoom out',
        'pan left to right',
        'pan right to left',
        'dolly forward',
        'dolly backward',
        'crane up',
        'crane down',
        'orbit around subject',
        'static with subtle movement',
    ];

    const cameraAngles = [
        'eye level',
        'low angle',
        'high angle',
        'birds eye view',
        'dutch angle',
        'over the shoulder',
        'close-up',
        'wide shot',
    ];

    const durations = ['3 seconds', '5 seconds', '7 seconds', '10 seconds'];

    // Generate random selections (in production, this would be AI-driven)
    const style = styles[Math.floor(Math.random() * styles.length)];
    const motion = motions[Math.floor(Math.random() * motions.length)];
    const cameraAngle = cameraAngles[Math.floor(Math.random() * cameraAngles.length)];
    const duration = durations[Math.floor(Math.random() * durations.length)];

    // Create a comprehensive prompt
    const prompt = `Create a ${style} video with ${motion} camera movement from a ${cameraAngle} perspective. The scene should have professional cinematography with smooth motion and natural lighting. Duration: ${duration}. High quality, 4K resolution, cinematic color grading.`;

    const description = `This prompt is designed to generate a video with a ${style} aesthetic using ${motion} motion and filmed from a ${cameraAngle}.`;

    return {
        prompt,
        style,
        duration,
        motion,
        cameraAngle,
        description,
    };
}

// export type definition of API
export type AppRouter = typeof appRouter;
