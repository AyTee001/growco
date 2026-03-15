interface Subcategory {
  id: string;
  label: string;
  imagePath: string;
}

interface Category {
  id: string;
  label: string;
  iconPath: string;
  color: string;
  subcategories: Subcategory[];
}