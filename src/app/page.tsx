import Hero from "./components/Hero";
import Breed from "./components/Breed";
import Types from "./components/Types";
import Traits from "./components/Traits";
import Price from "./components/Price";
import Care from "./components/Care";
import About from "./components/About";
import Gallery from "./components/Gallery";
import Reviews from "./components/Reviews";
import FAQ from "./components/FAQ";
import ArticlesScroll from "./components/ArticlesScroll";
import { listPages } from "@/lib/seo-pages";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const pages = await listPages();
  return (
    <>
      <Hero />
      <Breed />
      <Types />
      <Traits />
      <Price />
      <Care />
      <About />
      <Gallery />
      <Reviews />
      <ArticlesScroll pages={pages} />
      <FAQ />
    </>
  );
}
