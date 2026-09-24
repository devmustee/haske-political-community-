/**
 * Seed data — verified facts only.
 *
 * Every fact below comes directly from the platform brief's "CURRENT
 * VERIFIED PROFILE DATA" / "BIOGRAPHY" sections. Nothing here invents
 * achievements, statistics, quotes, endorsements, campaign promises, or
 * events. Where the brief gave only a category (e.g. policy pillar names,
 * program categories) rather than confirmed detail, the seeded record is
 * marked DRAFT/PROPOSED and carries placeholder copy that says so plainly,
 * per the platform's content-provenance rule (see ContentStatus).
 */
import { PrismaClient, AdminRoleName } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Haske Community...");

  // ── Admin user ──────────────────────────────────────────────────────
  const adminPasswordHash = await bcrypt.hash("Admin123!", 12);
  await prisma.user.upsert({
    where: { email: "admin@haskecommunity.ng" },
    update: {},
    create: {
      name: "Platform Admin",
      username: "admin",
      email: "admin@haskecommunity.ng",
      passwordHash: adminPasswordHash,
      emailVerified: new Date(),
      status: "ACTIVE",
      notificationPref: { create: {} },
      adminRoles: { create: { role: AdminRoleName.SUPER_ADMIN } },
    },
  });
  console.log(`Admin user ready: admin@haskecommunity.ng / Admin123! (username: admin)`);

  // ── Official Haske account ─────────────────────────────────────────
  const hasePasswordHash = await bcrypt.hash("Haske123!", 12);
  const haske = await prisma.user.upsert({
    where: { email: "office@haskecommunity.ng" },
    update: {},
    create: {
      name: "Abdulrahman Bashir Haske",
      username: "AbdulrahmanHaske",
      email: "office@haskecommunity.ng",
      passwordHash: hasePasswordHash,
      emailVerified: new Date(),
      verification: "OFFICIAL",
      bio: "Businessman, entrepreneur, philanthropist and politician from Adamawa State. APM Governorship Candidate for Adamawa State, 2027.",
      location: "Yola, Adamawa State",
      status: "ACTIVE",
      notificationPref: { create: {} },
      adminRoles: { create: { role: AdminRoleName.CONTENT_ADMIN } },
    },
  });

  const campaignTeam = await prisma.user.upsert({
    where: { email: "team@haskecommunity.ng" },
    update: {},
    create: {
      name: "Haske Campaign Team",
      username: "HaskeCampaignTeam",
      email: "team@haskecommunity.ng",
      passwordHash: await bcrypt.hash("Team1234!", 12),
      emailVerified: new Date(),
      verification: "ORGANIZATION",
      isOrganization: true,
      bio: "Official campaign team account for Abdulrahman Bashir Haske's 2027 Adamawa governorship bid.",
      status: "ACTIVE",
      notificationPref: { create: {} },
    },
  });

  // A couple of ordinary demo community members, so demo posts read as
  // genuine community content rather than campaign-authored content.
  const demoUser1 = await prisma.user.upsert({
    where: { email: "demo.fatima@example.com" },
    update: {},
    create: {
      name: "Fatima Bello",
      username: "fatima_b",
      email: "demo.fatima@example.com",
      passwordHash: await bcrypt.hash("Demo1234!", 12),
      emailVerified: new Date(),
      bio: "Small business owner, Yola. Interested in youth and women's empowerment programs.",
      location: "Yola, Adamawa",
      status: "ACTIVE",
      notificationPref: { create: {} },
    },
  });

  const demoUser2 = await prisma.user.upsert({
    where: { email: "demo.ibrahim@example.com" },
    update: {},
    create: {
      name: "Ibrahim Sanda",
      username: "ibrahim_s",
      email: "demo.ibrahim@example.com",
      passwordHash: await bcrypt.hash("Demo1234!", 12),
      emailVerified: new Date(),
      bio: "Agriculture student, Mubi. Following the agribusiness agenda closely.",
      location: "Mubi, Adamawa",
      status: "ACTIVE",
      notificationPref: { create: {} },
    },
  });

  // ── Biography timeline ──────────────────────────────────────────────
  const timeline: { era: string; title: string; dateLabel: string; date?: Date; description: string; order: number }[] = [
    {
      era: "EARLY_LIFE",
      title: "Early life in Adamawa",
      dateLabel: "Early life",
      description: "Abdulrahman Bashir Haske is from Adamawa State, Nigeria, with roots and background in Yola.",
      order: 1,
    },
    {
      era: "EDUCATION",
      title: "American University of Nigeria",
      dateLabel: "Education",
      description:
        "Studied Information Systems at the American University of Nigeria (AUN) in Yola, with a concentration in Security and Assurance, according to the AA&R Investment Group profile.",
      order: 2,
    },
    {
      era: "PROFESSIONAL_CAREER",
      title: "Technology, business and entrepreneurship",
      dateLabel: "Professional career",
      description:
        "Built a professional career spanning technology, business and entrepreneurship, with public profile experience in IT, software architecture, web technologies, applications, information security and assurance.",
      order: 3,
    },
    {
      era: "AGRICULTURE",
      title: "H&W Rice Company",
      dateLabel: "Agriculture",
      description:
        "Associated with a rice-processing investment in Adamawa (H&W Rice Company), an integrated operation designed to connect smallholder farmers with value-added processing and market opportunities.",
      order: 4,
    },
    {
      era: "COMMUNITY_DEVELOPMENT",
      title: "Community development and philanthropy",
      dateLabel: "Community development",
      description:
        "Public activities have included humanitarian and empowerment work spanning youth empowerment, entrepreneurship support and community development across Adamawa State.",
      order: 5,
    },
    {
      era: "POLITICAL_JOURNEY",
      title: "Governorship declaration on the APC platform",
      dateLabel: "25 April 2026",
      date: new Date("2026-04-25"),
      description:
        "Declared intention to contest the Adamawa State governorship election on the All Progressives Congress (APC) platform, at Ribadu Square in Yola.",
      order: 6,
    },
    {
      era: "POLITICAL_JOURNEY",
      title: "APC governorship primary",
      dateLabel: "2026",
      description:
        "Contested the APC governorship primary for Adamawa State, which he lost to Ahmed Galadima, according to Naija News reporting.",
      order: 7,
    },
    {
      era: "POLITICAL_JOURNEY",
      title: "Resignation from the APC",
      dateLabel: "September 2026",
      description: "Resigned from the All Progressives Congress (APC).",
      order: 8,
    },
    {
      era: "POLITICAL_JOURNEY",
      title: "Emerged as APM governorship candidate",
      dateLabel: "September 2026",
      description:
        "Joined the Allied Peoples Movement (APM) and was unveiled in Yola as the party's governorship candidate for Adamawa State ahead of the 2027 election, at an event attended by APM leaders, traditional and community leaders, youth and women's groups, and supporters from Adamawa's 21 local government areas.",
      order: 9,
    },
  ];

  await prisma.timelineEvent.deleteMany({});
  await prisma.timelineEvent.createMany({
    data: timeline.map((t) => ({ ...t, era: t.era as never })),
  });

  // ── Achievements ─────────────────────────────────────────────────────
  const hwRice = await prisma.achievement.upsert({
    where: { slug: "hw-rice-company" },
    update: {},
    create: {
      title: "H&W Rice Company",
      slug: "hw-rice-company",
      category: "AGRICULTURE",
      location: "Adamawa State",
      summary: "A rice-processing investment associated with Abdulrahman Haske, strengthening agricultural value chains.",
      description:
        "H&W Rice Company is a rice-processing investment associated with Abdulrahman Haske, designed to strengthen agricultural value chains by connecting farmers to processing and market opportunities in Adamawa State. Public reporting describes it as an integrated rice-processing operation connecting smallholder farmers with value-added processing.",
      source: "Public reporting on H&W Rice Company / Haske & Williams Company",
      contentStatus: "DOCUMENTED",
      featured: true,
      order: 1,
    },
  });

  // ── Programs (placeholders — no confirmed figures) ──────────────────
  const programSeeds = [
    {
      name: "Youth Empowerment Initiative",
      slug: "youth-empowerment-initiative",
      category: "YOUTH_EMPOWERMENT" as const,
      description:
        "The campaign has indicated youth skills, entrepreneurship, technology and employment support will be a focus area of its empowerment agenda. Full program design, eligibility and application windows will be published here once confirmed.",
    },
    {
      name: "Women's Empowerment Programme",
      slug: "womens-empowerment-programme",
      category: "WOMEN_EMPOWERMENT" as const,
      description:
        "The campaign has indicated women's entrepreneurship, skills development and cooperative support will be a focus area of its empowerment agenda. Full program design, eligibility and application windows will be published here once confirmed.",
    },
    {
      name: "Agribusiness Support Programme",
      slug: "agribusiness-support-programme",
      category: "AGRICULTURE" as const,
      description:
        "The campaign has indicated support for farmers, agricultural inputs, processing and market access will be a focus area of its agenda, building on existing agriculture investment experience. Full program design will be published here once confirmed.",
    },
    {
      name: "Education & Skills Programme",
      slug: "education-skills-programme",
      category: "EDUCATION" as const,
      description:
        "The campaign has indicated scholarships, skills training and technology education will be a focus area of its agenda. Full program design will be published here once confirmed.",
    },
    {
      name: "Humanitarian Support Programme",
      slug: "humanitarian-support-programme",
      category: "HUMANITARIAN" as const,
      description:
        "The campaign has indicated food assistance and community support for vulnerable people will be a focus area of its agenda. Full program design will be published here once confirmed.",
    },
  ];

  for (const p of programSeeds) {
    await prisma.program.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        category: p.category,
        description: p.description,
        status: "UPCOMING",
        contentStatus: "PROPOSED",
      },
    });
  }

  // ── Manifesto (historical, publicly announced — not assumed current) ─
  // Manifesto has no natural unique key, so re-seeding deletes and
  // recreates it (cascades to ManifestoPillar/ManifestoDocument) rather
  // than duplicating on every run.
  await prisma.manifesto.deleteMany({ where: { title: "A.D.A.M.A.W.A First Agenda", version: "APC-era (2026)" } });
  const manifesto = await prisma.manifesto.create({
    data: {
      title: "A.D.A.M.A.W.A First Agenda",
      version: "APC-era (2026)",
      publicationDate: new Date("2026-01-01"),
      introduction:
        "The \"A.D.A.M.A.W.A First Agenda\" was publicly announced in connection with Abdulrahman Haske's earlier governorship bid on the APC platform. It is retained here as a historical / publicly announced agenda version. It is not assumed to be the current manifesto following the move to the Allied Peoples Movement (APM) — administrators can publish an updated, current manifesto at any time.",
      isCurrent: false,
    },
  });

  // ── Policy pillars (category shells — no invented policy specifics) ──
  const pillarSeeds = [
    { name: "Agriculture & Agribusiness", slug: "agriculture-agribusiness", category: "Agriculture" },
    { name: "Education & Human Capital", slug: "education-human-capital", category: "Education" },
    { name: "Healthcare", slug: "healthcare", category: "Healthcare" },
    { name: "Youth & Economic Empowerment", slug: "youth-economic-empowerment", category: "Youth & Economy" },
    { name: "Infrastructure", slug: "infrastructure", category: "Infrastructure" },
    { name: "Security", slug: "security", category: "Security" },
    { name: "Good Governance & Accountability", slug: "good-governance-accountability", category: "Governance" },
  ];

  for (const [i, pillar] of pillarSeeds.entries()) {
    const created = await prisma.policyPillar.upsert({
      where: { slug: pillar.slug },
      update: {},
      create: {
        name: pillar.name,
        slug: pillar.slug,
        category: pillar.category,
        problem: "Full policy detail for this pillar has not yet been published by the campaign.",
        contentStatus: "DRAFT",
        order: i + 1,
      },
    });
    await prisma.manifestoPillar.upsert({
      where: { manifestoId_pillarId: { manifestoId: manifesto.id, pillarId: created.id } },
      update: {},
      create: { manifestoId: manifesto.id, pillarId: created.id, order: i + 1 },
    });
  }

  // ── Public record ────────────────────────────────────────────────────
  await prisma.publicRecordItem.deleteMany({
    where: { title: { in: ["Abdulrahman Haske emerges as APM governorship candidate", "A.D.A.M.A.W.A First Agenda (historical)"] } },
  });
  await prisma.publicRecordItem.createMany({
    data: [
      {
        title: "Abdulrahman Haske emerges as APM governorship candidate",
        type: "OFFICIAL_STATEMENT",
        publishedDate: new Date("2026-09-01"),
        version: "1.0",
        source: "Public reporting, September 2026",
        content:
          "Abdulrahman Bashir Haske resigned from the All Progressives Congress (APC) and joined the Allied Peoples Movement (APM) in September 2026, where he emerged as the party's governorship candidate for Adamawa State ahead of the 2027 election.",
      },
      {
        title: "A.D.A.M.A.W.A First Agenda (historical)",
        type: "MANIFESTO_VERSION",
        publishedDate: new Date("2026-01-01"),
        version: "APC-era (2026)",
        source: "Publicly announced campaign material, APC-era candidacy",
        content:
          "The \"A.D.A.M.A.W.A First Agenda\" was the publicly announced agenda associated with Abdulrahman Haske's earlier governorship bid on the APC platform. Retained here for the public record; not assumed to be the current APM manifesto.",
      },
    ],
  });

  // ── Media center ─────────────────────────────────────────────────────
  // Sourced from public reporting (Leadership, Naija News, TVC, Blueprint,
  // Politics Nigeria, Per Second News, Prima News — September 2026) on the
  // APM unveiling, and the live YouTube coverage of the declaration event.
  const mediaSeeds = [
    {
      title: "Haske joins APM, emerges as Adamawa governorship candidate",
      slug: "haske-joins-apm-emerges-governorship-candidate",
      category: "NEWS" as const,
      date: new Date("2026-09-12"),
      content:
        "Abdulrahman Bashir Haske resigned from the All Progressives Congress (APC) and joined the Allied Peoples Movement (APM) in September 2026, where he emerged as the party's governorship candidate for Adamawa State for the 2027 election. He was formally unveiled in Yola at an event attended by APM leaders, stakeholders, traditional and community leaders, youth and women's groups, and supporters from all 21 local government areas of the state.",
      relatedTopic: "Political journey",
      sourceUrl: "https://leadership.ng/2027-haske-resigns-from-apc-joins-apm-as-adamawa-governorship-candidate/",
      contentStatus: "THIRD_PARTY" as const,
    },
    {
      title: "\"Strengthening a movement\": Haske's APM declaration speech",
      slug: "haske-apm-declaration-speech",
      category: "SPEECH" as const,
      date: new Date("2026-09-12"),
      content:
        "At his unveiling as the APM's Adamawa governorship candidate, Haske framed the move as \"strengthening a movement dedicated to the future of Adamawa State,\" rather than a simple party switch, and pledged a government where young people have room to succeed. APM National Chairman Yusuf Mamman Dantalle endorsed Haske's alignment with the party's people-centred governance ideals, while Adamawa State APM Chair Badejo Bello described him as a bridgebuilder who understands the state's local developmental challenges.",
      relatedTopic: "Political journey",
      sourceUrl: "https://leadership.ng/2027-haske-resigns-from-apc-joins-apm-as-adamawa-governorship-candidate/",
      contentStatus: "THIRD_PARTY" as const,
    },
    {
      title: "Live coverage: Haske's declaration of intent, Ribadu Square, Yola",
      slug: "haske-declares-intention-video",
      category: "VIDEO" as const,
      date: new Date("2026-04-25"),
      content:
        "Live video coverage of Abdulrahman Haske's declaration of intent to run for Governor of Adamawa State, on the APC platform, at Ribadu Square in Yola. Watch on YouTube for the full unedited coverage.",
      relatedTopic: "Political journey",
      sourceUrl: "https://www.youtube.com/watch?v=OaVqVah6Cpc",
      featuredImage: "https://img.youtube.com/vi/OaVqVah6Cpc/hqdefault.jpg",
      contentStatus: "THIRD_PARTY" as const,
    },
  ];

  for (const item of mediaSeeds) {
    await prisma.mediaCenterItem.upsert({
      where: { slug: item.slug },
      update: item,
      create: item,
    });
  }

  // ── Site settings: mission / vision / biography / experience copy ────
  // Re-seeding refreshes these to the canonical baseline copy below —
  // hand-edits made via the admin Site Settings editor will be overwritten
  // by the next `npm run db:seed`, which is the intended behavior while
  // this baseline is still being assembled from verified sources.
  const siteSettingSeeds: { key: string; value: Record<string, unknown> }[] = [
    {
      key: "mission",
      value: {
        heading: "Our Mission",
        statement:
          "A people-centred approach to governance focused on economic empowerment, youth participation, sustainable development, agriculture, infrastructure, education, healthcare, security and accountable governance.",
        note: "These are the campaign's stated political priorities and proposed agenda — not existing government achievements.",
        priorities: [
          "People-centred governance",
          "Economic empowerment",
          "Youth participation",
          "Sustainable development",
          "Agriculture",
          "Infrastructure",
          "Education",
          "Healthcare",
          "Security",
          "Accountable governance",
        ],
      },
    },
    {
      key: "vision",
      value: {
        heading: "Our Vision",
        statement: "Building a more prosperous, inclusive and secure Adamawa.",
        note: "This phrase has been used in public statements surrounding the APM candidacy.",
        themes: [
          { title: "Prosperity", description: "Economic opportunity, agriculture, entrepreneurship and investment." },
          { title: "Inclusion", description: "Youth, women, communities and citizens participating in development." },
          { title: "Security", description: "Safer communities and stronger institutions." },
          { title: "Accountability", description: "Transparent management of public resources." },
        ],
      },
    },
    {
      key: "biography",
      value: {
        heading: "Biography",
        paragraphs: [
          "Abdulrahman Bashir Haske is a Nigerian entrepreneur, philanthropist and politician from Adamawa State.",
          "Public profiles describe him as having built his career primarily through entrepreneurship, business, community development and philanthropy before entering electoral politics.",
          "He studied Information Systems at the American University of Nigeria (AUN) in Yola, with a concentration in Security and Assurance according to the AA&R Investment Group profile, and AA&R's own leadership page lists him as pursuing an MSc in Computer Science at Nigerian Turkish Nile University, Abuja.",
          "His professional profile also identifies him as Group Executive Director at AA&R Investment Group and Executive Director at Haske & Williams Company, where he leads Northern Region operations from the Yola office.",
          "His public profile includes experience in IT, software architecture, web technologies, applications, information security and assurance.",
          "His public activities have also included entrepreneurship, agriculture, philanthropy, youth empowerment and community development.",
        ],
      },
    },
    {
      key: "experience",
      value: {
        heading: "Experience & Enterprise",
        entries: [
          {
            organization: "AA&R Investment Group",
            role: "Group Executive Director",
            description:
              "AA&R Investment Group's own leadership page identifies Abdulrahman Bashir Haske as Group Executive Director, an IT professional with a BSc in Information Systems from AUN who is pursuing an MSc in Computer Science at Nigerian Turkish Nile University, Abuja.",
          },
          {
            organization: "Haske & Williams Company",
            role: "Executive Director, Northern Region",
            description: "He is identified as Executive Director and Northern Region lead, leading operations from the Yola office.",
          },
          {
            organization: "Technology",
            role: "Software architecture & information security",
            description: "His professional profile describes experience in software architecture, web technologies, applications, information security and security and assurance.",
          },
        ],
      },
    },
  ];

  for (const setting of siteSettingSeeds) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value as never },
      create: { key: setting.key, value: setting.value as never },
    });
  }

  // ── Demo community posts (clearly marked as demo content) ────────────
  // Posts have no natural unique key either, so clear the seed accounts'
  // prior posts before recreating them to keep re-seeding idempotent.
  await prisma.post.deleteMany({ where: { authorId: { in: [haske.id, demoUser1.id, demoUser2.id] } } });
  await prisma.hashtag.updateMany({ where: { tag: "adamawa2027" }, data: { postsCount: 0 } });

  const officialPost = await prisma.post.create({
    data: {
      authorId: haske.id,
      type: "ANNOUNCEMENT",
      content:
        "Welcome to Haske Community — a public space to learn about our record, understand our agenda for Adamawa, and join the conversation. #Adamawa2027",
      contentStatus: "OFFICIAL",
    },
  });
  await prisma.postHashtag.create({
    data: {
      postId: officialPost.id,
      hashtagId: (
        await prisma.hashtag.upsert({
          where: { tag: "adamawa2027" },
          update: { postsCount: { increment: 1 } },
          create: { tag: "adamawa2027", postsCount: 1 },
        })
      ).id,
    },
  });

  await prisma.post.create({
    data: {
      authorId: demoUser1.id,
      type: "TEXT",
      content: "Looking forward to seeing more detail on the youth empowerment programs. [Demo community post]",
      contentStatus: "COMMUNITY",
      isDemoContent: true,
    },
  });

  await prisma.post.create({
    data: {
      authorId: demoUser2.id,
      type: "TEXT",
      content: "The agribusiness agenda matters a lot to farmers here in Mubi. Hoping for real market access support. [Demo community post]",
      contentStatus: "COMMUNITY",
      isDemoContent: true,
    },
  });

  console.log("Seed complete.");
  console.log(`- Achievements: ${hwRice.title}`);
  console.log(`- Programs: ${programSeeds.length} placeholders`);
  console.log(`- Manifesto: ${manifesto.title} (historical)`);
  console.log(`- Policy pillars: ${pillarSeeds.length}`);
  console.log(`- Accounts: admin, ${haske.username}, ${campaignTeam.username}, ${demoUser1.username}, ${demoUser2.username}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
