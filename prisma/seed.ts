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

/**
 * Deterministic, generated (non-photographic) avatar for fictional demo
 * community accounts — never used for real people/accounts.
 */
function demoAvatar(seed: string): string {
  return `https://api.dicebear.com/9.x/personas/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3a4,c7f0d8,ffd699,fbe7a1,d1d4f9`;
}

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
    update: { avatarUrl: "/brand/portrait.png" },
    create: {
      name: "Abdulrahman Bashir Haske",
      username: "AbdulrahmanHaske",
      email: "office@haskecommunity.ng",
      passwordHash: hasePasswordHash,
      emailVerified: new Date(),
      verification: "OFFICIAL",
      bio: "Businessman, entrepreneur, philanthropist and politician from Adamawa State. APM Governorship Candidate for Adamawa State, 2027.",
      location: "Yola, Adamawa State",
      avatarUrl: "/brand/portrait.png",
      status: "ACTIVE",
      notificationPref: { create: {} },
      adminRoles: { create: { role: AdminRoleName.CONTENT_ADMIN } },
    },
  });

  const campaignTeam = await prisma.user.upsert({
    where: { email: "team@haskecommunity.ng" },
    update: { avatarUrl: "/brand/haske-logo.png" },
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
      avatarUrl: "/brand/haske-logo.png",
      notificationPref: { create: {} },
    },
  });

  // A handful of ordinary demo community members (fictional, generated
  // avatars — never real photos), so demo posts read as genuine community
  // content rather than campaign-authored content, and the feed doesn't
  // look empty in a fresh install.
  const demoUser1 = await prisma.user.upsert({
    where: { email: "demo.fatima@example.com" },
    update: { avatarUrl: demoAvatar("fatima_b") },
    create: {
      name: "Fatima Bello",
      username: "fatima_b",
      email: "demo.fatima@example.com",
      passwordHash: await bcrypt.hash("Demo1234!", 12),
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
    update: { avatarUrl: demoAvatar("ibrahim_s") },
    create: {
      name: "Ibrahim Sanda",
      username: "ibrahim_s",
      email: "demo.ibrahim@example.com",
      passwordHash: await bcrypt.hash("Demo1234!", 12),
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
    update: { avatarUrl: demoAvatar("aisha_teaches") },
    create: {
      name: "Aisha Umar",
      username: "aisha_teaches",
      email: "demo.aisha@example.com",
      passwordHash: await bcrypt.hash("Demo1234!", 12),
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
    update: { avatarUrl: demoAvatar("yakubu_m") },
    create: {
      name: "Yakubu Musa",
      username: "yakubu_m",
      email: "demo.yakubu@example.com",
      passwordHash: await bcrypt.hash("Demo1234!", 12),
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
    update: { avatarUrl: demoAvatar("grace_e") },
    create: {
      name: "Grace Emmanuel",
      username: "grace_e",
      email: "demo.grace@example.com",
      passwordHash: await bcrypt.hash("Demo1234!", 12),
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
    update: { avatarUrl: demoAvatar("suleiman_a") },
    create: {
      name: "Suleiman Abba",
      username: "suleiman_a",
      email: "demo.suleiman@example.com",
      passwordHash: await bcrypt.hash("Demo1234!", 12),
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
      title: "American University of Nigeria",
      dateLabel: "",
      description:
        "Studied Information Systems at the American University of Nigeria (AUN) in Yola, with a concentration in Security and Assurance, according to the AA&R Investment Group profile.",
      order: 2,
    },
    {
      era: "PROFESSIONAL_CAREER",
      title: "Technology, business and entrepreneurship",
      dateLabel: "",
      description:
        "Built a professional career spanning technology, business and entrepreneurship, with public profile experience in IT, software architecture, web technologies, applications, information security and assurance.",
      order: 3,
    },
    {
      era: "AGRICULTURE",
      title: "H&W Rice Company",
      dateLabel: "",
      description:
        "Associated with a rice-processing investment in Adamawa (H&W Rice Company), an integrated operation designed to connect smallholder farmers with value-added processing and market opportunities.",
      order: 4,
    },
    {
      era: "COMMUNITY_DEVELOPMENT",
      title: "Community development and philanthropy",
      dateLabel: "",
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
  await prisma.achievement.upsert({
    where: { slug: "ramadan-humanitarian-outreach" },
    update: ramadanOutreachData,
    create: {
      ...ramadanOutreachData,
      slug: "ramadan-humanitarian-outreach",
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
  // prior posts/follows before recreating them to keep re-seeding idempotent.
  const demoUserIds = demoUsers.map((u) => u.id);
  await prisma.post.deleteMany({ where: { authorId: { in: [haske.id, ...demoUserIds] } } });
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

  console.log("Seed complete.");
  console.log(`- Achievements: ${hwRice.title}`);
  console.log(`- Programs: ${programSeeds.length} placeholders`);
  console.log(`- Manifesto: ${manifesto.title} (historical)`);
  console.log(`- Policy pillars: ${pillarSeeds.length}`);
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
