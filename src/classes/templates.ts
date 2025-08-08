export function gameOverTemp() {
  return `<div class="end">
        <h2 class="endText">Game Over<h2>
        <button id="playAgainBtn" class="menu">Play Again</button>
        <button id="backBtn" class="menu">Menü</button>
       </div>
    `;
}

export function wonTemp() {
  return `<div class="end"><h2 class="endText"> GG's you won!<h2>
        <button id="playAgainBtn" class="menu"> Play Again</button>
        <button id="backBtn" class="menu">Menü</button>
        </div>`;
}

export function muteTemp() {
  return ` <img
          class="sound"
          src="assets/spritesheets/bg/mute.png"
          alt="Sound"
        />`;
}

export function audioTemp() {
  return ` <img
          class="sound"
          src="assets/spritesheets/bg/audio.png"
          alt="Sound"
        />`;
}

export function impressumTemp() {
  return ` <div id="impressumContent"> <h1 class="impressum__title">Impressum</h1>

    <section class="impressum__section">
      <h2 class="impressum__heading">Angaben gemäß § 5 TMG</h2>
      <p class="impressum__text">
        Patrick Höpner<br>
        Lerchenstraße 23<br>
        14612 Falkensee<br>
        Deutschland
      </p>
    </section>

    <section class="impressum__section">
      <h2 class="impressum__heading">Kontakt</h2>
      <p class="impressum__text">
        E-Mail: <a href="mailto:patrick-hoepner@outlook.de" class="impressum__link">patrick-hoepner@outlook.de</a><br>
        Telefon: 015253614955
      </p>
    </section>

    <section class="impressum__section">
      <h2 class="impressum__heading">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
      <p class="impressum__text">
        Patrick Höpner<br>
        Lerchenstraße 23<br>
        14612 Falkensee
      </p>
    </section>

    <section class="impressum__section">
      <h2 class="impressum__heading">Haftung für Inhalte</h2>
      <p class="impressum__text">
        Als Diensteanbieter bin ich gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den
        allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG bin ich als Diensteanbieter jedoch nicht
        verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen
        zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
      </p>
      <p class="impressum__text">
        Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen
        bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis
        einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werde
        ich diese Inhalte umgehend entfernen.
      </p>
    </section>

    <section class="impressum__section">
      <h2 class="impressum__heading">Haftung für Links</h2>
      <p class="impressum__text">
        Meine Website enthält Links zu externen Websites Dritter, auf deren Inhalte ich keinen Einfluss habe.
        Deshalb kann ich für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten
        Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
      </p>
      <p class="impressum__text">
        Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft.
        Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche
        Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht
        zumutbar. Bei Bekanntwerden von Rechtsverletzungen werde ich derartige Links umgehend entfernen.
      </p>

      <button class="backToMenuBtn" id="backBtn">Zurück</button>
    </section></div>`;
}

export function gameDescriptionTemp() {
  return `  <div class="gameExplanation">
                <h2 class="gameExplenationHeading">Spielablauf</h2>

                <p class="gameExplenationText"><b>Gegner besiegen:</b> Um feindliche Kreaturen auszuschalten, springe gezielt auf ihre Köpfe oder greife sie mit Feuerbällen an.</p>

                <p class="gameExplenationText"><b>Slide:</b> Aktiviere einen Slide, indem du Control drückst. Du kannst auch in der Luft sliden, um zusätzliche Distanz zu überbrücken. Um ihn nutzen zu können, musst du Kristalle sammeln – jede
                    Ausführung verbraucht einen Kristall. Setze sie also mit Bedacht ein!</p>

                <p class="gameExplenationText"><b>Schaden erleiden:</b> Ein direkter Zusammenstoß mit einem Gegner verursacht Schaden. Achte stets
                    auf deine Position und reagiere schnell, um Angriffe zu vermeiden.</p>

                <p class="gameExplenationText"><b>Ziel des Spiels:</b> Am Ende jedes Levels wartet ein herausfordernder Endboss auf dich. Er verfügt
                    über mehr Lebenspunkte und setzt spezielle Angriffe ein – bleib wachsam und nutze jede Gelegenheit,
                    um ihn zu besiegen.</p>

                <p class="gameExplenationText"><b>Nach dem Spiel:</b> Wenn du scheiterst, ist das kein Grund aufzugeben – du kannst jederzeit einen
                    neuen Versuch starten. Und auch nach einem Sieg kannst du das Abenteuer von vorn beginnen. Viel
                    Erfolg!</p>

                    <button class="backToMenuBtn" id="backBtn">Zurück</button>
            </div>`;
}

export function normalMenuTemp() {
  return `<button class="menu" id="impressum">Impressum</button>
      <button class="menu" id="controls">Steuerung</button>
      <button class="menu" id="gameplay">Spielverlauf</button>
      <img
        id="logo"
        alt="zombies and flames"
        src="assets/spritesheets/bg/logo.png"
      />
      <button class="menu big" id="startGame">Spielen</button>
  `;
}

export function controlTemp() {
  return `
  <section class="controls">
  <h2 class="controls__title">Steuerung</h2>
  <ul class="controls__list">
    <li><span class="controls__key">A</span> oder <span class="controls__key">←</span> – nach links laufen</li>
    <li><span class="controls__key">D</span> oder <span class="controls__key">→</span> – nach rechts laufen</li>
    <li><span class="controls__key">Leertaste</span> – springen</li>
    <li><span class="controls__key">F</span> – Feuerball abfeuern</li>
    <li><span class="controls__key">Strg</span> – Dash wenn Diamanten vorhanden!</li>
  </ul>
 <button class="backToMenuBtn" id="backBtn">Zurück</button>
</section>`;
}
