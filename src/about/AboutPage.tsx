import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import Attributions from "./components/Attributions";
import TheProblem from "./components/TheProblem";
import ThreeExampleUses from "./components/ThreeExampleUses";
import WhatThisIs from "./components/WhatThisIs";
import WhoThisIsFor from "./components/WhoThisIsFor";

export default function AboutPage() {
  return (
    <Container maxWidth="lg" sx={{ pt: 4, pb: 6 }}>
      <Stack spacing={5}>
        <Stack spacing={1}>
          <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
            About
          </Typography>
          <Typography variant="body1" color="text.secondary">
            What Refactoring In The Loop is, who it is for, and the books and tools it stands on.
          </Typography>
        </Stack>

        <WhatThisIs />
        <Divider />
        <WhoThisIsFor />
        <Divider />
        <TheProblem />
        <Divider />
        <ThreeExampleUses />
        <Divider />
        <Attributions />
      </Stack>
    </Container>
  );
}
