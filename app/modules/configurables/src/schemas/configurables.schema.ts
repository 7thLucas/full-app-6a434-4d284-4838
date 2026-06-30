/* START: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */
export interface FieldSchemaType {
  fieldName?: string;
  type:
    | "string"
    | "number"
    | "boolean"
    | "object"
    | "array"
    | "color"
    | "url"
    | "enum"
    | "datetime"
    | "file"
    | "files";
  required?: boolean;
  label?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  options?: string[];
  fields?: FieldSchemaType[];
  item?: FieldSchemaType;
}
/* END: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */

export type ConfigurableSchemas = {
  formSchema: FieldSchemaType[];
};



export const configurableSchemas: ConfigurableSchemas = {
  formSchema: [
    {
      fieldName: "appName",
      type: "string",
      required: true,
      label: "App Name",
    },
    {
      fieldName: "logoUrl",
      type: "url",
      required: true,
      label: "Logo URL",
    },
    {
      fieldName: "brandColor",
      type: "object",
      required: true,
      label: "Brand Color",
      fields: [
        // ── Base ────────────────────────────────────────────────────────────
        { fieldName: "background",        type: "color", required: true,  label: "Background" },
        { fieldName: "foreground",        type: "color", required: true,  label: "Foreground" },
        // ── Card ────────────────────────────────────────────────────────────
        { fieldName: "card",              type: "color", required: true,  label: "Card" },
        { fieldName: "cardForeground",    type: "color", required: true,  label: "Card Foreground" },
        // ── Popover ─────────────────────────────────────────────────────────
        { fieldName: "popover",           type: "color", required: true,  label: "Popover" },
        { fieldName: "popoverForeground", type: "color", required: true,  label: "Popover Foreground" },
        // ── Primary ─────────────────────────────────────────────────────────
        { fieldName: "primary",           type: "color", required: true,  label: "Primary" },
        { fieldName: "primaryForeground", type: "color", required: true,  label: "Primary Foreground" },
        // ── Secondary ───────────────────────────────────────────────────────
        { fieldName: "secondary",           type: "color", required: true,  label: "Secondary" },
        { fieldName: "secondaryForeground", type: "color", required: true,  label: "Secondary Foreground" },
        // ── Muted ───────────────────────────────────────────────────────────
        { fieldName: "muted",           type: "color", required: true,  label: "Muted" },
        { fieldName: "mutedForeground", type: "color", required: true,  label: "Muted Foreground" },
        // ── Accent ──────────────────────────────────────────────────────────
        { fieldName: "accent",           type: "color", required: true,  label: "Accent" },
        { fieldName: "accentForeground", type: "color", required: true,  label: "Accent Foreground" },
        // ── Destructive ─────────────────────────────────────────────────────
        { fieldName: "destructive",           type: "color", required: true,  label: "Destructive" },
        { fieldName: "destructiveForeground", type: "color", required: true,  label: "Destructive Foreground" },
        // ── Border / Input / Ring ────────────────────────────────────────────
        { fieldName: "border", type: "color", required: true, label: "Border" },
        { fieldName: "input",  type: "color", required: true, label: "Input" },
        { fieldName: "ring",   type: "color", required: true, label: "Ring" },
        // ── Charts ──────────────────────────────────────────────────────────
        { fieldName: "chart1", type: "color", required: false, label: "Chart 1" },
        { fieldName: "chart2", type: "color", required: false, label: "Chart 2" },
        { fieldName: "chart3", type: "color", required: false, label: "Chart 3" },
        { fieldName: "chart4", type: "color", required: false, label: "Chart 4" },
        { fieldName: "chart5", type: "color", required: false, label: "Chart 5" },
        // ── Navbar ──────────────────────────────────────────────────────────
        { fieldName: "navbarBackground", type: "color", required: true, label: "Navbar Background" },
        // ── Sidebar ─────────────────────────────────────────────────────────
        { fieldName: "sidebarBackground",        type: "color", required: true,  label: "Sidebar Background" },
        { fieldName: "sidebarForeground",        type: "color", required: true,  label: "Sidebar Foreground" },
        { fieldName: "sidebarPrimary",           type: "color", required: true,  label: "Sidebar Primary" },
        { fieldName: "sidebarPrimaryForeground", type: "color", required: true,  label: "Sidebar Primary Foreground" },
        { fieldName: "sidebarAccent",            type: "color", required: true,  label: "Sidebar Accent" },
        { fieldName: "sidebarAccentForeground",  type: "color", required: true,  label: "Sidebar Accent Foreground" },
        { fieldName: "sidebarBorder",            type: "color", required: true,  label: "Sidebar Border" },
        { fieldName: "sidebarRing",              type: "color", required: true,  label: "Sidebar Ring" },
      ],
    },

    // ── Brand copy ────────────────────────────────────────────────────────
    {
      fieldName: "tagline",
      type: "string",
      required: false,
      label: "Tagline",
      maxLength: 160,
    },
    {
      fieldName: "heroHeadline",
      type: "string",
      required: false,
      label: "Hero Headline",
      maxLength: 120,
    },
    {
      fieldName: "heroSubheadline",
      type: "string",
      required: false,
      label: "Hero Subheadline",
      maxLength: 280,
    },
    {
      fieldName: "heroCtaLabel",
      type: "string",
      required: false,
      label: "Hero CTA Label",
      maxLength: 40,
    },
    {
      fieldName: "heroImage",
      type: "file",
      required: false,
      label: "Hero Image",
    },
    {
      fieldName: "communityName",
      type: "string",
      required: false,
      label: "Community Name",
      maxLength: 60,
    },

    // ── Landing: how it works ───────────────────────────────────────────────
    {
      fieldName: "howItWorks",
      type: "array",
      required: false,
      label: "How It Works Steps",
      item: {
        type: "object",
        fields: [
          { fieldName: "title", type: "string", required: true, label: "Title" },
          { fieldName: "description", type: "string", required: true, label: "Description" },
        ],
      },
    },

    // ── Landing: future / staged vision ─────────────────────────────────────
    {
      fieldName: "showFutureVision",
      type: "boolean",
      required: false,
      label: "Show Future Vision Section",
    },
    {
      fieldName: "futureVisionHeading",
      type: "string",
      required: false,
      label: "Future Vision Heading",
      maxLength: 120,
    },
    {
      fieldName: "futureVision",
      type: "array",
      required: false,
      label: "Future Vision Items (Coming Soon)",
      item: {
        type: "object",
        fields: [
          { fieldName: "title", type: "string", required: true, label: "Title" },
          { fieldName: "description", type: "string", required: true, label: "Description" },
          { fieldName: "badge", type: "string", required: false, label: "Badge" },
        ],
      },
    },

    // ── Loyalty / rewards economy ───────────────────────────────────────────
    {
      fieldName: "pointsForJoining",
      type: "number",
      required: false,
      label: "Welcome Points (on join)",
      min: 0,
      max: 100000,
    },
    {
      fieldName: "pointsPerVerifiedPurchase",
      type: "number",
      required: false,
      label: "Points Per Verified Purchase",
      min: 0,
      max: 100000,
    },
    {
      fieldName: "pointsPerReferralInviter",
      type: "number",
      required: false,
      label: "Referral Points — Inviter",
      min: 0,
      max: 100000,
    },
    {
      fieldName: "pointsPerReferralInvitee",
      type: "number",
      required: false,
      label: "Referral Points — New Member",
      min: 0,
      max: 100000,
    },
    {
      fieldName: "rewardsCatalog",
      type: "array",
      required: false,
      label: "Rewards Catalog",
      item: {
        type: "object",
        fields: [
          { fieldName: "title", type: "string", required: true, label: "Reward Title" },
          { fieldName: "description", type: "string", required: false, label: "Description" },
          { fieldName: "cost", type: "number", required: true, label: "Cost (points)" },
        ],
      },
    },

    // ── Membership tiers ────────────────────────────────────────────────────
    {
      fieldName: "tiers",
      type: "array",
      required: false,
      label: "Membership Tiers",
      item: {
        type: "object",
        fields: [
          { fieldName: "name", type: "string", required: true, label: "Tier Name" },
          { fieldName: "minPoints", type: "number", required: true, label: "Minimum Points" },
        ],
      },
    },

    // ── Footer ──────────────────────────────────────────────────────────────
    {
      fieldName: "footerText",
      type: "string",
      required: false,
      label: "Footer Text",
      maxLength: 240,
    },

    {
      fieldName: "font",
      type: "object",
      required: true,
      label: "Typography",
      fields: [
        {
          fieldName: "headingFont",
          type: "enum",
          required: true,
          label: "Heading Font",
          options: [
            "Inter",
            "Inter Tight",
            "Plus Jakarta Sans",
            "Poppins",
            "Montserrat",
            "Raleway",
            "Playfair Display",
            "Lora",
            "Merriweather",
            "EB Garamond",
            "Cinzel",
            "Cormorant Garamond",
            "Libre Baskerville",
            "PT Serif",
            "Nunito",
            "Outfit",
            "DM Sans",
            "Sora",
            "Space Grotesk",
            "Josefin Sans",
            "Rubik",
            "Quicksand",
            "Figtree",
            "Lexend",
          ],
        },
        {
          fieldName: "textFont",
          type: "enum",
          required: true,
          label: "Text Font",
          options: [
            "Inter",
            "Inter Tight",
            "Plus Jakarta Sans",
            "Poppins",
            "Montserrat",
            "Raleway",
            "Lora",
            "Merriweather",
            "EB Garamond",
            "Libre Baskerville",
            "PT Serif",
            "Nunito",
            "Outfit",
            "DM Sans",
            "Sora",
            "Source Sans 3",
            "Noto Sans",
            "Lato",
            "Open Sans",
            "Roboto",
            "Rubik",
            "Quicksand",
            "Figtree",
            "Lexend",
          ],
        },
      ],
    },
  ],
};