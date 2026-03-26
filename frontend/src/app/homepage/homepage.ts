import { Component } from '@angular/core';
import { BannerSectionComponent } from './banner-section/banner-section';
import { CategoryCard } from './category-card/category-card';
import { Products } from '../client';
import { ProductSliderComponent } from "../shared/product-slider/product-slider";

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    BannerSectionComponent,
    CategoryCard,
    ProductSliderComponent
],
  templateUrl: './homepage.html',
  styleUrl: './homepage.scss'
})
export class Homepage {
  readonly leftImages = [
    'assets/banner/banner-1.png',
    'assets/banner/banner-2.png'
  ];

  readonly products: Partial<Products>[] = [
    {
      imgUrl: 'assets/products/noodles.png',
      name: 'Вермішель «Мівіна»',
      description: 'з соусом солодкий чилі',
      price: '42.0',
    },
    {
      imgUrl: 'assets/products/reeva.png',
      name: 'Вермішель Reeva',
      description: 'зі смаком курки',
      price: '18.69',
    },
    {
      imgUrl: 'assets/products/pelmeni.png',
      name: 'Пельмені «Три ведмеді»',
      description: 'зі смаком індички',
      price: '310.0',
    },
    {
      imgUrl: 'assets/products/varenyky.png',
      name: 'Вареники «Три Ведмеді»',
      description: 'з картоплею',
      price: '70.0',
    },
    {
      imgUrl: 'assets/products/puree.png',
      name: 'Пюре Reeva',
      description: 'швидкого приготування',
      price: '38.2',
    },
    {
      imgUrl: 'assets/products/cordero.png',
      name: 'Полента Cordero',
      description: 'швидкого приготування',
      price: '90.0',
    },
    {
      imgUrl: 'assets/products/glads-wok-soba.png',
      name: 'Локшина Glads Wok Soba',
      description: 'швидкого приготування',
      price: '75.99',
    },
    {
      imgUrl: 'assets/products/ekstra-oats.png',
      name: 'Пластівці вівсяні',
      description: 'екст. швидкого приготування',
      price: '17.99',
    },
    {
      imgUrl: 'assets/products/alive-mushroom-soup.png',
      name: 'Крем-суп Alive з грибами',
      description: 'швидкого приготування',
      price: '33.99',
    },
    {
      imgUrl: 'assets/products/oat-flakes-mix.png',
      name: 'Суміш пластівців',
      description: 'злаки швидкого приготування',
      price: '11.99',
    }
  ];
  readonly extraCategories1 = [
    { title: 'Макарони', image: 'images/categories/pasta.svg',  bgColor: '#E6E8DF' },
    { title: 'Птиця', image: '/images/categories/chicken.svg',bgColor: '#EFCFD3' },
    { title: 'Піца та напівфабрикати', image: '/images/categories/pizza.svg', bgColor: '#DDE7CF' },
    { title: 'Соки', image: '/images/categories/1.png', bgColor: '#DDE7CF' },
    { title: 'Фрукти', image: '/images/categories/fruits.png', bgColor: '#CFE3E7' }
  ];
  readonly candyBoxes: Partial<Products>[] = [
    {
      imgUrl: 'assets/products/toffifee.png',
      name: 'Цукерки Toffifee',
      description: 'Subtitle',
      price: '190.00',
    },
    {
      imgUrl: 'assets/products/schoko-gruss.png',
      name: 'Набір шоколадних фігур',
      description: 'Шоко-кули',
      price: '229.00',
    },
    {
      imgUrl: 'assets/products/pure-chocolate.png',
      name: 'Цукерки Pure Chocolate',
      description: 'трюфель асорті',
      price: '400.00',
    },
    {
      imgUrl: 'assets/products/merci.png',
      name: 'Шоколад Merci асорті',
      description: 'Subtitle',
      price: '429.00',
    },
    {
      imgUrl: 'assets/products/lindt-lindor.png',
      name: 'Цукерки Lindt Lindor',
      description: 'Subtitle',
      price: '95.00',
    },
    {
      imgUrl: 'assets/products/milka-heart.png',
      name: 'Цукерки Milka в шоколаді',
      description: 'Subtitle',
      price: '169.00',
    },
    {
      imgUrl: 'assets/products/lovita.png',
      name: 'Цукерки у шоколаді',
      description: '«Пташине молоко»',
      price: '179.00',
    },
    {
      imgUrl: 'assets/products/raffaello.png',
      name: 'Цукерки Raffaello',
      description: 'Subtitle',
      price: '199.00',
    },
    {
      imgUrl: 'assets/products/belgidor.png',
      name: 'Цукерки BelgidOr',
      description: '«Морські мушлі»',
      price: '199.00',
    },
    {
      imgUrl: 'assets/products/millennium.png',
      name: 'Цукерки Millennium',
      description: 'з арахісом та родзинками',
      price: '99.99',
    }
  ];
  
