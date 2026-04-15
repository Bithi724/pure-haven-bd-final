type NavChild = {
  label: string;
  href: string;
};

type NavSection = {
  title: string;
  children: NavChild[];
};

type NavItem = {
  label: string;
  href: string;
  sections?: NavSection[];
};

export const navItems: NavItem[] = [
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
          { label: "Low to High", href: "/shop?sort=price-low" },
          { label: "High to Low", href: "/shop?sort=price-high" },
        ],
      },
      {
        title: "Cosmetics",
        children: [
          { label: "Lipstick", href: "/shop?category=cosmetics&subcategory=lipstick" },
          {
            label: "Liquid Lipstick",
            href: "/shop?category=cosmetics&subcategory=liquid-lipstick",
          },
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
          {
            label: "Eyebrow Pencil",
            href: "/shop?category=cosmetics&subcategory=eyebrow-pencil",
          },
          { label: "Brush", href: "/shop?category=cosmetics&subcategory=brush" },
          { label: "Sponge", href: "/shop?category=cosmetics&subcategory=sponge" },
          {
            label: "Makeup Remover",
            href: "/shop?category=cosmetics&subcategory=makeup-remover",
          },
          { label: "Others", href: "/shop?category=cosmetics&subcategory=others" },
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
          {
            label: "Hair Treatment",
            href: "/shop?category=haircare&subcategory=hair-treatment",
          },
          {
            label: "Styling Gel Spray",
            href: "/shop?category=haircare&subcategory=styling-gel-spray",
          },
          { label: "Others", href: "/shop?category=haircare&subcategory=others" },
        ],
      },
      {
        title: "Skincare",
        children: [
          { label: "Face Wash", href: "/shop?category=skincare&subcategory=face-wash" },
          {
            label: "Moisturizer",
            href: "/shop?category=skincare&subcategory=moisturizer",
          },
          { label: "Cream", href: "/shop?category=skincare&subcategory=cream" },
          { label: "Lotion", href: "/shop?category=skincare&subcategory=lotion" },
          { label: "Serum", href: "/shop?category=skincare&subcategory=serum" },
          { label: "Sunscreen", href: "/shop?category=skincare&subcategory=sunscreen" },
          { label: "Toner", href: "/shop?category=skincare&subcategory=toner" },
          { label: "Scrub", href: "/shop?category=skincare&subcategory=scrub" },
          { label: "Face Mask", href: "/shop?category=skincare&subcategory=face-mask" },
          {
            label: "Petroleum Jelly",
            href: "/shop?category=skincare&subcategory=petroleum-jelly",
          },
          { label: "Others", href: "/shop?category=skincare&subcategory=others" },
        ],
      },
      {
        title: "Perfume",
        children: [
          { label: "EDT Men", href: "/shop?category=perfume&subcategory=edt-men" },
          { label: "EDP Men", href: "/shop?category=perfume&subcategory=edp-men" },
          {
            label: "Perfume Men",
            href: "/shop?category=perfume&subcategory=perfume-men",
          },
          { label: "EDT Women", href: "/shop?category=perfume&subcategory=edt-women" },
          { label: "EDP Women", href: "/shop?category=perfume&subcategory=edp-women" },
          {
            label: "Perfume Women",
            href: "/shop?category=perfume&subcategory=perfume-women",
          },
          { label: "Attar", href: "/shop?category=perfume&subcategory=attar" },
          {
            label: "Air Freshener",
            href: "/shop?category=perfume&subcategory=air-freshener",
          },
          { label: "Others", href: "/shop?category=perfume&subcategory=others" },
        ],
      },
      {
        title: "Food",
        children: [
          { label: "Honey", href: "/shop?category=food&subcategory=honey" },
          { label: "Tea", href: "/shop?category=food&subcategory=tea" },
          { label: "Coffee", href: "/shop?category=food&subcategory=coffee" },
          { label: "Snacks", href: "/shop?category=food&subcategory=snacks" },
          { label: "Chocolate", href: "/shop?category=food&subcategory=chocolate" },
          {
            label: "Organic Food",
            href: "/shop?category=food&subcategory=organic-food",
          },
          {
            label: "Health Drinks",
            href: "/shop?category=food&subcategory=health-drinks",
          },
          { label: "Others", href: "/shop?category=food&subcategory=others" },
        ],
      },
      {
        title: "Mens Products",
        children: [
          {
            label: "Face Wash",
            href: "/shop?category=mens-products&subcategory=face-wash",
          },
          {
            label: "Beard Oil",
            href: "/shop?category=mens-products&subcategory=beard-oil",
          },
          {
            label: "Shaving Cream",
            href: "/shop?category=mens-products&subcategory=shaving-cream",
          },
          {
            label: "After Shave",
            href: "/shop?category=mens-products&subcategory=after-shave",
          },
          {
            label: "Deodorant",
            href: "/shop?category=mens-products&subcategory=deodorant",
          },
          {
            label: "Body Spray",
            href: "/shop?category=mens-products&subcategory=body-spray",
          },
          {
            label: "Grooming Kit",
            href: "/shop?category=mens-products&subcategory=grooming-kit",
          },
          {
            label: "Others",
            href: "/shop?category=mens-products&subcategory=others",
          },
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
          { label: "All Cosmetics", href: "/shop?category=cosmetics" },
          { label: "Lipstick", href: "/shop?category=cosmetics&subcategory=lipstick" },
          {
            label: "Liquid Lipstick",
            href: "/shop?category=cosmetics&subcategory=liquid-lipstick",
          },
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
          { label: "Others", href: "/shop?category=cosmetics&subcategory=others" },
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
          { label: "All Haircare", href: "/shop?category=haircare" },
          { label: "Shampoo", href: "/shop?category=haircare&subcategory=shampoo" },
          { label: "Conditioner", href: "/shop?category=haircare&subcategory=conditioner" },
          { label: "Hair Oil", href: "/shop?category=haircare&subcategory=hair-oil" },
          { label: "Hair Serum", href: "/shop?category=haircare&subcategory=hair-serum" },
          { label: "Hair Mask", href: "/shop?category=haircare&subcategory=hair-mask" },
          { label: "Hair Color", href: "/shop?category=haircare&subcategory=hair-color" },
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
          { label: "All Skincare", href: "/shop?category=skincare" },
          { label: "Face Wash", href: "/shop?category=skincare&subcategory=face-wash" },
          { label: "Moisturizer", href: "/shop?category=skincare&subcategory=moisturizer" },
          { label: "Cream", href: "/shop?category=skincare&subcategory=cream" },
          { label: "Lotion", href: "/shop?category=skincare&subcategory=lotion" },
          { label: "Serum", href: "/shop?category=skincare&subcategory=serum" },
          { label: "Sunscreen", href: "/shop?category=skincare&subcategory=sunscreen" },
          { label: "Toner", href: "/shop?category=skincare&subcategory=toner" },
          { label: "Scrub", href: "/shop?category=skincare&subcategory=scrub" },
          { label: "Face Mask", href: "/shop?category=skincare&subcategory=face-mask" },
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
          { label: "All Perfume", href: "/shop?category=perfume" },
          { label: "EDT Men", href: "/shop?category=perfume&subcategory=edt-men" },
          { label: "EDP Men", href: "/shop?category=perfume&subcategory=edp-men" },
          {
            label: "Perfume Men",
            href: "/shop?category=perfume&subcategory=perfume-men",
          },
          { label: "EDT Women", href: "/shop?category=perfume&subcategory=edt-women" },
          { label: "EDP Women", href: "/shop?category=perfume&subcategory=edp-women" },
          {
            label: "Perfume Women",
            href: "/shop?category=perfume&subcategory=perfume-women",
          },
          { label: "Attar", href: "/shop?category=perfume&subcategory=attar" },
          { label: "Others", href: "/shop?category=perfume&subcategory=others" },
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
          { label: "All Food", href: "/shop?category=food" },
          { label: "Honey", href: "/shop?category=food&subcategory=honey" },
          { label: "Tea", href: "/shop?category=food&subcategory=tea" },
          { label: "Coffee", href: "/shop?category=food&subcategory=coffee" },
          { label: "Snacks", href: "/shop?category=food&subcategory=snacks" },
          { label: "Chocolate", href: "/shop?category=food&subcategory=chocolate" },
          {
            label: "Organic Food",
            href: "/shop?category=food&subcategory=organic-food",
          },
          {
            label: "Health Drinks",
            href: "/shop?category=food&subcategory=health-drinks",
          },
          { label: "Others", href: "/shop?category=food&subcategory=others" },
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
          { label: "All Men's Products", href: "/shop?category=mens-products" },
          {
            label: "Face Wash",
            href: "/shop?category=mens-products&subcategory=face-wash",
          },
          {
            label: "Beard Oil",
            href: "/shop?category=mens-products&subcategory=beard-oil",
          },
          {
            label: "Shaving Cream",
            href: "/shop?category=mens-products&subcategory=shaving-cream",
          },
          {
            label: "After Shave",
            href: "/shop?category=mens-products&subcategory=after-shave",
          },
          {
            label: "Deodorant",
            href: "/shop?category=mens-products&subcategory=deodorant",
          },
          {
            label: "Body Spray",
            href: "/shop?category=mens-products&subcategory=body-spray",
          },
          {
            label: "Grooming Kit",
            href: "/shop?category=mens-products&subcategory=grooming-kit",
          },
          {
            label: "Others",
            href: "/shop?category=mens-products&subcategory=others",
          },
        ],
      },
    ],
  },
];