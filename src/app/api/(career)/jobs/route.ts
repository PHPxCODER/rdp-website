import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const id = formData.get('id') as string;
        const title = formData.get('title') as string;
        const department = formData.get('department') as string;
        const location = formData.get('location') as string;
        const description = formData.get('description') as string;
        const requirements = formData
            .get('requirements')
            ?.toString()
            .split(',')
            .map(req => req.trim()) as string[];

        const job = await prisma.jobListing.create({
            data: {
                id,
                title,
                department,
                location,
                description,
                requirements: { set: requirements },
            },
        });

        return new Response(JSON.stringify(job), { status: 201 });
    } catch (error) {
        console.error(error);
        return new Response('Failed to create job', { status: 500 });
    }
}