  readonly sweetSpreads: Partial<Products>[] = [
    {
      imgUrl: 'assets/products/nutella-classic.png',
      name: 'Паста Nutella з какао',
      description: 'з какао',
      price: '484.00',
    },
    {
      imgUrl: 'assets/products/milka-spread.png',
      name: 'Паста Milka горіхова',
      description: 'з фундуком та какао',
      price: '199.00',
    },
    {
      imgUrl: 'assets/products/peanut-butter.png',
      name: 'Паста арахісова',
      description: 'класична',
      price: '199.00',
    },
    {
      imgUrl: 'assets/products/peanut-crunch.png',
      name: 'Паста арахісова',
      description: 'з сіллю і крихтами',
      price: '149.00',
    },
    {
      imgUrl: 'assets/products/peanut-tom.png',
      name: 'Паста арахісова',
      description: 'карнч с/б',
      price: '199.00',
    },
    {
      imgUrl: 'assets/products/nutella-alt.png',
      name: 'Паста горіхова Nutella',
      description: 'Subtitle',
      price: '149.00',
    },
    {
      imgUrl: 'assets/products/pralinutta.png',
      name: 'Паста Pralinutta',
      description: 'з горіхами та какао',
      price: '259.00',
    },
    {
      imgUrl: 'assets/products/pralinutta-duo.png',
      name: 'Паста Pralinutta Duo',
      description: 'з горіхами та какао',
      price: '299.00',
    },
    {
      imgUrl: 'assets/products/coconut-manna.png',
      name: 'Паста кокосова Aumi',
      description: 'ніжна',
      price: '174.00',
    },
    {
      imgUrl: 'assets/products/nutella-small.png',
      name: 'Паста горіхова Nutella',
      description: 'Subtitle',
      price: '149.00',
    }
  ];
  readonly extraCategories2 = [
    { title: 'Овочі', image: '/images/categories/vegetables.svg',  bgColor: '#A9C37A' },
    { title: 'Торти та десерти', image: '/images/categories/desserts.svg',bgColor: '#E2B8C8' },
    { title: 'Газовані напої', image: '/images/categories/drinks.svg', bgColor: '#F0C987' },
    { title: 'Кава та чай', image: '/images/categories/coffee.svg', bgColor: '#D6C9B3' },
    { title: 'Свіже м’ясо', image: '/images/categories/meat.svg', bgColor: '#B7CFB2' }
  ];
  
  readonly yogurtProducts: Partial<Products>[] = [
    {
      imgUrl: '/images/products/yogurt1.png',
      name: 'Десерт сирковий Valio',
      description: 'ваніль-лимон',
      price: '92.99',
    },
    {
      imgUrl: '/images/products/yogurt2.png',
      name: 'Пудинг Valio PROfeel',
      description: 'ваніль та біле',
      price: '93.99',
    },
    {
      imgUrl: '/images/products/yogurt3.png',
      name: 'Десерт сирковий',
      description: 'ваніль та манго',
      price: '88.49',
    },
    {
      imgUrl: '/images/products/yogurt4.png',
      name: 'Йогурт Bakoma MEN',
      description: 'зі смаком ванілі',
      price: '68.99',
    },
    {
      imgUrl: '/images/products/yogurt5.png',
      name: 'Пудинг Valio PROfeel',
      description: 'з карамеллю',
      price: '91.99',
    },
    {
      imgUrl: '/images/products/yogurt6.png',
      name: 'Йогурт Bakoma MEN',
      description: 'манго-маракуя',
      price: '84.99',
    },
    {
      imgUrl: '/images/products/yogurt7.png',
      name: 'Мус Valio',
      description: 'шоколадний',
      price: '79.99',
    },
    {
      imgUrl: '/images/products/yogurt8.png',
      name: 'Коктейль Valio PROfeel',
      description: 'шоколадний',
      price: '139.00',
    }
  ];

  onAddToCart(product: Products): void {
    console.log('Added to cart:', product);
  }
}