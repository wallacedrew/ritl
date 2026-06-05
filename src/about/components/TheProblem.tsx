import Typography from "@mui/material/Typography";

import Term from "@/shared/components/Term";

import AboutSection from "./AboutSection";

export default function TheProblem() {
  return (
    <AboutSection title="The problem">
      <Typography variant="body1">
        No catalog mapped the classic vocabulary onto agent mechanics in a per-entry,
        mechanism-grounded way. The canon was written for human readers — Fowler, Kerievsky, the
        Gang of Four — and LLM-paired developers reach for the same names without a second axis that
        says why each smell costs an agent something different from what it costs a person.
      </Typography>
      <Typography variant="body1">
        Generic &ldquo;AI is bad at long files&rdquo; advice does no work. It names no mechanism,
        picks no entry, gives no remedy.
      </Typography>
      <Typography variant="body1">
        When an LLM is the editor, the binding constraints shift to{" "}
        <Term term="context window">context window</Term> (what fits, what falls outside,{" "}
        <Term term="lost-in-the-middle">lost-in-the-middle</Term>) and{" "}
        <Term term="token cost">token cost</Term> (tokens per read, tokens per branch walk, tokens
        for unrelated payload).
      </Typography>
      <Typography variant="body1">
        A <em>Long Function</em> is hard to read for a human. For an agent, every reasoning pass
        loads the whole body, and each extracted helper inflates context cost by one more
        definition. Same name, different force, different remedy.
      </Typography>
      <Typography variant="body1">
        A reader who knows Fowler can look up <em>Mysterious Name</em> and see, in the same
        vocabulary, why it costs an agent more than a human, and which refactoring&rsquo;s
        agent-side <em>relief</em> cancels which agent-side <em>pressure</em>. The classic
        vocabulary keeps its authority; the agent column carries the second axis.
      </Typography>
    </AboutSection>
  );
}
