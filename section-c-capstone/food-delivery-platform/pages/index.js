import Link from 'next/link';

export default function Home() {
  return (
    <section className="hero">
      <h1>Hungry? Get it delivered 🚀</h1>
      <p>Browse the menu, build your cart, and track your orders in real time.</p>
      <Link href="/menu" className="cta">Browse menu →</Link>
    </section>
  );
}

// Static home page, pre-rendered at build time (Next.js SSR/SSG).
export async function getStaticProps() {
  return { props: {} };
}
