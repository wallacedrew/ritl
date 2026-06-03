import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import AboutSection from "./AboutSection";

export default function Attributions() {
  return (
    <AboutSection title="Attributions">
      <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 700 }}>
        Source works
      </Typography>
      <Typography variant="body1">
        Every entry name, the category structures, and the conceptual frame are drawn from these
        books.
      </Typography>
      <Stack component="ul" spacing={1} sx={{ pl: 3, my: 0 }}>
        <Typography component="li" variant="body1">
          Martin Fowler. <em>Refactoring: Improving the Design of Existing Code</em>, 2nd ed.
          Addison-Wesley, 2018. ISBN 978-0134757599.
        </Typography>
        <Typography component="li" variant="body1">
          Joshua Kerievsky. <em>Refactoring to Patterns</em>. Addison-Wesley, 2004. ISBN
          978-0321213358.
        </Typography>
        <Typography component="li" variant="body1">
          Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides.{" "}
          <em>Design Patterns: Elements of Reusable Object-Oriented Software</em>. Addison-Wesley,
          1994. ISBN 978-0201633610.
        </Typography>
      </Stack>
      <Typography variant="body1">
        This site does not reproduce the books&rsquo; prose, diagrams, or code listings. The
        agent-side force fields, the compare-view commentary, and any synthesized examples are
        original to Refactoring In The Loop. This is a reference and study aid; it is not a
        substitute for reading the originals. Where an example is derived from a source book, the
        entry carries a per-entry citation in its <code>exampleSource</code> field.
      </Typography>

      <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 700, pt: 1 }}>
        Built with
      </Typography>
      <Stack component="ul" spacing={0.5} sx={{ pl: 3, my: 0 }}>
        <Typography component="li" variant="body1">
          Next.js (MIT, Vercel).
        </Typography>
        <Typography component="li" variant="body1">
          React (MIT, Meta).
        </Typography>
        <Typography component="li" variant="body1">
          Material UI v9 + Emotion (MIT).
        </Typography>
        <Typography component="li" variant="body1">
          TypeScript (Apache 2.0, Microsoft).
        </Typography>
        <Typography component="li" variant="body1">
          Geist font family (SIL Open Font License 1.1, Vercel).
        </Typography>
        <Typography component="li" variant="body1">
          Vitest, ESLint, Prettier, and the wider open-source ecosystem.
        </Typography>
      </Stack>
      <Typography variant="body1">
        Hosted on Vercel. Inbound feedback email routes through Cloudflare Email Routing (see
        ADR-0003).
      </Typography>

      <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 700, pt: 1 }}>
        AI in production
      </Typography>
      <Typography variant="body1">
        Portions of this site&rsquo;s prose, including the agent-side force fields, were drafted by
        AI coding agents (Anthropic Claude) working from the source books and reviewed and edited by
        the author. The architecture, voice rubric, and editorial decisions are the author&rsquo;s.
        The full decision record lives under <code>docs/architecture/</code>.
      </Typography>

      <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 700, pt: 1 }}>
        Contact
      </Typography>
      <Typography variant="body1">
        Feedback to{" "}
        <Link href="mailto:feedback@refactoringintheloop.com">
          feedback@refactoringintheloop.com
        </Link>
        .
      </Typography>
    </AboutSection>
  );
}
