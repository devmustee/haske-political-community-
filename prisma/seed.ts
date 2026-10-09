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
import { isLocalDatabase, passwordFields } from "./credentials";

const prisma = new PrismaClient();

/**
 * Deterministic, generated (non-photographic) avatar for fictional demo
 * community accounts — never used for real people/accounts.
 */
function demoAvatar(seed: string): string {
  return `https://api.dicebear.com/9.x/personas/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3a4,c7f0d8,ffd699,fbe7a1,d1d4f9`;
}

async function main() {
  console.log("Seeding Haske Community...");

  // ── Accounts ─────────────────────────────────────────────────────────
  // Passwords come from SEED_*_PASSWORD env vars (see .env.example and
  // prisma/credentials.ts); none are stored in this file.

  // ── Admin user ──────────────────────────────────────────────────────
  const adminEmail = "admin@haskecommunity.ng";
  const adminPassword = await passwordFields(prisma, adminEmail, "SEED_ADMIN_PASSWORD");
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: adminPassword,
    create: {
      name: "Platform Administrator",
      username: "admin",
      email: adminEmail,
      ...adminPassword,
      emailVerified: new Date(),
      status: "ACTIVE",
      verification: "ORGANIZATION",
      notificationPref: { create: {} },
      adminRoles: { create: { role: AdminRoleName.SUPER_ADMIN } },
    },
  });
  console.log(`Admin user ready: ${adminEmail} (username: admin)`);

  // ── Official Haske account ─────────────────────────────────────────
  const haskeEmail = "office@haskecommunity.ng";
  const haskePassword = await passwordFields(prisma, haskeEmail, "SEED_HASKE_PASSWORD");
  const haske = await prisma.user.upsert({
    where: { email: haskeEmail },
    update: {
      ...haskePassword,
      avatarUrl: "/brand/portrait-haske-traditional.png",
    },
    create: {
      name: "Abdulrahman Bashir Haske",
      username: "AbdulrahmanHaske",
      email: haskeEmail,
      ...haskePassword,
      emailVerified: new Date(),
      verification: "OFFICIAL",
      bio: "Businessman, entrepreneur, philanthropist, and APM Governorship Candidate for Adamawa State 2027.",
      location: "Yola, Adamawa State",
      avatarUrl: "/brand/portrait-haske-traditional.png",
      status: "ACTIVE",
      notificationPref: { create: {} },
      adminRoles: {
        create: [
          { role: AdminRoleName.SUPER_ADMIN },
          { role: AdminRoleName.CONTENT_ADMIN },
        ],
      },
    },
  });
  await prisma.adminRole.upsert({
    where: { userId_role: { userId: haske.id, role: AdminRoleName.SUPER_ADMIN } },
    update: {},
    create: { userId: haske.id, role: AdminRoleName.SUPER_ADMIN },
  });

  // ── Localhost testing accounts (never created on a remote database) ──
  if (isLocalDatabase()) {
    const testAdminEmail = "testadmin@haske.local";
    const testAdminPassword = await passwordFields(prisma, testAdminEmail, "SEED_TEST_ADMIN_PASSWORD");
    const testAdmin = await prisma.user.upsert({
      where: { email: testAdminEmail },
      update: testAdminPassword,
      create: {
        name: "Localhost Test Admin",
        username: "testadmin",
        email: testAdminEmail,
        ...testAdminPassword,
        emailVerified: new Date(),
        verification: "OFFICIAL",
        status: "ACTIVE",
        notificationPref: { create: {} },
        adminRoles: { create: { role: AdminRoleName.SUPER_ADMIN } },
      },
    });
    await prisma.adminRole.upsert({
      where: { userId_role: { userId: testAdmin.id, role: AdminRoleName.SUPER_ADMIN } },
      update: {},
      create: { userId: testAdmin.id, role: AdminRoleName.SUPER_ADMIN },
    });

    const testUserEmail = "testuser@haske.local";
    const testUserPassword = await passwordFields(prisma, testUserEmail, "SEED_TEST_USER_PASSWORD");
    await prisma.user.upsert({
      where: { email: testUserEmail },
      update: testUserPassword,
      create: {
        name: "Localhost Community Tester",
        username: "testuser",
        email: testUserEmail,
        ...testUserPassword,
        emailVerified: new Date(),
        status: "ACTIVE",
        notificationPref: { create: {} },
      },
    });
  } else {
    console.log("Skipping localhost test accounts (DATABASE_URL is not a local database).");
  }

  const teamEmail = "team@haskecommunity.ng";
  const teamPassword = await passwordFields(prisma, teamEmail, "SEED_TEAM_PASSWORD");
  const campaignTeam = await prisma.user.upsert({
    where: { email: teamEmail },
    update: { ...teamPassword, avatarUrl: "/brand/haske-logo.png" },
    create: {
      name: "Haske Campaign Team",
      username: "HaskeCampaignTeam",
      email: teamEmail,
      ...teamPassword,
      emailVerified: new Date(),
      verification: "ORGANIZATION",
      isOrganization: true,
      bio: "Official campaign team account for Abdulrahman Bashir Haske's 2027 Adamawa governorship bid.",
      status: "ACTIVE",
      avatarUrl: "/brand/haske-logo.png",
      notificationPref: { create: {} },
    },
  });

  // A handful of ordinary demo community members (fictional, generated
  // avatars — never real photos), so demo posts read as genuine community
  // content rather than campaign-authored content, and the feed doesn't
  // look empty in a fresh install. They have no password: nobody signs in
  // as them.
  const demoUser1 = await prisma.user.upsert({
    where: { email: "demo.fatima@example.com" },
    update: { avatarUrl: demoAvatar("fatima_b"), passwordHash: null },
    create: {
      name: "Fatima Bello",
      username: "fatima_b",
      email: "demo.fatima@example.com",
      emailVerified: new Date(),
      bio: "Small business owner, Yola. Interested in youth and women's empowerment programs.",
      location: "Yola, Adamawa",
      avatarUrl: demoAvatar("fatima_b"),
      status: "ACTIVE",
      notificationPref: { create: {} },
    },
  });

  const demoUser2 = await prisma.user.upsert({
    where: { email: "demo.ibrahim@example.com" },
    update: { avatarUrl: demoAvatar("ibrahim_s"), passwordHash: null },
    create: {
      name: "Ibrahim Sanda",
      username: "ibrahim_s",
      email: "demo.ibrahim@example.com",
      emailVerified: new Date(),
      bio: "Agriculture student, Mubi. Following the agribusiness agenda closely.",
      location: "Mubi, Adamawa",
      avatarUrl: demoAvatar("ibrahim_s"),
      status: "ACTIVE",
      notificationPref: { create: {} },
    },
  });

  const demoUser3 = await prisma.user.upsert({
    where: { email: "demo.aisha@example.com" },
    update: { avatarUrl: demoAvatar("aisha_teaches"), passwordHash: null },
    create: {
      name: "Aisha Umar",
      username: "aisha_teaches",
      email: "demo.aisha@example.com",
      emailVerified: new Date(),
      bio: "Primary school teacher, Mubi. Watching the education and healthcare access plans closely.",
      location: "Mubi, Adamawa",
      avatarUrl: demoAvatar("aisha_teaches"),
      status: "ACTIVE",
      notificationPref: { create: {} },
    },
  });

  const demoUser4 = await prisma.user.upsert({
    where: { email: "demo.yakubu@example.com" },
    update: { avatarUrl: demoAvatar("yakubu_m"), passwordHash: null },
    create: {
      name: "Yakubu Musa",
      username: "yakubu_m",
      email: "demo.yakubu@example.com",
      emailVerified: new Date(),
      bio: "Young entrepreneur running a small agro-processing outfit in Numan.",
      location: "Numan, Adamawa",
      avatarUrl: demoAvatar("yakubu_m"),
      status: "ACTIVE",
      notificationPref: { create: {} },
    },
  });

  const demoUser5 = await prisma.user.upsert({
    where: { email: "demo.grace@example.com" },
    update: { avatarUrl: demoAvatar("grace_e"), passwordHash: null },
    create: {
      name: "Grace Emmanuel",
      username: "grace_e",
      email: "demo.grace@example.com",
      emailVerified: new Date(),
      bio: "Community health worker, Ganye. Focused on the health insurance scheme expansion.",
      location: "Ganye, Adamawa",
      avatarUrl: demoAvatar("grace_e"),
      status: "ACTIVE",
      notificationPref: { create: {} },
    },
  });

  const demoUser6 = await prisma.user.upsert({
    where: { email: "demo.suleiman@example.com" },
    update: { avatarUrl: demoAvatar("suleiman_a"), passwordHash: null },
    create: {
      name: "Suleiman Abba",
      username: "suleiman_a",
      email: "demo.suleiman@example.com",
      emailVerified: new Date(),
      bio: "Civil servant, Yola. Interested in transparency and accountable governance.",
      location: "Yola, Adamawa",
      avatarUrl: demoAvatar("suleiman_a"),
      status: "ACTIVE",
      notificationPref: { create: {} },
    },
  });

  const demoUsers = [demoUser1, demoUser2, demoUser3, demoUser4, demoUser5, demoUser6];

  // ── Biography timeline ──────────────────────────────────────────────
  const timeline: { era: string; title: string; dateLabel: string; date?: Date; description: string; order: number }[] = [
    {
      era: "EARLY_LIFE",
      title: "Early life in Adamawa",
      dateLabel: "",
      description: "Abdulrahman Bashir Haske is from Adamawa State, Nigeria, with roots and background in Yola.",
      order: 1,
    },
    {
      era: "EDUCATION",
      title: "Education and professional formation",
      dateLabel: "",
      description:
        "Graduated from the American University of Nigeria, building a foundation in business and leadership, then completed postgraduate certifications in Business Strategy and Leadership at Manchester Business School and Lagos Business School. Member of the Institute of Directors (IoD) Nigeria.",
      order: 2,
    },
    {
      era: "PROFESSIONAL_CAREER",
      title: "Technology, business and entrepreneurship",
      dateLabel: "",
      description:
        "Built a diversified investment portfolio spanning agriculture, construction, information technology and oil field services, with a pioneering role in advancing oil field services in Northern Nigeria.",
      order: 3,
    },
    {
      era: "AGRICULTURE",
      title: "H&W Rice Company",
      dateLabel: "",
      description:
        "Conceptualised and established a 48-ton-per-day rice processing mill in Adamawa State, described as the first of its kind in Northeast Nigeria, strengthening food security, creating jobs and empowering smallholder farmers.",
      order: 4,
    },
    {
      era: "COMMUNITY_DEVELOPMENT",
      title: "Community development and philanthropy",
      dateLabel: "",
      description:
        "As a founding member of the AB Haske Foundation, led interventions in education, skills development, youth empowerment and humanitarian support across Adamawa State, and promotes sports development through polo.",
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
      title: "Statewide grassroots engagement tour",
      dateLabel: "11–15 May 2026",
      date: new Date("2026-05-11"),
      description:
        "Undertook a five-day appreciation and engagement tour covering all 21 of Adamawa's local government areas, meeting traditional rulers, youth and women's groups, and party supporters at each stop.",
      order: 7,
    },
    {
      era: "POLITICAL_JOURNEY",
      title: "APC governorship primary",
      dateLabel: "2026",
      description:
        "Contested the APC governorship primary for Adamawa State, which he lost to Ahmed Galadima, according to Naija News reporting.",
      order: 8,
    },
    {
      era: "POLITICAL_JOURNEY",
      title: "Resignation from the APC",
      dateLabel: "September 2026",
      description: "Resigned from the All Progressives Congress (APC).",
      order: 9,
    },
    {
      era: "POLITICAL_JOURNEY",
      title: "Emerged as APM governorship candidate",
      dateLabel: "September 2026",
      description:
        "Joined the Allied Peoples Movement (APM) and was unveiled in Yola as the party's governorship candidate for Adamawa State ahead of the 2027 election, at an event attended by APM leaders, traditional and community leaders, youth and women's groups, and supporters from Adamawa's 21 local government areas.",
      order: 10,
    },
    {
      era: "POLITICAL_JOURNEY",
      title: "APM unveils running mate Engr. Safriel Judson Glah",
      dateLabel: "September 2026",
      description:
        "The APM presented retired NNPC senior executive Engr. Safriel Judson Glah as Haske's running mate, with the party framing the ticket as pairing private-sector entrepreneurship with public-sector experience.",
      order: 11,
    },
  ];

  await prisma.timelineEvent.deleteMany({});
  await prisma.timelineEvent.createMany({
    data: timeline.map((t) => ({ ...t, era: t.era as never })),
  });

  // ── Achievements ─────────────────────────────────────────────────────
  const hwRiceData = {
    title: "H&W Rice Company",
    category: "AGRICULTURE" as const,
    location: "Adamawa State",
    summary: "A rice-processing investment associated with Abdulrahman Haske, strengthening agricultural value chains.",
    description:
      "H&W Rice Company is a rice-processing investment associated with Abdulrahman Haske, designed to strengthen agricultural value chains by connecting farmers to processing and market opportunities in Adamawa State. Public reporting describes it as an integrated rice-processing operation connecting smallholder farmers with value-added processing.",
    source: "Public reporting on H&W Rice Company / Haske & Williams Company",
    contentStatus: "DOCUMENTED" as const,
    featured: true,
    order: 1,
  };
  const hwRice = await prisma.achievement.upsert({
    where: { slug: "hw-rice-company" },
    update: hwRiceData,
    create: {
      ...hwRiceData,
      slug: "hw-rice-company",
    },
  });
  await prisma.achievementImage.deleteMany({ where: { achievementId: hwRice.id } });
  await prisma.achievementImage.create({
    data: {
      achievementId: hwRice.id,
      url: "/images/abdulrahman/agriculture/hw-rice-mill-facility-demsa.jpg",
      caption: "H&W Rice Company 48-ton/day agro-industrial processing complex in Demsa, Adamawa State",
      order: 0,
    },
  });

  const ramadanOutreachData = {
    title: "Ramadan Humanitarian Outreach — Haske Foundation",
    category: "HUMANITARIAN_SUPPORT" as const,
    year: "2026",
    location: "Adamawa State (all 21 LGAs)",
    summary:
      "The Haske Foundation's Ramadan welfare drive distributed roughly 80,000 bags of rice and grains and about ₦220 million in cash assistance across Adamawa State.",
    description:
      "During Ramadan 2026, the Haske Foundation ran a welfare distribution across all 21 local government areas of Adamawa State: roughly 80,000 bags of rice and other grains, about ₦220 million in cash assistance, plus 10 vehicles and 50 motorcycles, flagged off in Yola. The foundation described it as a recurring festive-season tradition. Haske said: \"We do this every festive season to celebrate with our loved ones and to see how we can support families.\"",
    impact: "Reported to have reached an estimated 40,000–80,000 residents, particularly low-income households.",
    source: "Leadership, Daily Trust and Kowa Duniya reporting on the Haske Foundation's Ramadan outreach",
    sourceUrl: "https://leadership.ng/ramadan-haske-foundation-launches-welfare-drive-distributes-80000-bags-of-rice-in-adamawa/",
    contentStatus: "THIRD_PARTY" as const,
    featured: false,
    order: 2,
  };
  const ramadanOutreach = await prisma.achievement.upsert({
    where: { slug: "ramadan-humanitarian-outreach" },
    update: ramadanOutreachData,
    create: {
      ...ramadanOutreachData,
      slug: "ramadan-humanitarian-outreach",
    },
  });
  await prisma.achievementImage.deleteMany({ where: { achievementId: ramadanOutreach.id } });
  await prisma.achievementImage.create({
    data: {
      achievementId: ramadanOutreach.id,
      url: "/images/abdulrahman/foundation/ab-haske-foundation-ramadan-relief.png",
      caption: "AB Haske Foundation Ramadan humanitarian food grain relief distribution in Adamawa State",
      order: 0,
    },
  });

  // ── Programs (placeholders — no confirmed figures) ──────────────────
  const programSeeds = [
    {
      name: "Youth Empowerment Initiative",
      slug: "youth-empowerment-initiative",
      category: "YOUTH_EMPOWERMENT" as const,
      description:
        "Under the \"Meaningful Youth Inclusion\" plank of the A.D.A.M.A.W.A First Agenda, the campaign has indicated youth entrepreneurship, innovation, skills development and job creation will be a focus area. Full program design, eligibility and application windows for a citizen-facing program have not yet been published — this placeholder will be replaced once one is confirmed.",
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
        "The A.D.A.M.A.W.A First Agenda proposes a N200 billion agricultural guarantee fund and mechanisation, agro-processing and market-expansion support aimed at an export-grade agricultural economy. Full program design for a citizen-facing application process has not yet been published — this placeholder will be replaced once one is confirmed.",
    },
    {
      name: "Education & Skills Programme",
      slug: "education-skills-programme",
      category: "EDUCATION" as const,
      description:
        "The A.D.A.M.A.W.A First Agenda proposes rehabilitating 500 schools and recruiting and training 3,000 STEM-qualified teachers under its \"Access to Social Development\" plank. Full program design for a citizen-facing application process has not yet been published — this placeholder will be replaced once one is confirmed.",
    },
    {
      name: "Humanitarian Support Programme",
      slug: "humanitarian-support-programme",
      category: "HUMANITARIAN" as const,
      description:
        "The A.D.A.M.A.W.A First Agenda proposes expanding the Adamawa Health Insurance Scheme to cover at least 1 million residents within three years. Full program design for a citizen-facing application process has not yet been published — this placeholder will be replaced once one is confirmed.",
    },
  ];

  for (const p of programSeeds) {
    const data = { name: p.name, category: p.category, description: p.description, status: "UPCOMING" as const, contentStatus: "PROPOSED" as const };
    await prisma.program.upsert({
      where: { slug: p.slug },
      update: data,
      create: { ...data, slug: p.slug },
    });
  }

  // ── Manifesto (historical, publicly announced — not assumed current) ─
  // Sourced from Vanguard and AllAfrica coverage of the 25 April 2026
  // declaration at Mahmud Ribadu Square, Jimeta-Yola. This was announced
  // on the APC platform, before Haske's September 2026 move to the APM —
  // retained here as a historical agenda version, not assumed to carry
  // over unchanged to the current APM candidacy.
  //
  // Manifesto has no natural unique key, so re-seeding deletes and
  // recreates it (cascades to ManifestoPillar/ManifestoDocument) rather
  // than duplicating on every run.
  await prisma.manifesto.deleteMany({ where: { title: "A.D.A.M.A.W.A First Agenda" } });
  const manifesto = await prisma.manifesto.create({
    data: {
      title: "A.D.A.M.A.W.A First Agenda",
      version: "APC-era (2026)",
      publicationDate: new Date("2026-04-25"),
      introduction:
        "Unveiled on 25 April 2026 at Mahmud Ribadu Square in Jimeta-Yola, when Haske formally declared his intention to contest the Adamawa State governorship on the All Progressives Congress (APC) platform, the \"A.D.A.M.A.W.A First Agenda\" is a seven-point development blueprint — one plank for each letter of A-D-A-M-A-W-A. Haske described the ambition as a covenant with the people, built on unity, transparency and shared prosperity. It is retained here as a historical, publicly announced agenda version from his APC-era candidacy — it is not assumed to be the current manifesto following his September 2026 move to the Allied Peoples Movement (APM). Administrators can publish an updated, current manifesto at any time.",
      isCurrent: false,
    },
  });

  // ── Policy pillars ───────────────────────────────────────────────────
  // The seven planks of the A.D.A.M.A.W.A First Agenda, with the specific
  // commitments and figures reported by Vanguard and AllAfrica. Framed
  // throughout as PROPOSED (an announced campaign commitment, not a
  // delivered outcome) and tied to its APC-era origin.
  const APC_ERA_NOTE =
    "Announced as part of the APC-era \"A.D.A.M.A.W.A First Agenda\" (25 April 2026). Not yet confirmed as carried over to the current APM candidacy.";

  await prisma.policyPillar.deleteMany({
    where: {
      slug: {
        in: [
          "agriculture-agribusiness",
          "education-human-capital",
          "healthcare",
          "youth-economic-empowerment",
          "good-governance-accountability",
          "infrastructure",
          "security",
        ],
      },
    },
  });

  const pillarSeeds = [
    {
      name: "Agriculture & Agro-Industry",
      slug: "agriculture-agro-industry",
      category: "Agriculture (A)",
      problem:
        "Adamawa's agricultural sector has significant untapped potential, with limited mechanisation, weak value chains and minimal agro-processing capacity relative to its scale.",
      currentSituation:
        "Smallholder farming still dominates, with most produce leaving the state unprocessed and little organized access to guarantee financing.",
      proposedApproach:
        "Reposition agriculture as a wealth-creating industry through mechanisation, value chain development, agro-processing and market expansion, aiming to make Adamawa a leading agro-industrial hub.",
      objectives: "Grow agriculture into an export-grade economy worth an estimated N300 billion.",
      proposedActions:
        "Establish a N200 billion agricultural guarantee fund to de-risk lending to farmers and agribusinesses; invest in mechanisation and agro-processing infrastructure across the state's local government areas.",
      expectedOutcomes: "An estimated 1 million jobs created across the agricultural value chain.",
    },
    {
      name: "Development & Infrastructure",
      slug: "development-infrastructure",
      category: "Infrastructure (D)",
      problem: "Road networks, water supply, energy access and digital connectivity remain uneven across Adamawa's 21 local government areas.",
      proposedApproach: "Equitable, LGA-by-LGA infrastructure investment rather than concentrating development in a few urban centres.",
      objectives: "Rehabilitate at least 25 kilometres of roads annually in every local government area.",
      proposedActions: "Expand renewable energy access, improve water supply infrastructure, and strengthen digital connectivity statewide.",
      expectedOutcomes: "More reliable roads, power, water and connectivity reaching rural and urban LGAs alike.",
    },
    {
      name: "Access to Social Development",
      slug: "access-social-development",
      category: "Social Development (A)",
      problem: "Many communities are excluded from quality education and affordable healthcare due to distance or cost.",
      proposedApproach: "Treat education and healthcare as a single access problem — no community excluded because of where it is or what it can afford.",
      objectives: "Rehabilitate 500 schools and expand the Adamawa Health Insurance Scheme to cover at least 1 million residents within three years.",
      proposedActions: "Recruit and train 3,000 STEM-qualified teachers to rebuild classroom capacity alongside the school rehabilitation program.",
      expectedOutcomes: "Broader, more affordable access to both education and healthcare across the state.",
    },
    {
      name: "Meaningful Youth Inclusion",
      slug: "meaningful-youth-inclusion",
      category: "Youth Inclusion (M)",
      problem: "Young people make up much of Adamawa's population but have limited structured pathways into entrepreneurship and skilled work.",
      proposedApproach:
        "Haske has framed the state's youth as its greatest asset, centering their inclusion — not just employment — as a governance priority.",
      objectives: "Expand entrepreneurship support, innovation programs, job creation and skills development specifically targeted at youth.",
      proposedActions: "Build out skills-development and innovation programs in coordination with the Wealth Creation plank below.",
      expectedOutcomes: "More young people in Adamawa with a structured path into entrepreneurship or skilled employment.",
    },
    {
      name: "Accountable & Inclusive Governance",
      slug: "accountable-inclusive-governance",
      category: "Governance (A)",
      problem: "Public trust in state governance depends on transparency and the equitable distribution of resources across all communities.",
      proposedApproach: "Transparency and accountability as organizing principles of government, not just campaign language.",
      objectives: "Equitable distribution of public resources across Adamawa's 21 local government areas.",
      proposedActions: "Full detail on specific transparency and accountability mechanisms has not yet been published.",
      expectedOutcomes: "A state government residents can hold accountable, with resources reaching every LGA.",
    },
    {
      name: "Wealth Creation & Economic Empowerment",
      slug: "wealth-creation-economic-empowerment",
      category: "Wealth Creation (W)",
      problem: "Economic opportunity in Adamawa is not evenly distributed across all 21 local government areas.",
      proposedApproach: "Attract investment and pair it with skills training and access to finance, so job creation reaches every LGA rather than a few urban centres.",
      objectives: "Broaden access to finance and skills training statewide, alongside the agricultural job-creation target under the Agriculture plank.",
      proposedActions: "Investment attraction paired with local skills-training programs across all 21 local government areas.",
      expectedOutcomes: "More broadly distributed economic opportunity, measured across LGAs rather than concentrated growth.",
    },
    {
      name: "Assurance of Security",
      slug: "assurance-of-security",
      category: "Security (A)",
      problem: "Security is treated as the precondition for farming, trading and community life to function safely.",
      proposedApproach: "Modernized security operations paired with intelligence-led policing, rather than a purely reactive posture.",
      objectives: "Fund and stand up dedicated state security infrastructure separate from routine budget allocations.",
      proposedActions: "Establish an Adamawa Security Trust Fund to resource modernized operations and intelligence-led policing.",
      expectedOutcomes: "Safer conditions for farming, trading and daily community life across the state.",
    },
  ];

  for (const [i, pillar] of pillarSeeds.entries()) {
    const data = {
      name: pillar.name,
      category: pillar.category,
      problem: pillar.problem,
      currentSituation: "currentSituation" in pillar ? pillar.currentSituation : null,
      proposedApproach: pillar.proposedApproach,
      objectives: pillar.objectives,
      proposedActions: pillar.proposedActions,
      expectedOutcomes: `${pillar.expectedOutcomes} ${APC_ERA_NOTE}`,
      contentStatus: "PROPOSED" as const,
      order: i + 1,
    };
    const created = await prisma.policyPillar.upsert({
      where: { slug: pillar.slug },
      update: data,
      create: { ...data, slug: pillar.slug },
    });
    await prisma.manifestoPillar.upsert({
      where: { manifestoId_pillarId: { manifestoId: manifesto.id, pillarId: created.id } },
      update: {},
      create: { manifestoId: manifesto.id, pillarId: created.id, order: i + 1 },
    });
  }

  // ── Public record ────────────────────────────────────────────────────
  await prisma.publicRecordItem.deleteMany({
    where: {
      title: {
        in: [
          "Abdulrahman Haske emerges as APM governorship candidate",
          "A.D.A.M.A.W.A First Agenda (historical)",
          "Declaration of intent — Mahmud Ribadu Square, Jimeta-Yola",
        ],
      },
    },
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
        publishedDate: new Date("2026-04-25"),
        version: "APC-era (2026)",
        source: "Vanguard News and AllAfrica, 25 April 2026",
        content:
          "The \"A.D.A.M.A.W.A First Agenda\" — a seven-point blueprint spanning agriculture, infrastructure, social development, youth inclusion, governance, wealth creation and security — was unveiled at Mahmud Ribadu Square, Jimeta-Yola, when Haske declared his intention to contest the Adamawa governorship on the APC platform. Retained here for the public record; not assumed to be the current APM manifesto.",
      },
      {
        title: "Declaration of intent — Mahmud Ribadu Square, Jimeta-Yola",
        type: "EVENT_RECORD",
        publishedDate: new Date("2026-04-25"),
        version: "1.0",
        source: "Vanguard News, 25 April 2026",
        content:
          "On 25 April 2026, Abdulrahman Haske formally declared his intention to contest the 2027 Adamawa State governorship election, on the APC platform, at Mahmud Ribadu Square in Jimeta-Yola. He described the ambition as a covenant with the people, and pledged leadership centred on unity, transparency and shared prosperity.",
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
    {
      title: "Haske unveils A.D.A.M.A.W.A First Agenda at Mahmud Ribadu Square",
      slug: "adamawa-first-agenda-unveiling",
      category: "PRESS_RELEASE" as const,
      date: new Date("2026-04-25"),
      content:
        "Thousands gathered at Mahmud Ribadu Square in Jimeta-Yola on 25 April 2026 — traditional rulers, religious leaders, youth and women's groups, diaspora representatives and APC stakeholders from all 21 local government areas — as Abdulrahman Haske formally declared his intention to contest the 2027 Adamawa governorship and unveiled the seven-point A.D.A.M.A.W.A First Agenda. Haske said he sought \"the honour to serve, not power for its own sake,\" describing his candidacy as a covenant with the people. Premium Times reported national APC dignitaries in attendance, including the party's National Youth Leader, Dayo Israel.",
      relatedTopic: "Political journey",
      sourceUrl: "https://www.premiumtimesng.com/promoted/874756-yola-agog-as-abdulrahman-haske-finally-declares-for-adamawa-governorship-race.html",
      contentStatus: "THIRD_PARTY" as const,
    },
    {
      title: "Haske launches statewide grassroots engagement tour of all 21 LGAs",
      slug: "haske-statewide-grassroots-tour",
      category: "NEWS" as const,
      date: new Date("2026-05-11"),
      content:
        "Abdulrahman Haske embarked on a five-day statewide grassroots appreciation and engagement tour, beginning Monday 11 May 2026 and covering all 21 of Adamawa's local government areas: Ganye, Toungo, Jada and Mayo-Belwa on day one; Lamurde, Guyuk, Shelleng, Numan and Demsa on day two; Michika, Madagali, Mubi North and Mubi South on day three; Maiha, Hong, Gombi and Song on day four; and Girei, Fufure, Yola North and Yola South on day five. At each stop he was received by traditional rulers, youth and women's groups, party stakeholders and large crowds of supporters. \"Unity and collective effort are essential ingredients for a prosperous Adamawa State,\" he said. Coverage of the tour was independently reported by Freedom Online, Guardian Nigeria, TheCable, Blueprint, Arise News, 21st Century Chronicle and Tori.",
      relatedTopic: "Political journey",
      sourceUrl: "https://freedomonline.com.ng/adamawa-2027-haske-commences-statewide-grassroots-engagement-tour-reaffirms-inclusive-leadership-agenda/",
      featuredImage: "https://freedomonline.com.ng/wp-content/uploads/2026/05/IMG-20260512-WA0183.jpg",
      contentStatus: "THIRD_PARTY" as const,
    },
    {
      title: "Photos: crowds greet Haske across Adamawa's local government areas",
      slug: "haske-grassroots-tour-photos",
      category: "PHOTO" as const,
      date: new Date("2026-05-13"),
      content:
        "Photo coverage from Abdulrahman Haske's five-day statewide grassroots tour (11–15 May 2026), showing the large turnouts of traditional rulers, youth and women's groups, and party supporters that met him across Adamawa's 21 local government areas.",
      relatedTopic: "Political journey",
      sourceUrl: "https://www.tori.ng/news/321533/apc-governorship-aspirant-tours-adamawa-lgas-ahead.html",
      featuredImage: "https://www.tori.ng/userfiles/image/2026/may/13/aabdul.jpg",
      contentStatus: "THIRD_PARTY" as const,
    },
    {
      title: "Haske: \"I built billion-dollar businesses, now I want to build my state\"",
      slug: "haske-billion-dollar-businesses-interview",
      category: "NEWS" as const,
      date: new Date("2026-09-22"),
      content:
        "In an interview, Haske explained his rationale for entering politics: \"If we can excel in businesses and build multi-billion-dollar businesses, why can't we be trusted with governance?\" On his campaign's timeline, he said: \"I started this journey in August of 2024. I've been dedicated, I've been consistent and my messaging has been the same.\" Addressing questions about his age relative to other contenders, he said: \"Don't vote my age, vote my pedigree and what I have done for people.\" He added that he does not see the role as a route to personal wealth: \"I am not coming into government to make wealth. Alhamdulillah, I'm okay.\"",
      relatedTopic: "Political journey",
      sourceUrl:
        "https://tgnews.com.ng/why-im-contesting-adamawa-governorship-haske-says-i-built-billion-dollar-businesses-now-i-want-to-build-my-state/",
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
          "A people-centred approach to governance built around seven priorities — agriculture, infrastructure, social development, youth inclusion, governance, wealth creation and security — first announced publicly as the A.D.A.M.A.W.A First Agenda.",
        note: "These are the campaign's stated political priorities and proposed agenda — not existing government achievements. The A.D.A.M.A.W.A First Agenda was announced during Haske's APC-era candidacy; see Our Agenda for the full historical text and current status.",
        priorities: [
          "Agriculture & agro-industry",
          "Development & infrastructure",
          "Access to social development",
          "Meaningful youth inclusion",
          "Accountable & inclusive governance",
          "Wealth creation & economic empowerment",
          "Assurance of security",
        ],
      },
    },
    {
      key: "vision",
      value: {
        heading: "Our Vision",
        statement: "Building a more prosperous, inclusive and secure Adamawa.",
        note: "This phrase has been used in public statements surrounding the APM candidacy. Haske has described his broader ambition as a covenant with the people, built on unity, transparency and shared prosperity.",
        themes: [
          {
            title: "Prosperity",
            description:
              "Economic opportunity, agriculture and investment — including a proposed N300 billion export-grade agricultural economy and an estimated 1 million jobs, per the A.D.A.M.A.W.A First Agenda.",
          },
          {
            title: "Inclusion",
            description:
              "Youth, women, communities and citizens participating in development, with youth described as Adamawa's greatest asset.",
          },
          {
            title: "Security",
            description: "Safer communities and stronger institutions, anchored by a proposed Adamawa Security Trust Fund.",
          },
          {
            title: "Accountability",
            description: "Transparent management of public resources, distributed equitably across all 21 local government areas.",
          },
        ],
      },
    },
    {
      key: "biography",
      value: {
        heading: "Biography",
        paragraphs: [
          "Abdulrahman Bashir Haske is a distinguished Nigerian entrepreneur, philanthropist and emerging political leader committed to advancing inclusive development, economic transformation and sustainable progress.",
          "Born and raised in Yola, Adamawa State, he has built a reputation as a forward-thinking leader with a deep understanding of both grassroots realities and national development priorities. His career spans multiple sectors, driving initiatives that improve livelihoods, expand economic opportunities and strengthen community resilience across Adamawa State and Northern Nigeria.",
          "He is a graduate of the American University of Nigeria, with postgraduate certifications in Business Strategy and Leadership from Manchester Business School and Lagos Business School, and is a member of the Institute of Directors (IoD) Nigeria.",
          "A dynamic entrepreneur, he has built a diversified investment portfolio spanning agriculture, construction, information technology and oil field services, and conceptualised and established a 48-ton-per-day rice processing mill in Adamawa State, the first of its kind in Northeast Nigeria.",
        ],
        sections: [
          {
            title: "Political Vision",
            body: "A pragmatic, people-centred and solutions-driven approach grounded in inclusive governance, economic empowerment and social justice, with a focus on job creation, youth empowerment, infrastructure and policies that unlock the state's economic potential.",
          },
          {
            title: "Ethical Leadership",
            body: "Guided by the principle of \"doing good while doing business\", aligning profitability with social impact and building partnerships across sectors.",
          },
          {
            title: "Philanthropy & Community",
            body: "A founding member of the AB Haske Foundation, which has led interventions in education, skills development, youth empowerment and humanitarian support in underserved communities across Adamawa State. He also advocates for sports development, using polo to promote unity, discipline and youth engagement.",
          },
          {
            title: "Family",
            body: "Happily married with children, and committed to his family, his community and the advancement of Adamawa State and Nigeria.",
          },
        ],
      },
    },
    {
      key: "experience",
      value: {
        heading: "Experience & Enterprise",
        entries: [
          {
            organization: "Diversified Investment Portfolio",
            role: "Entrepreneur",
            description:
              "Investments spanning agriculture, construction, information technology and oil field services, including a pioneering role in advancing oil field services in Northern Nigeria.",
          },
          {
            organization: "Rice Processing Mill, Adamawa State",
            role: "Founder",
            description:
              "Conceptualised and established a state-of-the-art 48-ton-per-day rice processing mill, the first of its kind in Northeast Nigeria, strengthening food security, creating jobs and empowering smallholder farmers.",
          },
          {
            organization: "AB Haske Foundation",
            role: "Founding Member",
            description:
              "Interventions in education, skills development, youth empowerment and humanitarian support across Adamawa State, alongside advocacy for sports development through polo.",
          },
          {
            organization: "Institute of Directors (IoD) Nigeria",
            role: "Member",
            description: "Upholds standards of corporate governance, accountability and ethical leadership.",
          },
        ],
      },
    },
    {
      key: "contact",
      value: {
        email: "info@abhaske.ng",
        phone: "+234 801 234 5678",
        offices: [
          { name: "Yola Office", address: "No. 1, Haske Road, Yola" },
          { name: "Mubi Office", address: "No. 2, Haske Road, Mubi" },
        ],
        socials: [
          { label: "Facebook", url: "https://www.facebook.com/share/14feGWpiZ1m/" },
          { label: "X", url: "https://x.com/OfficialABHaske" },
          { label: "Instagram", url: "https://www.instagram.com/officialabhaske" },
          { label: "TikTok", url: "https://vm.tiktok.com/ZS9NPwK8fREhc-aXoST/" },
          { label: "YouTube", url: "https://www.youtube.com/@abdulrahmanbashir" },
          { label: "WhatsApp", url: "https://whatsapp.com/channel/0029VbCbTfm3bbV2KGXVBK33" },
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
  // prior posts/follows before recreating them to keep re-seeding idempotent.
  const demoUserIds = demoUsers.map((u) => u.id);
  await prisma.post.deleteMany({ where: { authorId: { in: [haske.id, campaignTeam.id, ...demoUserIds] } } });
  await prisma.follow.deleteMany({ where: { followerId: { in: demoUserIds } } });
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

  const demoPostSeeds = [
    { author: demoUser1, content: "Looking forward to seeing more detail on the youth empowerment programs." },
    {
      author: demoUser2,
      content: "The agribusiness agenda matters a lot to farmers here in Mubi. Hoping for real market access support.",
    },
    {
      author: demoUser3,
      content: "Hoping the school rehabilitation plan reaches Mubi soon — some of our classrooms really need it.",
    },
    {
      author: demoUser4,
      content: "Access to affordable financing would change everything for small agro-processors like us in Numan.",
    },
    {
      author: demoUser5,
      content: "The health insurance scheme expansion could make a real difference for families here in Ganye.",
    },
    {
      author: demoUser6,
      content: "Would like to see how resources will be tracked and reported across all 21 LGAs, not just announced.",
    },
  ];

  const demoPosts = [officialPost];
  for (const { author, content } of demoPostSeeds) {
    const post = await prisma.post.create({
      data: {
        authorId: author.id,
        type: "TEXT",
        content: `${content} [Demo community post]`,
        contentStatus: "COMMUNITY",
        isDemoContent: true,
      },
    });
    demoPosts.push(post);
  }

  // A few likes so the feed doesn't read as completely inert (idempotent —
  // the posts/likes above are freshly recreated every seed run).
  const likeSeeds: [typeof demoUser1, (typeof demoPosts)[number]][] = [
    [demoUser1, officialPost],
    [demoUser2, officialPost],
    [demoUser3, officialPost],
    [demoUser4, demoPosts[1]],
    [demoUser5, demoPosts[2]],
    [demoUser6, demoPosts[3]],
  ];
  for (const [user, post] of likeSeeds) {
    await prisma.postLike.create({ data: { userId: user.id, postId: post.id } });
    await prisma.post.update({ where: { id: post.id }, data: { likesCount: { increment: 1 } } });
  }

  // Every demo account follows the official Haske account.
  for (const user of demoUsers) {
    await prisma.follow.create({ data: { followerId: user.id, followingId: haske.id } });
  }

  // ── Campaign team posts ──────────────────────────────────────────────
  // Restate only facts already documented above (achievements, media
  // center), in the team account's third-person voice, with the same
  // provenance status and source link. No new claims or quotes.
  // Photos are attached only where the image genuinely shows the event:
  // several files under public/images/abdulrahman are generic stock or
  // third-party graphics despite their names, so they are not used here.
  const hoursAgo = (h: number) => new Date(Date.now() - h * 60 * 60 * 1000);
  const IMG = "/images/abdulrahman";

  const teamPostSeeds: {
    content: string;
    contentStatus: "OFFICIAL" | "DOCUMENTED" | "THIRD_PARTY" | "PROPOSED";
    linkUrl?: string;
    createdAt: Date;
    media?: { url: string; altText: string; width: number; height: number }[];
  }[] = [
    {
      content:
        "H&W Rice Company is a rice-processing investment associated with Abdulrahman Haske, built to connect smallholder farmers in Adamawa with value-added processing and market opportunities. #Agriculture #Adamawa2027",
      contentStatus: "DOCUMENTED",
      createdAt: hoursAgo(3),
    },
    {
      content:
        "Looking back: on 25 April 2026, traditional rulers, religious leaders, youth and women's groups and supporters from all 21 LGAs gathered at Mahmud Ribadu Square, Jimeta-Yola, for Abdulrahman Haske's declaration of intent to contest the 2027 governorship. #Adamawa2027 #YolaNorth https://www.premiumtimesng.com/promoted/874756-yola-agog-as-abdulrahman-haske-finally-declares-for-adamawa-governorship-race.html",
      contentStatus: "THIRD_PARTY",
      linkUrl: "https://www.premiumtimesng.com/promoted/874756-yola-agog-as-abdulrahman-haske-finally-declares-for-adamawa-governorship-race.html",
      createdAt: hoursAgo(20),
      media: [
        { url: `${IMG}/politics/haske-declaration-podium-yola.jpeg`, altText: "Abdulrahman Haske greeting supporters from a vehicle, surrounded by campaign posters and flags", width: 1280, height: 960 },
        { url: `${IMG}/politics/haske-declaration-ribadu-square-crowd.jpeg`, altText: "Guests in white kaftans and HASKE caps seated in the grandstand", width: 1280, height: 960 },
        { url: `${IMG}/politics/haske-declaration-stage-dignitaries.jpeg`, altText: "Abdulrahman Haske seated with guests in the front row of the grandstand", width: 1280, height: 960 },
      ],
    },
    {
      content:
        "During Ramadan 2026, the Haske Foundation's welfare drive was reported to have distributed roughly 80,000 bags of rice and grains and about ₦220 million in cash assistance across all 21 LGAs. #Adamawa2027 https://leadership.ng/ramadan-haske-foundation-launches-welfare-drive-distributes-80000-bags-of-rice-in-adamawa/",
      contentStatus: "THIRD_PARTY",
      linkUrl: "https://leadership.ng/ramadan-haske-foundation-launches-welfare-drive-distributes-80000-bags-of-rice-in-adamawa/",
      createdAt: hoursAgo(44),
    },
    {
      content:
        "Youth inclusion is one of the campaign's stated priorities. Programme details are still being finalised — tell us below what support would make the biggest difference for young people in your LGA. #Youth #Adamawa2027",
      contentStatus: "PROPOSED",
      createdAt: hoursAgo(70),
    },
  ];

  const teamPosts = [];
  for (const seed of teamPostSeeds) {
    teamPosts.push(
      await prisma.post.create({
        data: {
          authorId: campaignTeam.id,
          type: seed.media?.length ? "IMAGE" : seed.linkUrl ? "LINK" : "TEXT",
          content: seed.content,
          linkUrl: seed.linkUrl,
          contentStatus: seed.contentStatus,
          createdAt: seed.createdAt,
          media: seed.media ? { create: seed.media.map((m, order) => ({ ...m, type: "IMAGE" as const, order })) } : undefined,
        },
      })
    );
  }

  // ── Official community consultation poll ─────────────────────────────
  // Asks a question; makes no claim. Open for two weeks from seeding.
  const consultationOptions = [
    "Farming inputs & market access",
    "Schools & teachers",
    "Healthcare access",
    "Jobs & skills for youth",
    "Security",
    "Roads & infrastructure",
  ];
  const consultationPost = await prisma.post.create({
    data: {
      authorId: campaignTeam.id,
      type: "POLL",
      content:
        "Community consultation: we want to hear directly from every LGA. Vote below, then reply with what's happening where you live. #Adamawa2027",
      contentStatus: "OFFICIAL",
      createdAt: hoursAgo(6),
      poll: {
        create: {
          question: "Which issue matters most to your community right now?",
          isOfficial: true,
          resultsVisibility: "AFTER_VOTE",
          endAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          options: { create: consultationOptions.map((text, order) => ({ text, order })) },
        },
      },
    },
    include: { poll: { include: { options: { orderBy: { order: "asc" } } } } },
  });
  // Demo accounts vote along their bios' interests.
  const pollOptions = consultationPost.poll!.options;
  const demoVotes: [typeof demoUser1, number][] = [
    [demoUser1, 3],
    [demoUser2, 0],
    [demoUser3, 1],
    [demoUser4, 0],
    [demoUser5, 2],
    [demoUser6, 5],
  ];
  for (const [user, optionIndex] of demoVotes) {
    const option = pollOptions[optionIndex];
    await prisma.pollVote.create({ data: { pollId: consultationPost.poll!.id, optionId: option.id, userId: user.id } });
    await prisma.pollOption.update({ where: { id: option.id }, data: { votesCount: { increment: 1 } } });
  }

  // ── Demo replies, likes and follows on the team posts ────────────────
  const [ricePost, declarationPost, , youthPost] = teamPosts;
  const demoCommentSeeds: [typeof demoUser1, (typeof teamPosts)[number], string][] = [
    [demoUser2, ricePost, "More processing capacity close to the farms is exactly what Mubi growers need."],
    [demoUser4, ricePost, "Would be great to know if smaller processors can partner with mills like this."],
    [demoUser6, declarationPost, "Was there that day — the square was packed."],
    [demoUser1, youthPost, "Start-up grants and mentorship for young women traders in Yola, please."],
    [demoUser3, consultationPost, "Mubi South: classrooms and teacher numbers, by a long way."],
    [demoUser5, consultationPost, "Ganye: the nearest general hospital is still too far for most families."],
  ];
  for (const [user, post, content] of demoCommentSeeds) {
    await prisma.comment.create({ data: { postId: post.id, authorId: user.id, content: `${content} [Demo reply]` } });
    await prisma.post.update({ where: { id: post.id }, data: { commentsCount: { increment: 1 } } });
  }

  for (const [i, post] of [...teamPosts, consultationPost].entries()) {
    for (const user of demoUsers.slice(0, 6 - (i % 4))) {
      await prisma.postLike.create({ data: { userId: user.id, postId: post.id } });
      await prisma.post.update({ where: { id: post.id }, data: { likesCount: { increment: 1 } } });
    }
  }

  for (const user of demoUsers) {
    await prisma.follow.create({ data: { followerId: user.id, followingId: campaignTeam.id } });
  }

  // ── Hashtags ─────────────────────────────────────────────────────────
  // Link every seeded post to its hashtags, then recount all hashtags from
  // live posts so re-seeding never drifts the counters.
  for (const post of [...teamPosts, consultationPost]) {
    const tags = [...new Set((post.content?.match(/#([a-zA-Z][a-zA-Z0-9_]{1,49})/g) ?? []).map((t) => t.slice(1).toLowerCase()))];
    for (const tag of tags) {
      const hashtag = await prisma.hashtag.upsert({ where: { tag }, update: {}, create: { tag } });
      await prisma.postHashtag.create({ data: { postId: post.id, hashtagId: hashtag.id } });
    }
  }
  for (const hashtag of await prisma.hashtag.findMany({ select: { id: true } })) {
    const postsCount = await prisma.postHashtag.count({ where: { hashtagId: hashtag.id, post: { deletedAt: null } } });
    await prisma.hashtag.update({ where: { id: hashtag.id }, data: { postsCount } });
  }

  console.log("Seed complete.");
  console.log(`- Achievements: ${hwRice.title}`);
  console.log(`- Programs: ${programSeeds.length} placeholders`);
  console.log(`- Manifesto: ${manifesto.title} (historical)`);
  console.log(`- Policy pillars: ${pillarSeeds.length}`);
  console.log(`- Community: ${teamPosts.length} team posts, 1 consultation poll, ${demoCommentSeeds.length} demo replies`);
  console.log(`- Accounts: admin, ${haske.username}, ${campaignTeam.username}, ${demoUsers.map((u) => u.username).join(", ")}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
