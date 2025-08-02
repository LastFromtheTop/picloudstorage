import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
import { getResolvedPath } from '@/lib/file-utils';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const relativePath = searchParams.get('path');
  const fileName = searchParams.get('file');
  const user = searchParams.get('user');

  if (!relativePath || !fileName || !user) {
    return new NextResponse('Missing path, file, or user parameter', { status: 400 });
  }

  try {
    const resolvedDir = getResolvedPath(relativePath, user);
    const filePath = path.join(resolvedDir, fileName);

    // Check if file exists
    await fs.promises.access(filePath);

    const fileStream = fs.createReadStream(filePath);
    const contentType = mime.lookup(fileName) || 'application/octet-stream';

    return new NextResponse(fileStream as any, {
      status: 200,
      headers: { 'Content-Type': contentType },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse('File not found', { status: 404 });
  }
}
