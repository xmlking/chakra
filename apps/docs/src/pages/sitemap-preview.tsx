import { getPressContext } from "fumapress";

// config file
import type PressConfig from "../../press.config";

// oxlint-disable-next-line import/no-default-export
export default async function Page() {
  const { getLoader } = getPressContext<typeof PressConfig.$context>();
  const source = await getLoader();
  const pages = source.getPages();

  return (
    <main>
      <h1>Sitemap Preview</h1>
      <ul>
        {pages.map((page) => (
          <li key={page.url}>
            <a href={page.url}>{page.url}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
