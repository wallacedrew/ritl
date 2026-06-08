import Typography from "@mui/material/Typography";

import AboutSection from "./AboutSection";

export default function ThreeExampleUses() {
  return (
    <AboutSection title="Three example uses">
      <Typography variant="body1">
        <strong>The agent is drifting.</strong> Third file, same helper, three signatures. The
        plugin already named it — &ldquo;Duplicated Code; I&rsquo;ll apply Extract Function&rdquo; —
        and the names are right. The signatures still drift. That&rsquo;s a window problem, not a
        knowledge problem. Open <em>Duplicated Code</em> on the site. The agent-side{" "}
        <em>pressure</em> says it plainly: each pass loads only the slice the agent is in. The
        canonical helper is out of sight. Paste the helper&rsquo;s full signature into your next
        prompt. Three becomes one.
      </Typography>
      <Typography variant="body1">
        <strong>The team needs a standard, not an opinion.</strong> Pull up <em>Mysterious Name</em>{" "}
        on the compare view. The human column gives the team Fowler — they know that part. The agent
        column gives the sentence they don&rsquo;t have yet: every reasoning pass re-derives meaning
        from surrounding context; chained edits compound the cost. Paste both columns into the doc.
        Link back. Repeat for <em>Long Function</em> and <em>Primitive Obsession</em>. Then put the
        plugin on every laptop so the agents speak the doc&rsquo;s words back to the team.
      </Typography>
      <Typography variant="body1">
        <strong>
          A fourth <code>switch (kind)</code> block. One of the old three is broken.
        </strong>{" "}
        No plugin yet. You don&rsquo;t have a name — only the word <em>switch</em>. That&rsquo;s
        enough. Search the site, open <em>Repeated Switches</em>, read the human-side{" "}
        <em>symptom</em>. You have the name now. The agent-side <em>trap</em> spells the cost: a new
        case means finding every site; missing one ships a silent bug. The entry links to{" "}
        <em>Replace Conditional with Polymorphism</em>. Install the plugin:{" "}
        <code>/plugin install refactor@ritl</code>. Next time, the agent names{" "}
        <em>Repeated Switches</em> before the fourth block gets written.
      </Typography>
    </AboutSection>
  );
}
