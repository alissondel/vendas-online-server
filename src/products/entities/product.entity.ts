import { CartProductEntity } from "../../cart-products/entities/cart-product.entity";
import { CategoryEntity } from "../../categories/entities/category.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'product' })
export class ProductEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'price', nullable: false })
  price: number;

  @Column({ name: 'image', nullable: false })
  image: string;

  @Column({ name: 'category_id', nullable: false })
  categoryId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @ManyToOne(
    () => CategoryEntity,
    (category: CategoryEntity) => category.products,
  )
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category?: CategoryEntity;

  @OneToMany(() => CartProductEntity, (cartProductEntity) => cartProductEntity.product)
  cartProducts?: CartProductEntity[]
}
