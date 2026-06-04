import Typography from "@mui/material/Typography";

import Term from "@/shared/components/Term";

import AboutSection from "./AboutSection";

export default function TheProblem() {
  return (
    <AboutSection title="The problem">
      <Typography variant="body1">
        The existing canon was written for human readers. When an LLM is the editor, the binding
        constraints shift to <Term term="context window">context window</Term> (what fits, what
        falls outside, <Term term="lost-in-the-middle">lost-in-the-middle</Term>) and{" "}
        <Term term="token cost">token cost</Term> (tokens per read, tokens per branch walk, tokens
        for unrelated payload).
      </Typography>
      <Typography variant="body1">
        A <em>Long Function</em> is hard to read for a human. For an agent, every reasoning pass
        loads the whole body, and each extracted helper inflates context cost by one more definition
        (see ADR-0006). Same name, different force, different remedy.
      </Typography>
      <Typography variant="body1">
        No catalog mapped the classic vocabulary onto agent mechanics in a per-entry,
        mechanism-grounded way. Generic &ldquo;AI is bad at long files&rdquo; advice is slop. This
        site forces every entry to name one specific failure mode in the context-window or
        token-cost frame (voice rubric, ADR-0005 → ADR-0006).
      </Typography>
      <Typography variant="body1">
        The catalog covers around 140 entries across the three books. Six force fields per entry,
        two actors, neutral facts-only voice. Hedge words (<em>can, may, might, tends to</em>) and
        load-bearing abstract nouns (<em>complexity, coupling, coordination, ergonomics</em>) are
        banned. A user-visible stake lands in every <em>pressure</em> and <em>trap</em>.
      </Typography>
      <Typography variant="body1">
        A reader who knows Fowler can look up <em>Mysterious Name</em> and see, in the same
        vocabulary, why it costs an agent more than a human, and which refactoring&rsquo;s
        agent-side <em>relief</em> cancels which agent-side <em>pressure</em>. The classic
        vocabulary keeps its authority; the agent column is the new lens.
      </Typography>
    </AboutSection>
  );
}
