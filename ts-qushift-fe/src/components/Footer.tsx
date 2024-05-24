import Link from "next/link";

export function Footer() {
  return (
    <footer>
      <div>
        <div />
        <div>
          <div>
            <Link href="/" aria-label="Dashboard" className="flex items-center gap-1">
              {/*<Image src="/images/logos/logo.svg" className="mx-auto object-fill" width="48" height="48" alt="logo" />*/}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
