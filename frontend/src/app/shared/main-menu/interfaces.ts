export interface Category {
  categoryId: number;
  name: string;
  parentCategoryId: number | null;
  imgUrl: string | null;
  subCategories?: Category[];
  accentColor: string;
}
