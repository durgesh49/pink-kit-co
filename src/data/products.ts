import jersey1 from "@/assets/jersey-1.jpg";
import jersey2 from "@/assets/jersey-2.jpg";
import jersey3 from "@/assets/jersey-3.jpg";
import jersey4 from "@/assets/jersey-4.jpg";
import jersey5 from "@/assets/jersey-5.jpg";
import jersey6 from "@/assets/jersey-6.jpg";

export type Product = {
  id: string;
  name: string;
  team: string;
  price: number;
  oldPrice?: number;
  image: string;
  trending?: boolean;
  badge?: string;
  description: string;
};

export const teams = [
  { name: "Barcelona", emoji: "🔵🔴", count: 4 },
  { name: "Real Madrid", emoji: "⚪", count: 3 },
  { name: "PSG", emoji: "🔵", count: 3 },
  { name: "Man United", emoji: "🔴", count: 2 },
  { name: "Man City", emoji: "🩵", count: 2 },
  { name: "Brazil", emoji: "💛", count: 2 },
];

export const products: Product[] = [
  { id: "1", name: "Barcelona Home '24", team: "Barcelona", price: 1499, oldPrice: 2199, image: jersey1, trending: true, badge: "Bestseller", description: "Iconic blaugrana stripes. Lightweight breathable mesh. Officially-styled drip." },
  { id: "2", name: "Real Madrid Home '24", team: "Real Madrid", price: 1599, image: jersey2, trending: true, badge: "New", description: "Clean white classic. Premium fabric, slim modern fit." },
  { id: "3", name: "PSG Home '24", team: "PSG", price: 1399, oldPrice: 1999, image: jersey3, trending: true, description: "Parisian navy with red stripe. Streetwear meets stadium." },
  { id: "4", name: "Brazil Home '24", team: "Brazil", price: 1299, image: jersey4, trending: true, badge: "Hot", description: "Samba yellow energy. Lightweight, vibrant, instantly iconic." },
  { id: "5", name: "Man City Home '24", team: "Man City", price: 1499, image: jersey5, description: "Sky blue, modern cut. The drip of champions." },
  { id: "6", name: "Man United Home '24", team: "Man United", price: 1499, oldPrice: 1899, image: jersey6, description: "Devil red, bold and timeless." },
  { id: "7", name: "Barcelona Away '24", team: "Barcelona", price: 1399, image: jersey1, description: "Alternate colorway, same iconic crest." },
  { id: "8", name: "Real Madrid Away '24", team: "Real Madrid", price: 1499, image: jersey2, badge: "Limited", description: "Clean lines, royal heritage." },
  { id: "9", name: "PSG Third '24", team: "PSG", price: 1599, image: jersey3, description: "Statement third kit. Pure attitude." },
  { id: "10", name: "Brazil Away '24", team: "Brazil", price: 1299, image: jersey4, description: "Cool blue alternate. Selecao style." },
  { id: "11", name: "Man City Away '24", team: "Man City", price: 1499, image: jersey5, description: "Crisp lines. Champions everywhere." },
  { id: "12", name: "Man United Away '24", team: "Man United", price: 1499, image: jersey6, description: "Classy second kit." },
  { id: "13", name: "Barcelona Retro '92", team: "Barcelona", price: 1799, image: jersey1, badge: "Retro", description: "Vintage drip, modern stitch." },
  { id: "14", name: "PSG Retro '98", team: "PSG", price: 1699, image: jersey3, description: "Throwback Paris classic." },
];

export const reviews = [
  { name: "Aarav S.", text: "Quality is unreal for the price. Fits perfectly and the fabric feels premium. Got compliments all week.", rating: 5 },
  { name: "Priya K.", text: "Obsessed with the Barcelona drop. Came in 3 days, packaging was so cute 🥹", rating: 5 },
  { name: "Rohan M.", text: "Easy returns when I needed a size up. Super smooth experience.", rating: 5 },
  { name: "Zara A.", text: "Wearing this on game days now. The colors are so accurate, looks identical to the real thing.", rating: 5 },
];
