import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const services = [
    {
        name: 'Engineering Projects',
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

async function main() {
    console.log('Start seeding services...');

    for (const serviceData of services) {
        const service = await prisma.service.upsert({
            where: { name: serviceData.name },
            update: {},
            create: {
                name: serviceData.name,
                description: serviceData.description,
                isActive: true,
            },
        });

        console.log(`Upserted service: ${service.name}`);

        for (const skillName of serviceData.skills) {
            // Check if skill exists for this service to avoid duplicates if run multiple times
            // Note: Logic assumes skill names are unique per service or we simply want to ensure they exist.
            // Since Skill model doesn't have a unique constraint on [name, serviceId] (based on provided schema, only id is unique usually unless specified),
            // we need to check first to be safe, or just create.
            // Schema:
            // model Skill {
            //   id        String   @id @default(uuid())
            //   name      String
            //   serviceId String   @map("service_id")
            //   ...
            // }
            // There is no unique constraint on name+serviceId in the schema snippet provided?
            // Wait, let me check the schema again.
            // @@unique([userId, name]) is in AdminPrivilege.
            // In Skill model: @@map("skills"). No @@unique([serviceId, name]).
            // So if I just create, I might duplicate. I should findFirst with matching name and serviceId.

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
            } else {
                console.log(`  = Skill already exists: ${skillName}`);
            }
        }
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
