export const MAIN_MENU_SCHEMA: Category[] = [
  {
    "id": "meat-products",
    "label": "М’ясні продукти",
    "color": "#FFE3E3",
    "iconPath": "meat.svg",
    "subcategories": [
      { "id": "fresh-meat", "label": "Свіже м’ясо", "imagePath": "/meat/fresh.png" },
      { "id": "poultry", "label": "Птиця", "imagePath": "/meat/poultry.png" },
      { "id": "offal", "label": "Субпродукти", "imagePath": "/meat/offal.png" },
      { "id": "minced-meat", "label": "Фарш", "imagePath": "/meat/minced.png" },
      { "id": "marinated-meat", "label": "Мариноване м’ясо", "imagePath": "/meat/marinated.png" },
      { "id": "delicacies", "label": "М’ясні делікатеси", "imagePath": "/meat/delicacies.png" },
      { "id": "pre-cooked", "label": "М’ясні напівфабрикати", "imagePath": "/meat/semi-finished.png" }
    ]
  },
  {
    "id": "dairy",
    "label": "Молочні продукти",
    "color": "#D9E4FF",
    "iconPath": "dairy.svg",
    "subcategories": [
      { "id": "milk", "label": "Молоко", "imagePath": "/dairy/milk.png" },
      { "id": "sour-cream-cream", "label": "Сметаната та вершки", "imagePath": "/dairy/cream.png" },
      { "id": "yogurts-desserts", "label": "Йогурти та десерти", "imagePath": "/dairy/yogurt.png" },
      { "id": "cheese", "label": "Сири", "imagePath": "/dairy/cheese.png" },
      { "id": "butter", "label": "Масло", "imagePath": "/dairy/butter.png" },
      { "id": "fermented-milk", "label": "Кисломолочні продукти", "imagePath": "/dairy/kefir.png" },
      { "id": "lactose-free", "label": "Безлактозні товари", "imagePath": "/dairy/lactose-free.png" }
    ]
  },
]