Hier is de volledige README in Markdown-formaat:

```markdown
# Conway's Game of Life

Dit project is een implementatie van Conway's Game of Life in JavaScript, waarbij elk vakje een unieke, dynamische kleur heeft die verandert met elke generatie. Het project bevat een interactieve simulatie, waarbij gebruikers het spel kunnen starten, pauzeren, patronen opslaan en laden, en de spelregels aanpassen.

## 🛠️ Clone het project

Clone dit project met de volgende opdracht:

```bash
git clone git@git.nexed.com:anaselbousklati/Conway-s-Game-of-Life.git
cd Conway-s-Game-of-Life
```

## 🚀 Installatie en Gebruik

1. **Open de index.html**:  
   Na het clonen van het project, open je `index.html` in een webbrowser om de simulatie te starten.

2. **Interactieve Bediening**:  
   - **Start**: Start de simulatie.  
   - **Pauzeer**: Pauzeer de simulatie.  
   - **Reset**: Reset het speelveld naar een nieuwe willekeurige toestand.  
   - **Opslaan**: Sla een huidige patroon op.  
   - **Laden**: Laad een opgeslagen patroon.  
   - **Beheer Patronen**: Hernoem of verwijder opgeslagen patronen.  

## ⚙️ Functies

- **Dynamische Kleurcellen**: Elke cel heeft een willekeurige RGB-kleur die verandert met elke generatie.
- **Interactie met Cellen**: Klik of sleep over cellen om hun status te veranderen.
- **Aanpasbare Regels**: Pas de regels voor geboorte en overleving aan via invoervelden.
- **Grafiek Levende Cellen**: Volg het aantal levende cellen door de generaties heen met een lijn in de grafiek.
- **Opslaan en Laden van Patronen**: Sla huidige celpatronen op en laad ze later terug om door te gaan.

## 📋 Bestandsstructuur

- `index.html`: De hoofd HTML-pagina die de interface van de simulatie bevat.
- `style.css`: Bevat de CSS voor de styling van het speelveld en de interface.
- `script.js`: Bevat de hoofdfunctionaliteit voor de simulatie en de interacties.

## 🎨 Aanpassingen

- Pas de grootte van het speelveld aan door de variabele `SIZE` in `script.js` te wijzigen.
- Stel andere spelregels in door de variabelen `birthRule` en `surviveRule` aan te passen.
- Pas de snelheid van de simulatie aan met de schuifregelaar in de interface.

## 📝 Auteurs

- **Anas el Bousklati** - Ontwikkelaar en auteur van het project.