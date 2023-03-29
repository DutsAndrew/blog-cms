import Link from 'next/link';

export default function DeletePost() {
  return (
    <section className="delete-post-container">
      <Link href={'/'}>
        <button className="return-btn">
          Return to Home
        </button>
      </Link>
    </section>
  );
};