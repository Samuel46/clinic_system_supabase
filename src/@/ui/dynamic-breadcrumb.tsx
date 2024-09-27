import React from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@ui/breadcrumb";
import { usePathname } from "next/navigation";

// Utility function to capitalize a string
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

// Generate breadcrumb items from the pathname
const generateBreadcrumbItems = (pathname: string | null) => {
  if (!pathname) return [];

  const pathSegments = pathname.split("/").filter((segment) => segment);

  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    const label = capitalize(segment);
    return { href, label };
  });

  return breadcrumbItems;
};

const DynamicBreadcrumb: React.FC = () => {
  const pathname = usePathname();
  const breadcrumbItems = generateBreadcrumbItems(pathname);

  return (
    <Breadcrumb className="hidden md:flex ">
      <BreadcrumbList>
        {/* Dynamic Breadcrumb Items */}
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.href}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {index < breadcrumbItems.length - 1 ? (
                <BreadcrumbLink asChild>
                  <Link href={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="text-primary font-bold">
                  {item.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DynamicBreadcrumb;
