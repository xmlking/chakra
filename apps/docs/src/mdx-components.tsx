import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { File, Files, Folder } from "fumadocs-ui/components/files";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs, TabsContent, TabsList, TabsTrigger } from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";

import { Mermaid } from "#components/mdx/mermaid";
import { Video } from "#components/video";

// oxlint-disable-next-line import/no-default-export
export default {
  File,
  Files,
  Folder,
  Steps,
  Step,
  Accordion,
  Accordions,
  Mermaid,
  Video,
  Tab,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ...defaultMdxComponents,
} satisfies MDXComponents;
