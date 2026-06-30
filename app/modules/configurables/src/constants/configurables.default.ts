/*
 * Default Configurable Data — seeded into Mongo on first boot.
 *
 * BEFORE EDITING: read ./RULES.md (especially R5: schema and defaults must
 * stay in sync) and ./configurables.schema.ts. For per-type schema and
 * default-value samples, see RULES.md §5 "Field Type Reference".
 */

export type TBrandColor = {
  // Base
  background: string;
  foreground: string;
  // Card
  card: string;
  cardForeground: string;
  // Popover
  popover: string;
  popoverForeground: string;
  // Primary
  primary: string;
  primaryForeground: string;
  // Secondary
  secondary: string;
  secondaryForeground: string;
  // Muted
  muted: string;
  mutedForeground: string;
  // Accent
  accent: string;
  accentForeground: string;
  // Destructive
  destructive: string;
  destructiveForeground: string;
  // Border / Input / Ring
  border: string;
  input: string;
  ring: string;
  // Charts
  chart1?: string;
  chart2?: string;
  chart3?: string;
  chart4?: string;
  chart5?: string;
  // Navbar
  navbarBackground: string;
  // Sidebar
  sidebarBackground: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
};

export type TFont = {
  headingFont: string;
  textFont: string;
};

export type THowItWorksStep = {
  title: string;
  description: string;
};

export type TFutureVisionItem = {
  title: string;
  description: string;
  badge?: string;
};

export type TReward = {
  title: string;
  description?: string;
  cost: number;
};

export type TTier = {
  name: string;
  minPoints: number;
};

export type TDefaultConfigurableData = {
  appName: string;
  logoUrl: string;
  brandColor: TBrandColor;
  // Brand copy
  tagline?: string;
  heroHeadline?: string;
  heroSubheadline?: string;
  heroCtaLabel?: string;
  heroImage?: string;
  communityName?: string;
  // Landing content
  howItWorks?: THowItWorksStep[];
  showFutureVision?: boolean;
  futureVisionHeading?: string;
  futureVision?: TFutureVisionItem[];
  // Loyalty economy
  pointsForJoining?: number;
  pointsPerVerifiedPurchase?: number;
  pointsPerReferralInviter?: number;
  pointsPerReferralInvitee?: number;
  rewardsCatalog?: TReward[];
  tiers?: TTier[];
  // Footer
  footerText?: string;
  font: TFont;
};

export const defaultConfigurablesData: TDefaultConfigurableData = {
  appName: "Navin",
  logoUrl: "",
  tagline: "Sip sustainably. Grow the movement.",
  heroHeadline: "Join the Navin community",
  heroSubheadline:
    "Every bottle is a step toward a cleaner planet. Verify your purchases, invite friends, and earn rewards for choosing sustainable water.",
  heroCtaLabel: "Become a member",
  heroImage: "",
  communityName: "Navin Community",
  howItWorks: [
    {
      title: "Register",
      description: "Create your free membership and join a community that drinks with purpose.",
    },
    {
      title: "Verify purchases",
      description: "Snap your receipt or bottle code to confirm a real purchase and earn points.",
    },
    {
      title: "Invite friends",
      description: "Share your personal referral link — you and your friend both get rewarded.",
    },
    {
      title: "Earn rewards",
      description: "Redeem your points for perks while supporting a more sustainable future.",
    },
  ],
  showFutureVision: true,
  futureVisionHeading: "The road ahead",
  futureVision: [
    {
      title: "Sustainability tracking",
      description: "See your personal water footprint and environmental impact over time.",
      badge: "Coming soon",
    },
    {
      title: "Carbon savings",
      description: "Turn verified sustainable habits into measurable, validated carbon savings.",
      badge: "Coming soon",
    },
    {
      title: "Tokenized rewards",
      description: "Convert your impact into digital rewards and tokenized assets.",
      badge: "Planned",
    },
    {
      title: "Health & insurance",
      description: "Connect with health and insurance ecosystems for richer benefits.",
      badge: "Planned",
    },
  ],
  pointsForJoining: 100,
  pointsPerVerifiedPurchase: 50,
  pointsPerReferralInviter: 150,
  pointsPerReferralInvitee: 75,
  rewardsCatalog: [
    {
      title: "Free reusable Navin bottle",
      description: "A premium stainless-steel bottle to carry your sustainable habit anywhere.",
      cost: 500,
    },
    {
      title: "10% off your next purchase",
      description: "A discount voucher applied at checkout on Navin water.",
      cost: 250,
    },
    {
      title: "Plant a tree in your name",
      description: "We plant a tree on your behalf with our reforestation partners.",
      cost: 400,
    },
    {
      title: "Navin tote bag",
      description: "Carry your essentials in style with our recycled-material tote.",
      cost: 350,
    },
  ],
  tiers: [
    { name: "Droplet", minPoints: 0 },
    { name: "Stream", minPoints: 500 },
    { name: "River", minPoints: 1500 },
    { name: "Ocean", minPoints: 4000 },
  ],
  footerText: "Navin — building a sustainable water community, one bottle at a time.",
  brandColor: {
    // Base — airy white with the faintest blue tint
    background:        "#f7fbff",
    foreground:        "#0c1f33",
    // Card
    card:              "#ffffff",
    cardForeground:    "#0c1f33",
    // Popover
    popover:           "#ffffff",
    popoverForeground: "#0c1f33",
    // Primary — clear water blue
    primary:           "#0284c7",
    primaryForeground: "#ffffff",
    // Secondary — soft sky tint
    secondary:           "#e0f2fe",
    secondaryForeground: "#075985",
    // Muted
    muted:           "#eef6fc",
    mutedForeground: "#5b7891",
    // Accent — lighter sky highlight
    accent:           "#dbeafe",
    accentForeground: "#0369a1",
    // Destructive
    destructive:           "#ef4444",
    destructiveForeground: "#ffffff",
    // Border / Input / Ring
    border: "#d6e7f3",
    input:  "#d6e7f3",
    ring:   "#0284c7",
    // Charts — water/sustainability spectrum
    chart1: "#0ea5e9",
    chart2: "#06b6d4",
    chart3: "#3b82f6",
    chart4: "#14b8a6",
    chart5: "#2563eb",
    // Navbar
    navbarBackground: "#ffffff",
    // Sidebar
    sidebarBackground:        "#ffffff",
    sidebarForeground:        "#33536e",
    sidebarPrimary:           "#0284c7",
    sidebarPrimaryForeground: "#ffffff",
    sidebarAccent:            "#e0f2fe",
    sidebarAccentForeground:  "#075985",
    sidebarBorder:            "#d6e7f3",
    sidebarRing:              "#0284c7",
  },
  font: {
    headingFont: "Plus Jakarta Sans",
    textFont: "Inter",
  },
  // ─────────────────────────────────────────────────────────────────────
  // Add new field defaults here. See RULES.md §5 for per-type shape.
  // ─────────────────────────────────────────────────────────────────────
};
