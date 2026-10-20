// The company's social profiles. An entry with no url shows in the footer as plain, inactive text.
export type SocialLink = { label: string; url: string | null };

export const SOCIAL: SocialLink[] = [
  { label: "Facebook", url: "https://www.facebook.com/Alanyogroup/" },
  { label: "Instagram", url: "https://www.instagram.com/alanyogroup/" },
  { label: "TikTok", url: "https://www.tiktok.com/@alanyogroup" },
  { label: "YouTube", url: "https://www.youtube.com/@Alanyogroup" },
];
