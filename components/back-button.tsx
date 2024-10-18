import React from 'react';
import Link from "next/link";

const BackButton = ({ href }: { href: string }) => {
  return (
    <Link href={href} className="flex flex-row gap-1 items-center mb-4 text-md">
      <i className="ri-arrow-left-line"></i>
      <span>返回</span>
    </Link>
  );
};

export default BackButton;