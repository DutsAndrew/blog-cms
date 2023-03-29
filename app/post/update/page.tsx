import Link from 'next/link';

export default function UpdatePost() {
  return (
    <section className="update-post-container">
    <Link href={'/'}>
      <button className="return-btn">
        Return to Home
      </button>
    </Link>
  </section>
  );
};