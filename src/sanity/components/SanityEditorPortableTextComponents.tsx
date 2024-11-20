export const H1 = ({ children }: any) => (
  <p className="text-base font-bold">{children}</p>
);

export const H2 = ({ children }: any) => (
  <p className="text-base font-semibold">{children}</p>
);

export const H3 = ({ children }: any) => (
  <p className="text-base font-semibold">{children}</p>
);

export const Normal = ({ children }: any) => (
  <p className="text-base">{children}</p>
);

export const Bullet = ({ children }: any) => (
  <ul className="list-disc *:my-auto">{children}</ul>
);

export const Number = ({ children }: any) => (
  <ol className="list-decimal *:my-auto">{children}</ol>
);
