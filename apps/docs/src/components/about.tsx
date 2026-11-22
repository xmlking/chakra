import { Banner } from "fumadocs-ui/components/banner";
// import { GithubInfo } from "fumadocs-ui/components/github-info";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";

// import { ENV } from "#env";

const rainbowColors = [
  "rgba(255,100,0, 0.5)",
  "rgba(255,100,0, 0.5)",
  "transparent",
  "rgba(255,100,0, 0.5)",
  "transparent",
  "rgba(255,100,0, 0.5)",
  "transparent",
];

export function About() {
  return (
    <main>
      <Banner
        id="banner-demo"
        className="z-0"
        variant="rainbow"
        rainbowColors={rainbowColors}
        changeLayout={false}
      >
        This a Banner: Check out my GutHub repo
      </Banner>
      <h1>About</h1>
      <ImageZoom
        alt="banner"
        src={`${import.meta.env.BASE_URL.replace(/\/$/, "")}/og2.png`}
        className="bg-fd-background !my-0 rounded-xl"
        priority
      />
      <p>This page is rendered from a route file.</p>

      {/* <GraphView graph={buildGraph()} /> */}
      {/* <GithubInfo
        owner="xmlking"
        repo="chakra"
        // your own GitHub access token (optional)
        token={ENV.GITHUB_TOKEN}
      /> */}
    </main>
  );
}
