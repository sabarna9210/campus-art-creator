import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
async function main() {
  const templatesFolder = path.join(__dirname, 'templates');
  const files = fs.readdirSync(templatesFolder).filter(f => f.endsWith('.json'));

  for (const file of files) {
    const data = JSON.parse(
      fs.readFileSync(path.join(templatesFolder, file), 'utf-8')
    );
    const name = path.basename(file, '.json');
    const thumbUrl = `/templates/thumbs/${name}.png`;

    await prisma.template.upsert({
      where: { id: data.id },
      update: {},
      create: {
        id: data.id,
        name,
        thumbUrl,
        data,
      },
    });
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());