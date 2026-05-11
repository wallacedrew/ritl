import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const projectRoot = resolve(__dirname, "../../..");

interface MarketplaceManifest {
  name: string;
  description: string;
  owner: { name: string; email?: string };
  plugins: Array<{
    name: string;
    description: string;
    source: string;
  }>;
}

describe("ritl marketplace manifest", () => {
  const manifest: MarketplaceManifest = JSON.parse(
    readFileSync(resolve(projectRoot, ".claude-plugin/marketplace.json"), "utf-8"),
  );

  it("declares the marketplace name used as the @ritl install suffix", () => {
    expect(manifest.name).toBe("ritl");
  });

  it("identifies the marketplace owner", () => {
    expect(manifest.owner.name.length).toBeGreaterThan(0);
  });

  it("lists exactly one plugin: refactor", () => {
    expect(manifest.plugins).toHaveLength(1);
    const plugin = manifest.plugins[0];
    expect(plugin).toBeDefined();
    expect(plugin!.name).toBe("refactor");
  });

  it("points the plugin source at the in-repo path", () => {
    const plugin = manifest.plugins[0];
    expect(plugin!.source).toBe("./plugin/refactor");
  });
});
