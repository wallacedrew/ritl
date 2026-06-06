import Typography from "@mui/material/Typography";

import AboutSection from "./AboutSection";

export default function ThreeExampleUses() {
  return (
    <AboutSection title="Three example uses">
      <Typography variant="body1">
        <strong>Steering the agent back on track.</strong> You&rsquo;re mid-refactor with the agent
        — the plugin is installed, so the agent announces &ldquo;Duplicated Code; I&rsquo;ll apply
        Extract Function&rdquo; before editing. The smell is right, the remedy is right; what drifts
        is the helper&rsquo;s signature, module to module. You know Fowler. Open{" "}
        <em>Duplicated Code</em> on the site, read the agent-side <em>pressure</em>: each reasoning
        pass loads only the slice the agent is in, so the canonical helper falls outside the window
        each time. Pin the helper&rsquo;s full signature into your next prompt and the agent
        finishes with one signature, not three.
      </Typography>
      <Typography variant="body1">
        <strong>Writing a team AI coding standard.</strong> You&rsquo;re drafting a doc the team
        will live by — per-smell reasoning that lands as citable, not as your opinion. Pull up{" "}
        <em>Mysterious Name</em> on the compare view. The human column supplies the Fowler framing
        the team already knows. The agent column supplies the missing sentence: every reasoning pass
        re-derives meaning from surrounding context; chained edits compound the cost. Paste both
        columns into the standards doc with a link back to the entry. Repeat for{" "}
        <em>Long Function</em> and <em>Primitive Obsession</em>. Roll the plugin out to the team
        next, so every agent on every laptop announces the same smells with the same vocabulary the
        doc cites.
      </Typography>
      <Typography variant="body1">
        <strong>Naming what the agent just produced.</strong> Without the plugin installed, the
        agent dropped a fourth <code>switch (kind)</code> block into the codebase, and it quietly
        breaks one of the older three. You don&rsquo;t have a name for the pattern — you have the
        word <em>switch</em>. Search for it on the site, open <em>Repeated Switches</em>, and read
        the human-side <em>symptom</em>: now you have the canonical name. The agent-side{" "}
        <em>trap</em> lands the stake: adding a new case requires the agent to find and modify every
        site, and missing one ships a silent bug. The entry links to{" "}
        <em>Replace Conditional with Polymorphism</em>. Install the plugin with{" "}
        <code>/plugin install refactor@ritl</code> so next time the agent announces{" "}
        <em>Repeated Switches</em> before producing the fourth block.
      </Typography>
    </AboutSection>
  );
}
