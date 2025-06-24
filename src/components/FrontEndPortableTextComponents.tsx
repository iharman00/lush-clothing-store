import {
  PortableTextMarkComponentProps,
  PortableTextReactComponents,
} from "next-sanity";

export const H1 = ({ children }: any) => (
  <p className="text-base font-bold mb-2">{children}</p>
);

export const H2 = ({ children }: any) => (
  <p className="text-base font-semibold mb-2">{children}</p>
);

export const H3 = ({ children }: any) => (
  <p className="text-base font-semibold mb-2">{children}</p>
);

export const Normal = ({ children }: any) => (
  <p className="text-base mb-2">{children}</p>
);

export const Bullet = ({ children }: any) => (
  <ul className="list-disc pl-6 mb-4">{children}</ul>
);

export const Number = ({ children }: any) => (
  <ol className="list-decimal pl-6 mb-4">{children}</ol>
);

export const BulletListItem = ({ children }: any) => (
  <li className="mb-2">{children}</li>
);

export const Link = ({ value, children }: PortableTextMarkComponentProps) => {
  const target = (value?.href || "").startsWith("http") ? "_blank" : undefined;
  return (
    <a
      href={value?.href}
      target={target}
      className="underline text-blue-500"
      style={{ overflowWrap: "anywhere" }}
    >
      {children}
    </a>
  );
};

// Custom components for Portable Text
export const customPortableTextComponents: Partial<PortableTextReactComponents> =
  {
    block: {
      h1: H1,
      h2: H2,
      h3: H3,
      normal: Normal,
    },
    list: {
      bullet: Bullet,
      number: Number,
    },
    listItem: {
      bullet: BulletListItem,
      number: BulletListItem, // Using the same component for both bullet and number lists
    },
    marks: {
      link: Link,
    },
  };
