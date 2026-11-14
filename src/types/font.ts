export type FontId =
  | 'inter'
  | 'outfit'
  | 'be-vietnam-pro'
  | 'playfair'
  | 'jetbrains-mono'
  | 'caveat'
  | 'comfortaa'
  | 'cinzel'
  | 'jakarta'
  | 'custom';

export type FontCategory = 'all' | 'clean' | 'serif' | 'mono' | 'handwriting' | 'rounded' | 'custom';

export interface FontOption {
  id: FontId;
  name: string;
  category: FontCategory;
  fontFamily: string;
  sample: string;
  desc: string;
  descVi: string;
}

export interface CustomFontMeta {
  name: string;
  fileName: string;
  fileSize: number;
  uploadedAt: number;
  format: string;
}

export const PRESET_FONTS: FontOption[] = [
  {
    id: 'inter',
    name: 'Inter',
    category: 'clean',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    sample: 'Aa Bb Gg 123',
    desc: 'Default modern clean sans-serif with exceptional legibility',
    descVi: 'Phông hiện đại tiêu chuẩn, rõ nét và dễ đọc nhất',
  },
  {
    id: 'be-vietnam-pro',
    name: 'Be Vietnam Pro',
    category: 'clean',
    fontFamily: "'Be Vietnam Pro', system-ui, sans-serif",
    sample: 'Tiếng Việt 123',
    desc: 'Geometric neo-grotesque optimized for Vietnamese & global typography',
    descVi: 'Được thiết kế tối ưu riêng cho dấu thanh tiếng Việt & thẩm mỹ cao',
  },
  {
    id: 'outfit',
    name: 'Outfit',
    category: 'clean',
    fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
    sample: 'Aa Bb Gg 123',
    desc: 'Contemporary geometric display font inspired by minimalist aesthetics',
    descVi: 'Phông hình học hiện đại, phong cách tối giản thanh lịch',
  },
  {
    id: 'jakarta',
    name: 'Plus Jakarta Sans',
    category: 'clean',
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    sample: 'Aa Bb Gg 123',
    desc: 'Fresh modern humanist sans with clean balanced curves',
    descVi: 'Nét chữ thanh thoát, đường cong mềm mại và sang trọng',
  },
  {
    id: 'playfair',
    name: 'Playfair Display',
    category: 'serif',
    fontFamily: "'Playfair Display', Georgia, serif",
    sample: 'Aa Bb Gg 123',
    desc: 'High-contrast classic editorial serif with literary warmth',
    descVi: 'Phông có chân cổ điển, đậm chất văn chương và hoài niệm',
  },
  {
    id: 'cinzel',
    name: 'Cinzel',
    category: 'serif',
    fontFamily: "'Cinzel', Georgia, serif",
    sample: 'ROMAN 123',
    desc: 'Cinematic classical Roman inscriptional proportions',
    descVi: 'Hào hùng điện ảnh theo phong cách bia đá La Mã cổ điển',
  },
  {
    id: 'jetbrains-mono',
    name: 'JetBrains Mono',
    category: 'mono',
    fontFamily: "'JetBrains Mono', Menlo, Consolas, monospace",
    sample: 'const code = 1;',
    desc: 'Monospace font crafted for developers and deep coding flow',
    descVi: 'Phông đơn cách chuyên dụng cho coder và góc làm việc công nghệ',
  },
  {
    id: 'caveat',
    name: 'Caveat',
    category: 'handwriting',
    fontFamily: "'Caveat', cursive, sans-serif",
    sample: 'Cozy study notes ~',
    desc: 'Playful and warm handwriting font reminiscent of personal diaries',
    descVi: 'Chữ viết tay ấm áp, nhẹ nhàng như ghi chép sổ nhật ký',
  },
  {
    id: 'comfortaa',
    name: 'Comfortaa',
    category: 'rounded',
    fontFamily: "'Comfortaa', 'Outfit', cursive, sans-serif",
    sample: 'lofi study vibe',
    desc: 'Soft rounded geometric font for cute and cozy lo-fi ambience',
    descVi: 'Đường nét bo tròn dễ thương, chuẩn phong cách chill lo-fi',
  },
];
