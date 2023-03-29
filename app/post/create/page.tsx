import Link from 'next/link';

export default function CreatePost() {
  return (
    <section className="create-post-container">
      <Link href={'/'}>
        <button className="return-btn">
          Return to Home
        </button>
      </Link>
    </section>
  );
};