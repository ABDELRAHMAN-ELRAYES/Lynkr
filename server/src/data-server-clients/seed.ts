import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const services = [
    {
        name: 'Engineering Projects',
        type: 'PROJECT',
        description: 'Professional engineering services including design, analysis, and implementation for various engineering disciplines.',
        skills: [
            'CAD Design',
            'Structural Analysis',
            'Circuit Design',
            'PCB Layout',
            '3D Modeling',
            'Matlab',
            'SolidWorks',
            'AutoCAD',
            'Embedded Systems',
            'IoT Solutions'
        ]
    },
    {
        name: 'Tutoring',
        type: 'HOURLY',
        description: 'Expert tutoring sessions for students of all levels in various subjects.',
        skills: [
            'Mathematics',
            'Physics',
            'Chemistry',
            'Computer Science',
            'English Literature',
            'Calculus',
            'Statistics',
            'Biology',
            'Programming',
            'SAT Prep'
        ]
    },
    {
        name: 'Research Writing',
        type: 'PROJECT',
        description: 'Academic and professional research writing services, including thesis guidance, data analysis, and technical reporting.',
        skills: [
            'Academic Writing',
            'Thesis Writing',
            'Technical Writing',
            'Data Analysis',
            'SPSS',
            'Literature Review',
            'Proofreading',
            'Grant Writing',
            'Research Methodology',
            'Citation Formatting'
        ]
    }
];

export async function seedDatabase() {
    console.log('Start seeding services...');

    for (const serviceData of services) {
        const service = await prisma.service.upsert({
            where: { name: serviceData.name },
            update: { type: serviceData.type }, // Update type if service exists
            create: {
                name: serviceData.name,
                type: serviceData.type,
                description: serviceData.description,
                isActive: true,
            },
        });

        console.log(`Upserted service: ${service.name} (${service.type})`);

        for (const skillName of serviceData.skills) {
            const existingSkill = await prisma.skill.findFirst({
                where: {
                    name: skillName,
                    serviceId: service.id,
                },
            });

            if (!existingSkill) {
                await prisma.skill.create({
                    data: {
                        name: skillName,
                        serviceId: service.id,
                        isActive: true,
                    },
                });
                console.log(`  + Created skill: ${skillName}`);
            }
        }
    }

    // Initialize default settings if not exist
    const existingSettings = await prisma.setting.findFirst();
    if (!existingSettings) {
        await prisma.setting.create({
            data: {
                platformName: 'Lynkr',
                platformCommission: 15,
                minWithdrawal: 10,
            },
        });
        console.log('Default settings initialized');
    } else {
        console.log('Settings already exist');
    }

    console.log('Seeding finished.');
}

