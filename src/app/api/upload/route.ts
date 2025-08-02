import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getResolvedPath } from '@/lib/file-utils';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const files = formData.getAll('files') as File[];
        const relativePath = formData.get('path') as string;

        if (!files.length || !relativePath) {
            return NextResponse.json({ error: 'Missing files or path' }, { status: 400 });
        }
        
        const uploadDir = getResolvedPath(relativePath);
        await fs.mkdir(uploadDir, { recursive: true });

        for (const file of files) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const filePath = path.join(uploadDir, file.name);
            await fs.writeFile(filePath, buffer);
        }

        revalidatePath('/');
        return NextResponse.json({ success: true, message: `${files.length} files uploaded.` });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Failed to upload files.' }, { status: 500 });
    }
}
