# 🔐 Sicherer Passwort-Generator

Ein moderner, clientseitiger Passwort-Generator, entwickelt mit **HTML5, CSS3 und Vanilla JavaScript**.

Das Projekt wurde als Teil meines IT-Portfolios entwickelt und zeigt praktische Kenntnisse in **Webentwicklung, JavaScript und grundlegenden Cybersecurity-Konzepten**.

Die Passwörter werden direkt im Browser mit der **Web Crypto API** generiert und nicht an einen Server übertragen.

## 🚀 Live Demo

**[Live Demo öffnen](DEIN-NETLIFY-LINK)**

## ✨ Funktionen

* 🔐 Kryptografisch sichere Passwortgenerierung
* 📏 Individuelle Passwortlänge
* 🔤 Groß- und Kleinbuchstaben
* 🔢 Zahlen
* 🔣 Sonderzeichen
* 🚫 Ausschluss ähnlicher Zeichen (`0`, `O`, `I`, `l`, `1`)
* 📊 Passwortstärke-Anzeige
* 🧮 Theoretische Entropie-Berechnung
* ⏱️ Geschätzte Offline-Brute-Force-Zeit
* 📋 Passwort in die Zwischenablage kopieren
* 👁️ Passwort anzeigen / verbergen
* ⚡ Voreinstellungen für verschiedene Passworttypen
* 📱 Responsive Design
* ♿ Fokus auf Accessibility

## 🛡️ Sicherheit

Für die Generierung zufälliger Werte wird die **Web Crypto API** mit `crypto.getRandomValues()` verwendet.

Im Gegensatz zu `Math.random()` ist diese Methode für kryptografisch relevante Zufallswerte geeignet.

Zusätzlich wird **Rejection Sampling** verwendet, um Verzerrungen bei der Auswahl zufälliger Zeichen zu vermeiden.

Die Passwörter werden **lokal im Browser** erzeugt und nicht an einen Server gesendet.

> Die angezeigte Brute-Force-Zeit ist lediglich eine Schätzung und basiert auf einer angenommenen Angriffsgeschwindigkeit. Sie stellt keine Garantie für die tatsächliche Sicherheit eines Passworts dar.

## 🧠 Funktionsweise

1. Der Benutzer wählt die gewünschte Passwortlänge.
2. Die gewünschten Zeichensätze werden ausgewählt.
3. Sichere Zufallswerte werden mit `crypto.getRandomValues()` erzeugt.
4. Mindestens ein Zeichen aus jedem ausgewählten Zeichensatz wird verwendet.
5. Die Zeichen werden mit einem kryptografisch sicheren Fisher-Yates-Algorithmus gemischt.
6. Die theoretische Entropie und eine Sicherheitsbewertung werden berechnet.
7. Das generierte Passwort kann in die Zwischenablage kopiert werden.

## 🛠️ Verwendete Technologien

* HTML5
* CSS3
* Vanilla JavaScript
* Web Crypto API
* Clipboard API
* Responsive CSS
* CSS Custom Properties

## 📂 Projektstruktur

```text
password-generator/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

## 📚 Was ich gelernt habe

Durch dieses Projekt konnte ich praktische Erfahrungen sammeln in:

* JavaScript DOM-Manipulation
* Event Handling
* sicherer Zufallszahlengenerierung
* Web Crypto API
* grundlegenden Cybersecurity-Konzepten
* Entropie-Berechnung
* Input-Validierung
* Clipboard API
* Responsive Webdesign
* Accessibility
* sauberer Code-Struktur

## 🎯 Ziel des Projekts

Dieses Projekt ist Teil meines IT-Portfolios und soll meine praktischen Kenntnisse in **Webentwicklung, JavaScript und grundlegender IT-Sicherheit** zeigen.

## 👨‍💻 Autor

**Mouhaned Zbedi**

Angehender Fachinformatiker

🇹🇳 Tunesien → 🇩🇪 Deutschland

---

⭐ Vielen Dank für das Interesse an meinem Projekt!
