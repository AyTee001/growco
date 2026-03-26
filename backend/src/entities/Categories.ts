import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Products } from './Products';

@Index('categories_pkey', ['categoryId'], { unique: true })
@Index('categories_name_key', ['name'], { unique: true })
@Index('ix_categories_parent_id', ['parentCategoryId'], {})
@Entity('categories', { schema: 'public' })
export class Categories {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'category_id' })
  categoryId: number;

  @Column('character varying', { name: 'name', unique: true, length: 100 })
  name: string;

  @Column('integer', { name: 'parent_category_id', nullable: true })
  parentCategoryId: number | null;

  @Column('character varying', { name: 'img_url', nullable: true, length: 500 })
  imgUrl: string | null;

  @Column('character varying', { name: 'accent_color', nullable: true, length: 7 })
  accentColor: string | null;

  @ManyToOne(() => Categories, (categories) => categories.categories)
  @JoinColumn([
    { name: 'parent_category_id', referencedColumnName: 'categoryId' },
  ])
  parentCategory: Categories;

  @OneToMany(() => Categories, (categories) => categories.parentCategory)
  categories: Categories[];

  @ManyToMany(() => Products, (products) => products.categories)
  @JoinTable({
    name: 'productcategories',
    joinColumns: [{ name: 'category_id', referencedColumnName: 'categoryId' }],
    inverseJoinColumns: [
      { name: 'product_id', referencedColumnName: 'productId' },
    ],
    schema: 'public',
  })
  products: Products[];
}

export class CreateCategoryDto {
  name: string;
  parentCategoryId?: number | null;
  imgUrl?: string | null;
}
