/* Article body on the server: prepare the blocks (sanitise, link standards), then draw them. */
import type { Block } from "@/lib/content/types";
import { prepareBlocks } from "@/lib/article-prepare";
import { ArticleBlocks } from "./ArticleBlocks";

export function ArticleBody({ blocks, showAd }: { blocks: Block[]; showAd: boolean }) {
  return <ArticleBlocks blocks={prepareBlocks(blocks)} showAd={showAd} />;
}
