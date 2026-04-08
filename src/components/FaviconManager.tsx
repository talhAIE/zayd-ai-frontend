import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const FAVICON_SETS = {
  english: [
    { id: "favicon-ico", size: "any", href: "/favicons/favicon.ico" },
  ],
} as const;

type FaviconSetKey = keyof typeof FAVICON_SETS;

const ensureFaviconLink = (id: string) => {
  let link = document.getElementById(id) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.id = id;
    link.rel = "icon";
    link.type = "image/x-icon";
    document.head.appendChild(link);
  }
  return link;
};

const applyFaviconSet = (setKey: FaviconSetKey) => {
  FAVICON_SETS[setKey].forEach(({ id, size, href }) => {
    const link = ensureFaviconLink(id);
    link.sizes = size;
    link.href = href;
  });
};

const FaviconManager = () => {
  const location = useLocation();

  useEffect(() => {
    applyFaviconSet("english");
  }, [location.pathname]);

  return null;
};

export default FaviconManager;
