import { prisma } from "./lib/db";

async function main() {
  // 1. Change email from maddyclickz24@gmail.com to itsmadhankumar24@gmail.com
  const existingUser = await prisma.user.findUnique({
    where: { email: "maddyclickz24@gmail.com" },
  });

  if (existingUser) {
    await prisma.user.update({
      where: { email: "maddyclickz24@gmail.com" },
      data: { email: "itsmadhankumar24@gmail.com" },
    });
    console.log("Updated email from maddyclickz24@gmail.com to itsmadhankumar24@gmail.com");
  } else {
    console.log("User maddyclickz24@gmail.com not found. Maybe already updated?");
  }

  // 2. Give admin access to itsmadhankumar24@gmail.com
  const user1 = await prisma.user.findUnique({
    where: { email: "itsmadhankumar24@gmail.com" },
  });

  if (user1) {
    await prisma.user.update({
      where: { email: "itsmadhankumar24@gmail.com" },
      data: { role: "admin" },
    });
    console.log("Granted admin role to itsmadhankumar24@gmail.com");
  } else {
    console.log("User itsmadhankumar24@gmail.com does not exist in DB yet.");
  }

  // 3. Give admin access to devmadhan24@gmail.com
  const user2 = await prisma.user.findUnique({
    where: { email: "devmadhan24@gmail.com" },
  });

  if (user2) {
    await prisma.user.update({
      where: { email: "devmadhan24@gmail.com" },
      data: { role: "admin" },
    });
    console.log("Granted admin role to devmadhan24@gmail.com");
  } else {
    console.log("User devmadhan24@gmail.com does not exist in DB yet.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
