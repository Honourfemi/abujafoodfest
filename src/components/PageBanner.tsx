type PageBannerProps = {
  breadcrumb: string;
  eyebrow: string;
  title: string;
  description?: string;
};

export function PageBanner({ breadcrumb, eyebrow, title, description }: PageBannerProps) {
  return (
    <div className="page-banner">
      <div className="container">
        <p className="breadcrumb">
          Home / <b>{breadcrumb}</b>
        </p>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
    </div>
  );
}
