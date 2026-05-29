import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import { loadPatterns } from "@/patterns/lib/loadPatterns";
import { loadRefactorings } from "@/refactorings/lib/loadRefactorings";
import { loadSmells } from "@/smells/lib/loadSmells";

import AtlasCanvas from "./components/AtlasCanvas";
import { buildAtlasGraph } from "./lib/buildAtlasGraph";
import { DEFAULT_ATLAS_LAYOUT, layoutAtlasGraph } from "./lib/layoutAtlasGraph";

export default function AtlasView() {
  const layout = layoutAtlasGraph(
    buildAtlasGraph({
      refactorings: loadRefactorings(),
      smells: loadSmells(),
      patterns: loadPatterns(),
    }),
    DEFAULT_ATLAS_LAYOUT,
  );

  return (
    <Container maxWidth={false} disableGutters sx={{ py: 4 }}>
      <Box
        sx={{
          overflowX: "auto",
          overflowY: "hidden",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "thin",
          px: 2,
          "&::-webkit-scrollbar": { height: 6 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.2)",
            borderRadius: 3,
          },
        }}
      >
        <AtlasCanvas layout={layout} />
      </Box>
    </Container>
  );
}
