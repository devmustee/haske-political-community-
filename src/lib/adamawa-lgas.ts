/** The 21 local government areas of Adamawa State. */
export const ADAMAWA_LGAS = [
  "Demsa",
  "Fufore",
  "Ganye",
  "Girei",
  "Gombi",
  "Guyuk",
  "Hong",
  "Jada",
  "Lamurde",
  "Madagali",
  "Maiha",
  "Mayo-Belwa",
  "Michika",
  "Mubi North",
  "Mubi South",
  "Numan",
  "Shelleng",
  "Song",
  "Toungo",
  "Yola North",
  "Yola South",
] as const;

export type AdamawaLga = (typeof ADAMAWA_LGAS)[number];
