"use client";

import { Button } from "konsta/react";
import Link from "next/link";
import { FiAlertTriangle } from "react-icons/fi";

import { EmptyState } from "@/components/EmptyState";

export default function Error() {
  return (
    <>
      <div className="subpixel-antialiased">
        <EmptyState text="Sorry, the page you are looking for does not exist." icon={FiAlertTriangle} />
        <div>
          <p>If you were trying to contribute data but ended up here, please file a bug.</p>
          <Button>
            <Link key="Report a Bug" href="#" aria-label="Report a Bug" className="flex items-center">
              Report a Bug
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
