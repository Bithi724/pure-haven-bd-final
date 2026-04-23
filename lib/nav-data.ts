export const navItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Shop",
    href: "/shop",
    sections: [
      {
        title: "Browse",
        children: [
          { label: "All Products", href: "/shop" },
          { label: "Latest Products", href: "/shop?sort=latest" },
          { label: "Low to High", href: "/shop?sort=price-asc" },
          { label: "High to Low", href: "/shop?sort=price-desc" },
        ],
      },
      {
        title: "Cosmetics",
        children: [
          { label: "Lipstick", href: "/shop?category=cosmetics&subcategory=lipstick" },
          { label: "Liquid Lipstick", href: "/shop?category=cosmetics&subcategory=liquid-lipstick" },
          { label: "Lip Liner", href: "/shop?category=cosmetics&subcategory=lip-liner" },
          { label: "Lip Gloss", href: "/shop?category=cosmetics&subcategory=lip-gloss" },
          { label: "Lip Balm", href: "/shop?category=cosmetics&subcategory=lip-balm" },
          { label: "Foundation", href: "/shop?category=cosmetics&subcategory=foundation" },
          { label: "Face Powder", href: "/shop?category=cosmetics&subcategory=face-powder" },
          { label: "Primer", href: "/shop?category=cosmetics&subcategory=primer" },
        ],
      },
      {
        title: "Haircare",
        children: [
          { label: "Shampoo", href: "/shop?category=haircare&subcategory=shampoo" },
          { label: "Conditioner", href: "/shop?category=haircare&subcategory=conditioner" },
          { label: "Hair Oil", href: "/shop?category=haircare&subcategory=hair-oil" },
          { label: "Hair Serum", href: "/shop?category=haircare&subcategory=hair-serum" },
          { label: "Hair Mask", href: "/shop?category=haircare&subcategory=hair-mask" },
          { label: "Hair Color", href: "/shop?category=haircare&subcategory=hair-color" },
          { label: "Hair Treatment", href: "/shop?category=haircare&subcategory=hair-treatment" },
          { label: "Styling Gel Spray", href: "/shop?category=haircare&subcategory=styling-gel-spray" },
        ],
      },
      {
        title: "Skincare",
        children: [
          { label: "Face Wash", href: "/shop?category=skincare&subcategory=face-wash" },
          { label: "Moisturizer", href: "/shop?category=skincare&subcategory=moisturizer" },
          { label: "Cream", href: "/shop?category=skincare&subcategory=cream" },
          { label: "Lotion", href: "/shop?category=skincare&subcategory=lotion" },
          { label: "Serum", href: "/shop?category=skincare&subcategory=serum" },
          { label: "Sunscreen", href: "/shop?category=skincare&subcategory=sunscreen" },
          { label: "Toner", href: "/shop?category=skincare&subcategory=toner" },
          { label: "Scrub", href: "/shop?category=skincare&subcategory=scrub" },
        ],
      },
    ],
  },
  {
    label: "Cosmetics",
    href: "/shop?category=cosmetics",
    sections: [
      {
        title: "Cosmetics",
        children: [
          { label: "Lipstick", href: "/shop?category=cosmetics&subcategory=lipstick" },
          { label: "Liquid Lipstick", href: "/shop?category=cosmetics&subcategory=liquid-lipstick" },
          { label: "Lip Liner", href: "/shop?category=cosmetics&subcategory=lip-liner" },
          { label: "Lip Gloss", href: "/shop?category=cosmetics&subcategory=lip-gloss" },
          { label: "Lip Balm", href: "/shop?category=cosmetics&subcategory=lip-balm" },
          { label: "Foundation", href: "/shop?category=cosmetics&subcategory=foundation" },
          { label: "Face Powder", href: "/shop?category=cosmetics&subcategory=face-powder" },
          { label: "Primer", href: "/shop?category=cosmetics&subcategory=primer" },
          { label: "Concealer", href: "/shop?category=cosmetics&subcategory=concealer" },
          { label: "Blush", href: "/shop?category=cosmetics&subcategory=blush" },
          { label: "Highlighter", href: "/shop?category=cosmetics&subcategory=highlighter" },
          { label: "Eyeliner", href: "/shop?category=cosmetics&subcategory=eyeliner" },
          { label: "Kajal", href: "/shop?category=cosmetics&subcategory=kajal" },
          { label: "Mascara", href: "/shop?category=cosmetics&subcategory=mascara" },
          { label: "Eyeshadow", href: "/shop?category=cosmetics&subcategory=eyeshadow" },
          { label: "Eyebrow Pencil", href: "/shop?category=cosmetics&subcategory=eyebrow-pencil" },
          { label: "Brush", href: "/shop?category=cosmetics&subcategory=brush" },
        ],
      },
    ],
  },
  {
    label: "Haircare",
    href: "/shop?category=haircare",
    sections: [
      {
        title: "Haircare",
        children: [
          { label: "Shampoo", href: "/shop?category=haircare&subcategory=shampoo" },
          { label: "Conditioner", href: "/shop?category=haircare&subcategory=conditioner" },
          { label: "Hair Oil", href: "/shop?category=haircare&subcategory=hair-oil" },
          { label: "Hair Serum", href: "/shop?category=haircare&subcategory=hair-serum" },
          { label: "Hair Mask", href: "/shop?category=haircare&subcategory=hair-mask" },
          { label: "Hair Color", href: "/shop?category=haircare&subcategory=hair-color" },
          { label: "Hair Treatment", href: "/shop?category=haircare&subcategory=hair-treatment" },
          { label: "Styling Gel Spray", href: "/shop?category=haircare&subcategory=styling-gel-spray" },
          { label: "Others", href: "/shop?category=haircare&subcategory=others" },
        ],
      },
    ],
  },
  {
    label: "Skincare",
    href: "/shop?category=skincare",
    sections: [
      {
        title: "Skincare",
        children: [
          { label: "Face Wash", href: "/shop?category=skincare&subcategory=face-wash" },
          { label: "Moisturizer", href: "/shop?category=skincare&subcategory=moisturizer" },
          { label: "Cream", href: "/shop?category=skincare&subcategory=cream" },
          { label: "Lotion", href: "/shop?category=skincare&subcategory=lotion" },
          { label: "Serum", href: "/shop?category=skincare&subcategory=serum" },
          { label: "Sunscreen", href: "/shop?category=skincare&subcategory=sunscreen" },
          { label: "Toner", href: "/shop?category=skincare&subcategory=toner" },
          { label: "Scrub", href: "/shop?category=skincare&subcategory=scrub" },
          { label: "Face Mask", href: "/shop?category=skincare&subcategory=face-mask" },
          { label: "Petroleum Jelly", href: "/shop?category=skincare&subcategory=petroleum-jelly" },
          { label: "Others", href: "/shop?category=skincare&subcategory=others" },
        ],
      },
    ],
  },
  {
    label: "Perfume",
    href: "/shop?category=perfume",
    sections: [
      {
        title: "Perfume",
        children: [
          { label: "EDT Men", href: "/shop?category=perfume&subcategory=edt-men" },
          { label: "EDP Men", href: "/shop?category=perfume&subcategory=edp-men" },
          { label: "Perfume Men", href: "/shop?category=perfume&subcategory=perfume-men" },
          { label: "EDT Women", href: "/shop?category=perfume&subcategory=edt-women" },
          { label: "EDP Women", href: "/shop?category=perfume&subcategory=edp-women" },
          { label: "Perfume Women", href: "/shop?category=perfume&subcategory=perfume-women" },
          { label: "Attar", href: "/shop?category=perfume&subcategory=attar" },
          { label: "Others", href: "/shop?category=perfume&subcategory=others" },
        ],
      },
    ],
  },
  {
    label: "Mens Products",
    href: "/shop?category=mens-products",
    sections: [
      {
        title: "Mens Products",
        children: [
          { label: "Shirts", href: "/shop?category=mens-products&subcategory=shirts" },
          { label: "T-Shirts", href: "/shop?category=mens-products&subcategory=t-shirts" },
          { label: "Panjabi", href: "/shop?category=mens-products&subcategory=panjabi" },
          { label: "Pants", href: "/shop?category=mens-products&subcategory=pants" },
          { label: "Wallet", href: "/shop?category=mens-products&subcategory=wallet" },
          { label: "Belt", href: "/shop?category=mens-products&subcategory=belt" },
          { label: "Watch", href: "/shop?category=mens-products&subcategory=watch" },
          { label: "Others", href: "/shop?category=mens-products&subcategory=others" },
        ],
      },
    ],
  },
  {
    label: "Food",
    href: "/shop?category=food",
    sections: [
      {
        title: "Food",
        children: [
          { label: "Oil & Ghee", href: "/shop?category=food&subcategory=oil-ghee" },
          { label: "Honey", href: "/shop?category=food&subcategory=honey" },
          { label: "Dates", href: "/shop?category=food&subcategory=dates" },
          { label: "Spices", href: "/shop?category=food&subcategory=spices" },
          { label: "Nuts & Seeds", href: "/shop?category=food&subcategory=nuts-seeds" },
          { label: "Beverage", href: "/shop?category=food&subcategory=beverage" },
          { label: "Rice", href: "/shop?category=food&subcategory=rice" },
          { label: "Flours & Lentils", href: "/shop?category=food&subcategory=flours-lentils" },
          { label: "Certified", href: "/shop?category=food&subcategory=certified" },
          { label: "Pickle", href: "/shop?category=food&subcategory=pickle" },
        ],
      },
    ],
  },
  {
    label: "Track Order",
    href: "/track-order",
  },
];