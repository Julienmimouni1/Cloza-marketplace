export type MenuItem = {
  title: string;
  href: string;
  children?: MenuItem[];
};

export const MENU_DATA: MenuItem[] = [
  {
    title: "New products",
    href: "/catalog?sort=newest",
  },
  {
    title: "Beauty & Wellness",
    href: "/catalog?category=Beauty",
    children: [
      {
        title: "Facial Care",
        href: "/catalog?category=Facial%20Care",
        children: [
          { title: "Cleansers & Toners", href: "/catalog?category=Cleansers%20%26%20Toners" },
          { title: "Moisturizers & Creams", href: "/catalog?category=Moisturizers%20%26%20Creams" },
          { title: "Masks & Treatments", href: "/catalog?category=Masks%20%26%20Treatments" },
        ],
      },
      {
        title: "Body Care",
        href: "/catalog?category=Body%20Care",
        children: [
          { title: "Body Lotions & Oils", href: "/catalog?category=Body%20Lotions%20%26%20Oils" },
          { title: "Scrubs & Exfoliants", href: "/catalog?category=Scrubs%20%26%20Exfoliants" },
          { title: "Hand & Foot Care", href: "/catalog?category=Hand%20%26%20Foot%20Care" },
        ],
      },
      {
        title: "Hair",
        href: "/catalog?category=Hair",
        children: [
          { title: "Shampoos & Conditioners", href: "/catalog?category=Shampoos%20%26%20Conditioners" },
          { title: "Hair Treatments & Masks", href: "/catalog?category=Hair%20Treatments%20%26%20Masks" },
          { title: "Styling Products & Tools", href: "/catalog?category=Styling%20Products%20%26%20Tools" },
        ],
      },
      {
        title: "Makeup",
        href: "/catalog?category=Makeup",
        children: [
          { title: "Face Makeup", href: "/catalog?category=Face%20Makeup" },
          { title: "Eye Makeup", href: "/catalog?category=Eye%20Makeup" },
          { title: "Lips", href: "/catalog?category=Lips" },
        ],
      },
      {
        title: "Fragrance",
        href: "/catalog?category=Fragrance",
        children: [
          { title: "Perfumes & Eau de Parfum", href: "/catalog?category=Perfumes%20%26%20Eau%20de%20Parfum" },
          { title: "Body Mists & Sprays", href: "/catalog?category=Body%20Mists%20%26%20Sprays" },
          { title: "Home Fragrances", href: "/catalog?category=Home%20Fragrances" },
        ],
      },
      {
        title: "Beauty accessory",
        href: "/catalog?category=Beauty%20accessory",
        children: [
          { title: "Makeup Brushes & Tools", href: "/catalog?category=Makeup%20Brushes%20%26%20Tools" },
          { title: "Skincare Tools", href: "/catalog?category=Skincare%20Tools" },
          { title: "Hair Accessories", href: "/catalog?category=Hair%20Accessories" },
        ],
      },
      {
        title: "Beauty & personnal care",
        href: "/catalog?category=Beauty%20%26%20personnal%20care",
        children: [
          { title: "Hygiene Essentials", href: "/catalog?category=Hygiene%20Essentials" },
          { title: "Oral Care", href: "/catalog?category=Oral%20Care" },
          { title: "Wellness Products", href: "/catalog?category=Wellness%20Products" },
        ],
      },
      {
        title: "Natural & Organic Products",
        href: "/catalog?category=Natural%20%26%20Organic%20Products",
        children: [
          { title: "Organic Skincare", href: "/catalog?category=Organic%20Skincare" },
          { title: "Natural Haircare", href: "/catalog?category=Natural%20Haircare" },
          { title: "Eco-friendly Beauty Accessories", href: "/catalog?category=Eco-friendly%20Beauty%20Accessories" },
        ],
      },
    ],
  },
  {
    title: "Food & Beverages",
    href: "/catalog?category=Food",
    children: [
      {
        title: "Savory Grocery",
        href: "/catalog?category=Savory%20Grocery",
        children: [
          { title: "Pasta, Rice & Grains", href: "/catalog?category=Pasta,%20Rice%20%26%20Grains" },
          { title: "Sauces, Condiments & Seasonings", href: "/catalog?category=Sauces,%20Condiments%20%26%20Seasonings" },
          { title: "Oils & Vinegars", href: "/catalog?category=Oils%20%26%20Vinegars" },
        ],
      },
      {
        title: "Sweet Grocery",
        href: "/catalog?category=Sweet%20Grocery",
        children: [
          { title: "Biscuits, Chocolate & Sweets", href: "/catalog?category=Biscuits,%20Chocolate%20%26%20Sweets" },
          { title: "Jams, Honey & Spreads", href: "/catalog?category=Jams,%20Honey%20%26%20Spreads" },
          { title: "Breakfast & Baking Essentials", href: "/catalog?category=Breakfast%20%26%20Baking%20Essentials" },
        ],
      },
      {
        title: "World Food",
        href: "/catalog?category=World%20Food",
        children: [
          { title: "African & Caribbean", href: "/catalog?category=African%20%26%20Caribbean" },
          { title: "Asian & Oriental", href: "/catalog?category=Asian%20%26%20Oriental" },
          { title: "Mediterranean & European", href: "/catalog?category=Mediterranean%20%26%20European" },
        ],
      },
      {
        title: "Salty Snacks",
        href: "/catalog?category=Salty%20Snacks",
        children: [
          { title: "Chips, Nuts & Crackers", href: "/catalog?category=Chips,%20Nuts%20%26%20Crackers" },
        ],
      },
      {
        title: "Sweet Snacks",
        href: "/catalog?category=Sweet%20Snacks",
        children: [
          { title: "Pastries, Cakes & Biscuits", href: "/catalog?category=Pastries,%20Cakes%20%26%20Biscuits" },
        ],
      },
      {
        title: "Energy & Protein Snacks",
        href: "/catalog?category=Energy%20%26%20Protein%20Snacks",
        children: [
          { title: "Energy Bars, Protein Cookies, Dried Fruits", href: "/catalog?category=Energy%20Bars,%20Protein%20Cookies,%20Dried%20Fruits" },
        ],
      },
      {
        title: "Non-Alcoholic",
        href: "/catalog?category=Non-Alcoholic",
        children: [
          { title: "Juices & Smoothies", href: "/catalog?category=Juices%20%26%20Smoothies" },
          { title: "Coffee, Tea & Infusions", href: "/catalog?category=Coffee,%20Tea%20%26%20Infusions" },
          { title: "Functional & Energy Drinks", href: "/catalog?category=Functional%20%26%20Energy%20Drinks" },
        ],
      },
      {
        title: "Alcoholic",
        href: "/catalog?category=Alcoholic",
        children: [
          { title: "Wine, Beer & Spirits", href: "/catalog?category=Wine,%20Beer%20%26%20Spirits" },
        ],
      },
      {
        title: "Healthy Drinks",
        href: "/catalog?category=Healthy%20Drinks",
        children: [
          { title: "Plant-Based Milks, Kombucha & Fermented Drinks", href: "/catalog?category=Plant-Based%20Milks,%20Kombucha%20%26%20Fermented%20Drinks" },
        ],
      },
      {
        title: "Fine Grocery",
        href: "/catalog?category=Fine%20Grocery",
        children: [
          { title: "Truffle, Foie Gras & Delicatessen", href: "/catalog?category=Truffle,%20Foie%20Gras%20%26%20Delicatessen" },
          { title: "Specialty Oils & Vinegars", href: "/catalog?category=Specialty%20Oils%20%26%20Vinegars" },
          { title: "Artisan Chocolates & Sweets", href: "/catalog?category=Artisan%20Chocolates%20%26%20Sweets" },
        ],
      },
      {
        title: "Gift & Seasonal",
        href: "/catalog?category=Gift%20%26%20Seasonal",
        children: [
          { title: "Gourmet Gift Boxes", href: "/catalog?category=Gourmet%20Gift%20Boxes" },
          { title: "Seasonal & Limited Editions", href: "/catalog?category=Seasonal%20%26%20Limited%20Editions" },
        ],
      },
      {
        title: "Bulk Ingredients",
        href: "/catalog?category=Bulk%20Ingredients",
        children: [
          { title: "Flour, Sugar, Spices", href: "/catalog?category=Flour,%20Sugar,%20Spices" },
        ],
      },
      {
        title: "Professional Drinks",
        href: "/catalog?category=Professional%20Drinks",
        children: [
          { title: "Coffee Beans, Syrups, Barista Supplies", href: "/catalog?category=Coffee%20Beans,%20Syrups,%20Barista%20Supplies" },
        ],
      },
      {
        title: "Catering Essentials",
        href: "/catalog?category=Catering%20Essentials",
        children: [
          { title: "Ready Meals & Tableware", href: "/catalog?category=Ready%20Meals%20%26%20Tableware" },
        ],
      },
    ],
  },
  {
    title: "Textile",
    href: "/catalog?category=Textile",
    children: [
      {
        title: "Women",
        href: "/catalog?category=Women",
        children: [
          { title: "Tops", href: "/catalog?category=Tops" },
          { title: "Bottoms", href: "/catalog?category=Bottoms" },
          { title: "Sets & Jumpsuits", href: "/catalog?category=Sets%20%26%20Jumpsuits" },
          { title: "Jackets & Coats", href: "/catalog?category=Jackets%20%26%20Coats" },
          { title: "Lingerie, Swimwear & Underwear", href: "/catalog?category=Lingerie,%20Swimwear%20%26%20Underwear" },
          { title: "Pyjamas & Homewear", href: "/catalog?category=Pyjamas%20%26%20Homewear" },
          { title: "Sportswear / Activewear", href: "/catalog?category=Sportswear%20/%20Activewear" },
          { title: "Footwear", href: "/catalog?category=Footwear" },
        ],
      },
      {
        title: "Men",
        href: "/catalog?category=Men",
        children: [
          { title: "Tops", href: "/catalog?category=Tops" },
          { title: "Bottoms", href: "/catalog?category=Bottoms" },
          { title: "Suits & Blazers", href: "/catalog?category=Suits%20%26%20Blazers" },
          { title: "Sets / Matching Outfits", href: "/catalog?category=Sets%20/%20Matching%20Outfits" },
          { title: "Coats & Jackets", href: "/catalog?category=Coats%20%26%20Jackets" },
          { title: "Underwear & Socks", href: "/catalog?category=Underwear%20%26%20Socks" },
          { title: "Pyjamas & Homewear", href: "/catalog?category=Pyjamas%20%26%20Homewear" },
          { title: "Sportswear / Activewear", href: "/catalog?category=Sportswear%20/%20Activewear" },
          { title: "Footwear", href: "/catalog?category=Footwear" },
        ],
      },
      {
        title: "Kids",
        href: "/catalog?category=Kids",
        children: [
          { title: "Girl", href: "/catalog?category=Girl" },
          { title: "Boy", href: "/catalog?category=Boy" },
          { title: "Baby", href: "/catalog?category=Baby" },
          { title: "Shoes and Slippers", href: "/catalog?category=Shoes%20and%20Slippers" },
          { title: "Accessories", href: "/catalog?category=Accessories" },
        ],
      },
      {
        title: "Bags and accessories",
        href: "/catalog?category=Bags%20and%20accessories",
        children: [
          { title: "Bags", href: "/catalog?category=Bags" },
          { title: "Belts", href: "/catalog?category=Belts" },
          { title: "Ties", href: "/catalog?category=Ties" },
          { title: "Scarves", href: "/catalog?category=Scarves" },
          { title: "Gloves", href: "/catalog?category=Gloves" },
          { title: "Hats", href: "/catalog?category=Hats" },
        ],
      },
    ],
  },
];