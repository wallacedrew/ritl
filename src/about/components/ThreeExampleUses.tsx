import Typography from "@mui/material/Typography";

import AboutSection from "./AboutSection";

export default function ThreeExampleUses() {
  return (
    <AboutSection title="Three example uses">
      <Typography variant="body1">
        <strong>Diagnosing a degrading agent session.</strong> Mid-refactor, the agent starts
        duplicating a helper across three modules and proposing inconsistent signatures. Open the{" "}
        <em>Duplicated Code</em> entry, read the agent-side <em>pressure</em>, follow the cross-link
        to <em>Extract Function</em>, and reshape the prompt to point the agent at the canonical
        helper before asking for the next change.
      </Typography>
      <Typography variant="body1">
        <strong>Writing a team AI coding standard.</strong> Pull up <em>Mysterious Name</em> on the
        compare view. The human column supplies the Fowler framing the team already knows. The agent
        column supplies the missing sentence: every reasoning pass re-derives meaning from
        surrounding context; chained edits compound the cost. Paste both columns into the standards
        doc with a link back to the entry. Repeat for <em>Long Function</em> and{" "}
        <em>Primitive Obsession</em>. The doc now reads as two-actor reasoning, not opinion.
      </Typography>
      <Typography variant="body1">
        <strong>Recognizing a smell the agent just produced.</strong> A fourth{" "}
        <code>switch (kind)</code> block appears in the codebase and quietly breaks one of the older
        three. Search for &ldquo;switch&rdquo;, open <em>Repeated Switches</em>, and read the
        human-side <em>symptom</em>. The agent-side <em>trap</em> lands the stake: adding a new case
        requires the agent to find and modify every site, and missing one ships a silent bug. The
        entry links to <em>Replace Conditional with Polymorphism</em>; the agent-side{" "}
        <em>relief</em> supplies the structural target.
      </Typography>
    </AboutSection>
  );
}
