import React, { useState } from "react";
import TarotDNA from "../About/TarotDNA";
import ArcanaField from "./ArcanaField";
import ArcanaPiano from "./ArcanaPiano";
import "./tox-tarot.css";

function ToX() {
  const [activeWorld, setActiveWorld] = useState("deck");

  return (
    <main className={`tarot-world tarot-world-${activeWorld}`}>
      <ArcanaField activeWorld={activeWorld} />
      <section className="tox-section tarot-world-stage">
        <TarotDNA onCardChange={(cardId) => setActiveWorld(cardId || "deck")} />
      </section>
      <ArcanaPiano />
    </main>
  );
}

export default ToX;
